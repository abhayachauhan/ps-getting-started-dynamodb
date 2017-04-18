// How to insert a record
// How to get that record
// How to query multiple records
// Eventual Consistency vs Consistency consumed capacity

var AWS = require('aws-sdk');
var print = require('./lib');

var dynamodb = new AWS.DynamoDB();

  var params = {
    "ConsistentRead": false,
    "KeyConditionExpression": "JobId = :val",
    "ExpressionAttributeValues": { ":val": { S: "49fc1f17-2bd3-40d4-8f5d-1ee68288f878" } },
    "IndexName": "JobApplicationScore",
    "ReturnConsumedCapacity": "TOTAL",
    "TableName": "JobApplication",
    "ScanIndexForward": false
  }

  dynamodb.query(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      return;
    }
    console.log('Getting unique jobs in country.');
    print(data);
  });
  


