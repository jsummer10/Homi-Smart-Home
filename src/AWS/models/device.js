/**
 * Establishes the MongoDB schema for the Particle device
 *
 * @file      device.js.
 * @author    Martin Lopez, Diego Moscoso, Jacob Summerville.
 * @since     11/29/2021
 * @copyright Martin Lopez, Diego Moscoso, Jacob Summerville 2021
 */

const db = require("../db");

var DeviceSchema = new db.Schema({
    name  : String,
    id    : String,
    token : String
});

const Device = db.model("Device", DeviceSchema);

module.exports = Device; 