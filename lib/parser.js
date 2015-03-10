/**
 * Created by at15 on 15-3-7.
 */
// The new json config file parser for assets-bower-ci
var config = require('./config');

var parser = {};
var cached_libs = {};
var cached_groups = {};

parser.init = function () {
    // clean the cache
    cached_libs = {};
    cached_groups = {};
    // parse libs and groups
    parser.parseLibs();
    parser.parseGroups();
    // waiting for pars pages ...
};

parser.parseLibs = function () {

};

parser.parseGroups = function () {

};

parser.parsePage = function () {

};

// when config is loaded in other lib's we can also get the config value
parser.testConfig = function () {
    return config.get('foo');
};

module.exports = parser;