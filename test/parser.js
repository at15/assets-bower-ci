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

describe('parse group', function () {
    config.loadConfigJson('assets.json');
    parser.init();

    it('parse group base', function () {
        expect(parser.getGroup('base')[0]).to.equal(
            path.resolve('site/assets/lib/jquery/jquery.js')
        );
        expect(parser.getGroup('base')[1]).to.equal(
            path.resolve('site/assets/lib/bootstrap/css/bootstrap.css')
        );
    });
});

describe('parse page', function () {
    config.loadConfigJson('assets.json');
    parser.init();

    it('parse page act', function () {
        expect(parser.getPage('act')[0]).to.equal(
            path.resolve('site/assets/lib/jquery/jquery.js')
        );
    })
});