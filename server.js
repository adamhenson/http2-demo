'use strict';

var appInfo = require('./package');
var fs = require('fs');
var http = require('./lib/http');
var http2 = require('http2');
var path = require('path');

// File queue
const FILES = [
  '/public/html/index.html',
  '/public/css/main.css',
  '/public/js/jquery.min.js',
  '/public/images/nyc.jpg'
];

// Create read stream and add to response
function createReadStreamResponse(file, response) {
  let push = response.push(file);
  push.writeHead(200);
  fs.createReadStream(path.join(__dirname, file)).pipe(push);
}

// Request callback
function onRequest(request, response) {
  let view = path.join(__dirname, FILES[0]);

  if (response.push) {
    FILES.forEach((file) => {
      createReadStreamResponse(file, response);
    });
  }

  response.writeHead(200);
  let fileStream = fs.createReadStream(view);
  fileStream.pipe(response);
  fileStream.on('finish', response.end);
}

// Logger
var log = require('./lib/util').createLogger('server');

// Server
var server = http2.createServer({
  log: log,
  key: fs.readFileSync(path.join(__dirname, '/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '/localhost.crt'))
}, onRequest);

var port = process.env.PORT || 8080;

server.listen((port), () => {
  console.log('%s listening at port %s', appInfo.name, port);
});