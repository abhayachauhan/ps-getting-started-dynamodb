var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;
var dynamodb = new AWS.DynamoDB();

var userId = "53ad0503-4c81-401d-8b40-dfd084d332f5";
var totalCapacityConsumed = 0;
var totalItemsFound = 0;

var params = {
  "TableName": "GMJS.JobApplication",
  "FilterExpression": "UserId = :userId",
  "ExpressionAttributeValues": {
    ":userId": { S: userId }
  },  
  "ReturnConsumedCapacity": "TOTAL"
};

console.log("Scanning job applications for UserId", userId);
dynamodb.scan(params, scanResponse);

function scanResponse(err, data) {
    if (err) {
      print(err);
      return;
    } else if (data) {
      totalCapacityConsumed += data.ConsumedCapacity.CapacityUnits;
      totalItemsFound += data.Items.length;

      if (data.LastEvaluatedKey) {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        console.log('   Scanning next page...');
        dynamodb.scan(params, scanResponse);
      } else {
        console.log('Finished!');
        console.log('Job Applications found: ', totalItemsFound);
        console.log('RCUs consumed: ', totalCapacityConsumed);
      }
    }
}
