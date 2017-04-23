//http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithTables.html#CapacityUnitCalculations

var AWS = require('aws-sdk');
var gen = require('./generators');
var faker = require('faker');

var dynamodb = new AWS.DynamoDB();

var job = gen.generateUniqueJob();

job.BigData = { S: faker.lorem.paragraphs(20) };

var params = {
  Item: job,
  ReturnConsumedCapacity: "TOTAL", 
  TableName: "Job"
};

var createJob = dynamodb.putItem(params).promise();

createJob
    .then(console.log)
    .then(function(data) {

        var currentEpochTime = Math.floor(new Date() / 1000);

        var params = {
            ExpressionAttributeNames: {
                "#C": "ClosingTime"
            }, 
            ExpressionAttributeValues: {
                ":t": {
                    S: currentEpochTime.toString()
                    }
            }, 
            Key: {
                JobId: job.JobId,
                CountryId: job.CountryId
            },
            TableName: 'Job',
            ReturnConsumedCapacity: "TOTAL",
            ReturnItemCollectionMetrics: "SIZE",
            ReturnValues: "ALL_NEW",
            UpdateExpression: "SET #C = :t"
        };

        var updateJob = dynamodb.updateItem(params).promise();

        updateJob
            .then(console.log)
    });
