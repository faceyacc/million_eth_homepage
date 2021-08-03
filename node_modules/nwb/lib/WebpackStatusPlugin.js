"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _utils = require("./utils");

var _webpackUtils = require("./webpackUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Display build status for a Webpack watching build.
 */
class StatusPlugin {
  constructor(options = {}) {
    this.disableClearConsole = void 0;
    this.quiet = void 0;
    this.successMessage = void 0;
    this.isInitialBuild = void 0;

    this.watchRun = (compiler, cb) => {
      this.clearConsole();

      if (this.isInitialBuild) {
        this.log(_chalk.default.cyan('Starting Webpack compilation...'));
        this.isInitialBuild = false;
      } else {
        this.log('Recompiling...');
      }

      cb();
    };

    this.done = stats => {
      this.clearConsole();
      let hasErrors = stats.hasErrors();
      let hasWarnings = stats.hasWarnings();

      if (!hasErrors && !hasWarnings) {
        let time = stats.endTime - stats.startTime;
        this.log(_chalk.default.green(`Compiled successfully in ${time} ms.`));
      } else {
        (0, _webpackUtils.logErrorsAndWarnings)(stats);
        if (hasErrors) return;
      }

      if (this.successMessage) {
        this.log('');
        this.log(this.successMessage);
      }
    };

    let {
      disableClearConsole = false,
      quiet = false,
      successMessage = ''
    } = options;
    this.disableClearConsole = disableClearConsole;
    this.quiet = quiet;
    this.successMessage = successMessage; // We only want to display the "Starting..." message once

    this.isInitialBuild = true;
  }

  apply(compiler) {
    compiler.hooks.watchRun.tapAsync('StatusPlugin', this.watchRun);
    compiler.hooks.done.tap('StatusPlugin', this.done);
  }

  clearConsole() {
    if (!this.quiet && !this.disableClearConsole) {
      (0, _utils.clearConsole)();
    }
  }

  log(message) {
    if (!this.quiet) {
      console.log(message);
    }
  }

}

exports.default = StatusPlugin;
module.exports = exports.default;