"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processNpmBuildConfig = processNpmBuildConfig;

var _chalk = _interopRequireDefault(require("chalk"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function processNpmBuildConfig({
  report,
  userConfig
}) {
  let {
    cjs,
    esModules,
    umd,
    ...unexpectedConfig
  } = userConfig.npm;
  let unexpectedProps = Object.keys(unexpectedConfig);

  if (unexpectedProps.length > 0) {
    report.error('npm', unexpectedProps.join(', '), `Unexpected prop${(0, _utils.pluralise)(unexpectedProps.length)} in ${_chalk.default.cyan('babel')} config - ` + 'see https://github.com/insin/nwb/blob/master/docs/Configuration.md#npm-build-configuration for supported config');
  } // cjs


  if ('cjs' in userConfig.npm) {
    if ((0, _utils.typeOf)(cjs) !== 'boolean') {
      report.error('npm.cjs', cjs, `Must be ${_chalk.default.cyan('Boolean')}`);
    }
  } // esModules


  if ('esModules' in userConfig.npm) {
    if ((0, _utils.typeOf)(esModules) !== 'boolean') {
      report.error('npm.esModules', esModules, `Must be ${_chalk.default.cyan('Boolean')}`);
    }
  } // umd


  if ('umd' in userConfig.npm) {
    if (umd === false) {// ok
    } else if ((0, _utils.typeOf)(umd) === 'string') {
      userConfig.npm.umd = {
        global: umd
      };
    } else if ((0, _utils.typeOf)(umd) !== 'object') {
      report.error('npm.umd', umd, `Must be a ${_chalk.default.cyan('String')} (for ${_chalk.default.cyan('global')} ` + `config only)}, an ${_chalk.default.cyan('Object')} (for any UMD build options) ` + `or ${_chalk.default.cyan('false')} (to explicitly disable the UMD build)`);
    } else {
      let {
        entry,
        global: umdGlobal,
        externals,
        ...unexpectedConfig
      } = umd;
      let unexpectedProps = Object.keys(unexpectedConfig);

      if (unexpectedProps.length > 0) {
        report.error('npm.umd', unexpectedProps.join(', '), `Unexpected prop${(0, _utils.pluralise)(unexpectedProps.length)} in ${_chalk.default.cyan('npm.umd')} config - ` + 'see https://github.com/insin/nwb/blob/master/docs/Configuration.md#umd-string--object for supported config');
      }

      if ('entry' in umd && (0, _utils.typeOf)(entry) !== 'string') {
        report.error('npm.umd.entry', entry, `Must be a ${_chalk.default.cyan('String')}`);
      }

      if ('global' in umd && (0, _utils.typeOf)(umdGlobal) !== 'string') {
        report.error('npm.umd.global', umdGlobal, `Must be a ${_chalk.default.cyan('String')}`);
      }

      if ('externals' in umd && (0, _utils.typeOf)(externals) !== 'object') {
        report.error('npm.umd.externals', externals, `Must be an ${_chalk.default.cyan('Object')}`);
      }
    }
  }
}