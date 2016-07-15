'use strict';

const fs = require('fs');
const path = require('path');
const FILES = require('../constants/files');

class Pusher {
  push(req, res, next) {
    const self = this;

    // if HTTP/2 push method exists
    if(res.push) {
      FILES.forEach((file, index) => {
        let push = res.push(file.path);
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
