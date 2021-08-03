"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackBuild;

var _ora = _interopRequireDefault(require("ora"));

var _webpack = _interopRequireDefault(require("webpack"));

var _config = require("./config");

var _createWebpackConfig = _interopRequireDefault(require("./createWebpackConfig"));

var _debug = _interopRequireDefault(require("./debug"));

var _utils = require("./utils");

var _webpackUtils = require("./webpackUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * If you pass a non-falsy type, this will handle spinner display and output
 * logging itself, otherwise use the stats provided in the callback.
 */
function webpackBuild(type, args, buildConfig, cb) {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
  }

  let pluginConfig = (0, _config.getPluginConfig)(args);
  let userConfig;

  try {
    userConfig = (0, _config.getUserConfig)(args, {
      pluginConfig
    });
  } catch (e) {
    return cb(e);
  }

  if (typeof buildConfig == 'function') {
    buildConfig = buildConfig(args);
  }

  let webpackConfig;

  try {
    webpackConfig = (0, _createWebpackConfig.default)(buildConfig, pluginConfig, userConfig);
  } catch (e) {
    return cb(e);
  }

  (0, _debug.default)('webpack config: %s', (0, _utils.deepToString)(webpackConfig));
  let spinner;

  if (type) {
    spinner = (0, _ora.default)(`Building ${type}`).start();
  }

  let compiler = (0, _webpack.default)(webpackConfig);
  compiler.run((err, stats) => {
    if (err) {
      if (spinner) {
        spinner.fail();
      }

      return cb(err);
    }

    if (spinner || stats.hasErrors()) {
      (0, _webpackUtils.logBuildResults)(stats, spinner);
    }

    if (stats.hasErrors()) {
      return cb(new Error('Build failed with errors.'));
    }

    cb(null, stats);
  });
}

module.exports = exports.default;