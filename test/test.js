'use strict';

/**
 * lei-promise tests
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const assert = require('assert');
const me = require('../');

describe('promisify', function () {

  it('passed 1 argument and callback 1 argument', function (done) {

    function sleep(ms, callback) {
      console.log(`sleep(${ms})`);
      setTimeout(function () {
        console.log(`sleep(${ms}) callback`);
        callback(null, ms);
      }, ms);
    }

    let sleep2 = me.promisify(sleep);

    sleep2(100).then(([ms]) => {
      console.log(ms);
      assert.equal(ms, 100);
      done();
    }).catch(err => {
      throw err;
    });

  });

  it('passed 2 argument and callback 2 argument', function (done) {

    function sleep(ms, msg, callback) {
      console.log(`sleep(${ms})`);
      setTimeout(function () {
        console.log(`sleep(${ms}) callback`);
        callback(null, msg, ms);
      }, ms);
    }

    let sleep2 = me.promisify(sleep);

    sleep2(100, 'ok').then(([msg, ms]) => {
      console.log(msg, ms);
      assert.equal(msg, 'ok');
      assert.equal(ms, 100);
      done();
    }).catch(err => {
      throw err;
    });

  });

  it('callback error', function (done) {

    function sleep(ms, callback) {
      console.log(`sleep(${ms})`);
      setTimeout(function () {
        console.log(`sleep(${ms}) callback`);
        let err = new Error('just test');
        err.code = 'just_test';
        callback(err);
      }, ms);
    }

    let sleep2 = me.promisify(sleep);

    sleep2(100).then(_ => {
      throw new Error('should catch error');
    }).catch(err => {
      assert.equal(err.code, 'just_test');
      done();
    });

  });

  it('returnFirstArgument=true', function (done) {

    function sleep(ms, callback) {
      console.log(`sleep(${ms})`);
      setTimeout(function () {
        console.log(`sleep(${ms}) callback`);
        callback(null, ms);
      }, ms);
    }

    let sleep2 = me.promisify(sleep, false, true);

    sleep2(100).then(ms => {
      console.log(ms);
      assert.equal(ms, 100);
      done();
    }).catch(err => {
      throw err;
    });

  });

  it('argc=2', function (done) {

    function sleep(ms, callback, a, b, c) {
      console.log(`sleep(${ms})`);
      setTimeout(function () {
        console.log(`sleep(${ms}) callback`);
        callback(null, ms);
      }, ms);
    }

    let sleep2 = me.promisify(sleep, 2);

    sleep2(100).then(([ms]) => {
      console.log(ms);
      assert.equal(ms, 100);
      done();
    }).catch(err => {
      throw err;
    });

  });

  it('after promisify still callback', function (done) {

    function sleep(ms, callback) {
      console.log(`sleep(${ms})`);
      setTimeout(function () {
        console.log(`sleep(${ms}) callback`);
        callback(null, ms);
      }, ms);
    }

    let sleep2 = me.promisify(sleep);

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
      console.log(`sleep(${ms})`);
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.log(`sleep(${ms}) resolve`);
          resolve(ms);
        }, ms);
      });
    }

    let sleep2 = me.callbackify(sleep);

    sleep2(100, function (err, ms) {
      console.log(err, ms);
      assert.equal(err, null);
      assert.equal(ms, 100);
      done();
    });

  });

  it('passed 2 argument', function (done) {

    function sleep(ms, msg) {
      console.log(`sleep(${ms})`);
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.log(`sleep(${ms}) resolve`);
          resolve([ms, msg]);
        }, ms);
      });
    }

    let sleep2 = me.callbackify(sleep);

    sleep2(100, 'ok', function (err, [ms, msg]) {
      console.log(err, ms, msg);
      assert.equal(err, null);
      assert.equal(ms, 100);
      assert.equal(msg, 'ok');
      done();
    });

  });

  it('reject', function (done) {

    function sleep(ms) {
      console.log(`sleep(${ms})`);
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.log(`sleep(${ms}) resolve`);
          var err = new Error('just test');
          err.code = 'just_test';
          reject(err);
        }, ms);
      });
    }

    let sleep2 = me.callbackify(sleep);

    sleep2(100, function (err) {
      console.log(err);
      assert.ok(err instanceof Error);
      assert.equal(err.code, 'just_test');
      done();
    });

  });

  it('argc=1', function (done) {

    function sleep(ms, a, b, c) {
      console.log(`sleep(${ms})`);
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.log(`sleep(${ms}) resolve`);
          resolve(ms);
        }, ms);
      });
    }

    let sleep2 = me.callbackify(sleep, 1);

    sleep2(100, function (err, ms) {
      console.log(err, ms);
      assert.equal(err, null);
      assert.equal(ms, 100);
      done();
    });

  });

  it('after callbackify still callback', function (done) {

    function sleep(ms) {
      console.log(`sleep(${ms})`);
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.log(`sleep(${ms}) resolve`);
          resolve(ms);
        }, ms);
      });
    }

    let sleep2 = me.callbackify(sleep);

    sleep2(100).then(ms => {
      console.log(ms);
      assert.equal(ms, 100);
      done();
    }).catch(err => {
      throw err;
    });

  });

});


describe('promisifyRequire', function () {

  const fs = me.promisifyRequire('fs');
  const path = me.promisifyRequire('path');

  it('fs.readdir promise', function (done) {

    fs.readdir(__dirname).then(([list]) => {
      console.log(list);
      assert.ok(Array.isArray(list));
      assert.ok(list.length > 0);
      done();
    }).catch(err => {
      throw err;
    });

  });

  it('fs.readdir callback', function (done) {

    fs.readdir(__dirname, (err, list) => {
      console.log(err, list);
      assert.equal(err, null);
      assert.ok(Array.isArray(list));
      assert.ok(list.length > 0);
      done();
    });

  });

  it('fs.readdirSync', function () {

    let list = fs.readdirSync(__dirname);
    console.log(list);
    assert.ok(Array.isArray(list));
    assert.ok(list.length > 0);

  });

});
