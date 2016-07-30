'use strict';

const fs = require('fs');
const path = require('path');
const FILES = require('../constants/files');

class Pusher {
  push(req, res, next) {
    const self = this;

    // if HTTP/2 push method exists
    if(res.push) {
      // this doesn't seem to be working consistently yet.
      // there is a bug I commented on here:
      // https://github.com/molnarg/node-http2/issues/107#issuecomment-192953121
      //
      // UPDATE: Submitted a pull request (https://github.com/molnarg/node-http2/pull/210)
      // to fix the issue reproduced with browser cached resources.
      FILES.forEach((file, index) => {
        let push = res.push(file.path);

        push.stream.on('error', error => {
          console.log('Error pushing %s message %s', file.path, error.message);
          push.stream.removeAllListeners();
        });

        push.stream.on('end', () => {
          push.stream.removeAllListeners();
        })

        push.writeHead(200, file.headers);

        fs.createReadStream(path.join(__dirname, `../${file.path}`)).pipe(push);

        if(index === FILES.length - 1) {
          next();
        }
      });
    } else { // else we're probably on HTTP/1.1
      next();
    }
  }
}

module.exports = Pusher;
