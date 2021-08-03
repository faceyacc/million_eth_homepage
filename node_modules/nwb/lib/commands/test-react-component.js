"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = testReactComponent;

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _karmaServer = _interopRequireDefault(require("../karmaServer"));

var _react = _interopRequireDefault(require("../react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testReactComponent(args, cb) {
  (0, _karmaServer.default)(args, (0, _webpackMerge.default)((0, _react.default)(args).getKarmaTestConfig(), {}), cb);
}

module.exports = exports.default;