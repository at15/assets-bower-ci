/**
 * Created by at15 on 15-2-24.
 */
var chai = require('chai');
var should = chai.Should();
var expect = chai.expect;

var config = require('../lib/config');
var parser = require('../lib/parser');


describe('load config json', function () {
    it('cant get the config when json fileHelper does not exist', function () {
        expect(config.loadConfigJson('dummy.json')).to.equal(false);
    });
    it('can read config when the json fileHelper exists', function () {
        expect(config.loadConfigJson(process.cwd() + '/assets.json')).to.equal(true);
    });
    it('can read config value', function () {
        expect(config.get('foo')).to.equal('bar');
    });
    it('read lib config', function () {
        var jq = config.getLib('jquery');
        expect(jq.name).to.equal('jquery');
    });
});

describe('share config between libs', function () {
    config.loadConfigJson('assets.json');
    it('share config in parser', function () {
        expect(parser.testConfig()).to.equal('bar');
    });
});