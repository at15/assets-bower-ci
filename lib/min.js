/**
 * Created by at15 on 7/10/14.
 */
'use strict';

// deal with the compress
var min = {};

var fs = require('fs');
var path = require('path');

var UglifyJS = require("uglify-js"); // compress js
var CleanCSS = require('clean-css'); // compress css
var lodash = require('lodash');

var config = require('./config');
// var log = require('./log');
var fh = require('./file-helper');
// var hash = require('./hash'); // add hash to fileHelper name
var parser = require('./parser');

// cache for min
var minGroups = {};
var minLibs = {};

min.init = function () {
    min.cleanCache();
};

min.cleanCache = function () {
    minGroups = {};
    minLibs = {};
};

min.lib = function (name) {
    if (typeof minLibs[name] === 'object') {
        return minLibs[name];
    }
    // do the real min
    var toMinFiles = parser.getLib(name);
    minLibs[name] = min.files(toMinFiles);
    return minLibs[name];
};

min.group = function (name) {
    if (typeof minGroups[name] === 'object') {
        return minGroups[name];
    }
    // do the real min
    var toMinFiles = parser.getGroup(name);
    minGroups[name] = min.files(toMinFiles);
    return minGroups[name];
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
            jsMinResult = min.js(jsFiles, libOrGroupName + '.min.js.map');
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
    var realJsFiles = lodash.filter(jsFiles, function (p) {
        return path.extname(p) === '.js';
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
