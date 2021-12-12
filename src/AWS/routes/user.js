/**
 * Handles the user routes
 *
 * @file      user.js.
 * @author    Martin Lopez, Diego Moscoso, Jacob Summerville.
 * @since     11/29/2021
 * @copyright Martin Lopez, Diego Moscoso, Jacob Summerville 2021
 */

const crypto = require('crypto');
const delay  = require('delay');

const User = require('../models/user')
const Device = require('../models/device')

const iterations = 1000;

/**
 * Function that logs the user into the database
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.login = function(req, res){

    let username = req.body.username;

    let errorReturn = { code: '' }

    User.find({ username: req.body.username }).exec(function (error, results) {
        if (results.length != 0) {
            let account = results[0]
            let password = req.body.password;

            var salt = account.salt;
            crypto.pbkdf2(password, salt, iterations, 64, 'sha512', async (err, hash) => {
                if (err) { throw err; }
                let hStr = hash.toString('base64');
                if (account.hash == hStr) {

                    var deviceList = [];
                    for (device of account.devices) {
                        Device.find({ '_id': device }).exec(function (error, results) {
                            newDevice = {
                                name  : results[0].name,
                                id    : results[0].id,
                                token : results[0].token
                            }
                            deviceList.push(newDevice);
                        })
                    }

                    await delay(200);

                    const userInfo = {
                        code    : 'OK',
                        fname   : account.fname,
                        lname   : account.lname,
                        zipcode : account.zipcode,
                        devices : deviceList,
                    }

                    res.send(JSON.stringify(userInfo));
                }
                else {
                    errorReturn.code = 'Incorrect password';
                    res.send(JSON.stringify(errorReturn));
                }
            });
        }
        else {
            errorReturn.code = 'Incorrect Username';
            res.send(JSON.stringify(errorReturn));
        }
    });
};
    
/**
 * Function that creates a new user in the database
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.create = function(req, res){

    User.find({ username: req.body.username }).exec(function (error, results) {
        if (results.length == 0) {
            let password = req.body.password;

            // salting & hashing
            var salt = crypto.randomBytes(64).toString('base64');
            crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, hash) => {
                if (err) throw err;
                let hStr = hash.toString('base64');

                // save new account
                var userData = new User({
                    fname    : req.body.fname,
                    lname    : req.body.lname,
                    username : req.body.username,
                    zipcode  : req.body.zipcode,
                    salt     : salt,
                    hash     : hStr
                });
                userData.save(function (err) { if (err) console.log('an error occurred'); });
                res.send('OK');
            });
        }
        else {
            res.send('Username already taken.');
        }
    });
}

/**
 * Function that updates the current user's info
 * @param    {Object} req    post request
 * @param    {Object} res    post response
 * @return   None
 */
exports.update = function(req, res){
    var userQuery = { username: req.body.curUsername };

    let errorReturn = { code: '' }

    User.find(userQuery).exec(function (error, results) {
        if (results.length != 0) {
            let account = results[0]
            let curPassword = req.body.curPassword;

            let salt = account.salt;
            crypto.pbkdf2(curPassword, salt, iterations, 64, 'sha512', (err, hash) => {
                if (err) { throw err; }
                let hStr = hash.toString('base64');
                if (account.hash == hStr) {
                    // credentials verified

                    var newAccount = {};

                    if ('fname'   in req.body) { newAccount.fname = req.body.fname; }
                    if ('lname'   in req.body) { newAccount.lname = req.body.lname; }
                    if ('zipcode' in req.body) { newAccount.zipcode = req.body.zipcode; }
                    if ('newUsername' in req.body) { newAccount.username = req.body.newUsername; }

                    if ('newPassword' in req.body) {
                        let newSalt = crypto.randomBytes(64).toString('base64');
                        crypto.pbkdf2(req.body.newPassword, newSalt, iterations, 64, 'sha512', (err, hash) => {
                            if (err) throw err;
                            let newHash = hash.toString('base64')

                            if (newSalt && newHash && newHash !== '') {
                                newAccount.salt = newSalt;
                                newAccount.hash = newHash; 
                            }
                            
                            User.updateOne(userQuery, newAccount, function(err, result) {
                                if (err) {
                                    errorReturn.code = 'Error updating';
                                    res.send(JSON.stringify(errorReturn));
                                } else {
                                    errorReturn.code = 'OK';
                                    res.send(JSON.stringify(errorReturn));
                                }
                            });
                        });
                    } else {
                       User.updateOne(userQuery, newAccount, function(err, result) {
                            if (err) {
                                errorReturn.code = 'Error updating';
                                res.send(JSON.stringify(errorReturn));
                            } else {
                                errorReturn.code = 'OK';
                                res.send(JSON.stringify(errorReturn));
                            }
                        }); 
                    }
                } else {
                    errorReturn.code = 'Incorrect password';
                    res.send(JSON.stringify(errorReturn));
                }
            });
        } else {
            errorReturn.code = 'Error finding the account';
            res.send(JSON.stringify(errorReturn));
        }
    });
}