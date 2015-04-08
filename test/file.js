var chai = require('chai');
var should = chai.Should();
var expect = chai.expect;
var fileHelper = require('../lib/file-helper');
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
// TODO:test the cp .... how to test that....