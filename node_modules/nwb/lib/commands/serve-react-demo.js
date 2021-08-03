"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serveReactDemo;

var _path = _interopRequireDefault(require("path"));

var _constants = require("../constants");

var _utils = require("../utils");

var _webpackServer = _interopRequireDefault(require("../webpackServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Serve a React demo app from demo/src/index.js.
 */
function serveReactDemo(args, cb) {
  let pkg = require(_path.default.resolve('package.json'));

  let dist = _path.default.resolve('demo/dist');

  let config = {
    babel: {
      env: {
        targets: _constants.DEFAULT_BROWSERS_DEV,
        useBuiltIns: 'entry',
        corejs: 3,
        exclude: ['transform-typeof-symbol']
      },
      presets: ['react']
    },
    entry: [_path.default.resolve('demo/src/index.js')],
    output: {
      filename: 'demo.js',
      path: dist,
      publicPath: '/'
    },
    plugins: {
      html: {
        lang: 'en',
        mountId: 'demo',
        title: `${pkg.name} ${pkg.version} Demo`
      }
    }
  };

  if (args.hmr !== false) {
    config.babel.plugins = [require.resolve('react-refresh/babel')];
    config.plugins.reactRefresh = true;
  }

  if ((0, _utils.directoryExists)('demo/public')) {
    config.plugins.copy = [{
      from: _path.default.resolve('demo/public'),
      to: dist
    }];
  }

  (0, _webpackServer.default)(args, config, cb);
}

module.exports = exports.default;