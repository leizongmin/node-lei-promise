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

    var sleep2 = me.promisify(sleep);

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

    var sleep2 = me.promisify(sleep);

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
        var err = new Error('just test');
        err.code = 'just_test';
        callback(err);
      }, ms);
    }

    var sleep2 = me.promisify(sleep);

    sleep2(100).then(_ => {
      throw new Error('should catch error');
    }).catch(err => {
      assert.equal(err.code, 'just_test');
      done();
    });

  });

});
