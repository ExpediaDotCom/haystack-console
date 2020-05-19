# haystack-console [beta]

[![Build Status](https://travis-ci.org/ExpediaDotCom/haystack-console.svg?branch=master)](https://travis-ci.org/ExpediaDotCom/haystack-console)
[![License](https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg)](https://github.com/ExpediaDotCom/haystack/blob/master/LICENSE)

### Pre-requisites

Ensure you have `node >= 12.13.1` and `npm >= 6.12.1` installed.

### Build and Run

To run in developer mode with client and server side hotloading, use:

```
$ npm install                # install dependencies
$ npm run start:dev          # start server in dev mode with hotloading

NOTE: In Development Mode, app consumes client config via .env.devlopment.
```

Once start is successful you can visit [http://localhost:3000/](http://localhost:3000/)

For running in production mode, use:

```
$ npm install                # install dependencies
$ npm run build              # run tests(with coverage), build client side code and emit produciton optimized bundles
$ npm start                  # start node server
```
