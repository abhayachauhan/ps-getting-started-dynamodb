var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    callback();
};
