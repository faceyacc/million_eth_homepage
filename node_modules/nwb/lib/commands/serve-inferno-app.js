"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serveInferno;

var _inferno = _interopRequireDefault(require("../inferno"));

var _appCommands = require("../appCommands");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Serve an Inferno app.
 */
function serveInferno(args, cb) {
  (0, _appCommands.serve)(args, (0, _inferno.default)(args), cb);
}

module.exports = exports.default;