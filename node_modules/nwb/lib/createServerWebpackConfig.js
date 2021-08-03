"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createServerWebpackConfig;

var _config = require("./config");

var _createWebpackConfig = _interopRequireDefault(require("./createWebpackConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create Webpack entry config for the client which will subscribe to Hot Module
 * Replacement updates.
 */
function getHMRClientEntries(args, serverConfig) {
  // null config indicates we're creating config for use in Express middleware,
  // where the server config is out of our hands and we're using
  // webpack-hot-middleware for HMR.
  if (serverConfig == null) {
    let hotMiddlewareOptions = args.reload ? '?reload=true' : '';
    return [// Polyfill EventSource for IE11, as webpack-hot-middleware/client uses it
    require.resolve('eventsource-polyfill'), require.resolve('webpack-hot-middleware/client') + hotMiddlewareOptions];
  } // Otherwise, we're using webpack-dev-server's client


  let hmrURL = '/'; // Set full HMR URL if the user customised it (#279)

  if (args.host || args.port) {
    hmrURL = `http://${serverConfig.host || 'localhost'}:${String(serverConfig.port)}/`;
  }

  return [require.resolve('webpack-dev-server/client') + `?${hmrURL}`, require.resolve(`webpack/hot/${args.reload ? '' : 'only-'}dev-server`)];
}
/**
 * Creates Webpack config for serving a watch build with Hot Module Replacement.
 */


function createServerWebpackConfig(args, commandConfig, serverConfig) {
  let pluginConfig = (0, _config.getPluginConfig)(args);
  let userConfig = (0, _config.getUserConfig)(args, {
    pluginConfig
  });
  let {
    entry,
    plugins = {},
    ...otherCommandConfig
  } = commandConfig;

  if (args['auto-install'] || args.install) {
    plugins.autoInstall = true;
  }

  return (0, _createWebpackConfig.default)({
    server: true,
    devtool: 'cheap-module-source-map',
    entry: getHMRClientEntries(args, serverConfig).concat(entry),
    plugins,
    ...otherCommandConfig
  }, pluginConfig, userConfig);
}

module.exports = exports.default;