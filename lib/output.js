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

// TODO:rename, most function name as quite missleading ...
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

output.writeCompressedLib = function (minResults, libName) {
    // TODO: is the file path libName/libName really useful?
    // lib/jquery.min.js is enough lib/jquery/jquery.min.js is quite redundant
    var p = path.join(config.getDstFolder(), 'lib', libName, libName);
    return output.writeCompressed(p, minResults);
};

output.writeCompressedGroup = function (minResults, groupName) {
    var p = path.join(config.getDstFolder(), 'group', groupName, groupName);
    return output.writeCompressed(p, minResults);
};

output.writeCompressedPage = function (minResults, pageName) {
    var p = path.join(config.getDstFolder(), 'page', pageName, pageName);
    return output.writeCompressed(p, minResults);
};

output.writeCompressed = function (pathWithoutExt, minResults) {
    var result = {js: '', css: ''};
    if (minResults.js.code) {
        result.js = fh.writeWithHash(pathWithoutExt, minResults.js.code, 'min.js');
    }
    if (minResults.css.code) {
        result.css = fh.writeWithHash(pathWithoutExt, minResults.css.code, 'min.css');
    }
    // TODO:map file is indeed a problem...should it also include hash?
    if (config.needMapFile()) {
        var dstJsMap = pathWithoutExt + '.min.js.map';
        if (minResults.js.map) {
            fh.write(dstJsMap, minResults.js.map);
        }
        // TODO: css map, which is not working in the lib min
    }
    return result;
};

module.exports = output;
