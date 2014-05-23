/**
 * FooController
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
        console.log("I'M HERE")
        Person.find().done(function(err, usr) {
        if (err) {
            res.send(500, { error: "DB Error" });
        } else {
            console.log(usr)
        }
    });
    res.send("this");
    },
    signup: function (req, res) {
        console.log("I'M HERE")
        Person.find().done(function(err, usr) {
        if (err) {
            res.send(500, { error: "DB Error" });
        } else {
            console.log(usr)
        }
    });
    res.send("this");

    },
    login: function (req, res) {
        AustinLOOK.create({
          firstname: 'Mike',
          lastname: 'Mike',
          username: 'Mike',

        }).done(function(err, user) {

          // Error handling
          if (err) {
            return console.log(err);

          // The User was created successfully!
          }else {
            console.log("User created:", user);
          }
      });
        res.send("this");
    },
    chat: function (req, res) {

    }
};
