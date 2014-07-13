/**
 * Created by at15 on 7/13/14.
 */
// test the mgr itself
require('should');
var Mgr = require('../index');

describe('Assets Mgr',function(){
    it('parse a page with group',function(){
        var mgr = new Mgr('assets.json');
        mgr.parseAllPage();
    });
});