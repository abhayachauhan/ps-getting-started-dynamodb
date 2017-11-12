var AWS = require('aws-sdk');
var print = require('./../lib/helpers.js').printPretty;
var dynamodb = new AWS.DynamoDB();

var params = {
    "RequestItems": {
       "GMJS.Job": {
          "Keys": [
             {
                "JobId": {
                   "S": "0f296cdc-1b07-41e9-867e-0a6a66e56de7"
                },
                "CountryId": {
                   "S": "18"
                }
             },
             {
                "JobId": {
                   "S": "d88a73f7-0f2d-46be-9073-b62cfc9bf98e"
                },
                "CountryId": {
                   "S": "8"
                }
             },
             {
                "JobId": {
                   "S": "00b083a0-8c33-406f-9c6b-db0460b0b240"
                },
                "CountryId": {
                   "S": "13"
                }
             }
          ]
       },
       "GMJS.User": {
          "Keys": [
             {
                "UserId": {
                   "S": "80750525-8ea7-46f5-b456-25e6f91a0746"
                }
             }
          ]
       }
    },
    "ReturnConsumedCapacity": "TOTAL"
};

var promise = dynamodb.batchGetItem(params).promise();

promise
    .then(print)
    .catch(print);
