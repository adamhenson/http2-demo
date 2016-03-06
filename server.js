'use strict';

var appInfo = require('./package');
var fs = require('fs');
var http2 = require('http2');
var path = require('path');
var Template = require('./templates/MainTemplate');

// File queue
const FILES = [
  '/public/css/main.css',
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
  if (response.push) {
    FILES.forEach((file, index) => {
      createReadStreamResponse(file, response);
      if(index === FILES.length - 1) {
        response.end(Template.output({
          'css' : FILES[0],
          'image' : FILES[1]
        }));
      }
    });
  }
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