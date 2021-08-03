"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processBabelConfig = processBabelConfig;

var _babelPresetProposals = require("babel-preset-proposals");

var _chalk = _interopRequireDefault(require("chalk"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function processBabelConfig({
  report,
  userConfig
}) {
  let {
    cherryPick,
    env,
    loose,
    plugins,
    presets,
    proposals,
    removePropTypes,
    react,
    reactConstantElements,
    runtime,
    config,
    ...unexpectedConfig
  } = userConfig.babel;
  let unexpectedProps = Object.keys(unexpectedConfig);

  if (unexpectedProps.length > 0) {
    report.error('babel', unexpectedProps.join(', '), `Unexpected prop${(0, _utils.pluralise)(unexpectedProps.length)} in ${_chalk.default.cyan('babel')} config - ` + 'see https://github.com/insin/nwb/blob/master/docs/Configuration.md#babel-configuration for supported config');
  } // cherryPick


  if ('cherryPick' in userConfig.babel) {
    if ((0, _utils.typeOf)(cherryPick) !== 'string' && (0, _utils.typeOf)(cherryPick) !== 'array') {
      report.error('babel.cherryPick', cherryPick, `Must be a ${_chalk.default.cyan('String')} or an ${_chalk.default.cyan('Array')}`);
    }
  } // env


  if ('env' in userConfig.babel) {
    if ((0, _utils.typeOf)(env) !== 'object') {
      report.error('babel.env', env, `Must be an ${_chalk.default.cyan('Object')}`);
    }
  } // loose


  if ('loose' in userConfig.babel) {
    if ((0, _utils.typeOf)(loose) !== 'boolean') {
      report.error('babel.loose', loose, `Must be ${_chalk.default.cyan('Boolean')}`);
    }
  } // plugins


  if ('plugins' in userConfig.babel) {
    if ((0, _utils.typeOf)(plugins) === 'string') {
      userConfig.babel.plugins = [plugins];
    } else if ((0, _utils.typeOf)(userConfig.babel.plugins) !== 'array') {
      report.error('babel.plugins', plugins, `Must be a ${_chalk.default.cyan('String')} or an ${_chalk.default.cyan('Array')}`);
    }
  } // presets


  if ('presets' in userConfig.babel) {
    if ((0, _utils.typeOf)(presets) === 'string') {
      userConfig.babel.presets = [presets];
    } else if ((0, _utils.typeOf)(presets) !== 'array') {
      report.error('babel.presets', presets, `Must be a ${_chalk.default.cyan('String')} or an ${_chalk.default.cyan('Array')}`);
    }
  } // proposals


  if ('proposals' in userConfig.babel) {
    if ((0, _utils.typeOf)(proposals) === 'object') {
      let errors = (0, _babelPresetProposals.validateOptions)(proposals);

      if (errors.length) {
        report.error('babel.proposals', null, errors.join('\n'));
      }
    } else if (proposals !== false) {
      report.error('babel.proposals', proposals, `Must be an ${_chalk.default.cyan('Object')} (to configure proposal plugins) or ` + `${_chalk.default.cyan('false')} (to disable use of proposal plugins)`);
    }
  } // removePropTypes


  if ('removePropTypes' in userConfig.babel) {
    if (removePropTypes !== false && (0, _utils.typeOf)(removePropTypes) !== 'object') {
      report.error(`babel.removePropTypes`, removePropTypes, `Must be ${_chalk.default.cyan('false')} (to disable removal of PropTypes) ` + `or an ${_chalk.default.cyan('Object')} (to configure react-remove-prop-types)`);
    }
  } // react


  if ('react' in userConfig.babel) {
    if ((0, _utils.typeOf)(react) === 'string') {
      userConfig.babel.react = {
        runtime: react
      };
    } else if ((0, _utils.typeOf)(react) !== 'object') {
      report.error(`babel.react`, react, `Must be an ${_chalk.default.cyan('Object')} (to configure @babel/preset-react options) ` + `or a ${_chalk.default.cyan('String')} (to configure @babel/preset-react's runtime option)`);
    }
  } // reactConstantElements


  if ('reactConstantElements' in userConfig.babel) {
    if ((0, _utils.typeOf)(reactConstantElements) !== 'boolean') {
      report.error('babel.reactConstantElements', reactConstantElements, `Must be ${_chalk.default.cyan('Boolean')}`);
    }
  } // runtime


  if ('runtime' in userConfig.babel) {
    if ((0, _utils.typeOf)(runtime) !== 'object' && runtime !== false) {
      report.error('babel.runtime', runtime, `Must be an ${_chalk.default.cyan('Object')} (to configure transform-runtime options) or ` + `${_chalk.default.cyan('false')} (to disable use of the runtime-transform plugin)`);
    }
  } // config


  if ('config' in userConfig.babel && (0, _utils.typeOf)(config) !== 'function') {
    report.error(`babel.config`, `type: ${(0, _utils.typeOf)(config)}`, `Must be a ${_chalk.default.cyan('Function')}`);
  }
}