"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_BROWSERS_PROD = exports.DEFAULT_BROWSERS_DEV = exports.PROJECT_TYPES = exports.WEB_MODULE = exports.WEB_APP = exports.REACT_COMPONENT = exports.REACT_APP = exports.PREACT_APP = exports.INFERNO_APP = exports.DEFAULT_PORT = exports.CONFIG_FILE_NAME = void 0;
const CONFIG_FILE_NAME = 'nwb.config.js';
exports.CONFIG_FILE_NAME = CONFIG_FILE_NAME;
const DEFAULT_PORT = process.env.PORT || 3000;
exports.DEFAULT_PORT = DEFAULT_PORT;
const INFERNO_APP = 'inferno-app';
exports.INFERNO_APP = INFERNO_APP;
const PREACT_APP = 'preact-app';
exports.PREACT_APP = PREACT_APP;
const REACT_APP = 'react-app';
exports.REACT_APP = REACT_APP;
const REACT_COMPONENT = 'react-component';
exports.REACT_COMPONENT = REACT_COMPONENT;
const WEB_APP = 'web-app';
exports.WEB_APP = WEB_APP;
const WEB_MODULE = 'web-module';
exports.WEB_MODULE = WEB_MODULE;
const PROJECT_TYPES = new Set([INFERNO_APP, PREACT_APP, REACT_APP, REACT_COMPONENT, WEB_APP, WEB_MODULE]);
exports.PROJECT_TYPES = PROJECT_TYPES;
const DEFAULT_BROWSERS_DEV = 'last 1 chrome version, last 1 firefox version, last 1 safari version';
exports.DEFAULT_BROWSERS_DEV = DEFAULT_BROWSERS_DEV;
const DEFAULT_BROWSERS_PROD = '>0.2%, not dead, not op_mini all';
exports.DEFAULT_BROWSERS_PROD = DEFAULT_BROWSERS_PROD;