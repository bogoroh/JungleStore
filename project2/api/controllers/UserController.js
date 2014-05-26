/**
 * UserController
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

	login: function (req, res) {
		Admin.findOne({username:req.param('username'),password:req.param("password")}).done(function(err, result){
			if(!!result){
				req.session.user = {}
				req.session.user.username = result.username
				req.session.user.password = result.password
				req.session.user.authenticated = true
				res.redirect("/distro")
				console.log(req.session.user)
			} else {
				req.flash('incorrect','Incorrect password or username');
				res.redirect("/distro/login")
			}
		})
	},

	logout: function(req, res) {
		req.session.user.authenticated = false;
		console.log(req.session.user)
		res.send("Successfully logged out");
	},

	signup: function(req, res) {
		Admin.findOne({username:req.param('username')}).done(function(err, successs) {
			if(!successs) {
				Admin.save({username:req.param('username'), password:req.param('password')});

				// sets session variables
				req.session.user = successs;
				req.session.user.authenticated = true;
				console.log("user added");
				res.redirect('/distro');
			} else {
				req.flash('exist','User already exists');
				res.redirect('/distro/signup');
			}
		})
	}
};
