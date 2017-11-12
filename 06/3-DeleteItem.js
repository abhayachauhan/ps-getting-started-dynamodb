var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;
var dynamodb = new AWS.DynamoDB();

deleteItem()
  .then(print)
  .catch(print);

function deleteItem() {
  var params = {
    "TableName": "GMJS.User",
    "Key": {
      "UserId": {
        "S": "001"
      }
    },
    "ReturnConsumedCapacity": "TOTAL"
  };
  return dynamodb.deleteItem(params).promise();
}
