/**
 * Created by at15 on 15-3-10.
 */
// lib for configure
var config = {};
var fs = require('fs');
var log = require('./log');

config._config = {};

config.loadConfigJson = function (jsonFilePath) {
    try {
        this._config = JSON.parse(fs.readFileSync(jsonFilePath));
        return true;
    } catch (e) {
        log.error('Can\'t read config! ' + jsonFilePath);
        //console.log(e);
        return false;
    }
};

module.exports = config;