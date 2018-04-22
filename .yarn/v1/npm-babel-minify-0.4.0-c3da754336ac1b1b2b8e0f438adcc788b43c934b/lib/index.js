var babelCore = require("@babel/core");

var babelPresetMinify = require("babel-preset-minify");

module.exports = function babelMinify(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$minified = _ref.minified,
      minified = _ref$minified === void 0 ? true : _ref$minified,
      inputSourceMap = _ref.inputSourceMap,
      _ref$sourceMaps = _ref.sourceMaps,
      sourceMaps = _ref$sourceMaps === void 0 ? false : _ref$sourceMaps,
      _ref$babel = _ref.babel,
      babel = _ref$babel === void 0 ? babelCore : _ref$babel,
      _ref$minifyPreset = _ref.minifyPreset,
      minifyPreset = _ref$minifyPreset === void 0 ? babelPresetMinify : _ref$minifyPreset;

  return babel.transform(input, {
    babelrc: false,
    presets: [[minifyPreset, options]],
    comments: false,
    inputSourceMap,
    sourceMaps,
    minified
  });
};