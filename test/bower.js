require('should');
var bower = require('../lib/bower-helper');
var path = require('path');

describe('bower-helper.read', function () {
    it('return empty when find nothing', function () {
        var pkg = bower.read('phpmyadmin');
        pkg.name.should.eql('phpmyadmin');
        pkg.files.should.eql([]);
    });
    it('find jquery', function () {
        var pkg = bower.read('jquery');
        pkg.name.should.eql('jquery');
        var jqjs = path.resolve('bower_components/jquery/dist/jquery.js');
        pkg.files.should.eql([jqjs]);
        pkg.files.length.should.eql(1);
    });
//    it('return sth when found sth', function () {
//        var t = [
//            path.resolve('test/glob/a.js'),
//            path.resolve('test/glob/t.js')
//        ];
//        file.glob('test/glob/*.js').should.eql(t);
//    });
});