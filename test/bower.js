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
});

describe('bower-helper.copy', function () {
    it('return empty when copy nothing', function () {
        var pkg = bower.read('phpmyadmin');
        bower.copy(pkg, 'site/lib').should.eql([]);
    });
    it('copy jquery', function () {
        var pkg = bower.read('jquery');
        bower.copy(pkg,'site/lib').should.eql([path.resolve('site/lib/jquery/dist/jquery.js')]);
    });
});