/**
 * Created by at15 on 15-3-10.
 */
'use strict';

//  used to output the files.
var output = {};

var path = require('path');
var fh = require('./file-helper');
var config = require('./config');

var pages = {};

output.addPage = function (pageName, result) {
    // resolve the path here
    result.js = fh.resolve(result.js, config.getDstWebRoot());
    result.css = fh.resolve(result.css, config.getDstWebRoot());
    pages[pageName] = result;
};

output.toJson = function () {
    var dst = config.getDstJson();
    // add other json config
    var wrapped = {
        environment: config.currentEnvironment(),
        baseUrl: config.getBaseUrl(),
        pages: pages
    };
    var strPages = JSON.stringify(wrapped, null, 4);
    // 把\\替换成/以避免windows下路径分割符导致的错误
    strPages = strPages.replace(/\\\\/g, '/');
    fh.write(dst, strPages);
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

output.cp = function(){

};

module.exports = output;
