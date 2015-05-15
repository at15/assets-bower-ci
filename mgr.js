/**
 * Created by at15 on 15-3-10.
 */
// The new assets manager
'use strict';

var lodash = require('lodash');

var mgr = {};

var config = require('./lib/config');
var fh = require('./lib/file-helper');
var parser = require('./lib/parser');
var min = require('./lib/min');
var output = require('./lib/output');
var log = require('./lib/log');


mgr.init = function (jsonPath) {
    config.loadConfigJson(jsonPath);
    parser.init();
    min.init();
    log.setLevel(config.currentEnvironmentSetting('logLevel', 'DEBUG'));
};

mgr.run = function () {
    var pages = config.getAllPages();

    lodash.forIn(pages, function (_, pageName) {
        var finalOutput = {
            js: [],
            css: []
        };
        log.info('====== Page:', pageName, ' ======');
        if (config.pageNeedMin(pageName)) {
            log.debug('page need min');

            var minResults = [];
            var outputResults = {};

            var pageConfig = config.getPage(pageName);

            // load the groups
            if (typeof pageConfig.groups === 'object') {
                pageConfig.groups.forEach(function (groupName) {
                    minResults = min.group(groupName);
                    outputResults = output.writeCompressedGroup(minResults, groupName);
                    if (outputResults.js) {
                        finalOutput.js.push(outputResults.js);
                    }
                    if (outputResults.css) {
                        finalOutput.css.push(outputResults.css);
                    }
                });
            }

            // load the libs
            if (typeof pageConfig.libs === 'object') {
                pageConfig.libs.forEach(function (libName) {
                    minResults = min.lib(libName);
                    outputResults = output.writeCompressedLib(minResults, libName);
                    if (outputResults.js) {
                        finalOutput.js.push(outputResults.js);
                    }
                    if (outputResults.css) {
                        finalOutput.css.push(outputResults.css);
                    }
                });
            }

            // load the files
            if (typeof pageConfig.files === 'object') {
                minResults = min.files(fh.glob(pageConfig.files));
                outputResults = output.writeCompressedPage(minResults, pageName);
                if (outputResults.js) {
                    finalOutput.js.push(outputResults.js);
                }
                if (outputResults.css) {
                    finalOutput.css.push(outputResults.css);
                }
            }

        } else {
            // TODO:copy all the files to the dst folder? yes
            finalOutput.js = fh.split(parser.getPage(pageName), 'js');
            finalOutput.css = fh.split(parser.getPage(pageName), 'css');
        }
        output.addPage(pageName, finalOutput);
    });
};

mgr.toJson = function () {
    output.toJson();
};

module.exports = mgr;
