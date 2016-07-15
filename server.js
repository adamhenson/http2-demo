'use strict';

const APP_INFO = require('./package');
const fs = require('fs');
const FILES = require('./constants/files');
const getHTML = require('./templates/MainTemplate');
const http2 = require('http2');
const log = require('./lib/util').createLogger('server');
const path = require('path');
const url = require('url');
const Pusher = require('./middleware/Pusher');
const staticFile = require('node-static');

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
const fileServer = new staticFile.Server();

function app(req, res) {
  router(req, res, finalhandler(req, res));
}

let pusher = new Pusher();

router.get('/', pusher.push, (req, res) => {
  let title = (res.push)
    ? 'Hello HTTP/1.1'
    : 'Hello HTTP/2';

  let html = getHTML({
    'title' : title
  });

  res.end(html);
});

// A temporary substitute for express.static, until Express
// is more supportive of http2 server push. This was pretty
// much copied from the documentation. Not doing much for
// error handling - just a basic example
router.get('/public/:sub/:file', (req, res) => {
  req.addListener('end', () => {
    fileServer.serve(req, res, (err, result) => {
      if(err) {
        console.error(`Error serving ${req.url} - ${err.message}`);
        res.writeHead(err.status, err.headers);
        res.end();
      }
    });
  }).resume();
});

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