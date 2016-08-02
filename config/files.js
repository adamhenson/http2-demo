'use strict';

const EXPIRE_MINUTES = 5;

let today = new Date();
let now = today.toUTCString();
let etag = new Date().getTime().toString();
let cacheExpire = today;
let maxAge = EXPIRE_MINUTES * 60;
cacheExpire.setMinutes(today.getMinutes() + EXPIRE_MINUTES);
cacheExpire = cacheExpire.toUTCString();

let config = {
  'groups' : [
    {
      'path' : '/foo/*',
      'files' : [
        {
          'headers' : {
            'etag' : `${etag}4`,
            'content-type' : 'image/x-icon',
            'cache-control' : `max-age=${maxAge}`,
            'date' : now,
            'expires' : cacheExpire,
            'last-modified' : today
          },
          'path' : '/public/images/favicon.ico'
        },
        {
          'headers' : {
            'etag' : `${etag}1`,
            'content-type' : 'text/css',
            'cache-control' : `max-age=${maxAge}`,
            'date' : now,
            'expires' : cacheExpire,
            'last-modified' : today
          },
          'path' : '/public/css/main.css'
        },
        {
          'headers' : {
            'etag' : `${etag}2`,
            'content-type' : 'application/javascript',
            'cache-control' : `max-age=${maxAge}`,
            'date' : now,
            'expires' : cacheExpire,
            'last-modified' : today
          },
          'path' : '/public/js/main.js'
        },
        {
          'headers' : {
            'etag' : `${etag}3`,
            'content-type' : 'image/jpeg',
            'cache-control' : `max-age=${maxAge}`,
            'date' : now,
            'expires' : cacheExpire,
            'last-modified' : today
          },
          'path' : '/public/images/nyc.jpg'
        }
      ]
    }
  ]
};

module.exports = config;
