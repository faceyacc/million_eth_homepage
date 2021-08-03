"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
exports.createBuildConfig = createBuildConfig;
exports.createServeConfig = createServeConfig;
exports.serve = serve;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _runSeries = _interopRequireDefault(require("run-series"));

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _cleanApp = _interopRequireDefault(require("./commands/clean-app"));

var _constants = require("./constants");

var _errors = require("./errors");

var _utils = require("./utils");

var _webpackBuild = _interopRequireDefault(require("./webpackBuild"));

var _webpackServer = _interopRequireDefault(require("./webpackServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a quick build, installing any required dependencies first if
 * they're not resolvable.
 */
function build(args, appConfig, cb) {
  if (args._.length === 1) {
    return cb(new _errors.UserError('An entry module must be specified.'));
  }

  if (!_fs.default.existsSync(args._[1])) {
    return cb(new _errors.UserError(`${args._[1]} does not exist.`));
  }

  let dist = args._[2] || 'dist';
  (0, _runSeries.default)([cb => (0, _utils.install)(appConfig.getQuickDependencies(), {
    args,
    check: true
  }, cb), cb => (0, _cleanApp.default)({
    _: ['clean-app', dist]
  }, cb), cb => (0, _webpackBuild.default)(`${appConfig.getName()} app`, args, () => createBuildConfig(args, appConfig.getQuickBuildConfig()), cb)], cb);
}
/**
 * Create default command config for a quick app build and merge any extra
 * config provided into it.
 */


function createBuildConfig(args, options) {
  let {
    commandConfig: extraConfig = {},
    defaultTitle,
    renderShim,
    renderShimAliases
  } = options;

  let entry = _path.default.resolve(args._[1]);

  let dist = _path.default.resolve(args._[2] || 'dist');

  let mountId = args['mount-id'] || 'app';
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
      proposals: {
        all: true
      }
    },
    devtool: 'source-map',
    output: {
      chunkFilename: filenamePattern,
      filename: filenamePattern,
      path: dist,
      publicPath: '/'
    },
    plugins: {
      html: {
        lang: 'en',
        mountId,
        title: args.title || defaultTitle
      },
      // A vendor bundle can be explicitly enabled with a --vendor flag
      vendor: args.vendor
    }
  };

  if (renderShim == null || args.force === true) {
    config.entry = {
      app: [entry]
    };
  } else {
    // Use a render shim module which supports quick prototyping
    config.entry = {
      app: [renderShim]
    };
    config.plugins.define = {
      NWB_QUICK_MOUNT_ID: JSON.stringify(mountId)
    };
    config.resolve = {
      alias: {
        // Allow the render shim module to import the provided entry module
        'nwb-quick-entry': entry,
        // Allow the render shim module to import modules from the cwd
        ...renderShimAliases
      }
    };
  }

  return (0, _webpackMerge.default)(config, extraConfig);
}
/**
 * Create default command config for quick serving and merge any extra config
 * provided into it.
 */


function createServeConfig(args, options) {
  let {
    commandConfig: extraConfig = {},
    defaultTitle,
    renderShim,
    renderShimAliases
  } = options;

  let entry = _path.default.resolve(args._[1]);

  let dist = _path.default.resolve(args._[2] || 'dist');

  let mountId = args['mount-id'] || 'app';
  let config = {
    babel: {
      env: {
        targets: _constants.DEFAULT_BROWSERS_DEV,
        useBuiltIns: 'entry',
        corejs: 3,
        exclude: ['transform-typeof-symbol']
      },
      proposals: {
        all: true
      }
    },
    output: {
      filename: 'app.js',
      path: dist,
      publicPath: '/'
    },
    plugins: {
      html: {
        lang: 'en',
        mountId,
        title: args.title || defaultTitle
      }
    }
  };

  if (args.force === true || renderShim == null) {
    config.entry = [entry];
  } else {
    config.entry = [renderShim];
    config.plugins.define = {
      NWB_QUICK_MOUNT_ID: JSON.stringify(mountId)
    };
    config.resolve = {
      alias: {
        // Allow the render shim module to import the provided entry module
        'nwb-quick-entry': entry,
        // Allow the render shim module to import modules from the cwd
        ...renderShimAliases
      }
    };
  }

  return (0, _webpackMerge.default)(config, extraConfig);
}
/**
 * Run a quick development server, installing any required dependencies first if
 * they're not resolvable.
 */


function serve(args, appConfig, cb) {
  if (args._.length === 1) {
    return cb(new _errors.UserError('An entry module must be specified.'));
  }

  if (!_fs.default.existsSync(args._[1])) {
    return cb(new _errors.UserError(`${args._[1]} does not exist.`));
  }

  (0, _runSeries.default)([cb => (0, _utils.install)(appConfig.getQuickDependencies(), {
    args,
    check: true
  }, cb), cb => (0, _webpackServer.default)(args, createServeConfig(args, appConfig.getQuickServeConfig()), cb)], cb);
}