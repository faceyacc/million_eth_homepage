"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = test;

var _config = require("../config");

var _constants = require("../constants");

var _karmaServer = _interopRequireDefault(require("../karmaServer"));

var _testInferno = _interopRequireDefault(require("./test-inferno"));

var _testPreact = _interopRequireDefault(require("./test-preact"));

var _testReact = _interopRequireDefault(require("./test-react"));

var _testReactComponent = _interopRequireDefault(require("./test-react-component"));

var _testWebModule = _interopRequireDefault(require("./test-web-module"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TEST_COMMANDS = {
  [_constants.INFERNO_APP]: _testInferno.default,
  [_constants.PREACT_APP]: _testPreact.default,
  [_constants.REACT_APP]: _testReact.default,
  [_constants.REACT_COMPONENT]: _testReactComponent.default,
  [_constants.WEB_MODULE]: _testWebModule.default
};
/**
 * Generic test command, invokes the appropriate project type-specific command,
 * or runs with the default test config.
 */

function test(args, cb) {
  let projectType;

  try {
    projectType = (0, _config.getProjectType)(args);
  } catch (e) {// pass
  }

  if (projectType && TEST_COMMANDS[projectType]) {
    TEST_COMMANDS[projectType](args, cb);
  } else {
    (0, _karmaServer.default)(args, {}, cb);
  }
}

module.exports = exports.default;