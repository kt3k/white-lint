'use strict'

var expect = require('chai').expect

var Promise = require('es6-promise').Promise

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

        it('overwrites indent, semi and parser', function () {

            var cmdOptions = {
                indent: 4,
                semi: false,
                parser: 'foo'
            }

            app.mergePackageOptionsToCommandOptions({
                indent: 2,
                semi: true,
                parser: 'bar'
            }, cmdOptions)

            expect(cmdOptions.indent).to.equal(2)
            expect(cmdOptions.semi).to.equal(true)
            expect(cmdOptions.parser).to.equal('bar')

        })

        it('merges globals', function () {

            var cmdOptions = {
                globals: ['a']
            }

            app.mergePackageOptionsToCommandOptions({
                globals: ['b', 'c']
            }, cmdOptions)

            expect(cmdOptions.globals).to.eql(['a', 'b', 'c'])

        })

        it('merges rules', function () {

            var cmdOptions = {
                rules: {
                    foo: 2,
                    bar: 2
                }
            }

            app.mergePackageOptionsToCommandOptions({
                rules: {
                    baz: 1,
                    spam: 1
                }
            }, cmdOptions)

            expect(cmdOptions.rules).to.eql({
                foo: 2,
                bar: 2,
                baz: 1,
                spam: 1
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

    describe('execute', function () {

        it('calls help when cliOptions have h', function (done) {

            app.help = done

            app.execute({h: true})

        })

        it('calls help when cliOptions have help', function (done) {

            app.help = done

            app.execute({help: true})

        })

        it('calls version when cliOptions have v', function (done) {

            app.version = done

            app.execute({v: true})

        })

        it('calls version when cliOptions have version', function (done) {

            app.version = done

            app.execute({version: true})

        })

        it('calls lint when cliOptions do not have h, v, help or version', function (done) {

            var cmdOptions = {}

            app.lint = function () {

                expect(cmdOptions).to.equal(cmdOptions)

                done()

            }

            app.execute({}, cmdOptions)

        })

    })

    describe('glob', function () {

        it('resolves an array of the filenames', function () {

            return app.glob().then(function (files) {

                expect(files).to.be.an('array')

            })

        })

    })

    describe('lint', function () {

        it('lints files', function () {

            app.glob = function () { return Promise.resolve([__filename]) }

            return app.lint({globals: ['it', 'describe', 'beforeEach']}).then(function (exitCode) {

                expect(exitCode).to.equal(0)

            })

        })

    })

})
