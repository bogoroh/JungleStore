/**
 * Affiliate2Controller
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
// Affiliate 2 API key   994D49B55DB0748324BB4A6366197730
        var path = "/distro/json/994D49B55DB0748324BB4A6366197730/";

    // using the async package, do a waterfall style db query
    // the results of the first query can be passed to the next

    // the first query gets all skus from the affiliate site's database then passes that into the second query for further processing

        var products = async.waterfall([
            function(callback){
                Affiliate2.find()
                .sort('sku asc')
                .done(function(err, usr) {
                    if (err) {
                        res.send(500, { error: "DB Error" });
                    } else {
                        console.log("Product Info");
                        console.log(usr)
                        callback(null, usr);
                    }
                });
            },
            function(res1, callback){
                Affiliate2.find({ groupBy: [ 'category' ], sum: [ 'price' ] })
                .done(function(err, usr) {
                    if (err) {
                        res.send(500, { error: "DB Error" });
                    } else {

                        // console.log(usr)
                        callback(null, res1, usr);
                    }
                });
            },
            function(res1, res2, callback){
                // console.log(res1)
    // the second query gets all skus from the results of the first query, and builds out the rest of the API url

                for(var i=0, max = res1.length; i < max; i++){
                    path += res1[i].sku + ((i < (max-1)) ? "," : "");
                }

                var categories = []
                for(var i=0, max = res2.length; i < max; i++){
                    categories.push({'category': res2[i].category});
                }

                console.log(categories);
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
                        if(req.session.affiliate2cart){
                            var tempCart = req.session.affiliate2cart;
                            var CartCount = 0;
                            for(var i = 0; i< tempCart.length; i++){
                                CartCount += (tempCart[i].qty)*1;
                            }
                            var cartQty = CartCount;
                        }
                        else{
                            var cartQty =  0;
                        };
                        console.log(responseData);
                        catPage = {}
                      res.view({details: responseData, prices: res1, categories: categories, catPage: catPage, cartQty: cartQty });
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

    },
    category: function (req, res) {

        var path = "/distro/json/994D49B55DB0748324BB4A6366197730/";


// using the async package, do a waterfall style db query
// the results of the first query can be passed to the next

// the first query gets all skus from the affiliate site's database then passes that into the second query for further processing
        var category = req.param('category');
        console.log(category);
        var products = async.waterfall([
            function(callback){
                Affiliate2.find()
                .where({category: category})
                .sort('sku asc')
                .done(function(err, usr) {
                    if (err) {
                        res.send(500, { error: "DB Error" });
                    } else {
                        console.log("Product Info");
                        console.log(usr)
                        callback(null, usr);
                    }
                });
            },
            function(res1, callback){
                Affiliate2.find({ groupBy: [ 'category' ], sum: [ 'price' ] })
                .done(function(err, usr) {
                    if (err) {
                        res.send(500, { error: "DB Error" });
                    } else {

                        // console.log(usr)
                        callback(null, res1, usr);
                    }
                });
            },
            function(res1, res2, callback){
                // console.log(res1)
// the second query gets all skus from the results of the first query, and builds out the rest of the API url

                for(var i=0, max = res1.length; i < max; i++){
                    path += res1[i].sku + ((i < (max-1)) ? "," : "");
                }


                var categories = []
                for(var i=0, max = res2.length; i < max; i++){
                    categories.push({'category': res2[i].category});
                }
                console.log(path);

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
                        if(req.session.affiliate2cart){
                            var tempCart = req.session.affiliate2cart;
                            var CartCount = 0;
                            for(var i = 0; i< tempCart.length; i++){
                                CartCount += (tempCart[i].qty)*1;
                            }
                            var cartQty = CartCount;
                        }
                        else{
                            var cartQty =  0;
                        };
                        catPage = {'category': category}
                      res.view('affiliate2/index', {details: responseData, prices: res1, categories: categories, catPage: catPage, cartQty: cartQty});
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

    },
    product: function (req, res) {

        var path = "/distro/json/994D49B55DB0748324BB4A6366197730/";
        var productsku = req.param('sku');

        var products = async.waterfall([
            function(callback){
                Affiliate2.findOne()
                .where({sku: productsku})
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
                Affiliate2.find({ groupBy: [ 'category' ], sum: [ 'price' ] })
                .done(function(err, usr) {
                    if (err) {
                        res.send(500, { error: "DB Error" });
                    } else {

                        // console.log(usr)
                        callback(null, res1, usr);
                    }
                });
            },
            function(res1, res2, callback){
                console.log(res1)
// the second query gets all skus from the results of the first query, and builds out the rest of the API url


                path += res1.sku;


                console.log(path);

                var categories = []
                for(var i=0, max = res2.length; i < max; i++){
                    categories.push({'category': res2[i].category});
                }


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
                        if(req.session.affiliate2cart){
                            var tempCart = req.session.affiliate2cart;
                            var CartCount = 0;
                            for(var i = 0; i< tempCart.length; i++){
                                CartCount += (tempCart[i].qty)*1;
                            }
                            var cartQty = CartCount;
                        }
                        else{
                            var cartQty =  0;
                        };
                        // console.log(responseData);
                      res.view("affiliate2/product",{details: responseData[0], prices: res1, categories: categories, cartQty: cartQty});
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

    },

    additem: function(req,res){
        var exist = false;



        if(req.session.affiliate2cart){
            var tempCart = req.session.affiliate2cart;
        }
        else{
            var tempCart = [];
        }
        console.log(tempCart);

        for(var i = 0; i < tempCart.length; i++){
            console.log(tempCart[i].sku);
            if(tempCart[i].sku == req.param('sku')){
                tempCart[i].qty++;
                tempCart[i].total = Math.round(100*(tempCart[i].qty*(req.param('price')*1)))/100;
                exist = true;
            }
        }

        console.log(req.param('name'));

        if(exist == false){
                var cartItem = {
                sku : req.param('sku'),
                name : req.param('name'),
                price : req.param('price')*1,
                qty : 1,
                total: req.param('price')*1
            };
            tempCart.push(cartItem);
        }

        req.session.affiliate2cart = tempCart;

        console.log(req.session.affiliate2cart);
        var CartCount = 0;

        for(var i = 0; i< tempCart.length; i++){
            CartCount += (tempCart[i].qty)*1;
        }

        var CountObj = {
            count: CartCount
        };

        res.json(CountObj);
    },

    viewcart: function (req, res) {
        async.waterfall([
            function(callback){
                Affiliate2.find({ groupBy: [ 'category' ], sum: [ 'price' ] })
                .done(function(err, usr) {
                    if (err) {
                        res.send(500, { error: "DB Error" });
                    } else {

                        // console.log(usr)
                        callback(null, usr)
                    }
                });
            },
            function(res1, callback){

                var categories = []
                for(var i=0, max = res1.length; i < max; i++){
                    categories.push({'category': res1[i].category});
                }


                if (req.session.affiliate2cart) {
                    // GET THE SESSION STORED CART
                        var userCart = req.session.affiliate2cart;
                        console.log("userCart");
                        console.log(userCart);
                    // TEST DATA
                        var SubTotal = 0;
                        for(var i = 0; i< userCart.length; i++){
                            SubTotal += (Math.round(100*(userCart[i].total))/100);
                        }
                        SubTotal = Math.round(100*SubTotal)/100;
                        var TotalObj = {
                            total: SubTotal
                        };


                            var CartCount = 0;
                            for(var i = 0; i< userCart.length; i++){
                                CartCount += (userCart[i].qty)*1;
                            }
                            var cartQty = CartCount;

                        res.view("affiliate2/cart",{cart: userCart, total: TotalObj, categories: categories, cartQty: cartQty});
                }else{

                    var cartQty =  0;

                        res.view("affiliate2/emptycart",{categories: categories, cartQty: cartQty});

                }
            }
        ]);
    },

     updateitem: function(req,res){
        var tempCart = req.session.affiliate2cart;

        for(var i = 0; i < tempCart.length; i++){
            if(tempCart[i].sku == req.param('sku')){
                tempCart[i].qty = req.param('qty');
                tempCart[i].total = (Math.round(100*(tempCart[i].qty*(req.param('price')*1)))/100);

                updateditem = {
                    sku:tempCart[i].sku,
                    qty: tempCart[i].qty,
                    total: tempCart[i].total,
                }
            }
        }

        req.session.affiliate2cart = tempCart;

        var SubTotal = 0;
        for(var i = 0; i< tempCart.length; i++){
            SubTotal += (Math.round(100*(tempCart[i].total))/100);
        }
        SubTotal = Math.round(100*SubTotal)/100;
        var TotalObj = {
            total: SubTotal
        };
        if(req.session.affiliate2cart){

            var CartCount = 0;
            for(var i = 0; i< tempCart.length; i++){
                CartCount += (tempCart[i].qty)*1;
            }
            var cartQty = CartCount;
        }
        else{
            var cartQty =  0;
        };
            res.json({item: updateditem, total: TotalObj, cartQty: cartQty});

     },

      deleteitem: function(req,res){
         var tempCart = req.session.affiliate2cart;

         for(var i = 0; i < tempCart.length; i++){
             if(tempCart[i].sku == req.param('sku')){
                 tempCart.splice(i,1);
             }
         }

         req.session.affiliate2cart = tempCart;

         var SubTotal = 0;
         for(var i = 0; i< tempCart.length; i++){
             SubTotal += (Math.round(100*(tempCart[i].total))/100);
         }
         SubTotal = Math.round(100*SubTotal)/100;
         var TotalObj = {
             total: SubTotal
         };
         if(req.session.affiliate2cart){

             var CartCount = 0;
             for(var i = 0; i< tempCart.length; i++){
                 CartCount += (tempCart[i].qty)*1;
             }
             var cartQty = CartCount;
         }
         else{
             var cartQty =  0;
         };
             res.json({total: TotalObj, cartQty: cartQty});

      }

}
