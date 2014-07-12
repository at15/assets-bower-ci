require('should');
var file = require('../lib/file-helper');
var path = require('path');

describe('file.glob', function () {
    it('return empty when find nothing', function () {
        file.glob('*.lq').should.eql([]);
    });
    it('return sth when found sth', function () {
        var t = [
            path.resolve('test/glob/a.js'),
            path.resolve('test/glob/t.js')
        ];
        file.glob('test/glob/*.js').should.eql(t);
    });
    it('can split file', function () {
        file.split(file.glob('test/glob/*.*'),'css')
            .should.eql([path.resolve('test/glob/a.css')]);
    });
});

// TODO:test the cp .... how to test that....
// TODO