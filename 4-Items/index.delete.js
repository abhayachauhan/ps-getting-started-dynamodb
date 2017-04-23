// How to insert a record
// How to get that record
// How to query multiple records
// Eventual Consistency vs Consistency consumed capacity

var AWS = require('aws-sdk');
var gen = require('./generators');
var faker = require('faker');

var dynamodb = new AWS.DynamoDB();

var job = gen.generateUniqueJob();

job.CountryId.S = "1";
job.NewAtt = { S: faker.lorem.paragraphs(10) };
var params = {
  Item: job,
  ReturnConsumedCapacity: "TOTAL", 
  TableName: "Job"
};

console.log('Inserting unique job.');
dynamodb.putItem(params, function(err, data) {
  if (err) {
    console.log(err, err.stack); // an error occurred
    return;
  }
  
  console.log(data);           // successful response
  
  var params = {
    //  "AttributesToGet": [ "string" ],
    "ConsistentRead": true,
    //  "ExpressionAttributeNames": { 
    //     "string" : "string" 
    //  },
    "Key": { 
        "CountryId" : job.CountryId,
        "JobId" : job.JobId
    },
    //  "ProjectionExpression": "string",
    "ReturnConsumedCapacity": "TOTAL",
    "TableName": "Job"
  }

  console.log('Getting unique job.');
  dynamodb.getItem(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      return;
    }
    
    console.log(data);

    var params = {
        "Key": { 
            "CountryId" : job.CountryId,
            "JobId" : job.JobId
        },
        "TableName": "Job"
    };
    dynamodb.deleteItem(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        } else
        {
            console.log(data);

            console.log('Getting unique job again.');
            dynamodb.getItem(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                    return;
                }
                
                console.log(data);
            });
        }
    });
  });

});


