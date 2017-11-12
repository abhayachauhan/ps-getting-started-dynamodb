var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;
var dynamodb = new AWS.DynamoDB();

var params = {
  "TableName": "GMJS.JobApplication",
  "KeyConditionExpression": "JobId = :jobid",
  "ExpressionAttributeValues": {
    ":jobid": { S: "0f296cdc-1b07-41e9-867e-0a6a66e56de7" }
  },
  "ReturnConsumedCapacity": "TOTAL"  
}

dynamodb
  .query(params).promise()
  .then(print)
  .catch(print);
