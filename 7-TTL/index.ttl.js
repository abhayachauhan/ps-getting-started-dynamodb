var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;

var dynamodb = new AWS.DynamoDB();


var params = {
  TableName: 'Job',
  TimeToLiveSpecification: {
    AttributeName: 'ClosingTime',
    Enabled: true
  }
};

var promise = dynamodb.updateTimeToLive(params).promise();

promise
    .then(print)
    .catch(print);
