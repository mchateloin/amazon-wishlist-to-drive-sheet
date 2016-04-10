var RSVP = require('rsvp'),
    utils = require('./lib')
    fs = require('fs'),
    GoogleSpreadsheet = require("google-spreadsheet"),
    config = require('./config.js'),
    doc = new GoogleSpreadsheet(config['google_spreadsheet_key']);


RSVP.hash({
        currentItems: utils.getWishlistFromAmazon(config['amazon_wishlist_id']),
        previousItems: utils.getPreviousWishlist(),
        spreadsheetAuthenticated: utils.authenticateServiceAccount(doc, {
            private_key: config['google_private_key'],
            client_email: config['google_client_email']
        })
    })
    .then(function(wishlist){
        var itemsAdded = utils.getDifference(wishlist.previousItems, wishlist.currentItems),
            rowValues = itemsAdded.map(function(item){
                return {
                    Image: '=IMAGE("' + item.picture + '")',
                    Title: '=HYPERLINK("' + item.link + '", "' + item.name + '")'
                };
            }),
            rowAddPromises = rowValues.map(function(rowObj){
                return utils.addRowsToDriveSpreadsheet(doc, 1, rowObj);
            });

        rowAddPromises.push(utils.savePreviousWishlist(wishlist.currentItems));

        return RSVP.all(rowAddPromises);
    }, function(){
        console.log('Error finding wishlists or authenticating to drive!')
    })
    .then(function(){
        console.log('Success adding rows to spreadsheet!');
    }, function(){
        console.log('Error adding rows to spreadsheet!');
    });