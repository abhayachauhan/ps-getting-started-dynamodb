var AWS = require('aws-sdk');
var gen = require('./generators');
var async = require('async');
var ProgressBar = require('progress');

var dynamodb = new AWS.DynamoDB({httpOptions: { timeout: 500 }});

// Generate data
var allData = gen.generateAllData(100, 500);

var totalCapacityConsumed = 0;

var progress = new ProgressBar('  Bulk Writing Data [:bar] :percent (:rate item/s) :elapseds :capacity units/s | :current of :total', {
    complete: '=',
    incomplete: ' ',
    width: 50,
    total: 0
  });

var start = new Date;
var work = [].concat(
    function() { startJobApplication(null, allData) },
    function() { startJob(null, allData) },
    function() { startApplicant(null, allData) }
);

async.series(work, function(err, data) {
    if (err)
        console.log(err);
    else
        console.log(data);
});

function startJobApplication(err, data) {
    if (err)
        console.log(err);
    else
        processSubset(data, 'JobApplication', startJobApplication);
}

function startJob(err, data) {
    if (err)
        console.log(err);
    else
        processSubset(data, 'Job', startJob);
}

function startApplicant(err, data) {
    if (err)
        console.log(err);
    else
        processSubset(data, 'Applicant', startApplicant);
}

function processSubset(dataSet, tableName, cb) {
    
    if (!progress.total)
        progress.total = Object.keys(dataSet[tableName]).length;

    function getX(data, x) {
        var counter = 0;
        var returnObj = {};
        for (var id in data) {
            returnObj[id] = data[id];
            delete data[id];

            counter++;
            if (x === counter)
                break;
        }
        return returnObj;
    }

    function buildBulkWriteRequest(subData, prms) {
        var queue = [];
        var params = {
            RequestItems: {},
            "ReturnConsumedCapacity": "TOTAL"
        };
        params.RequestItems[tableName] = [];

        if (prms) {
            params.RequestItems = prms;
        }
        for (var id in subData) {
            var request = {
                            "PutRequest": {
                                "Item": subData[id]
                            }
                        };

            params.RequestItems[tableName].push(request);
        }

        function callback1(err,data) {
            if (err) { 
                console.log(`   Error ${err.message}`);
                cb(err);
            } else if (Object.keys(data.UnprocessedItems).length > 0){
                
                var numberOfUnprocessedItems = data.UnprocessedItems[Object.keys(data.UnprocessedItems)[0]].length;
                var noOfItemsRequired = 25 - numberOfUnprocessedItems;
                var newItemsToProcess = getX(dataSet[tableName], noOfItemsRequired);
                capacityConsumed(data);
                buildBulkWriteRequest(newItemsToProcess, data.UnprocessedItems);
            } else {
                progress.tick(25);
                capacityConsumed(data);
                cb(null, allData);
            }
        }

        // console.log('Making call!');
        dynamodb.batchWriteItem(params, callback1);
    }

    if (Object.keys(dataSet[tableName]).length !== 0)
    {
        var rData = getX(dataSet[tableName], 25);
        buildBulkWriteRequest(rData);
    }
    else {
        var elapsed = (new Date - start)/1000;
        console.log('Finished with Avg Capacity units / s of ' + Math.round(totalCapacityConsumed/elapsed))
    }
}

// var counter = 0;
var totalCapacityConsumed = 0;

var progress = new ProgressBar('  Bulk Writing Data [:bar] :percent (:rate item/s) :elapseds :capacity units/s | :current of :total', {
    complete: '=',
    incomplete: ' ',
    width: 50,
    total: 0
  });

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
