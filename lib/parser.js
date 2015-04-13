/**
 * Created by at15 on 15-3-7.
 */
// The new json config fileHelper parser for assets-bower-ci
var config = require('./config');
var log = require('./log');
var fh = require('./file-helper');
var lodash = require('lodash');
var parser = {};

// cache
var cachedLibs = {};
var cachedGroups = {};
var cachedPages = {};

parser.init = function () {
    // clean the cache
    this.cleanCache();
    // parse libs and groups
    this.parseLibs();
    this.parseGroups();
    // waiting for pars pages ...
};

parser.child = function (parent, childName) {
    var child = parent[childName];
    if (child.name !== childName) {
        log.raise('node ' + childName + ' does not match its name ' + child.name);
    }
    return child;
};

parser.parseLibs = function () {
    // get all libs
    var libs = config.getAllLibs();
    for (var libName in libs) {
        if (!libs.hasOwnProperty(libName)) {
            continue;
        }
        parser.parseSingleLib(parser.child(libs, libName));
    }

};

parser.parseGroups = function () {
    var groups = config.getAllGroups();
    for (var groupName in groups) {
        if (!groups.hasOwnProperty(groupName)) {
            continue;
        }
        parser.parseSingleGroup(parser.child(groups, groupName));
    }
};

// This will parse all pages.
parser.parsePages = function () {
    var pages = config.getAllPages();
    for (var pageName in pages) {
        if (!pages.hasOwnProperty(pageName)) {
            continue;
        }
        parser.parseSingleGroup(parser.child(pages, pageName));
    }
};

// also pass libs because we need to resolve dependencies. todo: but we do not use `libs`?...
parser.parseSingleLib = function (libConfig) {
    // check cache
    if (typeof cachedLibs[libConfig.name] === 'object') {
        return;
    }

    var libFiles = [];
    // load dependencies.
    if (typeof libConfig.dependencies === 'object') {
        libConfig.dependencies.forEach(function (depName) {
            libFiles = libFiles.concat(parser.getLib(depName));
        });
    }
    // just grab the files
    if (typeof libConfig.files === 'object') {
        libFiles = libFiles.concat(fh.glob(libConfig.files));
    }
    cachedLibs[libConfig.name] = libFiles;
};

parser.parseSingleGroup = function (groupConfig) {
    // check cache
    if (typeof cachedGroups[groupConfig.name] === 'object') {
        return;
    }

    var groupFiles = [];

    // load the libs
    if (typeof groupConfig.libs === 'object') {
        groupConfig.libs.forEach(function (libName) {
            // TODO:why i added a isLoaded check in the old parser? cache?
            groupFiles = groupFiles.concat(parser.getLib(libName));
        });
    }

    // load the files
    // parse the files
    if (typeof groupConfig.files === 'object') {
        groupFiles = groupFiles.concat(fh.glob(groupConfig.files));
    }

    cachedGroups[groupConfig.name] = groupFiles;
};

parser.parseSinglePage = function (pageConfig) {
    // parse page without min
    var pageFiles = [];
    // load the groups
    if (typeof  pageConfig.groups === 'object') {
        pageConfig.groups.forEach(function (groupName) {
            pageFiles = pageFiles.concat(parser.getGroup(groupName));
        });
    }
    // load the libs
    // TODO:refactor this. it is used in both page,group and lib
    if (typeof pageConfig.libs === 'object') {
        pageConfig.libs.forEach(function (libName) {
            pageFiles = pageFiles.concat(parser.getLib(libName));
        });
    }
    // load the files
    if (typeof  pageConfig.files === 'object') {
        pageFiles = pageFiles.concat(fh.glob(pageConfig.files));
    }

    cachedPages[pageConfig.name] = pageFiles;
};

parser.getLib = function (name) {
    if (typeof cachedLibs[name] === 'object') {
        return cachedLibs[name];
    }
    if (config.getLib(name)) {
        parser.parseSingleLib(config.getLib(name));
        return cachedLibs[name];
    }
    log.raise('lib ' + name + ' not found');
};

parser.getGroup = function (name) {
    if (cachedGroups[name] === 'object') {
        return cachedGroups[name];
    }
    if (config.getGroup(name)) {
        parser.parseSingleGroup(config.getGroup(name));
        return cachedGroups[name];
    }
    log.raise('group ' + name + ' not found');
};

parser.getPage = function (name) {
    if (cachedPages[name] !== 'object') {
        if (!config.getPage(name)) {
            throw 'Cannot get page ' + name;
        }
        parser.parseSinglePage(config.getPage(name));
    }
    return cachedPages[name];
};

parser.getAllLibs = function () {
    return cachedLibs;
};

parser.cleanCache = function () {
    cachedLibs = {};
    cachedGroups = {};
    cachedPages = {};
};

// when config is loaded in other lib's we can also get the config value
parser.testConfig = function () {
    return config.get('foo');
};

module.exports = parser;