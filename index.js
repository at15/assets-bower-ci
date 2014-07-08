var fs = require('fs');
var path = require('path');
var glob = require('glob');

var log4js = require('log4js');
log4js.configure({appenders: [
    { type: 'console' }
]
});
var log = log4js.getLogger();
log.setLevel('DEBUG');

var bower = require('bower');

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

Mgr.prototype.parseLib = function () {

};

Mgr.prototype.readBower = function (pkgName) {
    // final files in absolute path
    var libFiles = [];
    var bowerJsonPath = 'bower_components/' + pkgName + '/bower.json';
    var bowerJson = {};
    try {
        bowerJson = JSON.parse(fs.readFileSync(bowerJsonPath));
    } catch (e) {
        // need to try .bower.json
        bowerJsonPath = 'bower_components/' + pkgName + '/.bower.json';
        try {
            bowerJson = JSON.parse(fs.readFileSync(bowerJsonPath));
        } catch (e) {
            log.error('Can\'t read bower.json! ' + bowerJsonPath);
        }
    }

    var mainFilesGlob = bowerJson.main;
    if (typeof mainFilesGlob !== 'object') {
        mainFilesGlob = [mainFilesGlob];
    }

    // change the directory
    var cwd = process.cwd();
    process.chdir('bower_components/' + pkgName);

    mainFilesGlob.forEach(function (pattern) {
        var files = glob.sync(pattern, {});
        files.forEach(function (p) {
            libFiles.push(path.resolve(p));
        });
    });

    // go back to the old dir
    process.chdir(cwd);
    return libFiles;
};

Mgr.prototype.parseGroup = function () {

};

Mgr.prototype.parsePage = function () {

};

// TODO: do we already have function like this?
Mgr.prototype.mergeFiles = function () {

};

module.exports = Mgr;