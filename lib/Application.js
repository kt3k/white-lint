'use strict'

var subclass = require('subclassjs')
var deglob = require('deglob')
var eslint = require('eslint')
var Promise = require('es6-promise').Promise

var CommandOptions = require('./CommandOptions')

var JS_PATTERNS = [
    '**/*.js',
    '**/*.jsx'
]

var IGNORE_PATTERNS = [
    '**/*.min.js',
    '**/bundle.js',
    'coverage/**',
    'node_modules/**',
    'vendor/**'
]

/**
 * The main application class of white-lint.
 *
 * This class implements brutus' CommandDelegate interface.
 */
var Application = subclass(function (pt) {

    /**
     * @param {Object} options The options
     * @param {String} options.cmdName The command name
     * @param {String} options.version The version name
     */
    pt.constructor = function (options) {

        this.options = options

    }

    /**
     * @param {Object} cliOptions The user's cli options
     * @param {Object} pkgOptions The command's package options
     */
    pt.mergeCliOptionsToPackageOptions = function (cliOptions, pkgOptions) {

        if (cliOptions.parser) { pkgOptions.parser = cliOptions.parser }
        if (cliOptions[2]) { pkgOptions.indent = 2 }
        if (cliOptions[4]) { pkgOptions.indent = 4 }
        if (cliOptions.tab) { pkgOptions.indent = 'tab' }
        if (cliOptions.semi === true) { pkgOptions.semi = true }
        if (cliOptions.semi === false) { pkgOptions.semi = false }

        pkgOptions.globals = pkgOptions.globals || []

        if (cliOptions.global) {

            pkgOptions.globals = pkgOptions.globals.concat(cliOptions.global)

        }

    }

    /**
     * @param {Object} pkgOptions The user's package options
     * @param {Object} cmdOptions The command's default options
     */
    pt.mergePackageOptionsToCommandOptions = function (pkgOptions, cmdOptions) {

        if (pkgOptions.indent) { cmdOptions.indent = pkgOptions.indent }
        if (pkgOptions.semi) { cmdOptions.semi = pkgOptions.semi }
        if (pkgOptions.parser) { cmdOptions.parser = pkgOptions.parser }

        cmdOptions.globals = cmdOptions.globals || []

        if (pkgOptions.globals) {

            cmdOptions.globals = cmdOptions.globals.concat(pkgOptions.globals)

        }

        cmdOptions.rules = cmdOptions.rules || {}

        if (pkgOptions.rules) {

            Object.keys(pkgOptions.rules).forEach(function (key) {

                cmdOptions.rules[key] = pkgOptions.rules[key]

            })

        }

    }

    /**
     * @param {Object} cliOptions The user's cli options
     * @param {Object} cmdOptions The command options which the cli and package options are merged in
     * @return {Number|Promise<Number>}
     */
    pt.execute = function (cliOptions, cmdOptions) {

        if (cliOptions.v || cliOptions.version) {

            return this.version()

        }

        if (cliOptions.h || cliOptions.help) {

            return this.help()

        }

        if (cliOptions._ && cliOptions._.length > 0) {

            return this.lintFiles(cliOptions._, cmdOptions)

        }

        return this.lintAll(cmdOptions)

    }

    /**
     * Shows the help.
     *
     * @return {Number}
     */
    pt.help = function () {

        console.log('' +
            'Usage:\n' +
            '    %s <flags> [FILES...]\n' +
            '\n' +
            '    If FILES is omitted, then all JavaScript source files (*.js, *.jsx) in the current\n' +
            '    working directory are checked, recursively.\n' +
            '\n' +
            '    Certain paths (node_modules/, .git/, coverage/, *.min.js, bundle.js) are\n' +
            '    automatically ignored.\n' +
            '\n' +
            'Flags:\n' +
            '        --global    Declare global variable (can be set multiple times)\n' +
            '        --parser    Use custom js parser (e.g. babel-eslint)\n' +
            '    -2, --2         Use 2 space indent\n' +
            '    -4, --4         Use 4 space indent\n' +
            '        --tab       Use tab indent\n' +
            '        --semi      Use semicolon\n' +
            '        --no-semi   Don\'t use semicolon\n' +
            '    -h, --help      Show usage information\n' +
            '    -v, --version   Show current version\n', this.options.cmdName)

        return 0

    }

    /**
     * Shows the version number.
     *
     * @return {Number}
     */
    pt.version = function () {

        console.log(this.options.cmdName + ' ' + this.options.version)

        return 0

    }

    /**
     * Globs files with the app options.
     *
     * @return {Promise<String[]>}
     */
    pt.glob = function () {

        var deglobOpts = {
            ignore: IGNORE_PATTERNS,
            useGitIgnore: true,
            usePackageJson: true,
            configKey: this.options.cmdName
        }

        return new Promise(function (resolve, reject) {

            deglob(JS_PATTERNS, deglobOpts, function (err, files) {

                err && reject(err) || resolve(files)

            })

        })

    }

    /**
     * Lints the all files
     *
     * @param {Object} cmdOptions
     * @return {Promise<Number>}
     */
    pt.lintAll = function (cmdOptions) {

        var self = this

        return this.glob().then(function (files) {

            return self.lintFiles(files, cmdOptions)

        })

    }

    /**
     * @param {String[]} files The files
     * @param {Object} cmdOptions The command options.
     * @return {Number}
     */
    pt.lintFiles = function (files, cmdOptions) {

        var result = new eslint.CLIEngine(new CommandOptions(cmdOptions).getCLIEngineOptions()).executeOnFiles(files)

        if (result.errorCount === 0) {

            return 0

        }

        // report lint errors
        console.log(eslint.CLIEngine.getFormatter()(result.results))

        return 1

    }

})

module.exports = Application
