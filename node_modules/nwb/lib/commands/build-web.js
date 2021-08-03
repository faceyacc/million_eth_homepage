"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildWE;

var _quickCommands = require("../quickCommands");

var _web = _interopRequireDefault(require("../web"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build a vanilla JavaScript app.
 */
function buildWE(args, cb) {
  (0, _quickCommands.build)(args, (0, _web.default)(args), cb);
}

module.exports = exports.default;