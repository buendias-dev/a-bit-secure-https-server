#!/bin/bash
host_name=server_name

# Generate CA
openssl req -x509 -newkey rsa:2048 -keyout ca_key.pem -out ca_pub.pem -days 3650
# Generate clave privada servidor y petición de la pública
openssl req -nodes -newkey rsa:2048 -subj /CN=$host_name -keyout server_key.pem -out server_req.pem
# Firma de clave pública del servidor por CA
openssl x509 -CA ca_pub.pem -CAkey ca_key.pem -req -in server_req.pem -days 3650 -sha1 -CAcreateserial -out server_pub.pem

