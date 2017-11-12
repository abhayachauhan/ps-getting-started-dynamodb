var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;
var dynamodb = new AWS.DynamoDB();

var params = {
  "TableName": "GMJS.Job",
  "Key": {
     "CountryId": {
        "S": "18"
     },
     "JobId": {
        "S": "0f296cdc-1b07-41e9-867e-0a6a66e56de7"
     }
  },
  "ReturnConsumedCapacity": "TOTAL"
};

var promise = dynamodb.getItem(params).promise();

promise
  .then(print)
  .catch(print);
