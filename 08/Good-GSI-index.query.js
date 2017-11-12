var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;
var dynamodb = new AWS.DynamoDB();

var userId = "53ad0503-4c81-401d-8b40-dfd084d332f5";

var params = {
  "TableName": "GMJS.JobApplication",
  "IndexName": "UserJobs",
  "KeyConditionExpression": "UserId = :userId",
  "ExpressionAttributeValues": {
      ":userId": { S: userId }
  },
  "ScanIndexForward": false,
  "ReturnConsumedCapacity": "TOTAL"
}

dynamodb
  .query(params).promise()
  .then(print)
  .catch(print);
  


