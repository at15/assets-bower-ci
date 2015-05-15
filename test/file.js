'use strict';

var chai = require('chai');
var expect = chai.expect;
/* eslint-disable */
var should = chai.Should();
/* eslint-enable */
var fileHelper = require('../lib/file-helper');
var fs = require('fs');
var path = require('path');

describe('fileHelper.glob', function () {
    it('return empty when find nothing', function () {
        fileHelper.glob('*.lq').should.eql([]);
    });
    it('return sth when found sth', function () {
        var t = [
            path.resolve('test/glob/a.js'),
            path.resolve('test/glob/t.js')
        ];
        fileHelper.glob('test/glob/*.js').should.eql(t);
    });
    it('can split fileHelper', function () {
        fileHelper.split(fileHelper.glob('test/glob/*.*'), 'css')
            .should.eql([path.resolve('test/glob/a.css')]);
    });
});

describe('fileHelper.dfs', function () {
    it('return all files in one folder', function () {
        var f = fileHelper.dfs('test/glob');
        var r = [
            'a.css',
            'a.js',
            't/t.js',
            't.js'
        ];
        r = r.map(function (t) {
            return 'test/glob/' + t;
        });
        expect(f).to.eql(r);
    });
});

describe('fileHelper.writeWithHash', function () {
    // hash for test/glob/t.js is b45beb2dd9fbb534b9bdeb13d21c0bae
    it('write file with hash tag', function () {
        var dst = fileHelper.writeWithHash('test/min/t', fs.readFileSync('test/glob/t.js'), 'min.js');
        expect(dst).to.eql('test/min/t-b45beb2dd9fbb534b9bdeb13d21c0bae.min.js');
    });
    it('ok for extension has dot ', function () {
        var dst = fileHelper.writeWithHash('test/min/t2', fs.readFileSync('test/glob/t.js'), '.min.js');
        expect(dst).to.eql('test/min/t2-b45beb2dd9fbb534b9bdeb13d21c0bae.min.js');
    });
});

// TODO:test the cp .... how to test that...., remove file and test if file exist
