"use strict";

const config = require('../config');
const querystring = require("querystring");
const sha256 = require('sha256');
const request = require('request');
const fs = require('fs');

function t() {
    return (new Date).getTime() / 1000;
}

function h(t) {
    return sha256(config.hashPassword + t + config.hashPassword)
}

var t = t();
var h = h(t);

var body = querystring.stringify({
    't' : t,
    'h' : h
});

var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(body),
    "Authorization" : "Basic " + Buffer.from(config.basicAuth.user + ":" + config.basicAuth.password).toString("base64")
};

// Request
request({
        method : "POST",
        uri : "https://" + config.serverName + ":" + config.serverPort,
        headers : headers,
        body : body,
        agentOptions : {
            ca: fs.readFileSync(config.publicCAFile)
        }
    },
    function(err, res, body) {
        if(err) {
            console.log("TEST ERROR", err);
        } else {
            //console.log("res", res);
            console.log(body);
        }
    }
);

