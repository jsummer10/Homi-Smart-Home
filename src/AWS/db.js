/**
 * Establishes the MongoDB database
 *
 * @file      db.js.
 * @author    Martin Lopez, Diego Moscoso, Jacob Summerville.
 * @since     11/29/2021
 * @copyright Martin Lopez, Diego Moscoso, Jacob Summerville 2021
 */

// to use mongoDB
const mongoose = require("mongoose");
const db = mongoose.connection;

// database url
const mongoDBURL = 'mongodb://127.0.0.1/Homi';

mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology:true });

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose;