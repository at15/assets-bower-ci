/**
 * Created by at15 on 7/10/14.
 */
// deal with the compress
var min = {};

var fs = require('fs');
var path = require('path');

var UglifyJS = require("uglify-js"); // compress js
var CleanCSS = require('clean-css'); // compress css

var config = require('./config');
var log = require('./log');
var fh = require('./file-helper');
var arrh = require('./arr');
var hash = require('./hash');// add hash to fileHelper name
var parser = require('./parser');

// cache for min
var minGroups = {};
var minLibs = {};
var minPages = {};

min.init = function () {
    min.cleanCache();
};

min.cleanCache = function () {
    minGroups = {};
    minLibs = {};
};

min.page = function (pageName) {
    var minResults = [];
    var jsResults = [];
    var cssResults = [];
    var pageConfig = config.getPage(pageName);

    if (typeof pageConfig.libs === 'object') {
        pageConfig.libs.forEach(function (libName) {
            minResults = min.lib(libName);
            jsResults.push(minResults.js);
            cssResults.push(minResults.css);
        });
    }

    // load the groups
    if (typeof  pageConfig.groups === 'object') {
        pageConfig.groups.forEach(function (groupName) {
            minResults = min.group(groupName);
            jsResults.push(minResults.js);
            cssResults.push(minResults.css);
        });
    }

    // load the files
    if (typeof  pageConfig.files === 'object') {
        minResults = min.files(fh.glob(pageConfig.files));
        jsResults.push(minResults.js);
        cssResults.push(minResults.css);
    }

    return {
        js: jsResults,
        css: cssResults
    };
};

min.lib = function (name) {
    if (typeof minLibs[name] === 'object') {
        return minLibs[name];
    }
    // do the real min
    var toMinFiles = parser.getLib(name);
    return minLibs[name] = min.files(toMinFiles);
};

min.group = function (name) {
    if (typeof minGroups[name] === 'object') {
        return minGroups[name];
    }
    // do the real min
    var toMinFiles = parser.getGroup(name);
    return minGroups[name] = min.files(toMinFiles);
};

min.files = function (files, libOrGroupName) {
    var jsFiles = fh.split(files, 'js');
    var cssFiles = fh.split(files, 'css');
    // TODO:the dst folder? or we just store everything in memory?
    var jsMinResult = {
        code: '',
        map: ''
    };
    if (jsFiles.length) {
        if (config.needMapFile()) {
            jsMinResult = min.js(jsFiles, libOrGroupName + '.min.js.map')
        } else {
            jsMinResult = min.js(jsFiles);
            jsMinResult.map = '';
        }
    }
    var cssMinResult = {
        code: '',
        map: ''
    };
    if (cssFiles.length) {
        // TODO: decide if gen map fileHelper in different conditions
        cssMinResult = min.css(cssFiles);
    }
    return {
        js: jsMinResult,
        css: cssMinResult
    };
};

// return the minfiied css content and map
min.css = function (cssFiles) {
    var content = '';
    cssFiles.forEach(function (p) {
        if (path.extname(p) === '.css') {
            content += fs.readFileSync(p);
        }
    });
    // TODO:the real source map
    var minify = new CleanCSS().minify(content);
    return {
        code: minify.styles,
        map: ''
    };
};

// return minified js content and map
// TODO:how to test?
min.js = function (jsFiles, mapFileName) {
    var realJsFiles = [];
    jsFiles.forEach(function (p) {
        if (path.extname(p) === '.js') {
            realJsFiles.push(p);
        }
    });
    if (mapFileName !== '') {
        return UglifyJS.minify(realJsFiles, {
            outSourceMap: mapFileName
        });
    } else {
        return UglifyJS.minify(realJsFiles);
    }
};

module.exports = min;