"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildPreactApp;

var _appCommands = require("../appCommands");

var _preact = _interopRequireDefault(require("../preact"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build a Preact app.
 */
function buildPreactApp(args, cb) {
  (0, _appCommands.build)(args, (0, _preact.default)(args), cb);
}

module.exports = exports.default;