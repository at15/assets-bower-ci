var fs = require('fs');
var path = require('path');
var glob = require('glob');
var tq = require('./tq');
var mkdirp = require('mkdirp');

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

Mgr.prototype.parseLib = function (libName) {

    if (typeof this._libs[libName] === 'object') {
        return this._libs[libName];
    }


    var libConfig = this._config.libs[libName];
    if (libConfig.bower) {
        var bowerPkg = this.readBower(libName);
        return this.copyBower(bowerPkg);
    }

    var libFiles = [];

    if (typeof libConfig === 'object') {

        // get all the dependencies
        if (typeof libConfig.dependencies === 'object') {
            var deps = libConfig.dependencies;
            var me = this;
            deps.forEach(function (d) {
                libFiles = me.mergeFiles(libFiles, me.parseLib(d));
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
    if (typeof config.libs == 'object') {
        if (typeof config.libs === 'object') {
            config.libs.forEach(function (libName) {
                allFiles = me.mergeFiles(allFiles, me.parseLib(libName));
            })
        }
        if (typeof config.files === 'object') {
            var fileGlob = config.files;
            allFiles = this.mergeFiles(allFiles, this.parseFile(fileGlob));
        }
    }
    return allFiles;
};


Mgr.prototype.getGroupPath = function (groupName) {
    return this.config('grouppath') + '/' + groupName;
};


Mgr.prototype.parseGroup = function (groupName) {
    log.debug(groupName);

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

    // write the js
    var jsContent = this.minJs(jsFiles);
    fs.writeFileSync(dst.js, jsContent);
    dst.js = path.resolve(dst.js);

    // TODO: write the css
    // write the css


    return [dst.js];

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

};

Mgr.prototype.parsePage = function (pageName) {
    // we don't need to cache the page right?...
    log.debug(pageName);
    var pageConfig = this._config.pages[pageName];
    var pageFiles = [];
    var me = this;
    if (typeof pageConfig === 'object') {
        var groups = pageConfig.groups;
        if (typeof groups === 'object') {
            groups.forEach(function (groupName) {
                pageFiles = me.mergeFiles(pageFiles, me.parseGroup(groupName));
            });
        }
        pageFiles = this.mergeFiles(pageFiles, this.parseLibsFiles(pageConfig));
    }
    this._pages[pageName] = pageFiles;
    return this._pages[pageName];
};


Mgr.prototype.toJSON = function (dst) {
    var str_pages = JSON.stringify(this._pages);
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