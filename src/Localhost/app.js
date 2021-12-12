/**
 * The main controller for the node.js server
 *
 * @file      app.js.
 * @author    Martin Lopez, Diego Moscoso, Jacob Summerville.
 * @since     11/29/2021
 * @copyright Martin Lopez, Diego Moscoso, Jacob Summerville 2021
 */

// establish port to listen on 
const PORT = process.env.PORT || 3000;

/**
 * NPM modules
 */

const express       = require("express");
const parser        = require('body-parser');
const cookieParser  = require('cookie-parser');
const path          = require('path');
const createError   = require('http-errors');

const app = express();

/**
 * Custom modules and routes
 */

const serialRoute = require('./routes/serialcomm');

/**
 * Express app setup
 */

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// enable cross-origin access
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, \
                                                 Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

/**
 * POST requests
 */

app.post('/serial/scan',    serialRoute.scan);
app.post('/serial/open',    serialRoute.open);
app.post('/serial/close',   serialRoute.close);
app.post('/serial/write',   serialRoute.write);
app.post('/serial/read',    serialRoute.read);

/**
 * Listen on LOCALHOST:PORT
 */

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
