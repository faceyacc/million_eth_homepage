"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serveWebApp;

var _web = _interopRequireDefault(require("../web"));

var _appCommands = require("../appCommands");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Serve a plain JS app.
 */
function serveWebApp(args, cb) {
  (0, _appCommands.serve)(args, (0, _web.default)(args), cb);
}

module.exports = exports.default;