var fs = require('fs');
var path = require('path');
var http2 = require('http2');

// The callback to handle requests
function onRequest(request, response) {
  var filename = path.join(__dirname, request.url);
  
  if ((filename.indexOf(__dirname) === 0) && fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    // push and image to the response
    if (response.push) {
      var push = response.push('/images/nyc.jpg');
      push.writeHead(200, {'content-type': 'image/jpeg'});
      fs.createReadStream(path.join(__dirname, '/images/nyc.jpg')).pipe(push);
    }
    response.writeHead(200);
    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(response);
    fileStream.on('finish',response.end);
  }

  // Otherwise responding with 404.
  else {
    response.writeHead(404);
    response.end();
  }
}

// Creating a bunyan logger (optional)
var log = require('../test/util').createLogger('server');

// Creating the server in plain or TLS mode (TLS mode is the default)
var server;
if (process.env.HTTP2_PLAIN) {
  server = http2.raw.createServer({
    log: log
  }, onRequest);
} else {
  server = http2.createServer({
    log: log,
    key: fs.readFileSync(path.join(__dirname, '/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '/localhost.crt'))
  }, onRequest);
}
server.listen(process.env.HTTP2_PORT || 8080);
