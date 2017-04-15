var AWS = require('aws-sdk');
var gen = require('./generators');
var async = require('async');
var ProgressBar = require('progress');

var dynamodb = new AWS.DynamoDB({httpOptions: { timeout: 500 }});

// AWS.events.on('retry', function(resp) {
//   if (resp.error && resp.error.retryable) {
//     var date = new Date();
//     console.log(date, '| Retrying request for the ' + resp.retryCount + 'th time.');
//     console.log(date, '| Retry triggered by', resp.error.code, resp.error.message);
//   }
// });
// AWS.events.on('retry', function(resp) {
//     console.log('| Retrying request for the ' + resp.retryCount + 'th time.');
//     console.log('| Retry triggered by', resp.error.code, resp.error.message);

// //   if (resp.error && resp.error.code === 'Throttling') {
// //     resp.error.retryable = true;
// //   }
// });

// Generate data
var allData = gen.generateAllData(100, 100);

var counter = 0;
var totalCapacityConsumed = 0;

var progress = new ProgressBar('  Bulk Writing Data [:bar] :percent (:rate item/s) :elapseds :capacity units/s | :current of :total', {
    complete: '=',
    incomplete: ' ',
    width: 50,
    total: 0
  });

// Work through queues
var batchWriteQueue = 
    [].concat(
        //batchWriteApplicantsTask(allData.Applicants)//,
        // batchWriteJobsTask(allData.Job),
        batchWriteJobApplicationsTask(allData.JobApplication)
    );

var start = new Date;
async.series(batchWriteQueue, function(err, data) {
    if (err)
        console.log(err.stack);
    else {
        var elapsed = (new Date - start)/1000;
        console.log(`\nSuccess! Capacity: ${Math.round(totalCapacityConsumed/elapsed)} unit/s`);
    }
});

function batchWriteApplicantsTask(applicants)
{
    var queue = [];
    var params = {
        RequestItems: {
            "Applicant": []
        },
        "ReturnConsumedCapacity": "TOTAL"
    };

    for (var applicantId in applicants) {
        var request = {
                        "PutRequest": {
                            "Item": applicants[applicantId]
                        }
                    };

        params.RequestItems.Applicant.push(request);

        if (params.RequestItems.Applicant.length === 25) {
            queue.push(queueBatchWrite(params, 'Applicants'));

            params = {
                RequestItems: {
                    "Applicant": []
                },
                "ReturnConsumedCapacity": "TOTAL"
            };
        }
    }
    if (params.RequestItems.Applicant.length > 0) {
        queue.push(queueBatchWrite(params, 'Applicants'));
    }

    return function(callback) {
        async.series(queue, function(err, data) {
            if (err)
                callback(err);
            else
                callback(null, 'Finished writing Applicants.')
        });
    }
    
}

function batchWriteJobsTask(jobs)
{
    var queue = [];
    var params = {
        RequestItems: {
            "Job": []
        },
        "ReturnConsumedCapacity": "TOTAL"
    };

    for (var jobId in jobs) {
        var request = {
                        "PutRequest": {
                            "Item": jobs[jobId]
                        }
                    };

        params.RequestItems.Job.push(request);

        if (params.RequestItems.Job.length === 25) {
            queue.push(queueBatchWrite(params, 'Jobs'));

            params = {
                RequestItems: {
                    "Job": []
                },
                "ReturnConsumedCapacity": "TOTAL"
            };
        }
    }
    if (params.RequestItems.Job.length > 0) {
        queue.push(queueBatchWrite(params, 'Jobs'));
    }

    
    return function(callback) {
        async.series(queue, function(err, data) {
            if (err)
                callback(err);
            else
                callback(null, 'Finished writing Jobs.')
        });
    }
}

function batchWriteJobApplicationsTask(jobApplications)
{
    var queue = [];
    var params = {
        RequestItems: {
            "JobApplication": []
        },
        "ReturnConsumedCapacity": "TOTAL"
    };

    for (var jobApplicationId in jobApplications) {
        var request = {
                        "PutRequest": {
                            "Item": jobApplications[jobApplicationId]
                        }
                    };

        params.RequestItems.JobApplication.push(request);

        if (params.RequestItems.JobApplication.length === 25) {
            queue.push(queueBatchWrite(params, 'Job Applications'));

            params = {
                RequestItems: {
                    "JobApplication": []
                },
                "ReturnConsumedCapacity": "TOTAL"
            };
        }
    }
    if (params.RequestItems.JobApplication.length > 0) {
        queue.push(queueBatchWrite(params, 'Job Applications'));
    }

    return function(callback) {
        async.series(queue, function(err, data) {
            if (err)
                callback(err);
            else
                callback(null, 'Finished writing Job Applications.')
        });
    }
}

function queueBatchWrite(params, entityName) {
    progress.total += params.RequestItems[Object.keys(params.RequestItems)[0]].length;
    var flag = false;
    return function(callback) {        
        var numberOfItems = params.RequestItems[Object.keys(params.RequestItems)[0]].length;

        var processItemsCallback = function(err, data) {
            if (err) { 
                console.log('   Error ${err.message}');
                callback(err);
            } else if (Object.keys(data.UnprocessedItems).length > 0){
                var retryParams = {};
                retryParams.RequestItems = data.UnprocessedItems;
                retryParams.ReturnConsumedCapacity = "TOTAL";
                counter += numberOfItems - retryParams.RequestItems[Object.keys(data.UnprocessedItems)[0]].length;
                // console.log(`Partial ${numberOfItems} - ${retryParams.RequestItems[Object.keys(data.UnprocessedItems)[0]].length} = ${numberOfItems - retryParams.RequestItems[Object.keys(data.UnprocessedItems)[0]].length}`);
                //progress.tick(numberOfItems - retryParams.RequestItems[Object.keys(data.UnprocessedItems)[0]].length);
                numberOfItems = retryParams.RequestItems[Object.keys(data.UnprocessedItems)[0]].length;
                capacityConsumed(data);
                // console.log(`   Retrying unprocessed ${retryParams.RequestItems[Object.keys(data.UnprocessedItems)[0]].length} items`);
                dynamodb.batchWriteItem(retryParams, processItemsCallback);
            } else {
                progress.tick(numberOfItems);
                counter += numberOfItems;

                capacityConsumed(data);
                callback(null, data);
            }
        };

        dynamodb.batchWriteItem(params, processItemsCallback);
    }    
}

function capacityConsumed(data) {
    if (data.ConsumedCapacity && data.ConsumedCapacity.length > 0)
    {
        for (var i=0; i<data.ConsumedCapacity.length; i++) {
            totalCapacityConsumed += data.ConsumedCapacity[i].CapacityUnits;
        }
    }
    
    var elapsed = (new Date - start)/1000;
    progress.tick({ 'capacity': Math.round(totalCapacityConsumed/elapsed) });
}