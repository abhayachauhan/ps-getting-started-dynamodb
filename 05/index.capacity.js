var AWS = require('aws-sdk');
var print = require('./../lib/helpers.js').printPretty;
var dynamodb = new AWS.DynamoDB();

console.log("Increasing RCUs & WCUs to 2: ");

var params = {
    "ProvisionedThroughput": {
        "ReadCapacityUnits": 2,
        "WriteCapacityUnits": 2
    },
    "TableName": "GMJS.Job"
};

dynamodb.updateTable(params).promise()
    .then(function () {
        var params = { "TableName": "GMJS.Job" };
        console.log("Waiting for update to finish...");
        return dynamodb.waitFor("tableExists", params).promise();
    })
    .then(print)
    .catch(print);
