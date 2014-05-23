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


        var path = "/distro/json/";
        var products = async.waterfall([
            function(callback){
                Affiliate2.find().done(function(err, usr) {
                    if (err) {
                        res.send(500, { error: "DB Error" });
                    } else {
                        // console.log(usr)
                        callback(null, usr);
                    }
                });
            },
            function(res1, callback){
                // console.log(res1)
                for(var i=0, max = res1.length; i < max; i++){
                    path += res1[i].sku + ((i < (max-1)) ? "," : "");
                }

                // console.log(path);

                var http = require('http'), options = {
                host : "127.0.0.1",
                port : 1337,
                path : path,
                method : 'GET'
                };
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
                      // response available as `responseData` in `yourview`
                    //   res.locals.prices = JSON.parse(res1);
                    //   res.locals.details = JSON.parse(responseData);
                      res.view({details: responseData, prices: res1});
                    // res.send({prices: res1, stock: responseData});
                        // callback(null, res1, responseData);
                    } catch (e) {
                      sails.log.warn('Could not parse response from options.hostname: ' + e);
                    }

                    // console.log(responseData);
                    // res.view();
                  });
                }).end();


            }
        ]);

    }
}
