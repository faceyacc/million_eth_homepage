"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serveReact;

var _quickCommands = require("../quickCommands");

var _react = _interopRequireDefault(require("../react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Serve a standalone React app entry module, component or element.
 */
function serveReact(args, cb) {
  (0, _quickCommands.serve)(args, (0, _react.default)(args), cb);
}

module.exports = exports.default;