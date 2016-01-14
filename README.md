[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/lei-promise.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lei-promise
[travis-image]: https://img.shields.io/travis/leizongmin/node-lei-promise.svg?style=flat-square
[travis-url]: https://travis-ci.org/leizongmin/node-lei-promise
[coveralls-image]: https://img.shields.io/coveralls/leizongmin/node-lei-promise.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/leizongmin/node-lei-promise?branch=master
[gittip-image]: https://img.shields.io/gittip/leizongmin.svg?style=flat-square
[gittip-url]: https://www.gittip.com/leizongmin/
[david-image]: https://img.shields.io/david/leizongmin/node-lei-promise.svg?style=flat-square
[david-url]: https://david-dm.org/leizongmin/node-lei-promise
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/lei-promise.svg?style=flat-square
[download-url]: https://npmjs.org/package/lei-promise

# lei-promise
callback promisify &amp; promise callbackify

## Installation

```bash
$ npm install lei-promise --save
```

## Usage

```javascript
const leiPromise = require('lei-promise');
```

### promisify

```javascript
function sleep(ms, callback) {
  setTimeout(() => callback(null, ms, Date.now()), ms);
}

const sleepP = leiPromise.promisify(sleep);

sleepP(100).then(([ms, timestamp]) => {
  console.log(`ms=${ms}, timestamp=${timestamp}`);
}).catch((err) => {
  console.error(err);
});
```

If the `callback` function only return 1 argument, you can passed `returnFirstArgument=true` to `promisify()`:

```javascript
function sleep(ms, callback) {
  setTimeout(() => callback(null, ms), ms);
}

const sleepP = leiPromise.promisify(sleep, null, true);

sleepP(100).then(ms => {
  console.log(`ms=${ms}`);
}).catch((err) => {
  console.error(err);
});
```

### callbackify

```javascript
function sleepP(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(ms, Date.now()));
  });
}

const sleep = leiPromise.callbackify(sleepP);

sleep(100, (err, ms, timestamp) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`ms=${ms}, timestamp=${timestamp}`);
  }
});
```

### promisifyRequire

```javascript
const fs = leiPromise.promisifyRequire('fs');

fs.readdir(__dirname).then(([list]) => {
  console.log(list);
}).catch((err) => {
  console.error(err);
});
```

If all the `callback` function only return 1 argument, you can passed `returnFirstArgument=true` to `promisifyRequire()`:

```javascript
const fs = leiPromise.promisifyRequire('fs', true);

fs.readdir(__dirname).then(list => {
  console.log(list);
}).catch((err) => {
  console.error(err);
});
```


## License

```
The MIT License (MIT)

Copyright (c) 2015 Zongmin Lei <leizongmin@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
