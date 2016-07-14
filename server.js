'use strict';

const APP_INFO = require('./package');
const fs = require('fs');
const http2 = require('http2');
const path = require('path');

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
      'content-type' : 'application/javascript'
    },
    'path' : '/public/js/main.js'
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
  let html = require('./templates/MainTemplate').HTML;
  
  if(response.push) {
    FILES.forEach((file, index) => {
      let push = response.push(file.path);
      push.writeHead(200, file.headers);
      fs.createReadStream(path.join(__dirname, file.path)).pipe(push);
      if(index === FILES.length - 1) {
        response.end(html);
      }
    });
  }
}

// Logger
let log = require('./lib/util').createLogger('server');

// Server
let server = http2.createServer({
  log: log,
  key: fs.readFileSync(path.join(__dirname, '/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '/localhost.crt'))
}, onRequest);

let port = process.env.PORT || 8080;

server.listen((port), () => {
  console.log('%s listening at port %s', APP_INFO.name, port);
});