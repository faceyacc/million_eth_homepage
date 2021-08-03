#!/usr/bin/env node
"use strict";

var _chalk = require("chalk");

var _cli = _interopRequireDefault(require("../cli"));

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleError(error) {
  if (error instanceof _errors.UserError) {
    console.error((0, _chalk.red)(error.message));
  } else if (error instanceof _errors.ConfigValidationError) {
    error.report.log();
  } else if (error instanceof _errors.KarmaExitCodeError) {
    console.error((0, _chalk.red)(`Karma exit code was ${error.exitCode}`));
  } else {
    console.error((0, _chalk.red)(`Error running command: ${error.message}`));

    if (error.stack) {
      console.error(error.stack);
    }
  }

  process.exit(1);
}

try {
  (0, _cli.default)(process.argv.slice(2), err => {
    if (err) handleError(err);
    process.exit(0);
  });
} catch (e) {
  handleError(e);
}