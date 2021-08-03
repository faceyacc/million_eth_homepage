"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serveReact;

var _appCommands = require("../appCommands");

var _react = _interopRequireDefault(require("../react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Serve a React app.
 */
function serveReact(args, cb) {
  (0, _appCommands.serve)(args, (0, _react.default)(args), cb);
}

module.exports = exports.default;