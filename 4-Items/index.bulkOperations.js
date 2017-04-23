var AWS = require('aws-sdk');
var gen = require('./../lib/generators');
var faker = require('faker');

var dynamodb = new AWS.DynamoDB({httpOptions: { timeout: 1500 }});//{httpOptions: { timeout: 500 }, maxRetries: 0});

// Generate 25x jobs
var jobs = gen.generateAllData(25, 1)['Job'];

processJobs();

function processJobs(UnprocessedItems) {
    var params = {};
    if (!UnprocessedItems) {
        params = buildParams();        
    } else {
        params.RequestItems = UnprocessedItems;
    }

    executeBatchPut(params)        
        .then(processBatchPutResponse)
        .catch(handleError)

    function processBatchPutResponse(response) {
        var request;
        if (Object.keys(response.UnprocessedItems).length > 0) {
            console.log('Retrying', response.UnprocessedItems.Job.length, 'unprocessed items');
            processJobs(response.UnprocessedItems);
        }
        else
            console.log(response);
    }    
    
    function handleError(err) {
        console.log('Error: ', err, err.stack);
        if (params.RequestItems.Job.length !== 0) {
            processJobs(params.RequestItems);
        }
    }

}

////////////////////////
// Build Params
function buildParams() {
    var params = {
        RequestItems: {
            Job: []
        },
        "ReturnConsumedCapacity": "TOTAL"
    };

    for (var id in jobs) {

        // Add large amount of data to force "UnprocessedItems"
        jobs[id]['BigData'] = {};
        jobs[id]['BigData'].S = faker.lorem.paragraphs(100);

        var request = {
            "PutRequest": {
                "Item": jobs[id]
            }
        };

        params.RequestItems.Job.push(request);
    }
    return params;
}
// END Build Params
/////////////////////

function executeBatchPut(params) {
    var request = dynamodb.batchWriteItem(params);
    return request.promise();
}




