"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function getBaseConfig() {
  return {};
}

function getDependencies() {
  return [];
}

function getQuickConfig() {
  return {
    commandConfig: getBaseConfig(),
    defaultTitle: 'Web App'
  };
} // Vanilla JavaScript apps just use the default config for everything


var _default = args => ({
  getName: () => 'Web',
  getProjectDefaults: () => ({}),
  getProjectDependencies: getDependencies,
  getProjectQuestions: () => null,
  getBuildDependencies: getDependencies,
  getBuildConfig: getBaseConfig,
  getServeConfig: getBaseConfig,
  getQuickDependencies: getDependencies,
  getQuickBuildConfig: getQuickConfig,

  getQuickServeConfig() {
    // Reload on unaccepted HMR changes by default; disable with --no-reload
    if (args.reload !== false) {
      args.reload = true;
    }

    return getQuickConfig();
  },

  getKarmaTestConfig: getBaseConfig
});

exports.default = _default;
module.exports = exports.default;