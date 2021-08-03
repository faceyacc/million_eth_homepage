"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clean;

var _config = require("../config");

var _constants = require("../constants");

var _cleanApp = _interopRequireDefault(require("./clean-app"));

var _cleanModule = _interopRequireDefault(require("./clean-module"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CLEAN_COMMANDS = {
  [_constants.INFERNO_APP]: _cleanApp.default,
  [_constants.PREACT_APP]: _cleanApp.default,
  [_constants.REACT_APP]: _cleanApp.default,
  [_constants.REACT_COMPONENT]: _cleanModule.default,
  [_constants.WEB_APP]: _cleanApp.default,
  [_constants.WEB_MODULE]: _cleanModule.default
};
/**
 * Generic clean command, invokes the appropriate project type-specific command.
 */

function clean(args, cb) {
  let projectType;

  try {
    projectType = (0, _config.getProjectType)(args);
  } catch (e) {
    return cb(e);
  }

  CLEAN_COMMANDS[projectType](args, cb);
}

module.exports = exports.default;