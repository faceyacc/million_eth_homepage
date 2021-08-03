"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = testPreact;

var _karmaServer = _interopRequireDefault(require("../karmaServer"));

var _preact = _interopRequireDefault(require("../preact"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testPreact(args, cb) {
  (0, _karmaServer.default)(args, (0, _preact.default)(args).getKarmaTestConfig(), cb);
}

module.exports = exports.default;