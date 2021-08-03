"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = testReact;

var _karmaServer = _interopRequireDefault(require("../karmaServer"));

var _react = _interopRequireDefault(require("../react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testReact(args, cb) {
  (0, _karmaServer.default)(args, (0, _react.default)(args).getKarmaTestConfig(), cb);
}

module.exports = exports.default;