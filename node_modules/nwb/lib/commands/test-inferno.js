"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = testInferno;

var _inferno = _interopRequireDefault(require("../inferno"));

var _karmaServer = _interopRequireDefault(require("../karmaServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testInferno(args, cb) {
  (0, _karmaServer.default)(args, (0, _inferno.default)(args).getKarmaTestConfig(), cb);
}

module.exports = exports.default;