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

let pusher = new Pusher();

router.get('/', pusher.push, function (req, res) {
  let html = getHTML({
    'title' : 'Hello HTTP/2'
  });
  res.end(html);
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