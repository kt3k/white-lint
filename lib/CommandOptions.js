'use strict'

var subclass = require('subclassjs')

var CommandOptions = subclass(function (pt) {

    pt.constructor = function (options) {

        this.options = options

    }

    /**
     * Gets the rules
     *
     * @return {Array}
     */
    pt.getRules = function () {

        var rules = {}

        // semicolons
        if (this.options.semi === true) { rules.semi = [2, 'always'] }
        if (this.options.semi === false) { rules.semi = [2, 'never'] }

        // indents
        if (typeof this.options.indent === 'number') {
            
            rules.indent = [2, this.options.indent, { SwitchCase: 1 }]

        }

        if (typeof this.options.indent === 'tab') {

            rules.indent = [2, 'tab', { SwitchCase: 1 }]

        }

        return rules

    }

    pt.getCLIEngineOptions = function () {

        return {
            baseConfig: this.options.eslintrc,
            rules: this.getRules()
        }

    }

})

module.exports = CommandOptions
