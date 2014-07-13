var fs = require('fs');
var path = require('path');

var log = require('./lib/log');
var arrh = require('./lib/arr');
var fh = require('./lib/file-helper');
var Parser = require('./lib/parse');
var min = require('./lib/min');

function Mgr(configPath) {
    this.init();
    this.setConfig(configPath);
}

Mgr.prototype.init = function () {
    this._config = {};
    this._pages = {};
    // 已经压缩过的lib和group
    this.minGroups = {};
    this.minLibs = {};
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

Mgr.prototype.parsePage = function (pageName) {
    // we don't need to cache the page right?...
    log.debug('Parse page: ' + pageName);
    var pageConfig = this._config.pages[pageName];

    if (typeof pageConfig !== 'object') {
    }
    var pageFiles = [];

    var parse = new Parser({
        dstFolder: 'site',
        libConfigs: this._config.libs,
        groupConfigs: this._config.groups
    });

    var me = this;
    // TODO: do the min css and min js here
    var groups = pageConfig.groups;
    var groupFiles = [];
    var minOpt = {};
    if (typeof groups === 'object') {
        log.debug('Start loading groups for page ' + pageName);
        groups.forEach(function (groupName) {

            if (typeof me.minGroups[groupName] === 'undefined'){
                groupFiles = parse.parseGroup(groupName);
                minOpt = {
                    name:groupName,
                    files:groupFiles,
                    dstFolder:'site/group/'+groupName
                };
                groupFiles = min.lib(minOpt);
                me.minGroups[groupName] = groupFiles;
            }else{
                groupFiles = me.minGroups[groupName];
            }

            pageFiles = arrh.merge(pageFiles,groupFiles);
        });
    }
    log.debug('Start loading libs and files for page ' + pageName);

    var libs = pageConfig.libs;
    if (typeof libs === 'object') {
        libs.forEach(function (libName) {
            pageFiles = arrh.merge(pageFiles, parse.parseLib(libName));
        });
    }

    var files = pageConfig.files;
    if (typeof files === 'object') {
        pageFiles = arrh.merge(pageFiles, fh.glob(files));
    }

    // pageFiles = this.resolveIndex(pageFiles);
    // pageFiles = this.splitFile(pageFiles);
    this._pages[pageName] = pageFiles;
    return this._pages[pageName];
};


Mgr.prototype.toJSON = function (dst) {
    var str_pages = JSON.stringify(this._pages, null, 4);
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