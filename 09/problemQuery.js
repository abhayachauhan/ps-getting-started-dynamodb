var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;
var dynamodb = new AWS.DynamoDB();

var aWeekFromNow = 1508755912;
 
var params = {
  "TableName": "GMJS.Job",
  "KeyConditionExpression": "CountryId = :country",
  "FilterExpression": "ClosingTime > :time",
  "ExpressionAttributeValues": {
    ":country": { S: "18" },
    ":time": { N: aWeekFromNow.toString() }
  },  
  "ReturnConsumedCapacity": "TOTAL"
};

dynamodb
  .query(params).promise()
  .then(print)
  .catch(print);
