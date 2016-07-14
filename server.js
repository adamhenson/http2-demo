'use strict';

const APP_INFO = require('./package');
const fs = require('fs');
const getHTML = require('./templates/MainTemplate');
const http2 = require('http2');
const log = require('./lib/util').createLogger('server');
const path = require('path');
const url = require('url');

// Cannot use Express until it supports http2 server push,
// therefore simply using the routing Express uses until
// it's supported.
//
// https://github.com/expressjs/express/issues/2761#issuecomment-142612001
// 
// Wondering if there's any light in this comment:
// https://github.com/expressjs/express/issues/2761#issuecomment-221675351
const finalhandler = require('finalhandler');
const Router = require('router');
const router = new Router();

function app(req, res) {
  router(req, res, finalhandler(req, res));
}

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

router.get('/', function (req, res) {
  if(res.push) {
    FILES.forEach((file, index) => {
      let push = res.push(file.path);
      push.writeHead(200, file.headers);

      fs.createReadStream(path.join(__dirname, file.path)).pipe(push);

      if(index === FILES.length - 1) {
        let html = getHTML({
          'title' : 'Hello HTTP/2'
        });
        res.end(html);
      }
    });
  } else {
    createStaticFileServer(req, res);
  }
})

// Server
let server = http2.createServer({
  log: log,
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.crt')
}, app);

let port = process.env.PORT || 8080;

server.listen((port), () => {
  console.log('%s listening at port %s', APP_INFO.name, port);
});