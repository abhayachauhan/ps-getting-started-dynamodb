var AWS = require('aws-sdk');

function getJobApplicationScore() {
  // Random number between 0 and 100 (inclusive)
  var min = Math.ceil(0);
  var max = Math.floor(100);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.handler = (event, context, callback) => {
    var dynamodb = new AWS.DynamoDB();
    var promises = [];
    console.log('Records to process:',event.Records.length);
    event.Records.forEach(function(record) {
      console.log('Eventname:',record.eventName);
      console.log('Key:', record.dynamodb.Keys);
      if (record.eventName === "INSERT") {
        var params = {
            ExpressionAttributeNames: { "#S": "Score" }, 
            ExpressionAttributeValues: {
                ":Score": { N: getJobApplicationScore().toString() }
            }, 
            Key: record.dynamodb.Keys,
            TableName: 'GMJS.JobApplication',
            UpdateExpression: "SET #S = :Score"
        };
        promises.push(
          dynamodb.updateItem(params).promise()
        );
      }
      
    });

    Promise.all(promises)
      .then(() => callback(), (err) => callback(err))
      .catch((err) => callback(err));    
};
