"use strict";

module.exports = {
    publicCAFile : 'certs/ca_pub.pem',
    privateServerFile : 'certs/server_key.pem',
    publicServerFile : 'certs/server_pub.pem',
    hashPassword : '1234', // h_calc will be sha256(hashPassword + t + hashPassword)
    deltaExpiration : 30, // if t - current_time > 30 the hash is expired. All units in seconds
    serverIP : '127.0.0.1',
    serverPort : 8443,
    basicAuth : {
        user : 'aladdin',
        password : 'opensesame'
    }
};