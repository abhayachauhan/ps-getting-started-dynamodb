var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

var tablePrefix = "";

function createJobTable() {
   
    var params = {
        AttributeDefinitions: [
            {
                AttributeName: "CountryId", 
                AttributeType: "S"
            }, 
                {
                AttributeName: "JobId", 
                AttributeType: "S"
            }
            ], 
        KeySchema: [
                {
                AttributeName: "CountryId", 
                KeyType: "HASH"
            }, 
                {
                AttributeName: "JobId", 
                KeyType: "RANGE"
            }
            ], 
        ProvisionedThroughput: {
            ReadCapacityUnits: 1, 
            WriteCapacityUnits: 1
        }, 
        TableName: tablePrefix+"Job"
    };
    var promise = dynamodb.createTable(params).promise();
    return promise;
};

function createApplicantTable() {
    var params = {
        AttributeDefinitions: [
            {
                AttributeName: "ApplicantId", 
                AttributeType: "S"
            }
            ], 
        KeySchema: [
                {
                AttributeName: "ApplicantId", 
                KeyType: "HASH"
            }
            ], 
        ProvisionedThroughput: {
            ReadCapacityUnits: 1, 
            WriteCapacityUnits: 1
        }, 
        TableName: tablePrefix+"Applicant"
    };
    var promise = dynamodb.createTable(params).promise();
    return promise;
};

function createJobApplicationTable() {
    var params = {
        AttributeDefinitions: [
            {
                AttributeName: "JobId", 
                AttributeType: "S"
            }, 
                {
                AttributeName: "ApplicantId", 
                AttributeType: "S"
            }
            ], 
        KeySchema: [
                {
                AttributeName: "JobId", 
                KeyType: "HASH"
            }, 
                {
                AttributeName: "ApplicantId", 
                KeyType: "RANGE"
            }
            ], 
        ProvisionedThroughput: {
            ReadCapacityUnits: 1, 
            WriteCapacityUnits: 1
        }, 
        TableName: tablePrefix+"JobApplication"
    };
    var promise = dynamodb.createTable(params).promise();
    return promise;
};

function done() {
    console.log('Finished creating all three tables.');
}

// function waitForAllTablesToExist() {
//     var jobExists = dynamodb.waitFor('tableExists', { TableName: 'Job' });
//     var jobApplicationExists = dynamodb.waitFor('tableExists', { TableName: 'JobApplication' });
//     var applicantExists = dynamodb.waitFor('tableExists', { TableName: 'Applicant' });

//     console.log('Waiting for tables to be created...');

//     return 
//         Promise.all(
//             [ jobExists.promise(), jobApplicationExists.promise(), applicantExists.promise() ]);
// }

createJobTable()
    .then(createApplicantTable)
    .then(createJobApplicationTable)
    // .then(waitForAllTablesToExist)
    .catch(function(err) {
        console.log(err, err.stack);
    })
    .then(done);

