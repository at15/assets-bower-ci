/**
 * Created by at15 on 15-2-24.
 */


describe('change config', function () {
    var Mgr = require('../index');
    var mgr = new Mgr('assets.json');
    it('get the config from json', function () {
        mgr.config('libpath').should.eql('site/assets/dist/lib');
    });
    it('change on the fly', function () {
        mgr.setConfigValue('libpath','dummypath');
        mgr.config('libpath').should.eql('dummypath');
    });
});