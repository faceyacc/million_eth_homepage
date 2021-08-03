"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackServer;

var _chalk = require("chalk");

var _detectPort = _interopRequireDefault(require("detect-port"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _config = require("./config");

var _constants = require("./constants");

var _createServerWebpackConfig = _interopRequireDefault(require("./createServerWebpackConfig"));

var _debug = _interopRequireDefault(require("./debug"));

var _devServer = _interopRequireDefault(require("./devServer"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get the port to run the server on, detecting if the intended port is
 * available first and prompting the user if not.
 */
function getServerPort(args, intendedPort, cb) {
  (0, _detectPort.default)(intendedPort, (err, suggestedPort) => {
    if (err) return cb(err); // No need to prompt if the intended port is available

    if (suggestedPort === intendedPort) return cb(null, suggestedPort); // Support use of --force to avoid interactive prompt

    if (args.force) return cb(null, suggestedPort);

    if (args.clear !== false && args.clearConsole !== false) {
      (0, _utils.clearConsole)();
    }

    console.log((0, _chalk.yellow)(`Something is already running on port ${intendedPort}.`));
    console.log();

    _inquirer.default.prompt([{
      type: 'confirm',
      name: 'run',
      message: 'Would you like to run the app on another port instead?',
      default: true
    }]).then(({
      run
    }) => cb(null, run ? suggestedPort : null), err => cb(err));
  });
}
/**
 * Start a development server with Webpack using a given build configuration.
 */


function webpackServer(args, buildConfig, cb) {
  // Default environment to development - we also run the dev server while
  // testing to check that HMR works.
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  if (typeof buildConfig == 'function') {
    buildConfig = buildConfig(args);
  }

  let serverConfig;

  try {
    let pluginConfig = (0, _config.getPluginConfig)(args);
    serverConfig = (0, _config.getUserConfig)(args, {
      pluginConfig
    }).devServer;
  } catch (e) {
    return cb(e);
  }

  getServerPort(args, args.port || Number(serverConfig.port) || _constants.DEFAULT_PORT, (err, port) => {
    if (err) return cb(err); // A null port indicates the user chose not to run the server when prompted

    if (port === null) return cb();
    serverConfig.port = port; // Fallback index serving can be disabled with --no-fallback

    if (args.fallback === false) {
      serverConfig.historyApiFallback = false;
    } // Fallback index serving can be configured with dot arguments
    // e.g. --fallback.disableDotRule --fallback.verbose
    else if ((0, _utils.typeOf)(args.fallback) === 'object') {
        serverConfig.historyApiFallback = args.fallback;
      } // The host can be overridden with --host


    if (args.host) serverConfig.host = args.host; // Open a browser with --open (default browser) or --open="browser name"

    if (args.open) serverConfig.open = args.open;
    let url = `http${serverConfig.https ? 's' : ''}://${serverConfig.host || 'localhost'}:${port}/`;

    if (!('status' in buildConfig.plugins)) {
      buildConfig.plugins.status = {
        disableClearConsole: args.clear === false || args['clear-console'] === false,
        successMessage: `The app is running at ${url}`
      };
    }

    let webpackConfig;

    try {
      webpackConfig = (0, _createServerWebpackConfig.default)(args, buildConfig, serverConfig);
    } catch (e) {
      return cb(e);
    }

    (0, _debug.default)('webpack config: %s', (0, _utils.deepToString)(webpackConfig));
    (0, _devServer.default)(webpackConfig, serverConfig, url, cb);
  });
}

module.exports = exports.default;