'use strict';

var appInfo = require('./package');
var fs = require('fs');
var http2 = require('http2');
var path = require('path');
var Template = require('./templates/MainTemplate');

var today = new Date();
var now = today.toUTCString();
var cacheExpire = today;
cacheExpire.setMinutes(today.getMinutes() + 5);
cacheExpire = cacheExpire.toUTCString();

// File push queue
const FILES = [
  {
    'headers' : {
      'etag' : new Date().getTime().toString() + '1',
      'content-type' : 'text/css',
      'cache-control' : 'no-transform',
      'date' : now,
      'expires' : cacheExpire,
      'last-modified' : 'Sat, 01 Aug 2015 00:45:10 GMT'
    },
    'path' : '/public/css/main.css'
  },
  {
    'headers' : {
      'etag' : new Date().getTime().toString() + '2',
      'content-type' : 'image/jpeg',
      'cache-control' : 'no-transform',
      'date' : now,
      'expires' : cacheExpire,
      'last-modified' : 'Sat, 01 Aug 2015 00:45:09 GMT'
    },
    'path' : '/public/images/nyc.jpg'
  }
];

// Request callback
function onRequest(request, response) {
  if(response.push) {
    FILES.forEach((file, index) => {
      let push = response.push(file.path);
      push.writeHead(200, file.headers);
      fs.createReadStream(path.join(__dirname, file.path)).pipe(push);
      if(index === FILES.length - 1) response.end(Template.output(FILES));
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