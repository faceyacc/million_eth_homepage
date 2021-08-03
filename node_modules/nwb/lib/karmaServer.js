"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = karmaServer;

var _karma = require("karma");

var _config = require("./config");

var _createKarmaConfig = _interopRequireDefault(require("./createKarmaConfig"));

var _errors = require("./errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function karmaServer(args, buildConfig, cb) {
  // Force the environment to test
  process.env.NODE_ENV = 'test';
  let pluginConfig = (0, _config.getPluginConfig)(args);
  let userConfig = (0, _config.getUserConfig)(args, {
    pluginConfig
  });
  let karmaConfig = (0, _createKarmaConfig.default)(args, buildConfig, pluginConfig, userConfig);
  new _karma.Server(karmaConfig, exitCode => {
    if (exitCode !== 0) return cb(new _errors.KarmaExitCodeError(exitCode));
    cb();
  }).start();
}

module.exports = exports.default;