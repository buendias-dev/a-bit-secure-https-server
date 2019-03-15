# A bit secure https server
A nodejs express server with basic authentication over TLS and token with expiration time

Any valid request to server must be authenticated by the use of Basic Authentication and sending a token (h) and a timestamp parameter (t) over TLS
```
curl --cacert ./ca_pub.pem -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic $auth" -d "t=$t&h=$h" https://127.0.0.1:8443
```
1. **How to install**
```
$ git clone https://github.com/buendias-dev/a-bit-secure-https-server
$ npm install
```
2. **How to test**
```
$ node a-bit-secure-https-server.js
$ cd test
$ ./test.sh
```
3. **How to configure**

Modify a-bit-secure-https-server.js
```
const config = {
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
}
```
4. **How to build certificates**
```
$ cd certs
$ ./make_certs.sh
```
