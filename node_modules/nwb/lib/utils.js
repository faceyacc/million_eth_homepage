"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clean = clean;
exports.clearConsole = clearConsole;
exports.deepToString = deepToString;
exports.directoryExists = directoryExists;
exports.getArgsPlugins = getArgsPlugins;
exports.install = install;
exports.joinAnd = joinAnd;
exports.modulePath = modulePath;
exports.padLines = padLines;
exports.pluralise = pluralise;
exports.toSource = toSource;
exports.typeOf = typeOf;
exports.unique = unique;
exports.formatPackageName = formatPackageName;
exports.replaceArrayMerge = void 0;

var _path = _interopRequireDefault(require("path"));

var _util = _interopRequireDefault(require("util"));

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _ora = _interopRequireDefault(require("ora"));

var _resolve = _interopRequireDefault(require("resolve"));

var _runSeries = _interopRequireDefault(require("run-series"));

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _debug = _interopRequireDefault(require("./debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check if the given directories exist and filter out any which don't.
 */
function checkDirectories(dirs, cb) {
  (0, _runSeries.default)(dirs.map(dir => cb => _fsExtra.default.stat(dir, (err, stats) => {
    if (err) return cb(err.code === 'ENOENT' ? null : err);
    cb(null, stats.isDirectory() ? dir : null);
  })), (err, dirs) => {
    if (err) return cb(err);
    cb(null, dirs.filter(dir => dir != null));
  });
}
/**
 * If any of the given directories exist, display a spinner and delete them.
 */


function clean( // A description of what's being cleaned, e.g. 'app'
desc, // Paths to delete
dirs, cb) {
  checkDirectories(dirs, (err, dirs) => {
    if (err != null) return cb(err);
    if (dirs == null || dirs.length === 0) return cb();
    let spinner = (0, _ora.default)(`Cleaning ${desc}`).start();
    (0, _runSeries.default)(dirs.map(dir => cb => _fsExtra.default.remove(dir, cb)), err => {
      if (err) {
        spinner.fail();
        return cb(err);
      }

      spinner.succeed();
      cb();
    });
  });
}
/**
 * Clear console scrollback.
 */


function clearConsole() {
  // Hack for testing
  if (process.env.NWB_TEST) return; // This will completely wipe scrollback in cmd.exe on Windows - use cmd.exe's
  // `start` command to launch nwb's dev server in a new prompt if you don't
  // want to lose it.

  process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
}
/**
 * Log objects in their entirety so we can see everything in debug output.
 */


function deepToString(object) {
  return _util.default.inspect(object, {
    colors: true,
    depth: null
  });
}
/**
 * Check if a directory exists.
 */


function directoryExists(dir) {
  try {
    return _fsExtra.default.statSync(dir).isDirectory();
  } catch (e) {
    return false;
  }
}
/**
 * Get a list of nwb plugin names passed as arguments.
 */


function getArgsPlugins(args) {
  let plugins = args.plugins || args.plugin;
  if (!plugins) return [];
  return plugins.split(',').map(name => name.replace(/^(nwb-)?/, 'nwb-'));
}

/**
 * Install packages from npm.
 */
function install( // npm package names, which may be in package@version format
packages, options, cb) {
  let {
    args = null,
    check = false,
    cwd = process.cwd(),
    dev = false,
    save = false
  } = options; // If the command being run allows users to specify an nwb plugins option by
  // providing the args object here, make sure they're installed.

  if (args) {
    packages = packages.concat(getArgsPlugins(args));
  }

  if (check) {
    packages = packages.filter(pkg => {
      // Assumption: we're not dealing with scoped packages, which start with @
      let name = pkg.split('@')[0];

      try {
        _resolve.default.sync(name, {
          basedir: cwd
        });

        return false;
      } catch (e) {
        return true;
      }
    });
  }

  if (packages.length === 0) {
    return process.nextTick(cb);
  }

  let npmArgs = ['install', '--silent', '--no-progress', '--no-package-lock'];

  if (save) {
    npmArgs.push(`--save${dev ? '-dev' : ''}`);
  }

  npmArgs = npmArgs.concat(packages);
  (0, _debug.default)(`${cwd} $ npm ${npmArgs.join(' ')}`);
  let spinner = (0, _ora.default)(`Installing ${joinAnd(packages)}`).start();
  let npm = (0, _crossSpawn.default)('npm', npmArgs, {
    cwd,
    stdio: ['ignore', 'pipe', 'inherit']
  });
  npm.on('close', code => {
    if (code !== 0) {
      spinner.fail();
      return cb(new Error('npm install failed'));
    }

    spinner.succeed();
    cb();
  });
}
/**
 * Join multiple items with a penultimate "and".
 */


function joinAnd(array, lastClause = 'and') {
  if (array.length === 0) return '';
  if (array.length === 1) return String(array[0]);
  return `${array.slice(0, -1).join(', ')} ${lastClause} ${array[array.length - 1]}`;
}
/**
 * Get the path to an npm module.
 */


function modulePath(module, basedir = process.cwd()) {
  return _path.default.dirname(_resolve.default.sync(`${module}/package.json`, {
    basedir
  }));
}

function padLines(message, padding = '  ') {
  return message.split('\n').map(line => `${padding}${line}`).join('\n');
}

function pluralise(count, suffixes = ',s') {
  return suffixes.split(',')[count === 1 ? 0 : 1];
}
/**
 * Custom merge which replaces arrays instead of concatenating them.
 */


const replaceArrayMerge = (0, _webpackMerge.default)({
  customizeArray(a, b, key) {
    return b;
  }

});
/**
 * Hack to generate simple config file contents by stringifying to JSON, but
 * without JSON formatting.
 */

exports.replaceArrayMerge = replaceArrayMerge;

function toSource(obj) {
  return JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");
}
/**
 * Better typeof.
 */


function typeOf(o) {
  if (Number.isNaN(o)) return 'nan';
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}
/**
 * @param {Array<string>} strings
 */


function unique(strings) {
  // eslint-disable-next-line
  return Object.keys(strings.reduce((o, s) => (o[s] = true, o), {}));
}
/**
 * Removes npm package scope from package name
 */


function formatPackageName(name) {
  const scopedPackageRegex = new RegExp(`^@[a-z0-9][\\w-.]+/[a-z0-9][\\w-.]*`, 'i');

  if (scopedPackageRegex.test(name)) {
    return name.split('/')[1];
  }

  return name;
}