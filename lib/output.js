/**
 * Created by at15 on 15-3-10.
 */
//  used to output the files.
var output = {};

var path = require('path');
var fh = require('./file-helper');
var config = require('./config');

var fileWrote = {};

output.addPage = function (pageFiles) {

};

output.minLib = function (minResults, libName) {
    var p = path.join(config.getDstFolder(), 'lib', libName, libName);
    return output.min(p, minResults);
};

output.minGroup = function (minResults, groupName) {
    var p = path.join(config.getDstFolder(), 'group', groupName, groupName);
    return output.min(p, minResults);
};

output.minPageFile = function (minResults, pageName) {
    var p = path.join(config.getDstFolder(), 'page', pageName, pageName);
    return output.min(p, minResults);
};

output.min = function (folder, minResults) {
    //console.log('need min!');
    var result = {js: '', css: ''};
    var dstJs = folder + '.min.js';
    var dstCss = folder + '.min.css';
    if (minResults.js.code) {
        fh.write(dstJs, minResults.js.code);
        result.js = dstJs;
    }
    if (minResults.css.code) {
        fh.write(dstCss, minResults.css.code);
        result.css = dstCss;
    }
    if (config.needMapFile()) {
        var dstJsMap = folder + '.min.js.map';
        if (minResults.js.map) {
            fh.write(dstJsMap, minResults.js.map);
        }
        //    TODO: css map, which is not working in the lib min
    }
    return result;
};

output.getJson = function () {

};

module.exports = output;