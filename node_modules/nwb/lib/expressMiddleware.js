"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nwbMiddleware;

var _assert = _interopRequireDefault(require("assert"));

var _webpack = _interopRequireDefault(require("webpack"));

var _appCommands = require("./appCommands");

var _config = require("./config");

var _constants = require("./constants");

var _createServerWebpackConfig = _interopRequireDefault(require("./createServerWebpackConfig"));

var _debug = _interopRequireDefault(require("./debug"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const APP_TYPE_CONFIG = {
  [_constants.INFERNO_APP]: './inferno',
  [_constants.PREACT_APP]: './preact',
  [_constants.REACT_APP]: './react',
  [_constants.WEB_APP]: './web'
};
/**
 * Express middleware for serving an app with hot reloading - equivalent to
 * having run `nwb serve`, but from your own server.
 */

function nwbMiddleware(express, options = {}) {
  (0, _assert.default)(express && typeof express.Router === 'function', 'The express module must be passed as the first argument to nwb middleware');
  let projectType = options.type;

  if (projectType == null) {
    projectType = (0, _config.getProjectType)({
      _: ['serve'],
      config: options.config
    });
  }

  if (!APP_TYPE_CONFIG[projectType]) {
    throw new Error(`nwb Express middleware is unable to handle '${projectType}' projects, only ` + (0, _utils.joinAnd)(Object.keys(APP_TYPE_CONFIG).map(s => `'${s}'`), 'or'));
  } // Use options to create an object equivalent to CLI args parsed by minimist


  let args = {
    _: [`serve-${projectType}`, options.entry],
    config: options.config,
    hmr: options.hmr !== false,
    install: !!options.install || !!options.autoInstall,
    reload: !!options.reload
  };

  let appTypeConfig = require(APP_TYPE_CONFIG[projectType])(args);

  let webpackConfig = (0, _createServerWebpackConfig.default)(args, (0, _appCommands.createServeConfig)(args, appTypeConfig.getServeConfig(), {
    plugins: {
      status: {
        disableClearConsole: true,
        successMessage: null
      }
    }
  }));
  (0, _debug.default)('webpack config: %s', (0, _utils.deepToString)(webpackConfig));
  let compiler = (0, _webpack.default)(webpackConfig);
  let router = express.Router();
  router.use(require('webpack-dev-middleware')(compiler, {
    logLevel: 'silent',
    publicPath: webpackConfig.output.publicPath,
    watchOptions: {
      ignored: /node_modules/
    }
  }));
  router.use(require('webpack-hot-middleware')(compiler, {
    log: false
  }));
  return router;
}

module.exports = exports.default;