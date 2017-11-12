var AWS = require('aws-sdk');
var print = require('./../lib/helpers').printPretty;
var dynamodb = new AWS.DynamoDB();

var params = {
    "TableName": "GMJS.User",
    "Key": {
        "UserId": { "S": "001" }
    },
    "ReturnConsumedCapacity": "TOTAL",
    "UpdateExpression": "SET #LN = :t, #NOL = :n",
    "ExpressionAttributeNames": {
        "#LN": "LastName",
        "#NOL": "NoOfLogins"
    },
    "ExpressionAttributeValues": {
        ":t": { "S": "Chauhan" },
        ":n": { "N": "1" }
    }
};
/*
var params = {
    "TableName": "GMJS.User",
    "Key": {
        "UserId": { "S": "001" }
    },
    "ReturnConsumedCapacity": "TOTAL",
    "UpdateExpression": "ADD #NOL :n",
    "ExpressionAttributeNames": {
        "#NOL": "NoOfLogins"
    },
    "ExpressionAttributeValues": {
        ":n": { "N": "1" },
        ":max": { "N": "5" }
    },
    "ConditionExpression": "#NOL < :max"
};
*/
var promise = dynamodb.updateItem(params).promise();

promise
    .then(print)
    .catch(print);
