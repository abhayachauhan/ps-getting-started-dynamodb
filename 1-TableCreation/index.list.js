var AWS = require('aws-sdk');
var print = require('./lib');

var dynamodb = new AWS.DynamoDB();


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
        ResourceArn: 'arn:aws:dynamodb:ap-southeast-1:428332548629:table/Job',
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
        ResourceArn: 'arn:aws:dynamodb:ap-southeast-1:428332548629:table/Job'
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
        ResourceArn: 'arn:aws:dynamodb:ap-southeast-1:428332548629:table/Job',
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

listTables()
    .then(describeJobTable)
    .then(tagJobTable)
    .then(listTagsForJobTable)
    .then(unTagJobTable)
    .then(listTagsForJobTable);






