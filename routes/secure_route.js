/**
 * This route is called after validation of Basic Authentication and token
 */
"use strict";

var express = require('express');
var router = express.Router();

module.exports = router.use(function(req, res) {
    res.send("Sesame opened!");
    console.log("Valid connection");
});