/**
 * Created by Pillar on 2015/5/15.
 */
'use strict';

var chai = require('chai');
var expect = chai.expect;
var stringHelper = require('../lib/string-helper');

describe('stringHelper.trim', function () {
    //it('trim one space', function () {
    //    expect(stringHelper.trim(' 123 ')).to.eql('123');
    //    expect(stringHelper.trim(' 123 ', '')).to.eql('123');
    //    expect(stringHelper.trim(' 123 ', ' ')).to.eql('123');
    //});
    //
    //it('trim one other character', function () {
    //    expect(stringHelper.trim('.123.', '.')).to.eql('123');
    //});
    it('trim continuous character', function () {
        expect(stringHelper.trim('..123..')).to.eql('123');
    });
});
