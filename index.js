var fs = require('fs');

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

//    bower.commands
//        .search('jquery', {})
//        .on('end', function (results) {
//            console.log(results);
//        });

    // list is not useable
//    bower.commands
//        .list()
//        .on('end', function (results) {
//            console.log(results);
//        });

//       console.log(bower.commands);
//    bower.commands.info().on('end', function (r) {
//        console.log(r)
//    });
    // find the bower.json in bower_components
    var bowerJsonPath = 'bower_components/' + pkgName +'/bower.json';
    var bowerJson = {};
    try {
        bowerJson = JSON.parse(fs.readFileSync(bowerJsonPath));
    } catch (e) {
        log.error('Can\'t read bower.json! ' + bowerJsonPath);
    }
    console.log(bowerJson);
};

Mgr.prototype.parseGroup = function () {

};

Mgr.prototype.parsePage = function () {

};

// TODO: do we already have function like this?
Mgr.prototype.mergeFiles = function () {

};

module.exports = function (config) {
    return new Mgr(config);
};