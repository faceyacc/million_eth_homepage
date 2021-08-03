"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigValidationError = exports.KarmaExitCodeError = exports.UserError = void 0;

/**
 * An error related to user input or configuration, or anything else the user is
 * responsible for and can fix.
 */
class UserError extends Error {}

exports.UserError = UserError;

class KarmaExitCodeError {
  constructor(exitCode) {
    this.exitCode = void 0;
    this.exitCode = exitCode;
  }

}

exports.KarmaExitCodeError = KarmaExitCodeError;

class ConfigValidationError {
  constructor(report) {
    this.report = void 0;
    this.report = report;
  }

}

exports.ConfigValidationError = ConfigValidationError;