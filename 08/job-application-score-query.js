var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;
var dynamodb = new AWS.DynamoDB();

var params = {
  "TableName": "GMJS.JobApplication",
  "KeyConditionExpression": "JobId = :jobid",
  "FilterExpression": "Score >= :score",    
  "ExpressionAttributeValues": {
      ":jobid": { S: "5442a327-36ee-4b36-911c-9cb4a3c33ee6" },
      ":score": { N: "50" }
  },
  "ReturnConsumedCapacity": "TOTAL"    
}

dynamodb
  .query(params).promise()
  .then(print)
  .catch(print);
