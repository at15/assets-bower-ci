var fs = require('fs');
var path = require('path');
var glob = require('glob');
var tq = require('./tq');
var mkdirp = require('mkdirp');
var CleanCSS = require('clean-css');

var log4js = require('log4js');
log4js.configure({appenders: [
    { type: 'console' }
]
});
var log = log4js.getLogger();
log.setLevel('DEBUG');

var bower = require('bower');
var UglifyJS = require("uglify-js");


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

Mgr.prototype.parseFile = function (fileGlob) {
    var allFiles = [];
    if (typeof fileGlob !== 'object') {
        fileGlob = [fileGlob];
    }
    fileGlob.forEach(function (pattern) {
        var files = glob.sync(pattern, {});
        files.forEach(function (p) {
            allFiles.push(path.resolve(p));
        });
    });
    return allFiles;
};


Mgr.prototype.mergeFiles = function () {
    var arg = arguments;
    var merged = [];

    if (arg.length === 0) {
        log.warn('Nothing provided for merge');
        return merged;
    }
    var i, to_merge = arg.length;
    for (i = 0; i < to_merge; i++) {
        var scripts = arg[i];
        var j, script_count = scripts.length;
        for (j = 0; j < script_count; j++) {
            var s = scripts[j];
            if (-1 === tq.inArray(merged, s)) {
                merged.push(s);
            }
        }
    }
    return merged;
};

// if not loaded, push the libName to the loadedlibs
Mgr.prototype.isLoaded = function (libName) {
    log.debug('current loaded libs are')
    console.log(this.currentLoadedLibs);
    if (-1 === tq.inArray(this.currentLoadedLibs, libName)) {
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
        var bowerPkg = this.readBower(libName);
        //console.log(bowerPkg);
        return this.copyBower(bowerPkg);
    }

    var libFiles = [];

    if (typeof libConfig === 'object') {

        // get all the dependencies
        if (typeof libConfig.dependencies === 'object') {
            var deps = libConfig.dependencies;
            var me = this;
            log.debug('Loading dependencies for ' + libName);
            deps.forEach(function (d) {
                if (!me.isLoaded(d)) {
                    libFiles = me.mergeFiles(libFiles, me.parseLib(d));
                }
            });
        }

        // get all the files
        var fileGlob = this._config.libs[libName].files;
        libFiles = this.mergeFiles(libFiles, this.parseFile(fileGlob));
    }

    if (libFiles.length === 0) {
        log.warn('Lib: ' + libName + ' is empty! ');
    }

    this._libs[libName] = libFiles;
    log.debug('load lib done!');
    return this._libs[libName];
};

Mgr.prototype.getBowerPath = function (pkgName) {
    return 'bower_components/' + pkgName;
};

Mgr.prototype.readBower = function (pkgName) {

    // final files in absolute path
    var libFiles = [];
    var bowerPath = this.getBowerPath(pkgName);
    var bowerJsonPath = bowerPath + '/bower.json';
    var bowerJson = {};
    try {
        bowerJson = JSON.parse(fs.readFileSync(bowerJsonPath));
    } catch (e) {
        // need to try .bower.json
        bowerJsonPath = bowerPath + '/.bower.json';
        try {
            bowerJson = JSON.parse(fs.readFileSync(bowerJsonPath));
        } catch (e) {
            log.error('Can\'t read bower.json! ' + bowerJsonPath);
            return libFiles;
        }
    }

    //TODO: get the dependencies

    // change the directory
    var cwd = process.cwd();
    process.chdir(bowerPath);

    var mainFilesGlob = bowerJson.main;
    libFiles = this.parseFile(mainFilesGlob);

    // go back to the previous dir
    process.chdir(cwd);

    return {
        files: libFiles,
        name: pkgName
    };

};

// copy bower files and keep the same structure
Mgr.prototype.copyBower = function (bowerPkg) {
//    console.log(bowerPkg);
    var libPath = this.config('libpath') + '/' + bowerPkg.name;
    var bowerPath = path.resolve(this.getBowerPath(bowerPkg.name));
    var rPath;
    var dstPath;
    var allFiles = [];
    bowerPkg.files.forEach(function (filePath) {
        rPath = path.relative(bowerPath, filePath);
        dstPath = path.join(libPath, rPath);
        tq.cp(filePath, dstPath);
        allFiles.push(path.resolve(dstPath));
    });
    return allFiles;
};

// TODO: parse lib should also behave like parse file, which can accept both array and string?
// no ... just one thing at a time
Mgr.prototype.parseLibsFiles = function (config) {
    var allFiles = [];
    var me = this;
    if (typeof config.libs === 'object') {
        config.libs.forEach(function (libName) {
            if (!me.isLoaded(libName)) {
                allFiles = me.mergeFiles(allFiles, me.parseLib(libName));
            }
        })
    }
    if (typeof config.files === 'object') {
        var fileGlob = config.files;
        allFiles = this.mergeFiles(allFiles, this.parseFile(fileGlob));
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

    // write the js
    var jsContent = this.minJs(scripts.js);
    fs.writeFileSync(dst.js, jsContent);
    dst.js = path.resolve(dst.js);

    // TODO: write the css
    // write the css
    var cssContent = this.minCss(scripts.css);
    fs.writeFileSync(dst.css, cssContent);
    dst.css = path.resolve(dst.css);

    return [dst.js, dst.css];

};

Mgr.prototype.minJs = function (jsFiles) {
    var realJsFiles = [];
    jsFiles.forEach(function (p) {
        if (path.extname(p) === '.js') {
            realJsFiles.push(p);
        }
    });
    var result = UglifyJS.minify(realJsFiles);
    // console.log(result.code);
    return result.code;
};

Mgr.prototype.minCss = function (cssFiles) {
    var content = '';
    cssFiles.forEach(function (p) {
        if (path.extname(p) === '.css') {
            content += fs.readFileSync(p);
        }
    });
    var minify = new CleanCSS().minify(content);
    return minify;
};

// resolve the absolute path to relative path to the index.php
Mgr.prototype.resolveIndex = function (files) {
    var resolvedPath = [];
    var webroot = this.config('webroot');
    if (typeof webroot === 'undefined') {
        log.error('Webroot is undefined!');
        return files;
    }
    files.forEach(function (p) {
        resolvedPath.push(path.relative(webroot, p))
    });
    return resolvedPath;
};

Mgr.prototype.splitFile = function (files) {
    var scripts = {js: [], css: []};
    var jsFiles = [];
    var cssFiles = [];
    files.forEach(function (p) {
        var ext = path.extname(p);
        if (ext === '.js') {
            jsFiles.push(p);
        }
        if (ext === '.css') {
            cssFiles.push(p);
        }
    });
    scripts.js = jsFiles;
    scripts.css = cssFiles;
    return scripts;
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