"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _resolve = _interopRequireDefault(require("resolve"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getBaseConfig() {
  let config = {
    babel: {
      presets: [require.resolve('./inferno-preset')]
    },
    // Allow compatible React components to be used
    resolve: {
      alias: {
        'react': 'inferno-compat',
        'react-dom': 'inferno-compat'
      }
    }
  }; // Inferno's default module build is the production version - use the
  // development version for development and testing.

  if (process.env.NODE_ENV !== 'production') {
    config.resolve.alias['inferno'] = _resolve.default.sync('inferno/dist/index.dev.esm.js', {
      basedir: process.cwd()
    });
  }

  return config;
}

function getDependencies() {
  return ['inferno'];
}

function getCompatDependencies() {
  return ['inferno-compat', 'inferno-clone-vnode', 'inferno-create-class', 'inferno-create-element'];
}

function getQuickConfig() {
  return {
    commandConfig: getBaseConfig(),
    defaultTitle: 'Inferno App',
    renderShim: require.resolve('./renderShim'),
    renderShimAliases: {
      'inferno': (0, _utils.modulePath)('inferno')
    }
  };
}

var _default = args => ({
  getName: () => 'Inferno',

  getProjectDefaults() {
    return {
      compat: false
    };
  },

  getProjectDependencies(answers) {
    let deps = getDependencies();

    if (answers.compat) {
      deps = deps.concat(getCompatDependencies());
    }

    return deps;
  },

  getProjectQuestions() {
    let defaults = this.getProjectDefaults();
    return [{
      when: () => !('compat' in args),
      type: 'confirm',
      name: 'compat',
      message: 'Do you want to use inferno-compat so you can use React modules?',
      default: defaults.compat
    }];
  },

  getBuildDependencies: () => [],
  getBuildConfig: getBaseConfig,
  getServeConfig: getBaseConfig,
  getQuickDependencies: () => getDependencies().concat(getCompatDependencies()),
  getQuickBuildConfig: getQuickConfig,
  getQuickServeConfig: getQuickConfig,
  getKarmaTestConfig: getBaseConfig
});

exports.default = _default;
module.exports = exports.default;