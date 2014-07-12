require('should');
var path = require('path');
var fh = require('../lib/file-helper');
var Parser = require('../lib/parse');

describe('parse.lib', function () {
    // read the config
    var config = fh.readJson('assets.json');
    var p1 = new Parser({
        dstFolder: 'site'
    });
    it('return empty when find nothing', function () {
        var jq = p1.parseLib(config.libs.jquery);
        jq.should.eql([path.resolve('site/lib/jquery/dist/jquery.js')]);
    });
    it('won\'t merge file twice', function () {
        var date_time = p1.parseLib(config.libs['date-time']);
        date_time.should.eql([]);
    });
//    it('return sth when found sth', function () {
//        var t = [
//            path.resolve('test/glob/a.js'),
//            path.resolve('test/glob/t.js')
//        ];
//        file.glob('test/glob/*.js').should.eql(t);
//    });
});
