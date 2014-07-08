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
    // this just search available
    // find the bower.json in bower_components
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
    // console.log(bowerJson);
    // now we get all files
    var files = [];
    var mainFiles = bowerJson.main;
    if (typeof mainFiles !== 'object') {
        mainFiles = [mainFiles];
    }
    var cwd = process.cwd();
    process.chdir('bower_components/' + pkgName);

    for (var i = 0; i < mainFiles.length; i++) {
        console.log(mainFiles[i]);

        var f = glob.sync(mainFiles[i], {});
        console.log(f);
        f.forEach(function (p) {
            console.log(path.resolve(p));
        });
    }
    //console.log(process.cwd());
    process.chdir(cwd);
    //console.log(process.cwd());

};

Mgr.prototype.parseGroup = function () {

};

Mgr.prototype.parsePage = function () {

};

// TODO: do we already have function like this?
Mgr.prototype.mergeFiles = function () {

};

module.exports = Mgr;