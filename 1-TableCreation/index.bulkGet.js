var AWS = require('aws-sdk');
var print = require('lib');

var params = {
    "RequestItems": {
        "Job": {
            "Keys": [ 
                    {
                        "JobId": {
                            "S": "d1a6a32b-22b1-44c7-a9f2-9885c915f685"
                        },  
                        "CountryId": {
                            "S": "14"
                        }
                    },
                    {
                        "JobId": {
                            "S": "cee6173d-6f87-475e-9730-69172a8b82a2"
                        },  
                        "CountryId": {
                            "S": "14"
                        }
                    },
                    {
                        "JobId": {
                            "S": "03d11afd-36d1-403a-a3d2-34440433a10ab"
                        },  
                        "CountryId": {
                            "S": "14"
                        }
                    }
            ],
        }
    }
}

var dynamodb = new AWS.DynamoDB();

var promise = dynamodb.batchGetItem(params).promise()

promise
    .then(lib)
    .catch(console.log);
