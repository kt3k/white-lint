var expect = require('chai').expect

var CommandOptions = require('../lib/CommandOptions')

var cmdOptions

describe('CommandOptions', function () {

    beforeEach(function () {

        cmdOptions = new CommandOptions({
            eslintrc: {
                foo: 'bar'
            },
            globals: ['$'],
            parser: 'spam-parser',
            indent: 'tab',
            semi: true
        })

    })

    describe('getRules', function () {

        it('returns semi rule if semi property is set', function () {

            expect(new CommandOptions({semi: true}).getRules().semi).to.eql([2, 'always'])
            expect(new CommandOptions({semi: false}).getRules().semi).to.eql([2, 'never'])
            expect(new CommandOptions({semi: undefined}).getRules().semi).to.be.undefined

        })

        it('returns indent rule if indent property is set', function () {

            expect(new CommandOptions({indent: 2}).getRules().indent).to.eql([2, 2, { SwitchCase: 1 }])
            expect(new CommandOptions({indent: 4}).getRules().indent).to.eql([2, 4, { SwitchCase: 1 }])
            expect(new CommandOptions({indent: 'tab'}).getRules().indent).to.eql([2, 'tab', { SwitchCase: 1 }])

        })

    })

    describe('getCLIEngineOptions', function () {

        it('gets the options for the cli engine', function () {

            var options = cmdOptions.getCLIEngineOptions()

            expect(options.baseConfig).to.eql({foo: 'bar'})
            expect(options.parser).to.equal('spam-parser')
            expect(options.globals).to.eql(['$'])
            expect(options.rules).to.eql({
                indent: [2, 'tab', { SwitchCase: 1 }],
                semi: [2, 'always']
            })

        })

    })

})
