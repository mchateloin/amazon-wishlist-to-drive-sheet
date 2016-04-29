# An Amazon Wishlist to Google Drive integration

This is a job that posts new items from an Amazon wishlist to a spreadsheet on Google Drive.


## Requirements

- [Google Service Account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount)
- A Google Drive spreadsheet you want to write to. You must share it and [give edit access](https://support.google.com/drive/answer/2494822?hl=en) to the client email assigned to your app by Google.
- An Amazon wishlist you want to read from. Must be [marked as public](http://www.amazon.com/gp/help/customer/display.html?nodeId=501094).
- [Amazon S3 Bucket](https://aws.amazon.com/s3/)
- A server running [Amazon Wishlister](https://github.com/doitlikejustin/amazon-wish-lister)

That last one provides an endpoint to scrape a wishlist page from Amazon. At the time of this writing, scraping is currently necessary as Amazon doesn't provide access to a wishlist through their API. I recommend using a free [Heroku PHP instance](https://devcenter.heroku.com/articles/getting-started-with-php#introduction)

## Installation

Next clone this project and run:

```
npm install
```

Now create a file titled **.env** with the following contents, and fill in your environment keys.

```
GOOGLE_SPREADSHEET_KEY=''
GOOGLE_CLIENT_EMAIL=''
GOOGLE_PRIVATE_KEY=''
AMAZON_WISHLIST_ID=''
AWS_ACCESS_KEY=''
AWS_SECRET_KEY=''
AWS_REGION=''
S3_BUCKET=''
```

For deploying, you can host this anywhere. If you're using Heroku, you can run the following to load your environment variables into your instance.

```
./bin/heroku-config
```


