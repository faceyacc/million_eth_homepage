"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

function getBaseConfig() {
  return {
    babel: {
      presets: [require.resolve('./preact-preset')]
    },
    // Allow compatible React components to be used
    resolve: {
      alias: {
        'react': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat'
      }
    }
  };
}

function getDependencies() {
  return ['preact'];
}

function getQuickConfig() {
  return {
    commandConfig: getBaseConfig(),
    defaultTitle: 'Preact App',
    renderShim: require.resolve('./renderShim'),
    renderShimAliases: {
      'preact': (0, _utils.modulePath)('preact')
    }
  };
}

var _default = args => ({
  getName: () => 'Preact',

  getProjectDefaults() {
    return {};
  },

  getProjectDependencies() {
    return getDependencies();
  },

  getProjectQuestions() {
    return null;
  },

  getBuildDependencies: () => [],
  getBuildConfig: getBaseConfig,
  getServeConfig: getBaseConfig,
  getQuickDependencies: () => getDependencies(),
  getQuickBuildConfig: getQuickConfig,
  getQuickServeConfig: getQuickConfig,
  getKarmaTestConfig: getBaseConfig
});

exports.default = _default;
module.exports = exports.default;