var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    var dynamodb = new AWS.DynamoDB();
    var promises = [];

    event.Records.forEach(function(record) {

      if (record.eventName === "REMOVE") {
        // Ensure TTL triggered this event
        if (record.userIdentity && 
          record.userIdentity.principalId === "dynamodb.amazonaws.com") {

          var params = {
            Item: record.dynamodb.OldImage,
            TableName: "GMJS.ClosedJob"
          };

          promises.push(
            dynamodb.putItem(params).promise()
          );

        }
      }
      
    });

    Promise.all(promises)
      .then(() => callback())
      .catch((err) => callback(err));    
};
