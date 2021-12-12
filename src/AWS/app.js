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
const https         = require("https");
const fs            = require("fs");

const app = express();

/**
 * Custom modules and routes
 */

const db     = require('./db');
const User   = require('./models/user')
const Device = require('./models/device')

const userRoute     = require('./routes/user');
const deviceRoute   = require('./routes/device');
const particleRoute = require('./routes/particle');

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

app.post('/user/login',     userRoute.login);
app.post('/user/create',    userRoute.create);
app.post('/user/update',    userRoute.update);

app.post('/device/update',  deviceRoute.update);

app.post('/particle/report',  particleRoute.report);
app.post('/particle/publish', particleRoute.publish);
app.post('/particle/ping',    particleRoute.ping);
app.post('/particle/read',    particleRoute.read);

/**
 * Listen on LOCALHOST:PORT
 */

https
  .createServer(
    {
      key: fs.readFileSync("security/server.key"),
      cert: fs.readFileSync("security/server.cert"),
    },
    app
  )
  .listen(PORT, function () {
    console.log(
      `Server started on port ${PORT}`
    );
});