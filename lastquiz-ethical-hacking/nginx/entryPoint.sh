#!/bin/bash
set -xe
: "${SERVER_ADDRESS?Need an api url}"

sed -i "s/SERVER_ADDRESS/$SERVER_ADDRESS/g" /etc/nginx/nginx.conf
sed -i "s/SERVER_ADDRESS/$SERVER_ADDRESS/g" /usr/share/nginx/html/index.html
sed -i "s/SERVER_PORT/$SERVER_PORT/g" /usr/share/nginx/html/index.html

exec "$@"