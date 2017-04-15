var AWS = require('aws-sdk');
var gen = require('./generators');
var async = require('async');
var ProgressBar = require('ascii-progress');

var dynamodb = new AWS.DynamoDB({httpOptions: { timeout: 500 }, maxRetries: 0});

// Generate data
var allData = gen.generateAllData(200, 1000);

var totalCapacityConsumed = {};
var start = new Date;
var progressBars = {};


// SETUP WORKLOADS

var work = [].concat(
    function(done) { 
        var tableName = 'Job';
        setupWorkload(done, tableName);
    },
    function(done) { 
        var tableName = 'Applicant';
        setupWorkload(done, tableName);
    },
    function(done) { 
        var tableName = 'JobApplication';
        setupWorkload(done, tableName);
    }
);

function setupWorkload(done, tableName) {
    progressBars[tableName] = new ProgressBar({
        schema: '[:bar] :current/:total :consumedCapacity WU/s [' + tableName + ']',
        current: 0,
        total: Object.keys(allData[tableName]).length
    });

    processDataset(done, allData, tableName);     
}

// END SETUP WORKLOADS


function startProcessingDataParallel() {
    async.parallel(work, function(err, data) {
        if (err)
            console.log('Unexpected Error: ', err, err.stack);
    });
}

function startProcessingDataSeries() {
    async.series(work, function(err, data) {
        if (err)
            console.log('Unexpected Error: ', err, err.stack);
    });
}

startProcessingDataParallel();
// startProcessingDataSeries();


function executeBatchPut(params) {
    var request = dynamodb.batchWriteItem(params);
    return request.promise();
}

function processDataset(done, allData, tableName, UnprocessedItems) {
    if (!totalCapacityConsumed[tableName])
        totalCapacityConsumed[tableName] = 0;

    var params = buildParams();
    if (params.RequestItems[tableName].length === 0) {
        var elapsed = (new Date - start)/1000;
        done();
        return;
    }

    executeBatchPut(params)        
        .then(processBatchPutResponse)
        .catch(handleError)

    function processBatchPutResponse(response) {
        function progressBarTick(unprocessedItemsLength) {
            var elapsed = (new Date - start)/1000;
            var consumedCapacity = Math.round(totalCapacityConsumed[tableName]/elapsed);
            var remainingItems = progressBars[tableName].total - progressBars[tableName].current;
            if (remainingItems < 25)
                progressBars[tableName].tick(remainingItems, {consumedCapacity: consumedCapacity});
            else if (unprocessedItemsLength)
                progressBars[tableName].tick(25 - unprocessedItemsLength, {consumedCapacity: consumedCapacity});
            else
                progressBars[tableName].tick(25, {consumedCapacity: consumedCapacity});
        }

        if (response.ConsumedCapacity && response.ConsumedCapacity.length > 0)
        {
            for (var i=0; i<response.ConsumedCapacity.length; i++) {
                totalCapacityConsumed[tableName] += response.ConsumedCapacity[i].CapacityUnits;
            }
        }
        var request;
        if (Object.keys(response.UnprocessedItems).length > 0) {
            progressBarTick(Object.keys(response.UnprocessedItems[tableName]).length);

            processDataset(done, allData, tableName, response.UnprocessedItems);
        }
        else {
            progressBarTick();
            processDataset(done, allData, tableName);
        }
    }

    function buildParams() {
        var dataSet = allData[tableName];
        var params = {
            RequestItems: {},
            "ReturnConsumedCapacity": "TOTAL"
        };
        params.RequestItems[tableName] = [];

        if (UnprocessedItems) {
            params.RequestItems = UnprocessedItems;
        }

        for (var id in dataSet) {
            if (params.RequestItems[tableName].length === 25)
                break;

            var request = {
                "PutRequest": {
                    "Item": dataSet[id]
                }
            };

            params.RequestItems[tableName].push(request);
            delete dataSet[id];
        }
        return params;
    }
    
    function handleError(err) {
        // console.log('   Error: ', err, err.stack);
        if (params.RequestItems[tableName].length !== 0) {
            processDataset(done, allData, tableName, params.RequestItems);
        }
    }

}


