/**
 * Created by at15 on 15-3-10.
 */
// The new assets manager
'use strict';

var lodash = require('lodash');

var mgr = {};

var log = require('./lib/log');
var config = require('./lib/config');
var fh = require('./lib/file-helper');
var parser = require('./lib/parser');
var min = require('./lib/min');
var output = require('./lib/output');
var Page = require('./lib/page');

mgr.init = function (jsonPath) {
    config.loadConfigJson(jsonPath);
    parser.init();
    min.init();
    log.setLevel(config.currentEnvironmentSetting('logLevel', 'DEBUG'));
};

mgr.run = function () {
    var pages = config.getAllPages();

    lodash.forIn(pages, function (_, pageName) {
        log.info('====== Page:', pageName, ' ======');
        var tPage = new Page(pageName);
        tPage.processAll();
        output.addPage(pageName, tPage.get());
    });
};

mgr.toJson = function () {
    output.toJson();
};

module.exports = mgr;
