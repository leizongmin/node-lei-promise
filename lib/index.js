/**
 * lei-promise
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

/**
 * Promisify
 *
 * @param {Function} fn
 * @param {Number} argc
 * @param {Boolean} returnFirstArgument
 * @return {Function}
 */
exports.promisify = function (fn, argc, returnFirstArgument) {
  if (typeof argc === 'undefined' || argc === null || argc === false || argc < 0) {
    argc = fn.length;
  }
  returnFirstArgument = !!returnFirstArgument;

  return function () {
    var _this = this;
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function (resolve, reject) {
      var callback = args[argc - 1];
      var newArgs = args.slice(0, argc - 1);

      newArgs.push(function (err) {
        var args = Array.prototype.slice.call(arguments);

        // promise resolve
        if (err) {
          reject(err);
        } else {
          if (returnFirstArgument) {
            resolve(args[1]);
          } else {
            resolve(args.slice(1));
          }
        }

        // still callback
        if (typeof callback === 'function') {
          callback.apply(_this, args);
        }

      });

      fn.apply(_this, newArgs);
    });
  };
};

/**
 * Callbackify
 *
 * @param {Function} fn
 * @param {Number} argc
 * @return {Function}
 */
exports.callbackify = function (fn, argc) {
  if (typeof argc === 'undefined' || argc === null || argc === false || argc < 0) {
    argc = fn.length;
  }

  return function () {
    var callback = arguments[argc];
    if (typeof callback !== 'function') callback = null;

    return fn.apply(this, arguments)
      .then(function (ret) {
        // callback
        callback && callback(null, ret);
        // still promise resolve
        return Promise.resolve(ret);
      })
      .catch(function (err) {
        callback && callback(err);
        return Promise.reject(err);
      });
  }
};

/**
 * Promisify Module
 *
 * @param {Function} fn
 * @param {Boolean} returnFirstArgument
 * @return {Function}
 */
exports.promisifyRequire = function (name, returnFirstArgument) {
  var mod = require(name);
  var ret = {};
  for (var i in mod) {
    if (typeof mod[i] === 'function') {
      if (i.slice(-4) !== 'Sync') {
        ret[i] = exports.promisify(mod[i].bind(mod), null, returnFirstArgument);
      } else {
        ret[i] = mod[i].bind(mod);
      }
    }
  }
  return ret;
};
