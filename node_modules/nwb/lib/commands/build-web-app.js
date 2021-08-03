"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildWebApp;

var _appCommands = require("../appCommands");

var _web = _interopRequireDefault(require("../web"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build a plain JS app.
 */
function buildWebApp(args, cb) {
  (0, _appCommands.build)(args, (0, _web.default)(args), cb);
}

module.exports = exports.default;