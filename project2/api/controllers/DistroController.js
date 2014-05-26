/**
 * DistroControllerController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    index: function (req, res) {
        if (!!req.session.user ){
            Distro.find().done(function(err, usr) {
                if (err) {
                    res.send(500, { error: "DB Error" });
                } else {
                    console.log(usr)
                    res.view({skus: usr})
                }
            });
        }else {
            req.flash('session','Session has been timed out');
            res.redirect("/distro/login")
        }
    // res.send("this");
    },
    json: function (req, res) {
// For the JSON returning API call, we take in two parameters, the API key, and the sku list.
// First we need to verify the API key
        var key = req.param('key');

        async.waterfall([
            function(callback){
// See if the key as entered exists in the distrokeys collection, if it does, proceed to the sku search, if not, terminate early and return an error
                DistroKeys.findOne()
                .where({apikey : key})
                .done(function(err, usr) {
                    if (err) {
                        res.send(500, { error: "DB Error" });
                    } else if(!usr) {
                        console.log("Invalid API Key");
                        return res.json({error: "Invalid API Key"});
                    }else {
                        console.log("Valid API Key");
                        console.log(usr)
                        callback(null, usr);
                    }
                });
            },
            function(res1, callback){
                // console.log(res1)
// If the API key is validated, get the comma separated skus parameter, and split it into an array
                var skus = req.param('skus');
                // console.log(key);
                var prodSkus = skus.split(",");
                // console.log(prodSkus);
// Find all products that match the entered skus, and return it as a JSON entity
                Distro.find({sku: prodSkus})
                .sort('sku asc')
                .done(function(err, usr) {
                    if (err) {
                        res.send(500, { error: "DB Error" });
                    } else {
                        // console.log(usr);
                        return res.json(usr);
                    }
                });

            }
        ]);


    }
};
