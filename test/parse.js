require('should');
var path = require('path');
var fh = require('../lib/file-helper');
var Parser = require('../lib/parse');

describe('parse.lib', function () {
    // read the config
    var config = fh.readJson('assets.json');
    var p1 = new Parser({
        dstFolder: 'site',
        dstLibFolder: 'site/assets/dist/lib',
        libConfigs: config.libs
    });
    it(' test jquery ', function () {
        var jq = p1.parseLib('jquery');
        jq.should.eql([path.resolve('site/assets/dist/lib/jquery/dist/jquery.js')]);
    });
    it(' test bootstrap ', function () {
        var bs = p1.parseLib('bootstrap');
        var bsFiles = [
            'site/assets/dist/lib/bootstrap/less/bootstrap.less',
            'site/assets/dist/lib/bootstrap/dist/css/bootstrap.css',
            'site/assets/dist/lib/bootstrap/dist/js/bootstrap.js',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.woff'
        ];
        var realBsFiles = [];
        bsFiles.forEach(function (b) {
            realBsFiles.push(path.resolve(b));
        });
        bs.should.eql(realBsFiles);
    });
    it('won\'t merge file twice', function () {
        var date_time = p1.parseLib('date-time');
        var dtFiles =
            [
                'site/assets/lib/date-time/bootstrap-datetimepicker.css',
                'site/assets/lib/date-time/bootstrap-datetimepicker.js',
                'site/assets/lib/date-time/moment.js'
            ];
        var realFiles = [];
        dtFiles.forEach(function (f) {
            realFiles.push((path.resolve(f)));
        });
        date_time.should.eql(realFiles);
    });
    it('can get dependencies', function () {
        var p2 = new Parser({
            dstFolder: 'site',
            dstLibFolder: 'site/assets/dist/lib',
            libConfigs: config.libs
        });
        var dtFiles = [
            'site/assets/dist/lib/jquery/dist/jquery.js',
            'site/assets/dist/lib/bootstrap/less/bootstrap.less',
            'site/assets/dist/lib/bootstrap/dist/css/bootstrap.css',
            'site/assets/dist/lib/bootstrap/dist/js/bootstrap.js',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
            'site/assets/lib/date-time/bootstrap-datetimepicker.css',
            'site/assets/lib/date-time/bootstrap-datetimepicker.js',
            'site/assets/lib/date-time/moment.js'
        ];
        var realFiles = [];
        dtFiles.forEach(function (f) {
            realFiles.push((path.resolve(f)));
        });
        p2.parseLib('date-time').should.eql(realFiles);
    });
    it('test group', function () {
        var p3 = new Parser({
            dstFolder: 'site',
            dstLibFolder:'site/assets/dist/lib',
            libConfigs: config.libs,
            groupConfigs: config.groups
        });
        var dtFiles = [
            'site/assets/dist/lib/jquery/dist/jquery.js',
            'site/assets/dist/lib/bootstrap/less/bootstrap.less',
            'site/assets/dist/lib/bootstrap/dist/css/bootstrap.css',
            'site/assets/dist/lib/bootstrap/dist/js/bootstrap.js',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
            'site/assets/dist/lib/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
            'run.js'
        ];
        var realFiles = [];
        dtFiles.forEach(function (f) {
            realFiles.push((path.resolve(f)));
        });
        p3.parseGroup('base').should.eql(realFiles);
    });
});
