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
        Distro.find().done(function(err, usr) {
            if (err) {
                res.send(500, { error: "DB Error" });
            } else {
                console.log(usr)
                res.view({skus: usr})
            }
        });
    // res.send("this");
    },
    json: function (req, res) {
        var key = req.param('key');
        // console.log(key);
        var keys = key.split(",");
        // console.log(keys);
        Distro.find({sku: keys}).done(function(err, usr) {
            if (err) {
                res.send(500, { error: "DB Error" });
            } else {
                // console.log(usr);
                return res.json(usr);
            }
        });

    }
};
