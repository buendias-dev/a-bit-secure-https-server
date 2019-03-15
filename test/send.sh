#!/bin/bash

# Server
server_name=server_name
server_port=8443
# Basi authentication
user=aladdin
pass=opensesame
# Password to build hash
hashPassword=1234


auth=`echo -n $user:$pass | base64`
t=`date +%s`
h=`echo -n $hashPassword$t$hashPassword | sha256sum | awk '{ print $1 }'`

curl --cacert ./../certs/ca_pub.pem -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic $auth" -d "t=$t&h=$h" https://$server_name:$server_port
echo


