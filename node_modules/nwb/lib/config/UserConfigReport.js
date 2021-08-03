"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(require("util"));

var _chalk = _interopRequireDefault(require("chalk"));

var _figures = _interopRequireDefault(require("figures"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserConfigReport {
  constructor({
    configFileExists,
    configPath
  } = {}) {
    this.configFileExists = configFileExists;
    this.configPath = configPath;
    this.deprecations = [];
    this.errors = [];
    this.hints = [];
    this.hasArgumentOverrides = false;
  }

  deprecated(path, ...messages) {
    this.deprecations.push({
      path,
      messages
    });
  }

  error(path, value, ...messages) {
    this.errors.push({
      path,
      value,
      message: messages.join('\n')
    });
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  hasSomethingToReport() {
    return this.errors.length + this.deprecations.length + this.hints.length > 0;
  }

  hint(path, ...messages) {
    this.hints.push({
      path,
      messages
    });
  }

  getConfigSource() {
    if (this.configFileExists) {
      let description = this.configPath;

      if (this.hasArgumentOverrides) {
        description += ' (with CLI argument overrides)';
      }

      return description;
    } else if (this.hasArgumentOverrides) {
      return 'config via CLI arguments';
    }

    return 'funsies';
  }

  getReport() {
    let report = [];
    report.push(_chalk.default.underline(`nwb config report for ${this.getConfigSource()}`));
    report.push('');

    if (!this.hasSomethingToReport()) {
      report.push(_chalk.default.green(`${_figures.default.tick} Nothing to report!`));
      return report.join('\n');
    }

    if (this.errors.length) {
      let count = this.errors.length > 1 ? `${this.errors.length} ` : '';
      report.push(_chalk.default.red.underline(`${count}Error${(0, _utils.pluralise)(this.errors.length)}`));
      report.push('');
    }

    this.errors.forEach(({
      path,
      value,
      message
    }) => {
      report.push(`${_chalk.default.red(`${_figures.default.cross} ${path}`)}${value ? ` ${_chalk.default.cyan('=')} ${_util.default.inspect(value)}` : ''}`);
      report.push((0, _utils.padLines)(message));
      report.push('');
    });

    if (this.deprecations.length) {
      let count = this.deprecations.length > 1 ? `${this.deprecations.length} ` : '';
      report.push(_chalk.default.yellow.underline(`${count}Deprecation Warning${(0, _utils.pluralise)(this.deprecations.length)}`));
      report.push('');
    }

    this.deprecations.forEach(({
      path,
      messages
    }) => {
      report.push(_chalk.default.yellow(`${_figures.default.warning} ${path}`));
      messages.forEach(message => {
        report.push(`  ${message}`);
      });
      report.push('');
    });

    if (this.hints.length) {
      let count = this.hints.length > 1 ? `${this.hints.length} ` : '';
      report.push(_chalk.default.cyan.underline(`${count}Hint${(0, _utils.pluralise)(this.hints.length)}`));
      report.push('');
    }

    this.hints.forEach(({
      path,
      messages
    }) => {
      report.push(_chalk.default.cyan(`${_figures.default.info} ${path}`));
      messages.forEach(message => {
        report.push(`  ${message}`);
      });
      report.push('');
    });
    return report.join('\n');
  }

  log() {
    console.log(this.getReport());
  }

}

exports.default = UserConfigReport;
module.exports = exports.default;