var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;

var dynamodb = new AWS.DynamoDB();

  var params = {
    "ConsistentRead": false,
    "FilterExpression": "Score >= :score",
    "KeyConditionExpression": "JobId = :jobid",
    "ExpressionAttributeValues": {
        ":jobid": { S: "3a754841-8b5a-48ef-ba92-058f12753e5e" }//,
        ":score": { N: "50" }
    },
    "ReturnConsumedCapacity": "TOTAL",
    "TableName": "JobApplication"
  }

  dynamodb.query(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      return;
    }
    print(data);
  });
  