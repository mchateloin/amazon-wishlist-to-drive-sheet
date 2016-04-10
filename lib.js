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
                    resolve(JSON.parse(body));
                }).on('error', function(error){
                    reject(error);
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
                    resolve([]);
                    return;
                }

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
                    reject();
                    return;
                }

                resolve();
            })
        })
    },

    authenticateServiceAccount: function(doc, creds){
        return new RSVP.Promise(function(resolve, reject) {
            doc.useServiceAccountAuth(creds, function (err) {
                if(err){
                    reject();
                    return;
                }

                resolve();
            })
        });
    },

    addRowsToDriveSpreadsheet: function(doc, sheetIndex, rowObj){
        return new RSVP.Promise(function(resolve, reject){
            doc.addRow(sheetIndex, rowObj, function(err){

                if(err){
                    reject();
                    return;
                }

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

