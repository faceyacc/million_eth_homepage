"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = new_;

var _path = _interopRequireDefault(require("path"));

var _constants = require("../constants");

var _createProject = _interopRequireWildcard(require("../createProject"));

var _errors = require("../errors");

var _utils = require("../utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function new_(args, cb) {
  if (args._.length === 1) {
    return cb(new _errors.UserError(`usage: nwb new [${Array.from(_constants.PROJECT_TYPES).join('|')}] <name>`));
  }

  let projectType = args._[1];

  try {
    (0, _createProject.validateProjectType)(projectType);
  } catch (e) {
    return cb(e);
  }

  let name = args._[2];

  if (!name) {
    return cb(new _errors.UserError('A project name must be provided'));
  }

  if ((0, _utils.directoryExists)(name)) {
    return cb(new _errors.UserError(`A ${name}/ directory already exists`));
  }

  let targetDir = _path.default.resolve(name);

  let initialVowel = /^[aeiou]/.test(projectType);
  console.log(`Creating ${initialVowel ? 'an' : 'a'} ${projectType} project...`);
  (0, _createProject.default)(args, projectType, name, targetDir, cb);
}

module.exports = exports.default;