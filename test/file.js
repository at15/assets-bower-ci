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
//    it('return -1 when can\'t find element', function () {
//        arr.inArray(a, 10086).should.eql(-1);
//    });
});

// TODO:test the cp .... how to test that....
// TODO