var AWS = require('aws-sdk');
var lib = require('./../lib/helpers.js');
var dynamodb = new AWS.DynamoDB();
var tableArn = 'arn:aws:dynamodb:ap-southeast-2:428332548629:table/GMJS.Job';

function tagJobTable() {
    console.log('Tagging Job Table...');
    var params = {
        ResourceArn: tableArn,
        Tags: [
            {
                Key: 'Owner',
                Value: 'Abhaya Chauhan'
            }
        ]
    };
    var tagPromise = dynamodb.tagResource(params).promise();
    
    return tagPromise;
}

function listTagsForJobTable() {
    console.log('Tags for Job Table: ');
    var params = {
        ResourceArn: tableArn
    };
    var promise = new Promise(function (resolve, reject) {
        var tagsPromise = dynamodb.listTagsOfResource(params).promise();
        tagsPromise
            .then(lib.printPretty)
            .then(resolve)
            .catch(reject);
    });
    return promise;

}

function unTagJobTable() {
    console.log('Untagging Job Table...');
    var params = {
        ResourceArn: tableArn,
        TagKeys: [
            'Owner'
        ]
    };
    tagsPromise = dynamodb.untagResource(params).promise();
    return tagsPromise;
}

tagJobTable()
    .then(listTagsForJobTable)
    .then(unTagJobTable)
    .then(listTagsForJobTable);