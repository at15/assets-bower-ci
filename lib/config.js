/**
 * Created by at15 on 15-3-10.
 */
'use strict';

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

config._get = function (object, name, defaultValue, must, type) {
    if (object[name] !== undefined) {
        if (type && typeof object[name] !== type) {
            log.raise('item ' + name + ' not match type ' + type);
        }
        return object[name];
    }
    if (must) {
        log.raise('item ' + name + ' not found');
    }
    return defaultValue || null;
};

// get the config value.
// NOTE:copied from the env lib
// env.get('distFolder')
// env.get('color','red')
// env.get('color','',true)
config.get = function (name, defaultValue, must) {
    return config._get(this._data, name, defaultValue, must);
};

config.getLib = function (name) {
    var data = config.getAllLibs();
    if (typeof data[name] !== 'object') {
        log.raise('config for lib ' + name + ' not found');
    }
    return data[name];
};

config.getGroup = function (name) {
    var data = config.getAllGroups();
    if (typeof data[name] !== 'object') {
        log.raise('config for group ' + name + ' not found');
    }
    return data[name];
};

config.getPage = function (name) {
    var data = config.getAllPages();
    if (typeof data[name] !== 'object') {
        log.raise('config for page ' + name + ' not found');
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
    return config.defaultProperties[config.currentEnvironment()].map;
};

config.pageNeedMin = function (pageName) {
    return config.getPageProperty(pageName, 'min');
};

config.defaultProperties = {
    'production': {
        min: true,
        map: false
    },
    'development': {
        min: false,
        map: false
    },
    'test': {
        min: false,
        map: true
    }
};

config.getPageProperty = function (pageName, propertyName) {
    var propSuppressed = config.currentEnvironmentSetting('suppressed', {}),
        page = config.getPage(pageName),
        propDefault = config.currentEnvironmentSetting('default', {});
    if (propSuppressed[propertyName] !== undefined) {
        return propSuppressed[propertyName];
    } else if (page[propertyName] !== undefined) {
        return page[propertyName];
    } else if (propDefault[propertyName] !== undefined) {
        return propDefault[propertyName];
    } else {
        return config.defaultProperties[config.currentEnvironment()][propertyName];
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

config.currentEnvironmentSetting = function (name, defaultValue, must) {
    var envs = config.get('env-' + config.currentEnvironment());
    return name ? config._get(envs, name, defaultValue, must) : envs;
};

config.getBaseUrl = function(){
    return config.currentEnvironmentSetting().baseUrl;
};

module.exports = config;
