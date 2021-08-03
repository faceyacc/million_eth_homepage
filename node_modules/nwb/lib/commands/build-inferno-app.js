"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildPreactApp;

var _appCommands = require("../appCommands");

var _inferno = _interopRequireDefault(require("../inferno"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build an Inferno app.
 */
function buildPreactApp(args, cb) {
  (0, _appCommands.build)(args, (0, _inferno.default)(args), cb);
}

module.exports = exports.default;