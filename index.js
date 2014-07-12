var fs = require('fs');
var path = require('path');

var log = require('./lib/log');
var arrh = require('./lib/arr');
var Parser = require('./lib/parse');

function Mgr(configPath) {
    this.init();
    this.setConfig(configPath);
}

Mgr.prototype.init = function () {
    this._config = {};
    this._pages = {};
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
    var me = this;

    var parse = new Parser({
        dstFolder: 'site',
        libConfigs: this._config.libs,
        groupConfigs: this._config.groups
    });

    var groups = pageConfig.groups;
    if (typeof groups === 'object') {
        log.debug('Start loading groups for page ' + pageName);
        groups.forEach(function (groupName) {
            pageFiles = arrh.merge(pageFiles, parse.parseGroup(groupName));
        });
    }
    log.debug('Start loading libs and files for page ' + pageName);

    var libs = pageConfig.libs;
    if (typeof libs === 'object') {
        libs.forEach(function (libName) {
            pageFiles = arrh.merge(pageFiles, parse.parseLib(libName));
        });
    }


    pageFiles = this.resolveIndex(pageFiles);
    pageFiles = this.splitFile(pageFiles);
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