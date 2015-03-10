/**
 * Created by at15 on 15-2-24.
 */
var chai = require('chai');
var should = chai.Should();
var expect = chai.expect;

var config = require('../lib/config');

describe('change config', function () {
    var Mgr = require('../index');
    var mgr = new Mgr('assets.json');
    it('get the config from json', function () {
        mgr.config('libpath').should.eql('site/assets/dist/lib');
    });
    it('change on the fly', function () {
        mgr.setConfigValue('libpath', 'dummypath');
        mgr.config('libpath').should.eql('dummypath');
    });
});

describe('load config json', function () {
    it('cant get the config when json file does not exist', function () {
        expect(config.loadConfigJson('dummy.json')).to.equal(false);
    });
    it('can read config when the json file exists', function () {
        expect(config.loadConfigJson(process.cwd() + '/assets.json')).to.equal(true);
    });
});