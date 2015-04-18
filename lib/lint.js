/**
 * Created by at15 on 15-4-8.
 */
'use strict';

var lodash = require('lodash');

var config = require('./config'),
    log = require('./log');

var lint = {};

lint.nameCheck = function (src) {
    var errorCount = 0;
    lodash.forIn(src, function (item, key) {
        if (item.name !== key) {
            errorCount++;
            log.error('Key "' + key + '" does not match name "' + item.name + '"');
        }
    });
    return errorCount;
};

lint.dependencyCheck = function (src) {
    var errorCount = 0,
        libs = config.getAllLibs();
    lodash.forIn(src, function (item, key) {
        lodash.forEach(item.dependencies, function (libName) {
            if (libs[libName] === undefined) {
                errorCount++;
                log.error('Denpendency "' + libName + '" of "' + key + '" not found');
            }
        });
    });
    return errorCount;
};

lint.libs = function () {
    var libs = config.getAllLibs(),
        nameCheck = lint.nameCheck(libs),
        dependencyCheck = lint.dependencyCheck(libs);
    if (nameCheck) {
        log.error(nameCheck + ' lib name error(s) found.');
    }
    if (dependencyCheck) {
        log.error(dependencyCheck + ' lib dependency error(s) found.');
    }
    return nameCheck + dependencyCheck === 0;
};

lint.groups = function () {
    var groups = config.getAllGroups(),
        nameCheck = lint.nameCheck(groups);
    if (nameCheck) {
        log.error(nameCheck + ' group name error(s) found.');
    }
    return nameCheck === 0;
};

lint.pages = function () {
    var pages = config.getAllPages(),
        nameCheck = lint.nameCheck(pages),
        dependencyCheck = lint.dependencyCheck(pages);
    if (nameCheck) {
        log.error(nameCheck + ' page name error(s) found.');
    }
    if (dependencyCheck) {
        log.error(dependencyCheck + ' page dependency error(s) found.');
    }
    return nameCheck + dependencyCheck === 0;
};

module.exports = lint;
