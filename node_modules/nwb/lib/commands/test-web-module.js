"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = testWebModule;

var _karmaServer = _interopRequireDefault(require("../karmaServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testWebModule(args, cb) {
  (0, _karmaServer.default)(args, {}, cb);
}

module.exports = exports.default;