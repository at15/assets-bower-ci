/**
 * Created by at15 on 15-3-10.
 */
// The new assets manager

// the mgr is just a test now

var config = require('./lib/config');
config.loadConfigJson('assets.json');

var fh = require('./lib/file-helper');
var parser = require('./lib/parser');
var min = require('./lib/min');
var output = require('./lib/output');

parser.init();
min.init();

var pages = config.getAllPages();
for (var pageName in pages) {
    if (!pages.hasOwnProperty(pageName)) {
        continue;
    }
    console.log('====== Page:', pageName, ' ======');
    if (config.pageNeedMin(pageName)) {
        console.log('page need min');
        min.page(pageName);

        var minResults = [];
        var outputResults = {};
        var finalOutput = {
            js: [],
            css: []
        };
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

        //console.log(finalOutput);
        //return finalOutput;
    } else {
        console.log(parser.getPage(pageName));
    }
}