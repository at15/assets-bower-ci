/**
 * Created by at15 on 14-7-7.
 */
var fs = require('fs');
var log4js = require('log4js');
log4js.configure({appenders: [
    { type: 'console' }
]
});
var log = log4js.getLogger();
log.setLevel('DEBUG');

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

Mgr.prototype.parseGroup = function () {

};

Mgr.prototype.parsePage = function () {

};

// TODO: do we already have function like this?
Mgr.prototype.mergeFiles = function () {

};

module.exports = Mgr;