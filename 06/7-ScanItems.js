var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;
var dynamodb = new AWS.DynamoDB();

var epochNow = 1506043477;

var params = {
  "TableName": "GMJS.Job",
  "FilterExpression": "CountryId = :country AND ClosingTime > :time",
  "ExpressionAttributeValues": {
     ":country": {
        "S": "18"
     },
     ":time": {
        "N": epochNow.toString()
     }
  },
  "ReturnConsumedCapacity": "TOTAL"
};

dynamodb.scan(params).promise()
  .then(print)
  .catch(print);
