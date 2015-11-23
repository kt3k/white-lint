'use strict'

var expect = require('chai').expect

var Application = require('../lib/Application')
var app

describe('Application', function () {

    beforeEach(function () {

        app = new Application({})

    })

    describe('mergeCliOptionsToPackageOptions', function () {

        it('merges global options correctly', function () {

            var cliOptions = {global: '$'}
            var pkgOptions = {}

            app.mergeCliOptionsToPackageOptions(cliOptions, pkgOptions)

            expect(pkgOptions.globals).to.eql(['$'])

            cliOptions = {global: ['util', 'App']}

            app.mergeCliOptionsToPackageOptions(cliOptions, pkgOptions)

            expect(pkgOptions.globals).to.eql(['$', 'util', 'App'])

        })

        it('merges indent options correctly', function () {

            var cliOptions = {2: true}
            var pkgOptions = {}

            app.mergeCliOptionsToPackageOptions(cliOptions, pkgOptions)

            expect(pkgOptions.indent).to.equal(2)

            cliOptions = {4: true}

            app.mergeCliOptionsToPackageOptions(cliOptions, pkgOptions)

            expect(pkgOptions.indent).to.equal(4)

            cliOptions = {tab: true}

            app.mergeCliOptionsToPackageOptions(cliOptions, pkgOptions)

            expect(pkgOptions.indent).to.equal('tab')

        })

        it('merges parser info', function () {

            var pkgOptions = {}

            app.mergeCliOptionsToPackageOptions({parser: 'foo'}, pkgOptions)

            expect(pkgOptions.parser).to.equal('foo')

        })

        it('merges semicolon info', function () {

            var pkgOptions = {}

            app.mergeCliOptionsToPackageOptions({semi: true}, pkgOptions)

            expect(pkgOptions.semi).to.be.true

            app.mergeCliOptionsToPackageOptions({semi: false}, pkgOptions)

            expect(pkgOptions.semi).to.be.false

        })

    })

    describe('mergePackageOptionsToCommandOptions', function () {

        it('merges indent, semi, parser, globals and rules', function () {

            var cmdOptions = {}

            app.mergePackageOptionsToCommandOptions({
                indent: 2,
                semi: true,
                parser: 'babel-eslint',
                globals: ['$'],
                rules: {
                    foo: 2
                }
            }, cmdOptions)

            expect(cmdOptions).to.eql({
                indent: 2,
                semi: true,
                parser: 'babel-eslint',
                globals: ['$'],
                rules: {
                    foo: 2
                }
            })

        })

    })

    describe('version', function () {

        it('returns 0', function () {

            expect(app.version()).to.equal(0)

        })

    })

    describe('help', function () {

        it('returns 0', function () {

            expect(app.help()).to.equal(0)

        })

    })

})
