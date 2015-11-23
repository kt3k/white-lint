'use strict'

var subclass = require('subclassjs')
var multiline = require('multiline')
var deglob = require('deglob')
var eslint = require('eslint')

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
        if (cliOptions.semi) { pkgOptions.semi = true }
        if (cliOptions.noSemi) { pkgOptions.semi = false }

    }

    /**
     * @param {Object} pkgOptions The user's package options
     * @param {Object} cmdOptions The command's default options
     */
    pt.mergePackageOptionsToCommandOptions = function (pkgOptions, cmdOptions) {

        if (pkgOptions.indent) { cmdOptions.indent = pkgOptions.indent }
        if (pkgOptions.semi) { cmdOptions.semi = pkgOptions.semi }
        if (pkgOptions.parser) { cmdOptions.parser = pkgOptions.parser }
        if (pkgOptions.global) { cmdOptions.globals = pkgOptions.global }
        if (pkgOptions.globals) { cmdOptions.globals = pkgOptions.globals }
        if (pkgOptions.rules) { cmdOptions.rules = pkgOptions.rules }

    }

    /**
     * @param {Object} cliOptions The user's cli options
     * @param {Object} cmdOptions The command options which the cli and package options are merged in
     */
    pt.execute = function (cliOptions, cmdOptions) {

        if (cliOptions.version) {

            return this.version()

        }

        if (cliOptions.h || cliOptions.help) {

            return this.help()

        }

        return this.lint(cmdOptions)

    }

    pt.help = function () {

        console.log(multiline.stripIndent(function () { /*
            Usage:
                %s <flags> [FILES...]

                If FILES is omitted, then all JavaScript source files (*.js, *.jsx) in the current
                working directory are checked, recursively.

                Certain paths (node_modules/, .git/, coverage/, *.min.js, bundle.js) are
                automatically ignored.

            Flags:
                    --global    Declare global variable
                    --parser    Use custom js parser (e.g. babel-eslint)
                    --indent    Specify indent size
                    --semi      Enforce semicolon
                    --no-semi   Enforce no semicolon
                -h, --help      Show usage information
                    --version   Show current version
        */ }), this.options.cmdName)

        return 0

    }

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
     * Lints the files
     *
     * @param {Object} cmdOptions
     * @return {Promise<Number>}
     */
    pt.lint = function (cmdOptions) {

        return this.glob().then(function (files) {

            var result = new eslint.CLIEngine(new CommandOptions(cmdOptions).getCLIEngineOptions()).executeOnFiles(files)

            // report lint errors
            console.log(eslint.CLIEngine.getFormatter()(result.results))

            // return exit code
            return result.errorCount > 0 ? 1 : 0

        })

    }

})

module.exports = Application
