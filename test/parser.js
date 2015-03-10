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
    parser.init();

    it('parse jquery', function () {
        //console.log(parser.getAllLibs());
        expect(parser.getLib('jquery')[0]).to.equal(
            path.resolve('site/assets/lib/jquery/jquery.js')
        );
    });

    it('load jquery for bootstrap', function () {
        expect(parser.getLib('bootstrap')[0]).to.equal(
            path.resolve('site/assets/lib/jquery/jquery.js')
        );
    });
});