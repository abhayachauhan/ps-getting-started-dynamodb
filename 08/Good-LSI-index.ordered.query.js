var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;
var dynamodb = new AWS.DynamoDB();

var params = {
  "TableName": "GMJS.JobApplication",
  "IndexName": "JobApplicationScore",
  "KeyConditionExpression": "JobId = :jobid AND Score >= :score",
  "ExpressionAttributeValues": {
      ":jobid": { S: "39d4f0b4-4892-46de-bcef-c1a4df2d139e" },
      ":score": { N: "50" }
  },
  "ScanIndexForward": false,
  "ReturnConsumedCapacity": "TOTAL"
}

dynamodb
  .query(params).promise()
  .then(print)
  .catch(print);
  


