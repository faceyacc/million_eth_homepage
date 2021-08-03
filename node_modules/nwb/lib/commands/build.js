"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = build;

var _config = require("../config");

var _constants = require("../constants");

var _buildInfernoApp = _interopRequireDefault(require("./build-inferno-app"));

var _buildPreactApp = _interopRequireDefault(require("./build-preact-app"));

var _buildReactApp = _interopRequireDefault(require("./build-react-app"));

var _buildReactComponent = _interopRequireDefault(require("./build-react-component"));

var _buildWebApp = _interopRequireDefault(require("./build-web-app"));

var _buildWebModule = _interopRequireDefault(require("./build-web-module"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BUILD_COMMANDS = {
  [_constants.INFERNO_APP]: _buildInfernoApp.default,
  [_constants.PREACT_APP]: _buildPreactApp.default,
  [_constants.REACT_APP]: _buildReactApp.default,
  [_constants.REACT_COMPONENT]: _buildReactComponent.default,
  [_constants.WEB_APP]: _buildWebApp.default,
  [_constants.WEB_MODULE]: _buildWebModule.default
};
/**
 * Generic build command, invokes the appropriate project type-specific command.
 */

function build(args, cb) {
  let projectType;

  try {
    projectType = (0, _config.getProjectType)(args);
  } catch (e) {
    return cb(e);
  }

  BUILD_COMMANDS[projectType](args, cb);
}

module.exports = exports.default;