"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadBlockHoistPlugin;

function _sortBy() {
  var data = _interopRequireDefault(require("lodash/sortBy"));

  _sortBy = function _sortBy() {
    return data;
  };

  return data;
}

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOADED_PLUGIN;

function loadBlockHoistPlugin() {
  if (!LOADED_PLUGIN) {
    var config = (0, _config.default)({
      babelrc: false,
      plugins: [blockHoistPlugin]
    });
    LOADED_PLUGIN = config ? config.passes[0][0] : undefined;
    if (!LOADED_PLUGIN) throw new Error("Assertion failure");
  }

  return LOADED_PLUGIN;
}

var blockHoistPlugin = {
  name: "internal.blockHoist",
  visitor: {
    Block: {
      exit: function exit(_ref) {
        var node = _ref.node;
        var hasChange = false;

        for (var i = 0; i < node.body.length; i++) {
          var bodyNode = node.body[i];

          if (bodyNode && bodyNode._blockHoist != null) {
            hasChange = true;
            break;
          }
        }

        if (!hasChange) return;
        node.body = (0, _sortBy().default)(node.body, function (bodyNode) {
          var priority = bodyNode && bodyNode._blockHoist;
          if (priority == null) priority = 1;
          if (priority === true) priority = 2;
          return -1 * priority;
        });
      }
    }
  }
};