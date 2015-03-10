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
        // we must have the libs, groups and pages block
        if (typeof this._data.libs !== 'object' ||
            typeof this._data.groups !== 'object' ||
            typeof this._data.pages !== 'object'
        ) {
            log.error('Must set libs, groups, pages in config json!');
            return false;
        }
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
    var data = this._data;
    if (typeof data[name] !== 'undefined') {
        return data[name];
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

config.getLib = function (name) {
    var data = config.get('libs');
    if (typeof data[name] === 'object') {
        return data[name];
    }
    throw new Error('config for lib ' + name + ' not found');
};

module.exports = config;