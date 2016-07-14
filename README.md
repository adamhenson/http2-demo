# HTTP/2 Demo
> A simple Node.js HTTP/2 demo using the [http2 package](https://github.com/molnarg/node-http2).

## Prepare
1. If you don't have Node.js and NPM - [install them](https://docs.npmjs.com/getting-started/installing-node).
2. For pretty printing logs, you will need a global install of bunyan (`$ npm install -g bunyan`).
3. `$ cd` into this project directory and then `$ npm install`, to install the dependencies.

## Start the Server
Start the server with informational logging:
```
$ HTTP2_LOG=info node server.js
```
Or without logging:
```
$ node server.js
```

## See It
Assuming your environment port is 8080, you can navigate to [https://localhost:8080](https://localhost:8080) to view this HTTP/2 website.