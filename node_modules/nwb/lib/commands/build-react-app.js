"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildReactApp;

var _appCommands = require("../appCommands");

var _react = _interopRequireDefault(require("../react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build a React app.
 */
function buildReactApp(args, cb) {
  (0, _appCommands.build)(args, (0, _react.default)(args), cb);
}

module.exports = exports.default;