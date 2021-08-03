"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serveWeb;

var _quickCommands = require("../quickCommands");

var _web = _interopRequireDefault(require("../web"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Serve a standalone vanilla JavaScript app.
 */
function serveWeb(args, cb) {
  (0, _quickCommands.serve)(args, (0, _web.default)(args), cb);
}

module.exports = exports.default;