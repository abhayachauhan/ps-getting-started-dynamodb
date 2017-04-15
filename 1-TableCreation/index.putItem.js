var AWS = require('aws-sdk');
var gen = require('./generators');

var dynamodb = new AWS.DynamoDB();

var job = gen.generateUniqueJob();
var params = {
  Item: job,
  ReturnConsumedCapacity: "TOTAL", 
  TableName: "Job"
};
dynamodb.putItem(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

var applicant = gen.generateUniqueApplicant();
var params = {
  Item: applicant, 
  ReturnConsumedCapacity: "TOTAL", 
  TableName: "Applicant"
};
dynamodb.putItem(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

var jobApplication = gen.generateJobApplication(job, applicant);
var params = {
  Item: jobApplication,
  ReturnConsumedCapacity: "TOTAL", 
  TableName: "JobApplication"
};
dynamodb.putItem(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});


