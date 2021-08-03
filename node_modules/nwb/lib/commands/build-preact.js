"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildPreact;

var _preact = _interopRequireDefault(require("../preact"));

var _quickCommands = require("../quickCommands");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build a standalone Preact entry module, component or element.
 */
function buildPreact(args, cb) {
  (0, _quickCommands.build)(args, (0, _preact.default)(args), cb);
}

module.exports = exports.default;