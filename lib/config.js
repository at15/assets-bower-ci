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
    var data = config.getAllLibs();
    if (typeof data[name] === 'object') {
        return data[name];
    }
    throw new Error('config for lib ' + name + ' not found');
};

config.getGroup = function (name) {
    var data = config.getAllGroups();
    if (typeof data[name] === 'object') {
        return data[name];
    }
    throw new Error('config for group ' + name + ' not found');
};

config.getPage = function (name) {
    var data = config.getAllPages();
    if (typeof data[name] === 'object') {
        return data[name];
    }
    throw new Error('config for page ' + name + ' not found');
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
    var env = config.currentEnvironment();
    // map file has no need for production environment
    if (env === 'production') {
        return false;
    }
    if (env === 'test') {
        return true;
    }
    if (env === 'development') {
        return false;
    }
};

config.pageNeedMin = function (pageName) {
    var pageConfig = config.getPage(pageName);
    // in development mode not min
    if (config.currentEnvironment() === 'development') {
        return false;
    }
    if (typeof pageConfig.min !== 'undefined' &&
        pageConfig.min === true) {
        return true;
    }
    return false;
};

config.getDstJson = function () {
    return config.currentEnvironmentSetting().dstJson;
};

config.getDstFolder = function () {
    return config.currentEnvironmentSetting().dstFolder;
};

//config.getWebRoot = function () {
//    return config.currentEnvironmentSetting().webroot;
//};

config.getSrcWebRoot = function(){
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
module.exports = config;