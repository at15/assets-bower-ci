/**
 * Created by W7_64 on 2014/7/11.
 */
var parse = {};
var fs = require('fs');
var log = require('./log');
var arrh = require('./arr');
var bowerh = require('./bower-helper');
var fh = require('./file-helper');

// we can make the parser itself OOP !
function Parser(opt) {
    this.libConfigs = opt.libConfigs;
    this.groupConfigs = opt.groupConfigs;
    this.dstLibFolder = opt.dstLibFolder;
    this.dstFolder = opt.dstFolder;
    this.loadedLibs = {};// record loaded libs, do the cache as well
    this.loadedGroups = {};// record the loaded groups, do cache as well
    this.loadedFiles = {};// loaded files
}

Parser.prototype.parseLib = function (libName) {
    var libConfig = this.libConfigs[libName];

    if (typeof libConfig !== 'object') {
        log.error('libConfig must be object rather than ' + libConfig +
            ' for ' + libName);
        return [];
    }

    if (typeof this.loadedLibs[libConfig.name] !== 'undefined') {
        return this.loadedLibs[libConfig.name];
    }
    // do the real parse, and also cache it
    var libFiles = this.parseLibReal(libConfig);
    this.loadedLibs[libConfig.name] = libFiles;
    // push the files
    arrh.merge(this.loadedFiles, libFiles);
    return this.loadedLibs[libConfig.name];
};

Parser.prototype.parseGroup = function (groupName) {
    var groupConfig = this.groupConfigs[groupName];

    if (typeof groupConfig !== 'object') {
        log.error('groupConfig must be object rather than ' + groupConfig +
            ' for ' + groupName);
        return [];
    }

    if (typeof this.loadedLibs[groupConfig.name] !== 'undefined') {
        return this.loadedLibs[groupConfig.name];
    }

    // do the real parse, and also cache it
    var groupFiles = this.parseGroupReal(groupConfig);
    this.loadedGroups[groupConfig.name] = groupFiles;
    // push the files
    arrh.merge(this.loadedFiles, groupFiles);
    return this.loadedGroups[groupConfig.name];
};

Parser.prototype.parseGroupReal = function (groupConfig) {
    var groupFiles = [];
    // parse the libs
    if (typeof groupConfig.libs === 'object') {
        var me = this;
        groupConfig.libs.forEach(function (libName) {
            if (!me.isLoaded(libName)) {
                groupFiles = arrh.merge(groupFiles, me.parseLib(libName));
            }
        });
    }

    // parse the files
    if (typeof groupConfig.files === 'object') {
        groupFiles = arrh.merge(groupFiles, fh.glob(groupConfig.files));
    }

    if (groupFiles.length === 0) {
        log.warn('Group: ' + groupConfig.name + ' is empty!');
    }

    return groupFiles;
};

//TODO: 其实可以用从所有文件中减去已经加载过的文件来避免这个问题,这个对于自己自定义的group应该也会有帮助?
// TODO:允许单页压缩之后载入的lib是存到 libName.min里的。。。似乎会出问题.
Parser.prototype.isLoaded = function (libName) {
    return typeof this.loadedLibs[libName] === 'object';
};

Parser.prototype.parseLibReal = function (libConfig) {
    var libFiles = [];
    var libName = libConfig.name;
    if (libConfig.bower) {
        var bowerPkg = bowerh.read(libName);
        libFiles = bowerh.copy(bowerPkg, this.dstLibFolder);
    } else {
        // get all the dependencies(lib)
        if (typeof libConfig.dependencies === 'object') {
            var deps = libConfig.dependencies;
            log.debug('Loading dependencies for ' + libName);
            var me = this;
            deps.forEach(function (dLibName) {
                // don't load this lib if it already loaded before
                if (!me.isLoaded(dLibName)) {
                    log.debug('Loading dependency ' + dLibName);

                    var dlib = me.parseLib(dLibName);
                    //console.log(dlib);
                    libFiles = arrh.merge(libFiles, dlib);
                    //console.log(libFiles);
                }
            });
            // console.log(libFiles);
        }
        // get all the files for this lib
        if (typeof libConfig.files === 'object') {
            var fileGlob = libConfig.files;
            libFiles = arrh.merge(libFiles, fh.glob(fileGlob));
        }
    }
    return libFiles;
};

module.exports = Parser;