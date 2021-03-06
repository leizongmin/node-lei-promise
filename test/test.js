'use strict';

/**
 * lei-promise tests
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var assert = require('assert');
var me = require('../');

if (typeof Promise === 'undefined') {
  global.Promise = require('bluebird');
}

describe('promisify', function () {

  it('passed 1 argument and callback 1 argument', function (done) {

    function sleep(ms, callback) {
      console.log('sleep(' + ms + ')');
      setTimeout(function () {
        console.log('sleep(' + ms + ') callback');
        callback(null, ms);
      }, ms);
    }

    var sleep2 = me.promisify(sleep);

    sleep2(100).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1);

      var ms = _ref2[0];

      console.log(ms);
      assert.equal(ms, 100);
      done();
    }).catch(function (err) {
      throw err;
    });
  });

  it('passed 2 argument and callback 2 argument', function (done) {

    function sleep(ms, msg, callback) {
      console.log('sleep(' + ms + ')');
      setTimeout(function () {
        console.log('sleep(' + ms + ') callback');
        callback(null, msg, ms);
      }, ms);
    }

    var sleep2 = me.promisify(sleep);

    sleep2(100, 'ok').then(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2);

      var msg = _ref4[0];
      var ms = _ref4[1];

      console.log(msg, ms);
      assert.equal(msg, 'ok');
      assert.equal(ms, 100);
      done();
    }).catch(function (err) {
      throw err;
    });
  });

  it('callback error', function (done) {

    function sleep(ms, callback) {
      console.log('sleep(' + ms + ')');
      setTimeout(function () {
        console.log('sleep(' + ms + ') callback');
        var err = new Error('just test');
        err.code = 'just_test';
        callback(err);
      }, ms);
    }

    var sleep2 = me.promisify(sleep);

    sleep2(100).then(function (_) {
      throw new Error('should catch error');
    }).catch(function (err) {
      assert.equal(err.code, 'just_test');
      done();
    });
  });

  it('returnFirstArgument=true', function (done) {

    function sleep(ms, callback) {
      console.log('sleep(' + ms + ')');
      setTimeout(function () {
        console.log('sleep(' + ms + ') callback');
        callback(null, ms);
      }, ms);
    }

    var sleep2 = me.promisify(sleep, false, true);

    sleep2(100).then(function (ms) {
      console.log(ms);
      assert.equal(ms, 100);
      done();
    }).catch(function (err) {
      throw err;
    });
  });

  it('argc=2', function (done) {

    function sleep(ms, callback, a, b, c) {
      console.log('sleep(' + ms + ')');
      setTimeout(function () {
        console.log('sleep(' + ms + ') callback');
        callback(null, ms);
      }, ms);
    }

    var sleep2 = me.promisify(sleep, 2);

    sleep2(100).then(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 1);

      var ms = _ref6[0];

      console.log(ms);
      assert.equal(ms, 100);
      done();
    }).catch(function (err) {
      throw err;
    });
  });

  it('after promisify still callback', function (done) {

    function sleep(ms, callback) {
      console.log('sleep(' + ms + ')');
      setTimeout(function () {
        console.log('sleep(' + ms + ') callback');
        callback(null, ms);
      }, ms);
    }

    var sleep2 = me.promisify(sleep);

    sleep2(100, function (err, ms) {
      console.log(err, ms);
      assert.equal(err, null);
      assert.equal(ms, 100);
      done();
    });
  });
});

describe('callbackify', function () {

  it('passed 1 argument', function (done) {

    function sleep(ms) {
      console.log('sleep(' + ms + ')');
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.log('sleep(' + ms + ') resolve');
          resolve(ms);
        }, ms);
      });
    }

    var sleep2 = me.callbackify(sleep);

    sleep2(100, function (err, ms) {
      console.log(err, ms);
      assert.equal(err, null);
      assert.equal(ms, 100);
      done();
    });
  });

  it('passed 2 argument', function (done) {

    function sleep(ms, msg) {
      console.log('sleep(' + ms + ')');
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.log('sleep(' + ms + ') resolve');
          resolve([ms, msg]);
        }, ms);
      });
    }

    var sleep2 = me.callbackify(sleep);

    sleep2(100, 'ok', function (err, _ref7) {
      var _ref8 = _slicedToArray(_ref7, 2);

      var ms = _ref8[0];
      var msg = _ref8[1];

      console.log(err, ms, msg);
      assert.equal(err, null);
      assert.equal(ms, 100);
      assert.equal(msg, 'ok');
      done();
    });
  });

  it('reject', function (done) {

    function sleep(ms) {
      console.log('sleep(' + ms + ')');
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.log('sleep(' + ms + ') resolve');
          var err = new Error('just test');
          err.code = 'just_test';
          reject(err);
        }, ms);
      });
    }

    var sleep2 = me.callbackify(sleep);

    sleep2(100, function (err) {
      console.log(err);
      assert.ok(err instanceof Error);
      assert.equal(err.code, 'just_test');
      done();
    });
  });

  it('argc=1', function (done) {

    function sleep(ms, a, b, c) {
      console.log('sleep(' + ms + ')');
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.log('sleep(' + ms + ') resolve');
          resolve(ms);
        }, ms);
      });
    }

    var sleep2 = me.callbackify(sleep, 1);

    sleep2(100, function (err, ms) {
      console.log(err, ms);
      assert.equal(err, null);
      assert.equal(ms, 100);
      done();
    });
  });

  it('after callbackify still callback', function (done) {

    function sleep(ms) {
      console.log('sleep(' + ms + ')');
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.log('sleep(' + ms + ') resolve');
          resolve(ms);
        }, ms);
      });
    }

    var sleep2 = me.callbackify(sleep);

    sleep2(100).then(function (ms) {
      console.log(ms);
      assert.equal(ms, 100);
      done();
    }).catch(function (err) {
      throw err;
    });
  });
});

describe('promisifyRequire', function () {

  var fs = me.promisifyRequire('fs');

  it('fs.readdir promise', function (done) {

    fs.readdir(__dirname).then(function (_ref9) {
      var _ref10 = _slicedToArray(_ref9, 1);

      var list = _ref10[0];

      console.log(list);
      assert.ok(Array.isArray(list));
      assert.ok(list.length > 0);
      done();
    }).catch(function (err) {
      throw err;
    });
  });

  it('fs.readdir callback', function (done) {

    fs.readdir(__dirname, function (err, list) {
      console.log(err, list);
      assert.equal(err, null);
      assert.ok(Array.isArray(list));
      assert.ok(list.length > 0);
      done();
    });
  });

  it('fs.readdirSync', function () {

    var list = fs.readdirSync(__dirname);
    console.log(list);
    assert.ok(Array.isArray(list));
    assert.ok(list.length > 0);
  });
});

describe('promisifyRequire(returnFirstArgument=true)', function () {

  var fs = me.promisifyRequire('fs', true);

  it('fs.readdir promise', function (done) {

    fs.readdir(__dirname).then(function (list) {
      console.log(list);
      assert.ok(Array.isArray(list));
      assert.ok(list.length > 0);
      done();
    }).catch(function (err) {
      throw err;
    });
  });

  it('fs.readdir callback', function (done) {

    fs.readdir(__dirname, function (err, list) {
      console.log(err, list);
      assert.equal(err, null);
      assert.ok(Array.isArray(list));
      assert.ok(list.length > 0);
      done();
    });
  });

  it('fs.readdirSync', function () {

    var list = fs.readdirSync(__dirname);
    console.log(list);
    assert.ok(Array.isArray(list));
    assert.ok(list.length > 0);
  });
});