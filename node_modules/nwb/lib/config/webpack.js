"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processWebpackConfig = processWebpackConfig;
exports.prepareWebpackRuleConfig = prepareWebpackRuleConfig;
exports.prepareWebpackStyleConfig = prepareWebpackStyleConfig;

var _chalk = _interopRequireDefault(require("chalk"));

var _constants = require("../constants");

var _createWebpackConfig = require("../createWebpackConfig");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_STYLE_LOADERS = new Set(['css', 'postcss']);
let warnedAboutAutoPrefixerString = false;

function processWebpackConfig({
  pluginConfig,
  report,
  userConfig
}) {
  let {
    aliases,
    autoprefixer,
    compat,
    copy,
    debug,
    define,
    extractCSS,
    html,
    install,
    publicPath,
    rules,
    styles,
    terser,
    extra,
    config,
    ...unexpectedConfig
  } = userConfig.webpack;
  let unexpectedProps = Object.keys(unexpectedConfig);

  if (unexpectedProps.length > 0) {
    report.error('webpack', unexpectedProps.join(', '), `Unexpected prop${(0, _utils.pluralise)(unexpectedProps.length)} in ${_chalk.default.cyan('webpack')} config - ` + 'see https://github.com/insin/nwb/blob/master/docs/Configuration.md#webpack-configuration for supported config. ' + `If you were trying to add extra Webpack config, try putting it in ${_chalk.default.cyan('webpack.extra')} instead`);
  } // aliases


  if ('aliases' in userConfig.webpack) {
    if ((0, _utils.typeOf)(aliases) !== 'object') {
      report.error('webpack.aliases', `type: ${(0, _utils.typeOf)(aliases)}`, `Must be an ${_chalk.default.cyan('Object')}`);
    } else {
      checkForRedundantCompatAliases(userConfig.type, aliases, 'webpack.aliases', report);
    }
  } // autoprefixer


  if ('autoprefixer' in userConfig.webpack) {
    // TODO Deprecated - remove
    if ((0, _utils.typeOf)(autoprefixer) === 'string') {
      if (!warnedAboutAutoPrefixerString) {
        report.deprecated('webpack.autoprefixer as a String', 'Replaced by top-level "browsers" config in nwb v0.25.0 - webpack.autoprefixer can no longer be a String');
        warnedAboutAutoPrefixerString = true;
      }

      userConfig.webpack.autoprefixer = {};
    } else if ((0, _utils.typeOf)(autoprefixer) !== 'object') {
      report.error('webpack.autoprefixer', `type: ${(0, _utils.typeOf)(autoprefixer)}`, `Must be an ${_chalk.default.cyan('Object')}`);
    }
  } // compat


  if ('compat' in userConfig.webpack) {
    if ((0, _utils.typeOf)(compat) !== 'object') {
      report.error('webpack.compat', `type: ${(0, _utils.typeOf)(compat)}`, `Must be an ${_chalk.default.cyan('Object')}`);
    } else {
      // Validate compat props
      let compatProps = Object.keys(compat);
      let unexpectedCompatProps = compatProps.filter(prop => !(prop in _createWebpackConfig.COMPAT_CONFIGS));

      if (unexpectedCompatProps.length > 0) {
        report.error('webpack.compat', unexpectedCompatProps.join(', '), `Unexpected prop${(0, _utils.pluralise)(unexpectedCompatProps.length)} in ${_chalk.default.cyan('webpack.compat')}. ` + `Valid props are: ${(0, _utils.joinAnd)(Object.keys(_createWebpackConfig.COMPAT_CONFIGS).map(p => _chalk.default.cyan(p)), 'or')}`);
      }

      void ['intl', 'moment', 'react-intl'].forEach(compatProp => {
        if (!(compatProp in compat)) return;
        let config = compat[compatProp];
        let configType = (0, _utils.typeOf)(config);

        if (configType === 'string') {
          compat[compatProp] = {
            locales: [config]
          };
        } else if (configType === 'array') {
          compat[compatProp] = {
            locales: config
          };
        } else if (configType === 'object') {
          if ((0, _utils.typeOf)(config.locales) === 'string') {
            config.locales = [config.locales];
          } else if ((0, _utils.typeOf)(config.locales) !== 'array') {
            report.error(`webpack.compat.${compatProp}.locales`, config.locales, `Must be a ${_chalk.default.cyan('String')} (single locale name) or an ${_chalk.default.cyan('Array')} of locales`);
          }
        } else {
          report.error(`webpack.compat.${compatProp}`, `type: ${configType}`, `Must be a ${_chalk.default.cyan('String')} (single locale name), an ${_chalk.default.cyan('Array')} ` + `of locales or an ${_chalk.default.cyan('Object')} with a ${_chalk.default.cyan('locales')} property - ` + 'see https://github.com/insin/nwb/blob/master/docs/Configuration.md#compat-object ');
        }
      });
    }
  } // copy


  if ('copy' in userConfig.webpack) {
    if ((0, _utils.typeOf)(copy) === 'array') {
      userConfig.webpack.copy = {
        patterns: copy
      };
    } else if ((0, _utils.typeOf)(copy) === 'object') {
      if (!copy.patterns && !copy.options) {
        report.error('webpack.copy', copy, `Must include ${_chalk.default.cyan('patterns')} or ${_chalk.default.cyan('options')}`);
      }

      if (copy.patterns && (0, _utils.typeOf)(copy.patterns) !== 'array') {
        report.error('webpack.copy.patterns', copy.patterns, `Must be an ${_chalk.default.cyan('Array')}`);
      }

      if (copy.options && (0, _utils.typeOf)(copy.options) !== 'object') {
        report.error('webpack.copy.options', copy.options, `Must be an ${_chalk.default.cyan('Object')}`);
      }
    } else {
      report.error('webpack.copy', copy, `Must be an ${_chalk.default.cyan('Array')} or an ${_chalk.default.cyan('Object')}`);
    }
  } // debug


  if (debug) {
    // Make it harder for the user to forget to disable the production debug build
    // if they've enabled it in the config file.
    report.hint('webpack.debug', "Don't forget to disable the debug build before building for production");
  } // define


  if ('define' in userConfig.webpack) {
    if ((0, _utils.typeOf)(define) !== 'object') {
      report.error('webpack.define', `type: ${(0, _utils.typeOf)(define)}`, `Must be an ${_chalk.default.cyan('Object')}`);
    }
  } // extractCSS


  if ('extractCSS' in userConfig.webpack) {
    let configType = (0, _utils.typeOf)(extractCSS);
    let help = `Must be ${_chalk.default.cyan('false')} (to disable CSS extraction) or ` + `an ${_chalk.default.cyan('Object')} (to configure MiniCssExtractPlugin)`;

    if (configType === 'boolean') {
      if (extractCSS !== false) {
        report.error('webpack.extractCSS', extractCSS, help);
      }
    } else if (configType !== 'object') {
      report.error('webpack.extractCSS', `type: ${configType}`, help);
    }
  } // html


  if ('html' in userConfig.webpack) {
    if ((0, _utils.typeOf)(html) !== 'object') {
      report.error('webpack.html', `type: ${(0, _utils.typeOf)(html)}`, `Must be an ${_chalk.default.cyan('Object')}`);
    }
  } // install


  if ('install' in userConfig.webpack) {
    if ((0, _utils.typeOf)(install) !== 'object') {
      report.error('webpack.install', `type: ${(0, _utils.typeOf)(install)}`, `Must be an ${_chalk.default.cyan('Object')}`);
    }
  } // publicPath


  if ('publicPath' in userConfig.webpack) {
    if ((0, _utils.typeOf)(publicPath) !== 'string') {
      report.error('webpack.publicPath', `type: ${(0, _utils.typeOf)(publicPath)}`, `Must be a ${_chalk.default.cyan('String')}`);
    }
  } // rules


  if ('rules' in userConfig.webpack) {
    if ((0, _utils.typeOf)(rules) !== 'object') {
      report.error('webpack.rules', `type: ${(0, _utils.typeOf)(rules)}`, `Must be an ${_chalk.default.cyan('Object')}`);
    } else {
      let error = false;
      Object.keys(rules).forEach(ruleId => {
        let rule = rules[ruleId];

        if (rule.use && (0, _utils.typeOf)(rule.use) !== 'array') {
          report.error(`webpack.rules.${ruleId}.use`, `type: ${(0, _utils.typeOf)(rule.use)}`, `Must be an ${_chalk.default.cyan('Array')}`);
          error = true;
        }
      });

      if (!error) {
        prepareWebpackRuleConfig(rules);
      }
    }
  } // styles


  if ('styles' in userConfig.webpack) {
    let configType = (0, _utils.typeOf)(styles);
    let help = `Must be an ${_chalk.default.cyan('Object')} (to configure custom style rules) ` + `or ${_chalk.default.cyan('false')} (to disable style rules)`;

    if (configType === 'boolean' && styles !== false) {
      report.error('webpack.styles', styles, help);
    } else if (configType !== 'object' && configType !== 'boolean') {
      report.error('webpack.styles', `type: ${configType}`, help);
    } else {
      let styleTypeIds = ['css'];

      if (pluginConfig.cssPreprocessors) {
        styleTypeIds = styleTypeIds.concat(Object.keys(pluginConfig.cssPreprocessors));
      }

      let error = false;
      Object.keys(styles).forEach(styleType => {
        if (styleTypeIds.indexOf(styleType) === -1) {
          report.error('webpack.styles', `property: ${styleType}`, `Unknown style type - must be ${(0, _utils.joinAnd)(styleTypeIds.map(s => _chalk.default.cyan(s)), 'or')}`);
          error = true;
        } else if ((0, _utils.typeOf)(styles[styleType]) !== 'array') {
          report.error(`webpack.styles.${styleType}`, `type: ${(0, _utils.typeOf)(styles[styleType])}`, `Must be an ${_chalk.default.cyan('Array')} - if you don't need multiple custom rules, ` + `configure the defaults via ${_chalk.default.cyan('webpack.rules')} instead`);
          error = true;
        } else {
          styles[styleType].forEach((styleConfig, index) => {
            let {
              test,
              include,
              exclude,
              // eslint-disable-line no-unused-vars
              ...loaderConfig
            } = styleConfig;
            Object.keys(loaderConfig).forEach(loaderId => {
              if (!DEFAULT_STYLE_LOADERS.has(loaderId) && loaderId !== styleType) {
                // XXX Assumption: preprocessors provide a single loader which is configured with the same id as the style type id
                let loaderIds = Array.from(new Set([...Array.from(DEFAULT_STYLE_LOADERS), styleType])).map(id => _chalk.default.cyan(id));
                report.error(`webpack.styles.${styleType}[${index}]`, `property: ${loaderId}`, `Must be ${_chalk.default.cyan('include')}, ${_chalk.default.cyan('exclude')} or a loader id: ${(0, _utils.joinAnd)(loaderIds, 'or')}`);
                error = true;
              }
            });
          });
        }
      });

      if (!error) {
        prepareWebpackStyleConfig(styles);
      }
    }
  } // terser


  if ('terser' in userConfig.webpack) {
    if (terser !== false && (0, _utils.typeOf)(terser) !== 'object') {
      report.error(`webpack.terser`, terser, `Must be ${_chalk.default.cyan('false')} (to disable terser-webpack-plugin) or ` + `an ${_chalk.default.cyan('Object')} (to configure terser-webpack-plugin)`);
    }
  } // extra


  if ('extra' in userConfig.webpack) {
    if ((0, _utils.typeOf)(extra) !== 'object') {
      report.error('webpack.extra', `type: ${(0, _utils.typeOf)(extra)}`, `Must be an ${_chalk.default.cyan('Object')}`);
    } else {
      if ((0, _utils.typeOf)(extra.output) === 'object' && extra.output.publicPath) {
        report.hint('webpack.extra.output.publicPath', `You can use the more convenient ${_chalk.default.cyan('webpack.publicPath')} config instead`);
      }

      if ((0, _utils.typeOf)(extra.resolve) === 'object' && extra.resolve.alias) {
        report.hint('webpack.extra.resolve.alias', `You can use the more convenient ${_chalk.default.cyan('webpack.aliases')} config instead`);
        checkForRedundantCompatAliases(userConfig.type, extra.resolve.alias, 'webpack.extra.resolve.alias', report);
      }
    }
  } // config


  if ('config' in userConfig.webpack && (0, _utils.typeOf)(config) !== 'function') {
    report.error(`webpack.config`, `type: ${(0, _utils.typeOf)(config)}`, `Must be a ${_chalk.default.cyan('Function')}`);
  }
}
/**
 * Tell the user if they've manually set up the same React compatibility aliases
 * nwb configured by default.
 */


function checkForRedundantCompatAliases(projectType, aliases, configPath, report) {
  if (!new Set([_constants.INFERNO_APP, _constants.PREACT_APP]).has(projectType)) return;
  let compatModule = `${projectType.split('-')[0]}-compat`;

  if (aliases.react && aliases.react.includes(compatModule)) {
    report.hint(`${configPath}.react`, `nwb aliases ${_chalk.default.yellow('react')} to ${_chalk.default.cyan(compatModule)} by default, so you can remove this config`);
  }

  if (aliases['react-dom'] && aliases['react-dom'].includes(compatModule)) {
    report.hint(`${configPath}.react-dom`, `nwb aliases ${_chalk.default.yellow('react-dom')} to ${_chalk.default.cyan(compatModule)} by default, so you can remove this config`);
  }
}
/**
 * Move loader options into an options object, allowing users to provide flatter
 * config.
 */


function prepareWebpackRuleConfig(rules) {
  Object.keys(rules).forEach(ruleId => {
    let rule = rules[ruleId]; // XXX Special case for stylus-loader, which uses a 'use' option for plugins

    if (rule.use && !/stylus$/.test(ruleId) || rule.options) return;
    let {
      exclude,
      include,
      test,
      loader,
      // eslint-disable-line no-unused-vars
      ...options
    } = rule;

    if (Object.keys(options).length > 0) {
      rule.options = options;
      Object.keys(options).forEach(prop => delete rule[prop]);
    }
  });
}
/**
 * Move loader options into a loaders object, allowing users to provide flatter
 * config.
 */


function prepareWebpackStyleConfig(styles) {
  Object.keys(styles).forEach(type => {
    styles[type].forEach(styleConfig => {
      let {
        exclude,
        include,
        // eslint-disable-line no-unused-vars
        ...loaderConfig
      } = styleConfig;

      if (Object.keys(loaderConfig).length > 0) {
        styleConfig.loaders = {};
        Object.keys(loaderConfig).forEach(loader => {
          styleConfig.loaders[loader] = {
            options: styleConfig[loader]
          };
          delete styleConfig[loader];
        });
      }
    });
  });
}