"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
exports.createBuildConfig = createBuildConfig;
exports.createServeConfig = createServeConfig;
exports.getDefaultHTMLConfig = getDefaultHTMLConfig;
exports.serve = serve;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _runSeries = _interopRequireDefault(require("run-series"));

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _cleanApp = _interopRequireDefault(require("./commands/clean-app"));

var _constants = require("./constants");

var _utils = require("./utils");

var _webpackBuild = _interopRequireDefault(require("./webpackBuild"));

var _webpackServer = _interopRequireDefault(require("./webpackServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_HTML_PATH = 'src/index.html';
/**
 * Create a build, installing any required dependencies first if they're not
 * resolvable.
 */

function build(args, appConfig, cb) {
  let dist = args._[2] || 'dist';
  let tasks = [cb => (0, _cleanApp.default)({
    _: ['clean-app', dist]
  }, cb), cb => (0, _webpackBuild.default)(`${appConfig.getName()} app`, args, () => createBuildConfig(args, appConfig.getBuildConfig()), cb)];
  let buildDependencies = appConfig.getBuildDependencies();

  if (buildDependencies.length > 0) {
    tasks.unshift(cb => (0, _utils.install)(buildDependencies, {
      check: true
    }, cb));
  }

  (0, _runSeries.default)(tasks, cb);
}
/**
 * Create default command config for building an app and merge any extra config
 * provided into it.
 */


function createBuildConfig(args, extra = {}) {
  let entry = _path.default.resolve(args._[1] || 'src/index.js');

  let dist = _path.default.resolve(args._[2] || 'dist');

  let production = process.env.NODE_ENV === 'production';
  let filenamePattern = production ? '[name].[chunkhash:8].js' : '[name].js';
  let config = {
    babel: {
      env: {
        targets: _constants.DEFAULT_BROWSERS_PROD,
        useBuiltIns: 'entry',
        corejs: 3,
        exclude: ['transform-typeof-symbol']
      }
    },
    devtool: 'source-map',
    entry: {
      app: [entry]
    },
    output: {
      filename: filenamePattern,
      chunkFilename: filenamePattern,
      path: dist,
      publicPath: '/'
    },
    plugins: {
      html: args.html !== false && getDefaultHTMLConfig(),
      vendor: args.vendor !== false
    }
  };

  if ((0, _utils.directoryExists)('public')) {
    config.plugins.copy = [{
      from: _path.default.resolve('public'),
      to: dist,
      globOptions: {
        ignore: ['.gitkeep']
      }
    }];
  }

  return (0, _webpackMerge.default)(config, extra);
}
/**
 * Create default command config for serving an app and merge any extra config
 * objects provided into it.
 */


function createServeConfig(args, ...extra) {
  let entry = _path.default.resolve(args._[1] || 'src/index.js');

  let dist = _path.default.resolve(args._[2] || 'dist');

  let config = {
    babel: {
      env: {
        targets: _constants.DEFAULT_BROWSERS_DEV,
        useBuiltIns: 'entry',
        corejs: 3,
        exclude: ['transform-typeof-symbol']
      }
    },
    entry: [entry],
    output: {
      path: dist,
      filename: 'app.js',
      publicPath: '/'
    },
    plugins: {
      html: getDefaultHTMLConfig()
    }
  };

  if ((0, _utils.directoryExists)('public')) {
    config.plugins.copy = [{
      from: _path.default.resolve('public'),
      to: dist,
      globOptions: {
        ignore: ['.gitkeep']
      }
    }];
  }

  return (0, _webpackMerge.default)(config, ...extra);
}
/**
 * Create default config for html-webpack-plugin.
 */


function getDefaultHTMLConfig(cwd = process.cwd()) {
  // Use the default HTML template path if it exists
  if (_fs.default.existsSync(_path.default.join(cwd, DEFAULT_HTML_PATH))) {
    return {
      template: DEFAULT_HTML_PATH
    };
  } // Otherwise provide default variables for the internal template, in case we
  // fall back to it.


  return {
    lang: 'en',
    mountId: 'app',
    title: require(_path.default.join(cwd, 'package.json')).name
  };
}
/**
 * Run a development server.
 */


function serve(args, appConfig, cb) {
  (0, _webpackServer.default)(args, () => createServeConfig(args, appConfig.getServeConfig()), cb);
}