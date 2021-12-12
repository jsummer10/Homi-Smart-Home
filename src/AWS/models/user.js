/**
 * Establishes the MongoDB schema for the user
 *
 * @file      user.js.
 * @author    Martin Lopez, Diego Moscoso, Jacob Summerville.
 * @since     11/29/2021
 * @copyright Martin Lopez, Diego Moscoso, Jacob Summerville 2021
 */

const db = require("../db");

var UserSchema = new db.Schema({
    fname    : String,
    lname    : String,
    username : String,
    zipcode  : Number,
    salt     : String,
    hash     : String,
    devices  : [{ type: db.Schema.Types.ObjectId, ref: 'Device' }]
});

const User = db.model("User", UserSchema);

module.exports = User; 