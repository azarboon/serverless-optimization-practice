function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var yargsParser = require("yargs-parser");

var optionsParser = require("./options-parser");

var _require = require("../package.json"),
    version = _require.version;

var _require2 = require("./fs"),
    handleStdin = _require2.handleStdin,
    handleFile = _require2.handleFile,
    handleArgs = _require2.handleArgs,
    isFile = _require2.isFile;

var plugins = ["booleans", "builtIns", "consecutiveAdds", "deadcode", "evaluate", "flipComparisons", "guards", "infinity", "mangle", "memberExpressions", "mergeVars", "numericLiterals", "propertyLiterals", "regexpConstructors", "removeConsole", "removeDebugger", "removeUndefined", "replace", "simplify", "simplifyComparisons", "typeConstructors", "undefinedToVoid"];
var proxies = ["keepFnName", "keepClassName", "tdz"];
var dceBooleanOpts = ["deadcode.keepFnName", "deadcode.keepFnArgs", "deadcode.keepClassName"];
var mangleBooleanOpts = ["mangle.eval", "mangle.keepFnName", "mangle.topLevel", "mangle.keepClassName"];
var mangleArrayOpts = ["mangle.exclude"];
var typeConsOpts = ["typeConstructors.array", "typeConstructors.boolean", "typeConstructors.number", "typeConstructors.object", "typeConstructors.string"];
var cliBooleanOpts = ["help", "version"];
var cliOpts = ["out-file", "out-dir"];
var alias = {
  outFile: "o",
  outDir: "d",
  version: "V"
};

function aliasArr(obj) {
  var r = Object.keys(obj).reduce(function (acc, val) {
    return acc.concat(val, obj[val]);
  }, []);
  return r;
}

function printHelpInfo() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$exitCode = _ref.exitCode,
      exitCode = _ref$exitCode === void 0 ? 0 : _ref$exitCode;

  var msg = `
  Usage: minify index.js [options]

  IO Options:
    --out-file, -o          Output to a specific file
    --out-dir, -d           Output to a specific directory

  Transform Options:
    --mangle                Context and scope aware variable renaming
    --simplify              Simplifies code for minification by reducing statements into
                            expressions
    --booleans              Transform boolean literals into !0 for true and !1 for false
    --builtIns              Minify standard built-in objects
    --consecutiveAdds       Inlines consecutive property assignments, array pushes, etc.
    --deadcode              Inlines bindings and tries to evaluate expressions.
    --evaluate              Tries to evaluate expressions and inline the result. Deals
                            with numbers and strings
    --flipComparisons       Optimize code for repetition-based compression algorithms
                            such as gzip.
    --infinity              Minify Infinity to 1/0
    --memberExpressions     Convert valid member expression property literals into plain
                            identifiers
    --mergeVars             Merge sibling variables into single variable declaration
    --numericLiterals       Shortening of numeric literals via scientific notation
    --propertyLiterals      Transform valid identifier property key literals into identifiers
    --regexpConstructors    Change RegExp constructors into literals
    --removeConsole         Removes all console.* calls
    --removeDebugger        Removes all debugger statements
    --removeUndefined       Removes rval's for variable assignments, return arguments from
                            functions that evaluate to undefined
    --replace               Replaces matching nodes in the tree with a given replacement node
    --simplifyComparisons   Convert === and !== to == and != if their types are inferred
                            to be the same
    --typeConstructors      Minify constructors to equivalent version
    --undefinedToVoid       Transforms undefined into void 0

  Other Options:
    --keepFnName            Preserve Function Name (useful for code depending on fn.name)
    --keepClassName         Preserve Class Name (useful for code depending on c.name)
    --keepFnArgs            Don't remove unused fn arguments (useful for code depending on fn.length)
    --tdz                   Detect usages of variables in the Temporal Dead Zone

  Nested Options:
    To use nested options (plugin specfic options) simply use the pattern
    --pluginName.featureName.

    For example,
    minify index.js --mangle.keepClassName --deadcode.keepFnArgs --outFile index.min.js
  `;
  log(msg, exitCode);
}

function log(msg) {
  var exitCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  process.stdout.write(msg + "\n");
  process.exit(exitCode);
}

function error(err) {
  if (err.file) {
    process.stderr.write("Error minifying file: " + err.file + "\n");
  }

  process.stderr.write(err + "\n");
  process.exit(1);
}

function getArgv(args) {
  var presetOpts = plugins.concat(proxies);

  var booleanOpts = _toConsumableArray(presetOpts).concat(dceBooleanOpts, mangleBooleanOpts, typeConsOpts, cliBooleanOpts);

  var booleanDefaults = booleanOpts.reduce(function (acc, cur) {
    return Object.assign(acc, {
      [cur]: void 0
    });
  }, {});
  var arrayOpts = mangleArrayOpts.concat();
  var arrayDefaults = arrayOpts.reduce(function (acc, cur) {
    return Object.assign(acc, {
      [cur]: []
    });
  }, {});
  return yargsParser(args, {
    boolean: booleanOpts,
    array: mangleArrayOpts,
    default: Object.assign({}, arrayDefaults, booleanDefaults),
    alias,
    configuration: {
      "dot-notation": false
    }
  });
}

function getMinifyOpts(argv) {
  var inputOpts = Object.keys(argv).filter(function (key) {
    if (Array.isArray(argv[key])) return argv[key].length > 0;
    return argv[key] !== void 0;
  }).reduce(function (acc, cur) {
    return Object.assign(acc, {
      [cur]: argv[cur]
    });
  }, {});
  var invalidOpts = validate(inputOpts);

  if (invalidOpts.length > 0) {
    throw new Error("Invalid Options passed: " + invalidOpts.join(","));
  }

  var options = optionsParser(inputOpts); // delete unncessary options to minify preset

  delete options["_"];
  delete options.d;
  delete options["out-dir"];
  delete options.o;
  delete options["out-file"];
  delete options.outFile;
  delete options.outDir;
  return options;
}

function validate(opts) {
  var allOpts = plugins.concat(proxies, dceBooleanOpts, mangleBooleanOpts, typeConsOpts, mangleArrayOpts, cliBooleanOpts, cliOpts, _toConsumableArray(aliasArr(alias)));
  return Object.keys(opts).filter(function (opt) {
    return opt !== "_" && allOpts.indexOf(opt) === -1;
  });
}

function runStdin(argv, options) {
  if (argv._.length > 0) {
    throw new Error("Reading input from STDIN. Cannot take file params");
  }

  return handleStdin(argv.outFile, options);
}

function runFile(argv, options) {
  var file = argv._[0]; // prefer outFile

  if (argv.outFile) {
    return handleFile(file, argv.outFile, options);
  } else if (argv.outDir) {
    return handleArgs([file], argv.outDir, options);
  } else {
    // prints to STDOUT
    return handleFile(file, void 0, options);
  }
}

function runArgs(argv, options) {
  return handleArgs(argv._, argv.outDir, options);
}

function run(_x) {
  return _run.apply(this, arguments);
}

function _run() {
  _run = _asyncToGenerator(function* (args) {
    var argv = getArgv(args); // early exits

    if (argv.help) printHelpInfo();
    if (argv.V) log(version);
    var options = getMinifyOpts(argv);

    if (argv._.length <= 0) {
      if (!process.stdin.isTTY) {
        return runStdin(argv, options);
      } else {
        return printHelpInfo({
          exitCode: 1
        });
      }
    } else if (argv._.length === 1 && (yield isFile(argv._[0]))) {
      return runFile(argv, options);
    } else {
      return runArgs(argv, options);
    }
  });
  return _run.apply(this, arguments);
}

run(process.argv.slice(2)).catch(function (e) {
  return error(e);
});