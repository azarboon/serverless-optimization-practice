"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var DELIMITTER = ".";

module.exports = function parseOpts(argv) {
  return dotsToObject(argv);
};
/**
 * Converts and Object of the form - {key<dot-notation>: value} to deep object
 * following rules of minify preset options
 *
 * A preset option can be `true` | `object` which enables the particular plugin
 * `false` disables the plugin
 *
 * @param input - An Object with dot-notation keys
 */


function dotsToObject(input) {
  var dots = Object.keys(input).map(function (key) {
    return _toConsumableArray(key.split(DELIMITTER)).concat([input[key]]);
  }); // sort to ensure dot notation occurs after parent key

  dots.sort(function (a, b) {
    if (a.length === b.length) {
      return a[0] > b[0];
    }

    return a.length > b.length;
  });
  var obj = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = dots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _parts = _step.value;
      add.apply(void 0, [obj].concat(_toConsumableArray(_parts)));
    } // make object

  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  function add(o, first) {
    for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rest[_key - 2] = arguments[_key];
    }

    if (rest.length < 1) {
      // something went wrong
      throw new Error("Option Parse Error");
    } else if (rest.length === 1) {
      // there is only a key and a value
      // for example: mangle: true
      o[first] = rest[0];
    } else {
      // create the current path and recurse if the plugin is enabled
      if (!hop(o, first) || o[first] === true) {
        // if the plugin is enabled
        o[first] = {};
      }

      if (o[first] !== false) {
        // if the plugin is NOT disabled then recurse
        add.apply(void 0, [o[first]].concat(rest));
      }
    }
  }

  return obj;
}

function hop(o, key) {
  return Object.prototype.hasOwnProperty.call(o, key);
}