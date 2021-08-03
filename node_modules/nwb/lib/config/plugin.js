"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPluginConfig = getPluginConfig;

var _path = _interopRequireDefault(require("path"));

var _resolve = _interopRequireDefault(require("resolve"));

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _debug = _interopRequireDefault(require("../debug"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPackagePlugins(cwd) {
  let pkg = require(_path.default.join(cwd, 'package.json'));

  return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})].filter(dep => /^nwb-/.test(dep));
}
/**
 * Look for nwb-* plugin dependencies in package.json and plugins specified as
 * arguments when supported, import them and merge the plugin config objects
 * they export.
 */


function getPluginConfig(args = {}, {
  cwd = process.cwd()
} = {}) {
  let plugins = [];

  try {
    let pkgPlugins = plugins.concat(getPackagePlugins(cwd));
    (0, _debug.default)('%s nwb-* dependencies in package.json', pkgPlugins.length);
    plugins = plugins.concat(pkgPlugins);
  } catch (e) {// pass
  }

  let argsPlugins = (0, _utils.getArgsPlugins)(args);

  if (argsPlugins.length !== 0) {
    (0, _debug.default)('%s plugins in arguments', argsPlugins.length);
    plugins = plugins.concat(argsPlugins);
  }

  if (plugins.length === 0) {
    return {};
  }

  plugins = (0, _utils.unique)(plugins);
  (0, _debug.default)('nwb plugins: %o', plugins);
  let pluginConfig = {};
  plugins.forEach(plugin => {
    let pluginModule = require(_resolve.default.sync(plugin, {
      basedir: cwd
    }));

    pluginConfig = (0, _webpackMerge.default)(pluginConfig, pluginModule);
  });
  (0, _debug.default)('plugin config: %s', (0, _utils.deepToString)(pluginConfig));
  return pluginConfig;
}