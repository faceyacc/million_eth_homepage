"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serveInferno;

var _inferno = _interopRequireDefault(require("../inferno"));

var _quickCommands = require("../quickCommands");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build a standalone Inferno app entry module, component or VNode.
 */
function serveInferno(args, cb) {
  (0, _quickCommands.serve)(args, (0, _inferno.default)(args), cb);
}

module.exports = exports.default;