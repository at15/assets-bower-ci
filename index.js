var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var log4js = require('log4js');
log4js.configure({appenders: [
    { type: 'console' }
]
});
var log = log4js.getLogger();
log.setLevel('DEBUG');

var arrh = require('./lib/arr');
var bowerh = require('./lib/bower-helper');
var fileh = require('./lib/file-helper');


function Mgr(configPath) {
    this.init();
    this.setConfig(configPath);
}

Mgr.prototype.init = function () {
    this._config = {};
    this._libs = {};
    this._groups = {};
    this._pages = {};
    // loaded libs don't need to load again
    this.currentLoadedLibs = [];
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


// if not loaded, push the libName to the loadedlibs
Mgr.prototype.isLoaded = function (libName) {
    log.debug('current loaded libs are');
    console.log(this.currentLoadedLibs);
    if (-1 === arrh.inArray(this.currentLoadedLibs, libName)) {
        return false;
    } else {
        log.debug(libName + ' is in currentLoadedLibs');
        return true;
    }
};

Mgr.prototype.parseLib = function (libName) {

    log.debug('Try to load lib: ' + libName);
    if (typeof this._libs[libName] === 'object') {
        log.warn(libName + ' is parsed already!');
        return this._libs[libName];
    }

    log.debug('Load ' + libName + ' for the first time');
    this.currentLoadedLibs.push(libName);

    var libConfig = this._config.libs[libName];
    if (libConfig.bower) {
        var bowerPkg = bowerh.read(libName);
        return bowerh.copy(bowerPkg);
    }

    var libFiles = [];

    if (typeof libConfig !== 'object') {
        log.warn('libConfig for lib ' + libName + ' is not object!');
        return libFiles;
    }
    // get all the dependencies
    if (typeof libConfig.dependencies === 'object') {
        var deps = libConfig.dependencies;
        var me = this;
        log.debug('Loading dependencies for ' + libName);
        deps.forEach(function (d) {
            if (!me.isLoaded(d)) {
                libFiles = arrh.merge(libFiles, me.parseLib(d));
            }
        });
    }

    // get all the files
    var fileGlob = libConfig.files;
    libFiles = arrh.merge(libFiles, fileh.glob(fileGlob));

    if (libFiles.length === 0) {
        log.warn('Lib: ' + libName + ' is empty! ');
    }

    this._libs[libName] = libFiles;
    log.debug('load lib done!');
    return this._libs[libName];
};


// TODO: parse lib should also behave like parse file, which can accept both array and string?
// no ... just one thing at a time
Mgr.prototype.parseLibsFiles = function (config) {
    var allFiles = [];
    var me = this;
    if (typeof config.libs === 'object') {
        config.libs.forEach(function (libName) {
            if (!me.isLoaded(libName)) {
                allFiles = arrh.merge(allFiles, me.parseLib(libName));
            }
        })
    }
    if (typeof config.files === 'object') {
        var fileGlob = config.files;
        allFiles = arrh.merge(allFiles, this.parseFile(fileGlob));
    }
    return allFiles;
};


Mgr.prototype.getGroupPath = function (groupName) {
    return this.config('grouppath') + '/' + groupName;
};


Mgr.prototype.parseGroup = function (groupName) {
    log.debug('Parse group: ' + groupName);

    // now we get the group
    if (typeof this._groups[groupName] === 'object') {
        return this._groups[groupName];
    }

    var groupConfig = this._config.groups[groupName];
    var groupFiles = [];

    if (typeof groupConfig === 'undefined') {
        log.error('Undefined group name! ');
        return groupFiles;
    }

    if (typeof groupConfig === 'object') {
        groupFiles = this.parseLibsFiles(groupConfig);
    }

    if (groupFiles.length === 0) {
        log.warn('Group: ' + groupName + ' is empty!');
        return [];
    }


    var groupPath = this.getGroupPath(groupName);
    if (!fs.existsSync(groupPath)) {
        mkdirp.sync(groupPath);
    }

    var dst = {
        js: groupPath + '/' + groupName + '.min.js',
        css: groupPath + '/' + groupName + '.min.css'
    };
    groupFiles = this.minFiles(groupFiles, dst);
    this._groups[groupName] = groupFiles;
    return this._groups[groupName];
};


Mgr.prototype.minFiles = function (files, dst) {
    // first split the files
    var scripts = this.splitFile(files);
    var dstFiles = [];

    // write the js
    if (scripts.js.length) {
        var jsContent = this.minJs(scripts.js);
        fs.writeFileSync(dst.js, jsContent);
        dst.js = path.resolve(dst.js);
        dstFiles.push(dst.js);
    }

    // write the css
    if (scripts.css.length) {
        var cssContent = this.minCss(scripts.css);
        fs.writeFileSync(dst.css, cssContent);
        dst.css = path.resolve(dst.css);
        dstFiles.push(dst.css);
    }

    return dstFiles;
};


Mgr.prototype.parsePage = function (pageName) {
    // we don't need to cache the page right?...
    log.debug('Parse page: ' + pageName);
    var pageConfig = this._config.pages[pageName];
    var pageFiles = [];
    var me = this;
    if (typeof pageConfig === 'object') {
        var groups = pageConfig.groups;
        if (typeof groups === 'object') {
            log.debug('Start loading groups for page ' + pageName);
            groups.forEach(function (groupName) {
                pageFiles = me.mergeFiles(pageFiles, me.parseGroup(groupName));
            });
        }
        log.debug('Start loading libs and files for page ' + pageName);
        pageFiles = this.mergeFiles(pageFiles, this.parseLibsFiles(pageConfig));
    }
    pageFiles = this.resolveIndex(pageFiles);
    pageFiles = this.splitFile(pageFiles);
    this._pages[pageName] = pageFiles;
    // clean up the loaded libs
    this.currentLoadedLibs = [];
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