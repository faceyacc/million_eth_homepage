"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serve;

var _config = require("../config");

var _constants = require("../constants");

var _errors = require("../errors");

var _serveInfernoApp = _interopRequireDefault(require("./serve-inferno-app"));

var _servePreactApp = _interopRequireDefault(require("./serve-preact-app"));

var _serveReactApp = _interopRequireDefault(require("./serve-react-app"));

var _serveReactDemo = _interopRequireDefault(require("./serve-react-demo"));

var _serveWebApp = _interopRequireDefault(require("./serve-web-app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SERVE_COMMANDS = {
  [_constants.INFERNO_APP]: _serveInfernoApp.default,
  [_constants.PREACT_APP]: _servePreactApp.default,
  [_constants.REACT_APP]: _serveReactApp.default,
  [_constants.REACT_COMPONENT]: _serveReactDemo.default,
  [_constants.WEB_APP]: _serveWebApp.default
};
/**
 * Generic serve command, invokes the appropriate project type-specific command.
 */

function serve(args, cb) {
  let projectType;

  try {
    projectType = (0, _config.getProjectType)(args);
  } catch (e) {
    return cb(e);
  }

  if (!SERVE_COMMANDS[projectType]) {
    return cb(new _errors.UserError(`Unable to serve anything for a ${projectType} project.`));
  }

  SERVE_COMMANDS[projectType](args, cb);
}

module.exports = exports.default;