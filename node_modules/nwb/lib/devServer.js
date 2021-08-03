"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = devServer;

var _open = _interopRequireDefault(require("open"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _debug = _interopRequireDefault(require("./debug"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Use Webpack Dev Server to build and serve assets using Webpack's watch mode,
 * hot reload changes in the browser and display compile error overlays.
 *
 * Static content is handled by CopyPlugin.
 */
function devServer(webpackConfig, serverConfig, url, cb) {
  let compiler = (0, _webpack.default)(webpackConfig);
  let {
    host,
    open,
    port,
    ...otherServerConfig
  } = serverConfig;
  let webpackDevServerOptions = (0, _webpackMerge.default)({
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true,
    hot: true,
    overlay: true,
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    }
  }, otherServerConfig);
  (0, _debug.default)('webpack dev server options: %s', (0, _utils.deepToString)(webpackDevServerOptions));
  let server = new _webpackDevServer.default(compiler, webpackDevServerOptions); // XXX Temporarily replace console.info() to prevent WDS startup logging which
  //     is explicitly done at the info level when the quiet option is set.

  let info = console.info;

  console.info = () => {};

  server.listen(port, host, err => {
    console.info = info;
    if (err) return cb(err);

    if (open) {
      // --open
      if ((0, _utils.typeOf)(open) === 'boolean') (0, _open.default)(url, {
        url: true
      }); // --open=firefox
      else (0, _open.default)(url, {
          app: open,
          url: true
        });
    }
  });
}

module.exports = exports.default;