var RSVP = require('rsvp'),
    https = require('https'),
    config = require('./config.js'),
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
            fs.readFile(amazonToDriveKey + '.json', 'utf8', function(err, data){
                if (err) {
                    resolve([]);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    },

    savePreviousWishlist: function(wishlist){
        return new RSVP.Promise(function(resolve, reject){
             fs.writeFile(amazonToDriveKey + '.json', 'utf8', JSON.stringify(wishlist), function(err){
                 if(err){
                    reject(err);
                 } else {
                    resolve();
                 }
             });
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

