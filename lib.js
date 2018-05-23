var RSVP = require('rsvp'),
    https = require('https'),
    config = require('./config.js'),
    s3bucket = require('./s3.js'),
    amazonToDriveKey = config['amazon_wishlist_id'] + '-' + config['google_spreadsheet_key'];

module.exports = {

    getWishlistFromAmazon: function(wishlistId){
        return new RSVP.Promise(function(resolve, reject){
            https.get({
                host: 'amazon-wish-lister.herokuapp.com',
                path: '/src/wishlist.php?id=' + wishlistId
            }, function(response){

                var body = '';

                response.on('data', function(d) {
                    body += d;
                });

                response.on('end', function() {
                    console.log('Got previous wishlist from Amazon');
                    resolve(JSON.parse(body));
                }).on('error', function(err){
                    console.log('Error getting current wishlist from Amazon');
                    reject(err);
                })
            })
        });
    },

    getPreviousWishlist: function(){
        return new RSVP.Promise(function(resolve, reject){
            s3bucket.getObject({
                Bucket: config['s3_bucket'],
                Key: amazonToDriveKey + '.json',
            }, function(err, data){
                if(err){
                    console.log('Empty previous wishlist from S3');
                    resolve([]);
                    return;
                }

                console.log('Loaded previous wishlist');
                resolve(JSON.parse(data.Body.toString()));
            })
        });
    },

    savePreviousWishlist: function(wishlist){
        return new RSVP.Promise(function(resolve, reject){
            s3bucket.putObject({
                Bucket: config['s3_bucket'],
                Key: amazonToDriveKey + '.json',
                Body: JSON.stringify(wishlist)
            }, function(err, data){

                if(err){
                    console.log('Error saving previous wishlist');
                    reject(err);
                    return;
                }

                console.log('Saved previous wishlist');
                resolve();
            })
        })
    },

    authenticateServiceAccount: function(doc, creds){
        return new RSVP.Promise(function(resolve, reject) {
            doc.useServiceAccountAuth(creds, function (err) {
                if(err){
                    console.log('Failed to authenticate service account');
                    reject(err);
                    return;
                }

                console.log('Authenticated service account');
                resolve();
            })
        });
    },

    addRowsToDriveSpreadsheet: function(doc, sheetIndex, rowObj){
        return new RSVP.Promise(function(resolve, reject){
            doc.addRow(sheetIndex, rowObj, function(err){

                if(err){
                    console.log('Error adding row');
                    reject(err);
                    return;
                }

                console.log('Added row');
                resolve();

            });
        });
    },

    getDifference: function(wishlistA, wishlistB){
        var lookupForA = {};

        wishlistA.forEach(function(item){
            lookupForA[item.ASIN] = true;
        });

        return wishlistB.filter(function(itemFromB){
            return typeof lookupForA[itemFromB.ASIN] === 'undefined';
        });
    }
}
