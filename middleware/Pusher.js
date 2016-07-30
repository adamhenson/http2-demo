'use strict';

const fs = require('fs');
const path = require('path');

class Pusher {
  constructor(options) {
    if(!!options && options.config) {
      this.config = options.config;
    }

    this.push = this.push.bind(this);
  }

  push(req, res, next) {
    if(res && res.push && req && req.url && this.config) {
      this.pushFiles(req, res, next);
    } else {
      next();
    }
  }

  static getFiles(path, config) {
    if(!config.groups || !Array.isArray(config.groups)) {
      return [];
    }
    
    return config.groups.filter((group) => {
      return path === group.path;
    });
  }

  pushFiles(req, res, next) {
    // there is a bug I commented on here:
    // https://github.com/molnarg/node-http2/issues/107#issuecomment-192953121
    //
    // UPDATE: Submitted a pull request (https://github.com/molnarg/node-http2/pull/210)
    // to fix the issue reproduced with browser cached resources.
    let self = this;

    let group = Pusher.getFiles(req.url, self.config);

    if(!group.length || !group[0].files) {
      next();
    } else {
      let files = group[0].files;

      files.forEach((file, index) => {
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

        if(index === files.length - 1) {
          next();
        }
      });
    }
  }
}

module.exports = Pusher;
