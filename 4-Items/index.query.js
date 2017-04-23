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

dynamodb.putItem(params, function(err, data) {
  if (err) {
    console.log(err, err.stack); // an error occurred
    return;
  }
  console.log('Inserting unique job.');
  console.log(data);           // successful response

  var params = {
    //  "AttributesToGet": [ "string" ],
    "ConsistentRead": false,
    //  "ExpressionAttributeNames": { 
    //     "string" : "string" 
    //  },
        "KeyConditionExpression": "CountryId = :val",
      "ExpressionAttributeValues": {":val": job.CountryId},
    //  "ProjectionExpression": "string",
    "ReturnConsumedCapacity": "TOTAL",
    "TableName": "Job"
  }

  dynamodb.query(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      return;
    }
    console.log('Getting unique jobs in country.');
    console.log(data);
  });
  
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

  dynamodb.getItem(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      return;
    }
    console.log('Getting unique job.');
    console.log(data);
  });

});


