/**
 * Created by at15 on 7/10/14.
 */
// deal with the compress
var min = {};

var fs = require('fs');
var path = require('path');

var log = require('./log');
var fh = require('./file-helper');

var UglifyJS = require("uglify-js"); // compress js
var CleanCSS = require('clean-css'); // compress css

// var minify = new CleanCSS().minify(content);

// return the minfiied css content
min.css = function (cssFiles) {
    var content = '';
    cssFiles.forEach(function (p) {
        if (path.extname(p) === '.css') {
            content += fs.readFileSync(p);
        }
    });
    var minify = new CleanCSS().minify(content);
    return minify;
};

// return minified js content.
// TODO:how to test?
min.js = function (jsFiles) {
    var realJsFiles = [];
    jsFiles.forEach(function (p) {
        if (path.extname(p) === '.js') {
            realJsFiles.push(p);
        }
    });
    var result = UglifyJS.minify(realJsFiles);
    return result.code;
};

min.lib = function (opt) {
    var files = opt.files;
    var name = opt.name;
    var dstFolder = opt.dstFolder;

    // split js and min
    var jsFiles = fh.split(files, 'js');
    var jsPath = '';

    // TODO:已经压缩过就不要再压缩了。。。额

    // libs like font-awesome don't have js
    if (jsFiles.length) {
        jsPath = path.join(dstFolder, name + '.min.js');
        fh.write(jsPath, min.js(jsFiles));
    }

    // split the css and min
    var cssFiles = fh.split(files, 'css');
    var cssPath = '';
    if (cssFiles.length) {
        cssPath = path.join(dstFolder, name + '.min.css');
        fh.write(cssPath, min.css(cssFiles));
    }

    var scripts = [];
    if (jsPath) {
        scripts.push(jsPath);
    }
    if (cssPath) {
        scripts.push(cssPath);
    }

    return scripts;

};

module.exports = min;