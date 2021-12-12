/**
 * Handles the Particle device routes
 *
 * @file      device.js.
 * @author    Martin Lopez, Diego Moscoso, Jacob Summerville.
 * @since     11/29/2021
 * @copyright Martin Lopez, Diego Moscoso, Jacob Summerville 2021
 */

const crypto = require('crypto');
var request = require('superagent');

const User = require('../models/user')
const Device = require('../models/device')

/**
 * Function that updates the current user's device information
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.update = function(req, res){
    var userQuery = { username: req.body.username };
    let deviceList = [];

    for (device of req.body.devices) {
        var deviceData = new Device({
            name  : device.name,
            id    : device.id,
            token : device.token
        });
        
        deviceData.save(function (err) { 
            if (err) console.log('an error occurred while saving the device'); 
        });

        deviceList.push(deviceData);
    }

    var newDeviceList = { $set: {
        devices: deviceList
    }};

    User.updateOne(userQuery, newDeviceList, function(err, result) {
        if (err) {
            res.send('BAD');
        } else {
            res.send('OK');
        }
    });
}