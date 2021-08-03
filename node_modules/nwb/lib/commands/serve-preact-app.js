"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = servePreact;

var _preact = _interopRequireDefault(require("../preact"));

var _appCommands = require("../appCommands");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Serve a Preact app.
 */
function servePreact(args, cb) {
  (0, _appCommands.serve)(args, (0, _preact.default)(args), cb);
}

module.exports = exports.default;