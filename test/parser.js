/**
 * Created by at15 on 15-3-10.
 */
var chai = require('chai');
var expect = chai.expect;
var path = require('path');

var config = require('../lib/config');
var parser = require('../lib/parser');

describe('parse lib', function () {
    config.loadConfigJson('assets.json');
    it('parse jquery', function () {
        parser.init();
        expect(parser.getLib('jquery')[0]).to.equal(
            path.resolve('site/assets/lib/jquery/jquery.js')
        );
    })
});