/**
 * CartController
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

    addItem: function(req,res,next) {
    	var item = req.item.all();

    	Cart.addItem(item, function(err,cart){
    		if (err) return next(err);

    		res.status(201);
    		res.json(cart);
    	})

    },

    cartItems: function(req,rex,next) {
    	var sku = req.item('sku');

    	var skuShortCut = isShortCut(sku);

    	if(skuShortCut === true){
    		return next();
    	}

    	if(sku){
    		Cart.findOne(sku, function(err, cart){
    			if(cart === undefined) return res.notFound();

    			if(err) return next(err);

    			res.json(cart);
    		});
    	}else{
    		// var
    	}
    }



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CartController)
   */



};
