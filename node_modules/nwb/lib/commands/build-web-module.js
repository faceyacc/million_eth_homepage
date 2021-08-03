"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildModule;

var _moduleBuild = _interopRequireDefault(require("../moduleBuild"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a web module's ES5, ES modules and UMD builds.
 */
function buildModule(args, cb) {
  (0, _moduleBuild.default)(args, {
    babel: {
      runtime: {
        helpers: false
      }
    }
  }, cb);
}

module.exports = exports.default;