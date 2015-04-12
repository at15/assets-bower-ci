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
    var data = this._data;
    if (typeof data[name] !== 'undefined') {
        return data[name];
    }
    // throw error if this config is a must and cant use default value
    if (arguments.length === 3 && arguments[2] === true) {
        throw new Error('config item ' + name + ' not found');
    }
    // there is default value
    if (arguments.length === 2) {
        return arguments[1];
    }
    // null if we got nothing
    return null;
};

config.getLib = function (name) {
    var data = config.getAllLibs();
    if (typeof data[name] !== 'object') {
        throw new Error('config for lib ' + name + ' not found');
    }
    return data[name];
};

config.getGroup = function (name) {
    var data = config.getAllGroups();
    if (typeof data[name] !== 'object') {
        throw new Error('config for group ' + name + ' not found');
    }
    return data[name];
};

config.getPage = function (name) {
    var data = config.getAllPages();
    if (typeof data[name] !== 'object') {
        throw new Error('config for page ' + name + ' not found');
    }
    return data[name];
};

config.getAllLibs = function () {
    return config.get('libs');
};

config.getAllGroups = function () {
    return config.get('groups');
};

config.getAllPages = function () {
    return config.get('pages');
};

config.needMapFile = function () {
    switch (config.currentEnvironment()) {
        case 'production':
            // map fileHelper has no need for production environment
            return false;
        case 'test':
            return true;
        case 'development':
            return false;
        default:
            throw new Error('environment ' + config.currentEnvironment() + ' unrecognizable');
    }
};

config.pageNeedMin = function (pageName) {
    if (config.currentEnvironment() === 'development') {
        // in development mode not min
        return false;
    } else {
        return config.getPage(pageName).min === true;
    }
};

config.getDstJson = function () {
    return config.currentEnvironmentSetting().dstJson;
};

config.getDstFolder = function () {
    return config.currentEnvironmentSetting().dstFolder;
};

config.getSrcWebRoot = function() {
    return config.currentEnvironmentSetting().srcwebroot;
};

config.getDstWebRoot = function () {
    return config.currentEnvironmentSetting().dstFolder;
};

config.currentEnvironment = function () {
    return config.get('environment');
};

config.currentEnvironmentSetting = function () {
    var key = 'env-' + config.currentEnvironment();
    return config.get(key);
};

config.getBaseUrl = function(){
    return config.currentEnvironmentSetting().baseUrl;
};

module.exports = config;