/**
 * Created by at15 on 15-3-7.
 */
// The new json config file parser for assets-bower-ci
var config = require('./config');
var fh = require('./file-helper');
var arrh = require('./arr.js');

var parser = {};

// cache
var cachedLibs = {};
var cachedGroups = {};

parser.init = function () {
    // clean the cache
    this.cleanCache();
    // parse libs and groups
    this.parseLibs();
    this.parseGroups();
    // waiting for pars pages ...
};

parser.parseLibs = function () {
    // get all libs
    var libs = config.getAllLibs();
    for (var libName in libs) {
        if (!libs.hasOwnProperty(libName)) {
            continue;
        }
        parser.parseSingleLib(libs[libName]);
    }

};

// also pass libs because we need to resolve dependencies
parser.parseSingleLib = function (libConfig, libs) {
    // check cache
    if (typeof cachedLibs[libConfig.name] === 'object') {
        return;
    }

    var libFiles = [];
    // load dependencies.
    if (typeof libConfig.dependencies === 'object') {
        libConfig.dependencies.forEach(function (depName) {
            libFiles = arrh.merge(libFiles, parser.getLib(depName));
        });
    }
    // just grab the files
    if (typeof libConfig.files === 'object') {
        libFiles = arrh.merge(libFiles, fh.glob(libConfig.files));
    }
    cachedLibs[libConfig.name] = libFiles;
};

parser.parseGroups = function () {

};

parser.parsePage = function () {

};

parser.getLib = function (name) {
    if (typeof cachedLibs[name] === 'object') {
        return cachedLibs[name];
    }
    if (config.getLib(name)) {
        parser.parseSingleLib(config.getLib(name), config.getAllLibs());
        return cachedLibs[name];
    }
    throw new Error('The lib ' + name +
    ' does not exists, typo for dependencies?');
};

parser.getAllLibs = function () {
    return cachedLibs;
};

parser.cleanCache = function () {
    cachedLibs = {};
    cachedGroups = {};
};

// when config is loaded in other lib's we can also get the config value
parser.testConfig = function () {
    return config.get('foo');
};

module.exports = parser;