// test map
var chai = require('chai');
var should = chai.Should();

describe('Array.prototype.map', function () {
    it('return some thing',function(){
        var a = [1,2,3];
        var b = a.map(function(e){
            console.log(e);
            return e;
        });
        a.should.eql(b);
    })
});