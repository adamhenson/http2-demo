'use strict';

const fs = require('fs');
const path = require('path');
const StaticFileClient = require('../middleware/StaticFileClient');
const FILES = require('../constants/files');

class Pusher {
  push(req, res, next) {
    const self = this;

    if(res.push) {
      FILES.forEach((file, index) => {
        let push = res.push(file.path);
        push.writeHead(200, file.headers);

        fs.createReadStream(path.join(__dirname, `../${file.path}`)).pipe(push);

        if(index === FILES.length - 1) {
          next();
        }
      });
    } else {
      let staticFileClient = new StaticFileClient(req, res, FILES, next);
      staticFileClient.createReadStream();
    }
  }
}

module.exports = Pusher;
