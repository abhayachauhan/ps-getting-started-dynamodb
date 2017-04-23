var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;

var dynamodb = new AWS.DynamoDB();

var currentEpochTime = Math.floor(new Date() / 1000);

var params = {
    TableName: 'Job',
    ExpressionAttributeValues: {
      ":time": {
        N: currentEpochTime.toString()
      }
    },
    FilterExpression: "TimeClosing <= :time",
    // Limit: 10,
    ReturnConsumedCapacity: 'TOTAL'
};

dynamodb.scan(params, function(err, data) {
  if (err) {
    console.log(err, err.stack); // an error occurred
    return;
  }
  // data.Items = [];
  print(data);

});


