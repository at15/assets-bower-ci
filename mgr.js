/**
 * Created by at15 on 15-3-10.
 */
// The new assets manager
var mgr = {};

var config = require('./lib/config');
var fh = require('./lib/file-helper');
var parser = require('./lib/parser');
var min = require('./lib/min');
var output = require('./lib/output');


mgr.init = function (jsonPath) {
    config.loadConfigJson(jsonPath);
    parser.init();
    min.init();
};

mgr.run = function () {
    var pages = config.getAllPages();
    for (var pageName in pages) {
        if (!pages.hasOwnProperty(pageName)) {
            continue;
        }
        var finalOutput = {
            js: [],
            css: []
        };
        console.log('====== Page:', pageName, ' ======');
        if (config.pageNeedMin(pageName)) {
            console.log('page need min');
            min.page(pageName);

            var minResults = [];
            var outputResults = {};

            var pageConfig = config.getPage(pageName);

            // load the libs
            if (typeof pageConfig.libs === 'object') {
                pageConfig.libs.forEach(function (libName) {
                    minResults = min.lib(libName);
                    outputResults = output.minLib(minResults, libName);
                    if (outputResults.js) {
                        finalOutput.js.push(outputResults.js);
                    }
                    if (outputResults.css) {
                        finalOutput.css.push(outputResults.css);
                    }
                });
            }

            // load the groups
            if (typeof  pageConfig.groups === 'object') {
                pageConfig.groups.forEach(function (groupName) {
                    minResults = min.group(groupName);
                    outputResults = output.minGroup(minResults, groupName);
                    if (outputResults.js) {
                        finalOutput.js.push(outputResults.js);
                    }
                    if (outputResults.css) {
                        finalOutput.css.push(outputResults.css);
                    }
                });
            }

            // load the files
            if (typeof  pageConfig.files === 'object') {
                minResults = min.files(fh.glob(pageConfig.files));
                outputResults = output.minPageFile(minResults, pageName);
                if (outputResults.js) {
                    finalOutput.js.push(outputResults.js);
                }
                if (outputResults.css) {
                    finalOutput.css.push(outputResults.css);
                }
            }

        } else {
            finalOutput.js = fh.split(parser.getPage(pageName), 'js');
            finalOutput.css = fh.split(parser.getPage(pageName), 'css');
        }
        //console.log(finalOutput)
        output.addPage(pageName, finalOutput);
    }
};

mgr.toJson = function () {
    output.toJson();
};

module.exports = mgr;