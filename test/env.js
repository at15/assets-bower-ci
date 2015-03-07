// test env.
var env = require('../lib/env.js');
describe('test env read',function(){
    it('return null when env is not set',function(){
       expect(env.get('not_exists')).to.equal(null);
    });
});