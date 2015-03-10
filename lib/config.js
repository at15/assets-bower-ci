/**
 * Created by at15 on 15-3-10.
 */
// lib for configure
var config = {};
var fs = require('fs');
var log = require('./log');

config._data = {};

config.loadConfigJson = function (jsonFilePath) {
    try {
        this._data = JSON.parse(fs.readFileSync(jsonFilePath));
        return true;
    } catch (e) {
        log.error('Can\'t read config! ' + jsonFilePath);
        //console.log(e);
        return false;
    }
};

// change config value on the fly
config.set = function (name, value) {
    log.debug('set config ' + name + ' to ' + value);
    this._data[name] = value;
};

// get the config value.
// NOTE:copied from the env lib
// env.get('distFolder')
// env.get('color','red')
// env.get('color','',true)
config.get = function (name) {
    var args = arguments;
    if (typeof this._data[name] !== 'undefined') {
        return this._data[name];
    }
    // throw error if this config is a must and cant use default value
    if (args.length === 3 && args[2] === true) {
        throw new Error('config item ' + name + ' not found');
    }
    // there is default value
    if (args.length === 2) {
        return args[1];
    }
    // null if we got nothing
    return null;
};

module.exports = config;