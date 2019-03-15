"use strict";

/**
 * A bit secure https server:
 *  + https certificates
 *  + Basic authentication
 *  + Token in querystring with expiration time. Every request to the serve must have two parameters sent as POST.
 *      t = epoch in seconds
 *      h = sha256(hashPassword + t + hashPassword)
 * 
 * Configuration ./config.js
 * Define secure route in ./routes/secure_route.js
 * Request example: ./test/send.sh
 * Generate certifacates: ./certs/make_certs.sh
 */

const config = require('./config');
const secureRoute = require('./routes/secure_route');

/**
 * Requires
 */
const fs = require('fs');
const https = require('https');
const sha256 = require('sha256');
const bodyParser = require("body-parser");
const express = require('express');
const app = express();

/**
 * Begin
 */
var credentials = {
    key: fs.readFileSync(config.privateServerFile),
    cert: fs.readFileSync(config.publicServerFile),
    ca: fs.readFileSync(config.publicCAFile)
};


/**
 * Express routes
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 * Basic Authentication
 */
app.use(function(req, res, next) {
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = new Buffer.from(b64auth, 'base64').toString().split(':')
  
    if (!login || !password || login !== config.basicAuth.user || password !== config.basicAuth.password) {
      res.set('WWW-Authenticate', 'Basic realm="401"')
      res.status(401).send('Authentication required.')
      console.log("Authentication required 1. Basic authentication failure");
      return
    }
    
    next();
});

/**
 * Token check
 */
app.use(function (req, res, next) {
    var t = req.body.t || req.query.t;
    var h = req.body.h || req.query.h;

    if(!t && !h) {

        res.set('WWW-Authenticate', 'Basic realm="401"')
        res.status(401).send('Authentication required.')
        console.log("Authentication required 2. No t or h parameter in request");

    } else {

        var h_calc = sha256(config.hashPassword + t + config.hashPassword);
        var epoch = (new Date).getTime() / 1000;
    
        var delta = epoch - t;
    
        // token and delta in time
        if(h == h_calc && delta < config.deltaExpiration) {
            next();
        } else {
            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).send('Authentication required.')
            console.log("Authentication required 3 (invalid hash). NOK " + h + " , " + h_calc + " , " + delta + "\n");
        }
    
    }

});

/**
 * Secure routes
 */
app.use(secureRoute);

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(config.serverPort, config.serverIP, function() {
    console.log("Server is up!", "Listening in https://" + config.serverIP + ":" + config.serverPort);
});