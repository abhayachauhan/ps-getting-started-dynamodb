var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;
var dynamodb = new AWS.DynamoDB();

var params = {
  "TableName": "GMJS.User",
  "Item": {
    "UserId": { "S": "001" },
    "FirstName": { "S": "Abhaya" },
    "LastName": { "S": "Chauhan" }
  },
  "ReturnConsumedCapacity": "TOTAL"
};

/*
var params = {
  "TableName": "GMJS.User",
  "Item": {
    "UserId": { "S": "001" },
    "FirstName": { "S": "Abhaya" },
    "NoOfLogins": { "N": "0" }
  },
  "ReturnConsumedCapacity": "TOTAL"
};
*/

var promise = dynamodb.putItem(params).promise();

promise
  .then(print)
  .catch(print);
