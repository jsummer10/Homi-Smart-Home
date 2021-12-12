/**
 * Handles the cloud Particle commands
 *
 * @file      particle.js.
 * @author    Martin Lopez, Diego Moscoso, Jacob Summerville.
 * @since     11/29/2021
 * @copyright Martin Lopez, Diego Moscoso, Jacob Summerville 2021
 */

const crypto = require('crypto');
const request = require('superagent');
const Device = require('../models/device')

var rxData = {};

var referenceTimeInSec = null;
var clockUnit = 60;     // 1 sec --> 1 minutes
let simulatedTime = null;

function simulatedClock(data) {
    let str = "";
    if ("t" in data) {
        if (referenceTimeInSec == null) {
          referenceTimeInSec = data.t;
        }
        let curTimeInSec = data.t;
        let simTimeInSec = referenceTimeInSec + (curTimeInSec-referenceTimeInSec)*clockUnit;
        let curTime = new Date(curTimeInSec*1000);
        simulatedTime = new Date(simTimeInSec*1000);
    }
}

exports.report = function(req, res){
    rxData = JSON.parse(req.body.data);
    simulatedClock(rxData);
    res.status(201).json({status: 'ok'});
}

// TODO: check if this works on the client
exports.publish = function(req, res){
    request
    .get("https://api.particle.io/v1/devices/" + req.body.id + "/cloudcmd")
    .set('Authorization', 'Bearer ' + req.body.token)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({ args: JSON.stringify(req.body)}) 
    .then(response => {
        res.status(200).json({cmd: 'publish', success: true});
    })
    .catch(err => {
        res.status(201).json({cmd: 'publish', success: false});  
    });
}

exports.ping = function(req, res){
    request
        .put("https://api.particle.io/v1/devices/" + req.body.id + "/ping")
        .set('Authorization', 'Bearer ' + req.body.token)
        .set('Accept', 'application/json')
        .send() 
        .then(response => {
            res.status(200).json({cmd: 'ping', success: true, data: JSON.parse(response.text)});
        })
        .catch(err => {
            res.status(201).json({cmd: 'ping', success: false, data: JSON.parse(err.response.text)});  
        });
}

exports.read = function(req, res){
    let retData = rxData;
    if (simulatedTime) retData["simclock"] = simulatedTime.toString();
    res.status(201).json({ cmd: 'read', data: retData });
}