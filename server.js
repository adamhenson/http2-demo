var appInfo = require('./package');
var fs = require('fs');
var http = require('./lib/http');
var http2 = require('http2');
var path = require('path');

// Request callback
function onRequest(request, response) {

  var view = path.join(__dirname, '/index.html');

  if (response.push) {
    var push = response.push('/images/nyc.jpg');
    push.writeHead(200);
    fs.createReadStream(path.join(__dirname, '/images/nyc.jpg')).pipe(push);
  }

  response.writeHead(200);
  var fileStream = fs.createReadStream(view);
  fileStream.pipe(response);
  fileStream.on('finish',response.end);

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