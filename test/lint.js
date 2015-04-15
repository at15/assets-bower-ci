var config = require('../lib/config'),
    lint = require('../lib/lint');
var chai = require('chai'),
    expect = chai.expect;

describe('lint json', function () {
    it('lint assets.json', function () {
        config.loadConfigJson('assets.json');
        expect(lint.libs()).to.eql(true);
        expect(lint.groups()).to.eql(true);
        expect(lint.pages()).to.eql(true);
    });
});