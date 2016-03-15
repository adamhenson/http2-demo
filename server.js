'use strict';

var appInfo = require('./package');
var fs = require('fs');
var http2 = require('http2');
var path = require('path');

// File push queue
const FILES = [
  {
    'headers' : {
      'content-type' : 'text/css'
    },
    'path' : '/public/css/main.css'
  },
  {
    'headers' : {
      'content-type' : 'image/jpeg'
    },
    'path' : '/public/images/nyc.jpg'
  },
  {
    'headers' : {
      'content-type' : 'image/x-icon'
    },
    'path' : '/public/images/favicon.ico'
  }
];

// Request callback
function onRequest(request, response) {
  let HTML = require('./templates/MainTemplate').HTML;
  if(response.push) {
    FILES.forEach((file, index) => {
      let push = response.push(file.path);
      push.writeHead(200, file.headers);
      fs.createReadStream(path.join(__dirname, file.path)).pipe(push);
      if(index === FILES.length - 1) {
        response.end(HTML);
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