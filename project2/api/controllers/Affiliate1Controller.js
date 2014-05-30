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

// #############################################
// #############################################
// This is how we set a session variable. The basic syntax is req.session .  In this instance, it is being set to the variable named 'test', and are storing the value "TEST SOURCE AFFILIATE1" to it. To demonstrate how it is being retrieved back from the server, the variable is being read on a different route.

// So, to set this variable, you would view the page at /affiliate1.  Then to read it back, view the page at /affiliate2.  The result will be in the terminal window.  When you view the second page (/affiliate2), you will see TEST SOURCE AFFILIATE1 in the terminal window.
// #############################################
// #############################################

        // req.session.test = "TEST SOURCE AFFILIATE1";



// suggestion for the shopping cart. The products being bought would be stored as an array of objects, and when the session variable is stored for later, store it as a JSON entry by using JSON.stringify().

		// req.session.affiliate1cart = [];

        // req.session.affiliate1ShoppingCart = JSON.stringify([ { sku: '00001', name: 'Product 1', price: 5.99, quantity: 1 }, { sku: '00002', name: 'Product 2', price: 9.99, quantity: 2 } ]);

        // suggested use

        // req.session.affiliate2ShoppingCart = []; // suggested use



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
                        console.log("Product Info");
                        console.log(usr)
                        callback(null, usr);
                    }
                });
            },
            function(res1, callback){
                Affiliate1.find({ groupBy: [ 'category' ], sum: [ 'price' ] })
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
                        console.log(responseData);
                        catPage = {}
                      res.view({details: responseData, prices: res1, categories: categories, catPage: catPage});
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
// set up the base path of the distro API
// Affiliate 1 API key 3CF3C254C4333EF75342F19BE3B8CEEF
        var path = "/distro/json/3CF3C254C4333EF75342F19BE3B8CEEF/";


// using the async package, do a waterfall style db query
// the results of the first query can be passed to the next

// the first query gets all skus from the affiliate site's database then passes that into the second query for further processing
        var category = req.param('category');
        console.log(category);
        var products = async.waterfall([
            function(callback){
                Affiliate1.find()
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
                Affiliate1.find({ groupBy: [ 'category' ], sum: [ 'price' ] })
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
                        // console.log(responseData);
                        // console.log("category" + category);
                        catPage = {'category': category}
                      res.view('affiliate1/index', {details: responseData, prices: res1, categories: categories, catPage: catPage});
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

        var path = "/distro/json/3CF3C254C4333EF75342F19BE3B8CEEF/";
        var productsku = req.param('sku');

        var products = async.waterfall([
            function(callback){
                Affiliate1.findOne()
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
                Affiliate1.find({ groupBy: [ 'category' ], sum: [ 'price' ] })
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
                        console.log(responseData);
                      res.view("affiliate1/product",{details: responseData[0], prices: res1, categories: categories});
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



    	if(req.session.affiliate1cart){
    		var tempCart = req.session.affiliate1cart;
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

    	req.session.affiliate1cart = tempCart;

		console.log(req.session.affiliate1cart);
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
                Affiliate1.find({ groupBy: [ 'category' ], sum: [ 'price' ] })
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
            // GET THE SESSION STORED CART
            	var	userCart = req.session.affiliate1cart;
            	console.log("userCart");
            	console.log(userCart);
            // TEST DATA
                var SubTotal = 0;
            	for(var i = 0; i< userCart.length; i++){
					SubTotal += (Math.round(100*(userCart[i].total))/100);
				}
				var TotalObj = {
					total: SubTotal
				};

                    res.view("affiliate1/cart",{cart: userCart, total: TotalObj, categories: categories});

                }
        ]);


    },

     updateitem: function(req,res){
        var tempCart = req.session.affiliate1cart;

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

        req.session.affiliate1cart = tempCart;

        var SubTotal = 0;
        for(var i = 0; i< tempCart.length; i++){
            SubTotal += (Math.round(100*(tempCart[i].total))/100);
        }
        var TotalObj = {
            total: (SubTotal).toFixed(2)
        };
            res.json({item: updateditem, total: TotalObj});

     },

      deleteitem: function(req,res){
         var tempCart = req.session.affiliate1cart;

         for(var i = 0; i < tempCart.length; i++){
             if(tempCart[i].sku == req.param('sku')){
                 tempCart.splice(i,1);
             }
         }

         req.session.affiliate1cart = tempCart;

         var SubTotal = 0;
         for(var i = 0; i< tempCart.length; i++){
             SubTotal += (Math.round(100*(tempCart[i].total))/100);
         }
         var TotalObj = {
             total: SubTotal
         };
             res.json({total: TotalObj});

      }

}
