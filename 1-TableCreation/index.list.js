var AWS = require('aws-sdk');
var print = require('./lib');

var dynamodb = new AWS.DynamoDB();
var tableArn = 'arn:aws:dynamodb:ap-southeast-2:428332548629:table/Job';

function listTables() {
    console.log('List Tables: ');
    var promise = new Promise(function (resolve, reject) {
        var params = {};

        var listTable = dynamodb.listTables(params).promise();

        listTable
            .then(print)
            .then(resolve)
            .catch(reject);

    });
    return promise;
}

function describeJobTable() {
    console.log('Describe Job Table: ');
    var params = {
        "TableName": "Job"
    }
    var promise = new Promise(function (resolve, reject) {
        var descTable = dynamodb.describeTable(params).promise();

        
        descTable
            .then(print)
            .then(resolve)
            .catch(reject);

    });
    return promise;
}

function tagJobTable() {
    console.log('Tag Job Table: ');
    var params = {
        ResourceArn: tableArn,
        Tags: [
            {
                Key: 'Owner',
                Value: 'Abhaya Chauhan'
            }
        ]
    };
    var promise = new Promise(function (resolve, reject) {
        var tagPromise = dynamodb.tagResource(params).promise();
        tagPromise
            .then(print)
            .then(resolve)
            .catch(reject);
    });
    return promise;
}

function listTagsForJobTable() {
    console.log('List Tags for Job Table: ');
    var params = {
        ResourceArn: tableArn
    };
    var promise = new Promise(function (resolve, reject) {
        var tagsPromise = dynamodb.listTagsOfResource(params).promise();
        tagsPromise
            .then(print)
            .then(resolve)
            .catch(reject);
    });
    return promise;

}

function unTagJobTable() {
    console.log('Untag Job Table: ');
    var params = {
        ResourceArn: tableArn,
        TagKeys: [
            'Owner'
        ]
    };
    var promise = new Promise(function (resolve, reject) {
        var tagsPromise = dynamodb.untagResource(params).promise();
        tagsPromise
            .then(print)
            .then(resolve)
            .catch(reject);
    });
    return promise;

}

function changeCapacityJobTable() {
    console.log('Increasing capacity to 2 RU / 2 WU: ')
    var params = {
        ProvisionedThroughput: {
            ReadCapacityUnits: 2, 
            WriteCapacityUnits: 2
        }, 
        TableName: "Job"
    };

    var promise = new Promise(function (resolve, reject) {
        var capacityPromise = dynamodb.updateTable(params).promise();
        capacityPromise
            .then(function() {
                var params = { TableName: 'Job' };
                console.log('Waiting for update to finish...');
                return dynamodb.waitFor('tableExists', params).promise();
            })
            .then(print)
            .then(resolve)
            .catch(reject);
    });
    return promise;
}

listTables()
    .then(describeJobTable)
    .then(tagJobTable)
    .then(listTagsForJobTable)
    .then(unTagJobTable)
    .then(listTagsForJobTable)
    .then(changeCapacityJobTable)
    .then(describeJobTable);
