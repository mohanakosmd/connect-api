console.log('api.js:- Start.');
var express = require('express');		
var app = express();

var moment = require('moment-timezone');
const config = require('../config/config');

var Request = require("request");

var logger = require('../middlewares/logger');
var db = require('../helper/database');

var errorAuthToken = 'Sorry but we could not log you in at this time. Please check with your system administrator.';

exports.status = function (req, res) {
    // optional: add further things to check (e.g. connecting to dababase)
	const healthcheck = {
		uptime: secondsToDhms(process.uptime()),
		message: 'OK',
		current_time: new Date(Date.now()).toLocaleTimeString("en-US")
    };
    

    var sql = db.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
		if (err) {
            logger.warn('Connect-api Health check failed');
            healthcheck.message = e;
		    res.status(503).send();			
		} else {
            res.status(200).json(healthcheck);
		}
	})

}

function secondsToDhms(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600*24));
	var h = Math.floor(seconds % (3600*24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	
	var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}