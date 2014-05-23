/**
 * Affiliate1Controller
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

// set up the base path of the distro API
// Affiliate 1 API key 3CF3C254C4333EF75342F19BE3B8CEEF
        var path = "/distro/json/3CF3C254C4333EF75342F19BE3B8CEEF/";

// using the async package, do a waterfall style db query
// the results of the first query can be passed to the next

// the first query gets all skus from the affiliate site's database then passes that into the second query for further processing

        var products = async.waterfall([
            function(callback){
                Affiliate1.find()
                .sort('sku asc')
                .done(function(err, usr) {
                    if (err) {
                        res.send(500, { error: "DB Error" });
                    } else {
                        console.log("Affiliate Site 1 Product Listing");
                        console.log(usr)
                        callback(null, usr);
                    }
                });
            },
            function(res1, callback){
                // console.log(res1)
// the second query gets all skus from the results of the first query, and builds out the rest of the API url

                for(var i=0, max = res1.length; i < max; i++){
                    path += res1[i].sku + ((i < (max-1)) ? "," : "");
                }

                // console.log(path);

// API url will look like   /distro/json/00001,00002,00003

// set up a new http request which will be the API call
// it is set to the IP of the localhost at the same port as the sails app using the path of the API call
                var http = require('http'), options = {
                host : "127.0.0.1",
                port : 1337,
                path : path,
                method : 'GET'
                };

// make the API call and encode the response data as utf8, this is necessary, when the data is returned parse it as JSON and save it to the responseData variable. when the API call ends, render the view passing in the original affiliate db query, and the results of the distro API response

                http.request(options, function(response) {
                  var responseData;
                  response.setEncoding('utf8');

                  response.on('data', function(chunk){
                    responseData = JSON.parse(chunk);
                  });

                  response.once('error', function(err){
                    // Some error handling here, e.g.:
                    res.serverError(err);
                  });

                  response.on('end', function(){
                    try {
                        console.log(responseData);
                      res.view({details: responseData, prices: res1});
                    // res.send({prices: res1, stock: responseData});
                        // callback(null, res1, responseData);
                    } catch (e) {
                      sails.log.warn('Could not parse response from options.hostname: ' + e);
                    }

                    // console.log(responseData);

                  });
                }).end();


            }
        ]);

    }
}
