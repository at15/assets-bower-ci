var fs = require('fs');
var path = require('path');

var log = require('./lib/log');
var arrh = require('./lib/arr');
var fh = require('./lib/file-helper');
var Parser = require('./lib/parse');
var min = require('./lib/min');
var html2js = require('./lib/ngHtml2js');

function Mgr(configPath) {
    this.init();
    this.setConfig(configPath);
}

Mgr.prototype.init = function () {
    this._config = {};
    this._pages = {};
    // 已经加载过的lib和group
    this.loadedGroups = {};
    this.loadedLibs = {};
};

Mgr.prototype.setConfig = function (configPath) {
    try {
        this._config = JSON.parse(fs.readFileSync(configPath));
    } catch (e) {
        log.error('Can\'t read config! ' + configPath);
    }
};

Mgr.prototype.config = function (name) {
    if (typeof this._config[name] !== 'undefined') {
        return this._config[name];
    } else {
        log.warn(name + ' is not set in config!');
        return null;
    }
};

Mgr.prototype.needMin = function () {
    return this.config('min') ? true : false;
};

Mgr.prototype.getConfig = function (libName) {
    return this._config.libs[libName];
};

Mgr.prototype.parsePage = function (pageName) {
    // we don't need to cache the page right?...
    log.debug('Parse page: ' + pageName);
    var pageConfig = this._config.pages[pageName];

    if (typeof pageConfig !== 'object') {
    }
    var pageFiles = [];

    var parse = new Parser({
        dstFolder: 'site',
        dstLibFolder: this.config('libpath'),
        libConfigs: this._config.libs,
        groupConfigs: this._config.groups
    });

    var me = this;

    function pageNeedMin() {
        if (typeof pageConfig.min !== 'undefined' && pageConfig.min) {
            return true;
        } else {
            return me.needMin();
        }
    }

    var groups = pageConfig.groups;
    var groupFiles = [];
    var minOpt = {};
    if (typeof groups === 'object') {
        log.debug('Start loading groups for page ' + pageName);
        groups.forEach(function (groupName) {
            log.debug('Parse group ' + groupName + ' for page ' + pageName);
            groupFiles = parse.parseGroup(groupName);
            if (pageNeedMin()) {
                // 压缩和不压缩的要分开处理额，在缓存的时候
                if (typeof me.loadedGroups[groupName + '.min'] === 'undefined') {
                    minOpt = {
                        name: groupName,
                        files: groupFiles,
                        dstFolder: path.join(me.config('grouppath'), groupName)
                    };
                    groupFiles = min.lib(minOpt);
                    me.loadedGroups[groupName + '.min'] = groupFiles;
                } else {
                    groupFiles = me.loadedGroups[groupName + '.min'];
                }
            }

            pageFiles = arrh.merge(pageFiles, groupFiles);
        });

    }
    log.debug('Start loading libs and files for page ' + pageName);


    var libs = pageConfig.libs;
    var libFiles = [];
    if (typeof libs === 'object') {
        libs.forEach(function (libName) {
            log.debug('Parse lib ' + libName + ' for page ' + pageName);
            libFiles = parse.parseLib(libName);
            if(pageNeedMin()){
                if(typeof me.loadedLibs[libName + '.min'] === 'undefined' ){
                    var dstFolder = '';
                    if (me.getConfig(libName).folder) {
                        dstFolder = me.getConfig(libName).folder;
                    } else {
                        dstFolder = path.join(me.config('libpath'), libName);
                    }
                    minOpt = {
                        name: libName,
                        files: libFiles,
                        dstFolder: dstFolder
                    };
                    libFiles = min.lib(minOpt);
                    me.loadedLibs[libName + '.min'] = libFiles;
                }else{
                    libFiles =  me.loadedLibs[libName + '.min'];
                }
            }
            pageFiles = arrh.merge(pageFiles, libFiles);
        });

    }

    // TODO:do the min for files and do the clean as well?
    // No need, just add a task to clean all the js and css that are not min.js min.css
    var fileGlobs = pageConfig.files;
    var filesOnly = [];
    if (typeof fileGlobs === 'object') {
        // do the min for files
        filesOnly = fh.glob(fileGlobs);
        if (pageNeedMin()) {
            minOpt = {
                name: pageName,
                files: filesOnly,
                dstFolder: path.join(me.config('pagepath'), pageName)
            };
            filesOnly = min.lib(minOpt);
        }
        pageFiles = arrh.merge(pageFiles, filesOnly);
    }
    log.debug('Resolve file path ');
    pageFiles = fh.resolve(pageFiles, this.config('webroot'));


    // var templateGlobs = pageConfig.template;
    // var templateFiles = [];
    // var templateContent = '';
    // if(typeof templateGlobs === 'object'){
    //     // min the templates
    //     templateFiles = fh.glob(templateGlobs);
    //     templateFiles.forEach(filePath){
    //         templateContent += html2js.toJs({
    //             src:filePath,
    //             url:path.basename(filePath)
    //         });
    //     }
    //     // 写入到哪里呢?还有压缩的问题，其实应该跟app一起压缩的....还是分开处理吧.
    //     fh.write()
    // }

    // split the files
    var scripts = {};
    scripts.js = fh.split(pageFiles, 'js');
    scripts.css = fh.split(pageFiles, 'css');
    this._pages[pageName] = scripts;
    log.debug('Finish loading page ' + pageName);
    return this._pages[pageName];
};


Mgr.prototype.toJSON = function (dst) {
    var str_pages = JSON.stringify(this._pages, null, 4);
    // 把\\替换成/以避免windows下路径分割符导致的错误
    str_pages = str_pages.replace(/\\\\/g, '/');
    try {
        fs.writeFileSync(dst, str_pages);
    } catch (e) {
        log.error('can\'t save in json format!', e);
    }
};


Mgr.prototype.parseAllPage = function () {
    if (typeof this._config.pages !== 'object') {
        log.error('config is not set! can\'t find any page!');
        return;
    }
    var pages = this._config.pages;
    var pageName;
    for (pageName in pages) {
        log.debug(pageName);
        this.parsePage(pageName);
    }
    this.toJSON(this._config.dst);
};

module.exports = Mgr;