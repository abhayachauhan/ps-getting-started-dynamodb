var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    var dynamodb = new AWS.DynamoDB();
    var promises = [];

    event.Records.forEach(function(record) {

      if (record.eventName === "REMOVE") {
        var params = {
            Item: record.dynamodb.OldImage,
            TableName: "ClosedJob"
        };

        promises.push(
          dynamodb.putItem(params).promise()
        );
      }
      
    });

    Promise.all(promises)
      .then(() => callback())
      .catch((err) => callback(err));    
};
