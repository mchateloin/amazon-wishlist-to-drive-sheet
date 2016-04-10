var AWS = require('aws-sdk'),
    config = require('./config.js');

AWS.config.update({
    region: config['aws_region'],
    accessKeyId: config['aws_access_key'],
    secretAccessKey: config['aws_secret_key']
})

module.exports = new AWS.S3({params: {Bucket: config['s3_bucket']}})