"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildDemo;

var _path = _interopRequireDefault(require("path"));

var _runSeries = _interopRequireDefault(require("run-series"));

var _constants = require("../constants");

var _utils = require("../utils");

var _webpackBuild = _interopRequireDefault(require("../webpackBuild"));

var _cleanDemo = _interopRequireDefault(require("./clean-demo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCommandConfig(args) {
  let pkg = require(_path.default.resolve('package.json'));

  let dist = _path.default.resolve('demo/dist');

  let production = process.env.NODE_ENV === 'production';
  let filenamePattern = production ? '[name].[chunkhash:8].js' : '[name].js';
  let config = {
    babel: {
      env: {
        targets: _constants.DEFAULT_BROWSERS_PROD,
        useBuiltIns: 'entry',
        corejs: 3,
        exclude: ['transform-typeof-symbol']
      },
      presets: ['react']
    },
    devtool: 'source-map',
    entry: {
      demo: [_path.default.resolve('demo/src/index.js')]
    },
    output: {
      filename: filenamePattern,
      chunkFilename: filenamePattern,
      path: dist
    },
    plugins: {
      html: {
        lang: 'en',
        mountId: 'demo',
        title: args.title || `${pkg.name} ${pkg.version} Demo`
      },
      // A vendor bundle can be explicitly enabled with a --vendor flag
      vendor: args.vendor
    }
  };

  if ((0, _utils.directoryExists)('demo/public')) {
    config.plugins.copy = [{
      from: _path.default.resolve('demo/public'),
      to: dist
    }];
  }

  return config;
}
/**
 * Build a module's demo app from demo/src/index.js.
 */


function buildDemo(args, cb) {
  (0, _runSeries.default)([cb => (0, _cleanDemo.default)(args, cb), cb => (0, _webpackBuild.default)('demo', args, getCommandConfig, cb)], cb);
}

module.exports = exports.default;