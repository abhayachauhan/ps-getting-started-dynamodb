var AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName: 'Job',
    // Limit: 10,
    ReturnConsumedCapacity: 'TOTAL'
};

dynamodb.scan(params, function(err, data) {
  if (err) {
    console.log(err, err.stack); // an error occurred
    return;
  }
  // data.Items = [];
  console.log(JSON.stringify(data, null, 4));

});


