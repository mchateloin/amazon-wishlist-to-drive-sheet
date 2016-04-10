var process = require('process');

module.exports = {
    google_spreadsheet_key: process.env.GOOGLE_SPREADSHEET_KEY,
    google_client_email: process.env.GOOGLE_CLIENT_EMAIL,
    google_private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    amazon_wishlist_id: process.env.AMAZON_WISHLIST_ID,
    aws_access_key: process.env.AWS_ACCESS_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY,
    aws_region: process.env.AWS_REGION,
    s3_bucket: process.env.S3_BUCKET
};