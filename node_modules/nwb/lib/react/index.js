"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getBaseConfig() {
  return {
    babel: {
      presets: [// User-configurable, so handled by createBabelConfig
      'react']
    }
  };
}

function getBaseDependencies() {
  return ['react', 'react-dom'];
}

function getBuildConfig(args, options = {}) {
  let config = getBaseConfig();

  if (process.env.NODE_ENV === 'production') {
    // User-configurable, so handled by createBabelConfig
    config.babel.presets.push('react-prod');
  }

  let aliasPath = options.useModulePath ? _utils.modulePath : alias => alias;

  if (args.inferno || args['inferno-compat']) {
    config.resolve = {
      alias: {
        'react': aliasPath('inferno-compat'),
        'react-dom': aliasPath('inferno-compat')
      }
    };
  } else if (args.preact || args['preact-compat']) {
    let preactCompathPath = _path.default.join(aliasPath('preact'), 'compat');

    config.resolve = {
      alias: {
        'react': preactCompathPath,
        'react-dom/test-utils': _path.default.join(aliasPath('preact'), 'test-utils'),
        'react-dom': preactCompathPath
      }
    };
  }

  return config;
}

class ReactConfig {
  constructor(args) {
    this._args = void 0;

    this.getName = () => {
      if (/^build/.test(this._args._[0])) {
        return this._getCompatName();
      }

      return 'React';
    };

    this.getBuildDependencies = () => {
      return this._getCompatDependencies();
    };

    this.getBuildConfig = () => {
      return getBuildConfig(this._args);
    };

    this.getServeConfig = () => {
      let config = getBaseConfig();

      if (this._args.hmr !== false) {
        config.babel.plugins = [[require.resolve('react-refresh/babel'), {
          skipEnvCheck: Boolean(process.env.NWB_TEST)
        }]];
        config.plugins = {
          reactRefresh: true
        };
      }

      return config;
    };

    this.getQuickDependencies = () => {
      let deps = getBaseDependencies();

      if (/^build/.test(this._args._[0])) {
        deps = deps.concat(this._getCompatDependencies());
      }

      return deps;
    };

    this.getQuickBuildConfig = () => {
      return {
        commandConfig: getBuildConfig(this._args, {
          useModulePath: true
        }),
        ...this._getQuickConfig()
      };
    };

    this.getQuickServeConfig = () => {
      return {
        commandConfig: this.getServeConfig(),
        ...this._getQuickConfig()
      };
    };

    this._args = args;
  }

  _getCompatDependencies() {
    if (this._args.inferno || this._args['inferno-compat']) {
      return ['inferno', 'inferno-compat', 'inferno-clone-vnode', 'inferno-create-class', 'inferno-create-element'];
    } else if (this._args.preact || this._args['preact-compat']) {
      return ['preact'];
    }

    return [];
  }

  _getCompatName() {
    if (this._args.inferno || this._args['inferno-compat']) {
      return 'Inferno (React compat)';
    } else if (this._args.preact || this._args['preact-compat']) {
      return 'Preact (React compat)';
    }

    return 'React';
  }

  _getQuickConfig() {
    return {
      defaultTitle: `${this.getName()} App`,
      renderShim: require.resolve('./renderShim'),
      renderShimAliases: {
        'react': (0, _utils.modulePath)('react'),
        'react-dom': (0, _utils.modulePath)('react-dom')
      }
    };
  }

  getProjectDefaults() {
    return {};
  }

  getProjectDependencies() {
    return getBaseDependencies();
  }

  getProjectQuestions() {
    return null;
  }

  getKarmaTestConfig() {
    return getBaseConfig();
  }

}

var _default = args => new ReactConfig(args);

exports.default = _default;
module.exports = exports.default;