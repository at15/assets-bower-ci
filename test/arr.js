/**
 * Created by at15 on 7/10/14.
 */
// test the arr.js
require("should");
var arr = require('../lib/arr');

describe('arr.inArray', function () {
    var a = [1, 2, 3, 4];
    it('return index when find the element', function () {
        arr.inArray(a, 2).should.eql(1);
    });
    it('return -1 when can\'t find element', function () {
        arr.inArray(a, 10086).should.eql(-1);
    });
});

describe('arr.merge', function () {
    var a = ['a', 'b', 'c'];
    var b = ['a', 'e'];
    var c = ['a', 'b', 'd'];
    it('return an empty array when nothing provided', function () {
        arr.merge().should.eql([]);
    });
    it('return the argument when only has one', function () {
        arr.merge(a).should.eql(a);
    });
    it('merge multi arrays', function () {
        arr.merge(a, b, c).should.eql(['a', 'b', 'c', 'e', 'd']);
    })
});