'use strict';

// test env.
var chai = require('chai');
var expect = chai.expect;

var env = require('../lib/env');
describe('test env read', function () {
    it('return null when env is not set', function () {
        expect(env.get('not_exists')).to.equal(null);
    });
    it('return the right env variable', function () {
        process.env.foo = 'bar';
        env.refresh();
        expect(env.get('foo')).to.equal('bar');
    });
    it('return default value', function () {
        expect(env.get('jimmy', 'young')).to.equal('young');
    });
    it('throw exception when force value', function () {
        var name = 'donotexists2';
        expect(
            function () {
                env.get(name, '', true);
            }).to.throw('config item ' + name + ' not found');
    });
});
