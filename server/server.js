/* jshint node:true */
'use strict';
var fs = require('fs');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');

var privateKey = fs.readFileSync('/cert/server.key', 'utf8');
var certificate = fs.readFileSync('/cert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var app = express();

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(18443);

app.use(express.static('public'));
app.use(bodyParser.json({limit: '1gb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '1gb'}));

app.post('/api/video', function(req, res) {
  console.log(req.body);
  res.send('abc');
});
