"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildReact;

var _quickCommands = require("../quickCommands");

var _react = _interopRequireDefault(require("../react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build a standalone React app entry module, component or element.
 */
function buildReact(args, cb) {
  (0, _quickCommands.build)(args, (0, _react.default)(args), cb);
}

module.exports = exports.default;