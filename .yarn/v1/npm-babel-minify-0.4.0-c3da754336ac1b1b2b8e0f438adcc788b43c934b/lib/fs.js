function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _gPO = Object.getPrototypeOf || function _gPO(o) { return o.__proto__; };

var _sPO = Object.setPrototypeOf || function _sPO(o, p) { o.__proto__ = p; return o; };

var _construct = typeof Reflect === "object" && Reflect.construct || function _construct(Parent, args, Class) { var Constructor, a = [null]; a.push.apply(a, args); Constructor = Parent.bind.apply(Parent, a); return _sPO(new Constructor(), Class.prototype); };

var _cache = typeof Map === "function" && new Map();

function _wrapNativeSuper(Class) { if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() {} Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writeable: true, configurable: true } }); return _sPO(Wrapper, _sPO(function Super() { return _construct(Class, arguments, _gPO(this).constructor); }, Class)); }

var fs = require("fs");

var path = require("path");

var readdir = require("fs-readdir-recursive");

var promisify = require("util.promisify");

var mkdirp = promisify(require("mkdirp"));

var minify = require("./");

var EXTENSIONS = [".js", ".mjs"];
var readFileAsync = promisify(fs.readFile);
var writeFileAsync = promisify(fs.writeFile);
var lstat = promisify(fs.lstat);

var MinifyFileError =
/*#__PURE__*/
function (_Error) {
  _inherits(MinifyFileError, _Error);

  function MinifyFileError(message, _ref) {
    var _this;

    var file = _ref.file;

    _classCallCheck(this, MinifyFileError);

    _this = _possibleConstructorReturn(this, (MinifyFileError.__proto__ || Object.getPrototypeOf(MinifyFileError)).call(this, message));
    _this.file = file;
    return _this;
  }

  return MinifyFileError;
}(_wrapNativeSuper(Error)); // set defaults


var readFile = function readFile(file) {
  return readFileAsync(file, {
    encoding: "utf-8"
  });
};

var writeFile = function writeFile(file, data) {
  return writeFileAsync(file, data, {
    encoding: "utf-8"
  });
};

function isJsFile(file) {
  return EXTENSIONS.some(function (ext) {
    return path.extname(file) === ext;
  });
}

function isDir(_x) {
  return _isDir.apply(this, arguments);
}

function _isDir() {
  _isDir = _asyncToGenerator(function* (p) {
    try {
      return (yield lstat(p)).isDirectory();
    } catch (e) {
      return false;
    }
  });
  return _isDir.apply(this, arguments);
}

function isFile(_x2) {
  return _isFile.apply(this, arguments);
} // the async keyword simply exists to denote we are returning a promise
// even though we don't use await inside it


function _isFile() {
  _isFile = _asyncToGenerator(function* (p) {
    try {
      return (yield lstat(p)).isFile();
    } catch (e) {
      return false;
    }
  });
  return _isFile.apply(this, arguments);
}

function readStdin() {
  return _readStdin.apply(this, arguments);
}

function _readStdin() {
  _readStdin = _asyncToGenerator(function* () {
    var code = "";
    var stdin = process.stdin;
    return new Promise(function (resolve) {
      stdin.setEncoding("utf8");
      stdin.on("readable", function () {
        var chunk = process.stdin.read();
        if (chunk !== null) code += chunk;
      });
      stdin.on("end", function () {
        resolve(code);
      });
    });
  });
  return _readStdin.apply(this, arguments);
}

function handleStdin(_x3, _x4) {
  return _handleStdin.apply(this, arguments);
}

function _handleStdin() {
  _handleStdin = _asyncToGenerator(function* (outputFilename, options) {
    var _minify = minify((yield readStdin()), options),
        code = _minify.code;

    if (outputFilename) {
      yield writeFile(outputFilename, code);
    } else {
      process.stdout.write(code);
    }
  });
  return _handleStdin.apply(this, arguments);
}

function handleFile(_x5, _x6, _x7) {
  return _handleFile.apply(this, arguments);
}

function _handleFile() {
  _handleFile = _asyncToGenerator(function* (filename, outputFilename, options) {
    var _minify2 = minify((yield readFile(filename)), options),
        code = _minify2.code;

    if (outputFilename) {
      yield writeFile(outputFilename, code);
    } else {
      process.stdout.write(code);
    }
  });
  return _handleFile.apply(this, arguments);
}

function handleFiles(_x8, _x9, _x10) {
  return _handleFiles.apply(this, arguments);
}

function _handleFiles() {
  _handleFiles = _asyncToGenerator(function* (files, outputDir, options) {
    if (!outputDir) {
      throw new TypeError(`outputDir is falsy. Got "${outputDir}"`);
    }

    return Promise.all(files.map(function (file) {
      var outputFilename = path.join(outputDir, path.basename(file));
      return mkdirp(path.dirname(outputFilename)).then(function () {
        return handleFile(file, outputFilename, options);
      }).catch(function (e) {
        return Promise.reject(new MinifyFileError(e.message, {
          file
        }));
      });
    }));
  });
  return _handleFiles.apply(this, arguments);
}

function handleDir(_x11, _x12, _x13) {
  return _handleDir.apply(this, arguments);
}

function _handleDir() {
  _handleDir = _asyncToGenerator(function* (dir, outputDir, options) {
    if (!outputDir) {
      throw new TypeError(`outputDir is falsy`);
    } // relative paths


    var files = readdir(dir);
    return Promise.all(files.filter(function (file) {
      return isJsFile(file);
    }).map(function (file) {
      var outputFilename = path.join(outputDir, file);
      var inputFilename = path.join(dir, file);
      return mkdirp(path.dirname(outputFilename)).then(function () {
        return handleFile(inputFilename, outputFilename, options);
      }).catch(function (e) {
        return Promise.reject(new MinifyFileError(e.message, {
          file: inputFilename
        }));
      });
    }));
  });
  return _handleDir.apply(this, arguments);
}

function handleArgs(_x14, _x15, _x16) {
  return _handleArgs.apply(this, arguments);
}

function _handleArgs() {
  _handleArgs = _asyncToGenerator(function* (args, outputDir, options) {
    var files = [];
    var dirs = [];

    if (!Array.isArray(args)) {
      throw new TypeError(`Expected Array. Got ${JSON.stringify(args)}`);
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _arg = _step.value;

        if (yield isFile(_arg)) {
          files.push(_arg);
        } else if (yield isDir(_arg)) {
          dirs.push(_arg);
        } else {
          throw new TypeError(`Input "${_arg}" is neither a file nor a directory.`);
        }
      }
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

    return Promise.all([handleFiles(files, outputDir, options)].concat(_toConsumableArray(dirs.map(function (dir) {
      return handleDir(dir, outputDir, options);
    }))));
  });
  return _handleArgs.apply(this, arguments);
}

module.exports = {
  handleFile,
  handleStdin,
  handleFiles,
  handleDir,
  handleArgs,
  isFile,
  isDir,
  isJsFile,
  readFile,
  writeFile
};