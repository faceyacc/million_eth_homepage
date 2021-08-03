"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserConfig = getUserConfig;
exports.getProjectType = getProjectType;
exports.processUserConfig = processUserConfig;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _chalk = _interopRequireDefault(require("chalk"));

var _webpack2 = _interopRequireDefault(require("webpack"));

var _constants = require("../constants");

var _debug = _interopRequireDefault(require("../debug"));

var _errors = require("../errors");

var _utils = require("../utils");

var _babel = require("./babel");

var _karma = require("./karma");

var _npm = require("./npm");

var _UserConfigReport = _interopRequireDefault(require("./UserConfigReport"));

var _webpack3 = require("./webpack");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_REQUIRED = false;
/**
 * Load a user config file and process it.
 */

function getUserConfig(args = {}, options = {}) {
  let {
    check = false,
    pluginConfig = {},
    // eslint-disable-line no-unused-vars
    required = DEFAULT_REQUIRED
  } = options; // Try to load default user config, or use a config file path we were given

  let userConfig = {};

  let configPath = _path.default.resolve(args.config || _constants.CONFIG_FILE_NAME); // Bail early if a config file is required by the current command, or if the
  // user specified a custom location, and it doesn't exist.


  let configFileExists = _fs.default.existsSync(configPath);

  if ((args.config || required) && !configFileExists) {
    throw new Error(`Couldn't find a config file at ${configPath}`);
  } // If a config file exists, it should be a valid module regardless of whether
  // or not it's required.


  if (configFileExists) {
    try {
      userConfig = require(configPath);
      (0, _debug.default)('imported config module from %s', configPath); // Delete the config file from the require cache as some builds need to
      // import it multiple times with a different NODE_ENV in place.

      delete require.cache[configPath];
    } catch (e) {
      throw new Error(`Couldn't import the config file at ${configPath}: ${e.message}\n${e.stack}`);
    }
  }

  userConfig = processUserConfig({
    args,
    check,
    configFileExists,
    configPath,
    pluginConfig,
    required,
    userConfig
  });

  if (configFileExists) {
    userConfig.path = configPath;
  }

  return userConfig;
}
/**
 * Load a user config file to get its project type. If we need to check the
 * project type, a config file must exist.
 */


function getProjectType(args = {}) {
  // Try to load default user config, or use a config file path we were given
  let userConfig = {};

  let configPath = _path.default.resolve(args.config || _constants.CONFIG_FILE_NAME); // Bail early if a config file doesn't exist


  let configFileExists = _fs.default.existsSync(configPath);

  if (!configFileExists) {
    throw new Error(`Couldn't find a config file at ${configPath} to determine project type.`);
  }

  try {
    userConfig = require(configPath); // Delete the file from the require cache as it may be imported multiple
    // times with a different NODE_ENV in place depending on the command.

    delete require.cache[configPath];
  } catch (e) {
    throw new Error(`Couldn't import the config file at ${configPath}: ${e.message}\n${e.stack}`);
  } // Config modules can export a function if they need to access the current
  // command or the webpack dependency nwb manages for them.


  if ((0, _utils.typeOf)(userConfig) === 'function') {
    userConfig = userConfig({
      args,
      command: args._[0],
      webpack: _webpack2.default
    });
  }

  let report = new _UserConfigReport.default({
    configFileExists,
    configPath
  });

  if (!_constants.PROJECT_TYPES.has(userConfig.type)) {
    report.error('type', userConfig.type, `Must be one of: ${(0, _utils.joinAnd)(Array.from(_constants.PROJECT_TYPES), 'or')}`);
  }

  if (report.hasErrors()) {
    throw new _errors.ConfigValidationError(report);
  }

  return userConfig.type;
}

let warnedAboutPolyfillConfig = false;
/**
 * Validate user config and perform any supported transformations to it.
 */

function processUserConfig({
  args = {},
  check = false,
  configFileExists,
  configPath,
  pluginConfig = {},
  required = DEFAULT_REQUIRED,
  userConfig
}) {
  // Config modules can export a function if they need to access the current
  // command or the webpack dependency nwb manages for them.
  if ((0, _utils.typeOf)(userConfig) === 'function') {
    userConfig = userConfig({
      args,
      command: args._[0],
      webpack: _webpack2.default
    });
  }

  let report = new _UserConfigReport.default({
    configFileExists,
    configPath
  });
  let {
    type,
    browsers,
    // TODO Deprecated - remove
    polyfill,
    babel,
    devServer,
    karma,
    npm,
    webpack: _webpack,
    // eslint-disable-line no-unused-vars
    ...unexpectedConfig
  } = userConfig;
  let unexpectedProps = Object.keys(unexpectedConfig);

  if (unexpectedProps.length > 0) {
    report.error('nwb config', unexpectedProps.join(', '), `Unexpected top-level prop${(0, _utils.pluralise)(unexpectedProps.length)} in nwb config - ` + 'see https://github.com/insin/nwb/blob/master/docs/Configuration.md for supported config');
  }

  if ((required || 'type' in userConfig) && !_constants.PROJECT_TYPES.has(type)) {
    report.error('type', userConfig.type, `Must be one of: ${(0, _utils.joinAnd)(Array.from(_constants.PROJECT_TYPES), 'or')}`);
  }

  if ('browsers' in userConfig) {
    if ((0, _utils.typeOf)(browsers) === 'string' || (0, _utils.typeOf)(browsers) === 'array') {
      userConfig.browsers = {
        development: browsers,
        production: browsers
      };
    } else if ((0, _utils.typeOf)(browsers) === 'object') {
      if (!browsers.hasOwnProperty('development') && !browsers.hasOwnProperty('production')) {
        report.hint('browsers', `You provided ${_chalk.default.cyan('browsers')} config but didn't provide ${_chalk.default.cyan('development')} or ${_chalk.default.cyan('production')} settings`);
      }
    } else {
      report.error('browsers', `type: ${(0, _utils.typeOf)(browsers)}`, `Must be a ${_chalk.default.cyan('String')}, ${_chalk.default.cyan('Array')} or ${_chalk.default.cyan('Object')}`);
    }
  } // TODO Deprecated - remove


  if ('polyfill' in userConfig) {
    if (!warnedAboutPolyfillConfig) {
      report.deprecated('polyfill', 'Default polyfills were removed in nwb v0.25.0, so polyfill config is no longer supported');
      warnedAboutPolyfillConfig = true;
    }
  }

  let argumentOverrides = {};
  void ['babel', 'devServer', 'karma', 'npm', 'webpack'].forEach(prop => {
    // Set defaults for top-level config objects so we don't have to
    // existence-check them everywhere.
    if (!(prop in userConfig)) {
      userConfig[prop] = {};
    } else if ((0, _utils.typeOf)(userConfig[prop]) !== 'object') {
      report.error(prop, `type: ${(0, _utils.typeOf)(userConfig[prop])}`, `${_chalk.default.cyan(prop)} config must be an ${_chalk.default.cyan('Object')} `); // Set a valid default so further checks can continue

      userConfig[prop] = {};
    } // Allow config overrides via --path.to.config in args


    if ((0, _utils.typeOf)(args[prop]) === 'object') {
      argumentOverrides[prop] = args[prop];
    }
  });

  if (Object.keys(argumentOverrides).length > 0) {
    (0, _debug.default)('user config arguments: %s', (0, _utils.deepToString)(argumentOverrides));
    userConfig = (0, _utils.replaceArrayMerge)(userConfig, argumentOverrides);
    report.hasArgumentOverrides = true;
  }

  (0, _babel.processBabelConfig)({
    report,
    userConfig
  });
  (0, _karma.processKarmaConfig)({
    report,
    userConfig
  });
  (0, _npm.processNpmBuildConfig)({
    report,
    userConfig
  });
  (0, _webpack3.processWebpackConfig)({
    pluginConfig,
    report,
    userConfig
  });

  if (report.hasErrors()) {
    throw new _errors.ConfigValidationError(report);
  }

  if (check) {
    throw report;
  }

  if (report.hasSomethingToReport()) {
    report.log();
  }

  (0, _debug.default)('user config: %s', (0, _utils.deepToString)(userConfig));
  return userConfig;
}