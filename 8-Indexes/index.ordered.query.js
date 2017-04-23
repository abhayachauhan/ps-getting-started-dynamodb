// Get Job Applicants, sorted by Application Score (DESC)

var AWS = require('aws-sdk');
var print = require('./lib');

var dynamodb = new AWS.DynamoDB();

var params = {
  "ConsistentRead": false,
  "KeyConditionExpression": "JobId = :jobid AND Score >= :score",
  "ExpressionAttributeValues": {
      ":jobid": { S: "3a754841-8b5a-48ef-ba92-058f12753e5e" },
      ":score": { N: "50" }
  },
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
  


