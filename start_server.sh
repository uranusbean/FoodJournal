#!/bin/bash

cd server && npm install && cd ..
cd public && bower install && cd ..
node server/server.js
