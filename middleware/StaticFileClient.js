'use strict';

const fs = require('fs');
const path = require('path');

class StaticFileClient {
  constructor(req, res, next, files) {
    this.req = req;
    this.res = res;
    this.files = files;
    this.next = next;
  }

  // Error response for http/1.1 fallback
  errorResponse() {
    response.writeHead(500, { 'content-type' : 'text/plain' });
    response.write(`Error: ${error}`);
    response.end();
  }

  // Failure response for http/1.1 fallback
  failResponse() {
    response.writeHead(404, { 'content-type' : 'text/plain' });
    response.write('404 Not Found');
    response.end();
  }

  createReadStream() {
    const self = this;

    let uri = url.parse(self.req.url).pathname
    let filename = path.join(__dirname, `../${uri}`);

    // if there is a matched file, this will return an array
    // with one result.
    let matchedFileObjectArray = self.files.filter((fileObject) => {
      return fileObject.path === uri;
    });

    if(uri === '/') {
      self.next();
    } else if(!matchedFileObjectArray.length) {
      StaticFileClient.failResponse(self.res);
    } else {
      let fileConfig = matchedFileObjectArray[0];

      fs.exists(filename, (exists) => {
        if(!exists) {
          StaticFileClient.failResponse();
          return;
        }

        fs.readFile(filename, (err, file) => {
          if(err) {        
            StaticFileClient.errorResponse();
            return;
          }

          self.res.writeHead(200, fileConfig.headers);
          self.res.write(file);
          self.res.end();
        });
      });
    }
  }
}

module.exports = StaticFileClient;