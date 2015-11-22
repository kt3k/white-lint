var subclass = require('subclassjs')

var Application = require('./lib/Application')

/**
 * The white lint module interface.
 *
 * @class
 */
var WhiteLint = subclass(function (pt) {

    /**
     * @param {Object} options The options
     * @param {String} options.cmdName The command name
     * @param {String} options.version The version name
     * @param {String} options.cmdOptions The command default options
     */
    pt.constructor = function (options) {

        if (!(this instanceof WhiteLint)) {

            return new WhiteLint(options)

        }

        this.brutus = require('brutus')({
            name: options.cmdName,
            version: options.version,
            options: options.cmdOptions,
            delegate: new Application(options)
        })

    }

    /**
     * Lints as an API.
     */
    pt.lint = function () {

        this.brutus.exec()

    }

    /**
     * Lints as an CLI.
     */
    pt.lintAsCli = function () {

        this.brutus.execAsCli()

    }

})

module.exports = WhiteLint
