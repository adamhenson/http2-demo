'use strict';

const APP_INFO = require('./package');
const fs = require('fs');
const getHTML = require('./templates/MainTemplate');
const http2 = require('http2');
const log = require('./lib/util').createLogger('server');
const path = require('path');
const url = require('url');

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

// Error response for http/1.1 fallback
function errorResponse(response, error) {
  response.writeHead(500, { 'content-type' : 'text/plain' });
  response.write(`Error: ${error}`);
  response.end();
}

// Failure response for http/1.1 fallback
function failResponse(response) {
  response.writeHead(404, { 'content-type' : 'text/plain' });
  response.write('404 Not Found');
  response.end();
}

// Fallback static file server for http/1.1 fallback
function createStaticFileServer(request, response) {
  let uri = url.parse(request.url).pathname
  let filename = path.join(process.cwd(), uri);

  // if there is a matched file, this will return an array
  // with one result.
  let matchedFileObjectArray = FILES.filter((fileObject) => {
    return fileObject.path === uri;
  });

  if(uri === '/') {
    let html = getHTML({
      'title' : 'Hello HTTP/1.1'
    });

    response.end(html);
  } else if(!matchedFileObjectArray.length) {
    failResponse(response);
  } else {
    let fileConfig = matchedFileObjectArray[0];

    fs.exists(filename, (exists) => {
      if(!exists) {
        failResponse(response);
        return;
      }

      fs.readFile(filename, (err, file) => {
        if(err) {        
          errorResponse(response, err);
          return;
        }

        response.writeHead(200, fileConfig.headers);
        response.write(file);
        response.end();
      });
    });
  }
}

// Request callback for http/2
function onRequest(request, response) {
  if(response.push) {
    FILES.forEach((file, index) => {
      let push = response.push(file.path);
      push.writeHead(200, file.headers);

      fs.createReadStream(path.join(__dirname, file.path)).pipe(push);

      if(index === FILES.length - 1) {
        let html = getHTML({
          'title' : 'Hello HTTP/2'
        });
        response.end(html);
      }
    });
  } else {
    createStaticFileServer(request, response);
  }
}

// Server
let server = http2.createServer({
  log: log,
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.crt')
}, onRequest);

let port = process.env.PORT || 8080;

server.listen((port), () => {
  console.log('%s listening at port %s', APP_INFO.name, port);
});