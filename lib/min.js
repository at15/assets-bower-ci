/**
 * Created by at15 on 7/10/14.
 */
// deal with the compress
var min = {};

var fs = require('fs');
var path = require('path');

var log = require('./log');
var arrh = require('./arr');
var fh = require('./file-helper');

var UglifyJS = require("uglify-js"); // compress js
var CleanCSS = require('clean-css'); // compress css

var hash = require('./hash');// add hash to file name

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
// TODO:gen map file
min.js = function (jsFiles, mapFileName) {
    var realJsFiles = [];
    jsFiles.forEach(function (p) {
        if (path.extname(p) === '.js') {
            realJsFiles.push(p);
        }
    });
    return UglifyJS.minify(realJsFiles, {
        outSourceMap: mapFileName
    });
};

min.lib = function (opt) {
    var files = opt.files;
    var name = opt.name;
    var dstFolder = opt.dstFolder;

    // split js and min
    var jsFiles = fh.split(files, 'js');
    var jsPath = '';

    // TODO:已经压缩过就不要再压缩了。。。额

    var hashValue = '';
    var tmpPath = '';
    // libs like font-awesome don't have js
    if (jsFiles.length) {
        jsPath = path.join(dstFolder, name + '.min.js');
        var jsMinResult = min.js(jsFiles, name + '.min.js.map');
        fh.write(jsPath, jsMinResult.code);
        // add hash tag to the file. TODO:refactor it to file-helper
        hashValue = hash(jsPath);
        tmpPath = jsPath;
        jsPath = path.join(dstFolder, name + '-' + hashValue.substr(0, 6) + '.min.js');
        fh.rename(tmpPath, jsPath);
        fh.write(jsPath + '.map', jsMinResult.map);
    }

    // split the css and min
    var cssFiles = fh.split(files, 'css');
    var cssPath = '';
    if (cssFiles.length) {
        cssPath = path.join(dstFolder, name + '.min.css');
        fh.write(cssPath, min.css(cssFiles));
        // add hash tag to the file
        hashValue = hash(cssPath);
        tmpPath = cssPath;
        cssPath = path.join(dstFolder, name + '-' + hashValue.substr(0, 6) + '.min.css');
        fh.rename(tmpPath, cssPath);
    }

    var scripts = [];
    if (jsPath) {
        scripts.push(path.resolve(jsPath));
    }
    if (cssPath) {
        scripts.push(path.resolve(cssPath));
    }

//    // TODO:copy other files like the font etc
//    var restFiles = arrh.subtract(files,jsFiles);
//    restFiles = arrh.subtract(restFiles,cssFiles);
//    var dstPath;
//    restFiles = restFiles.map(function(p){
//        dstPath = path.join(dstFolder,path.basename(p)
//    });
//    pkg.files.forEach(function (filePath) {
//        rPath = path.relative(bowerPath, filePath);
//        dstPath = path.join(libPath, rPath);
//        fh.copy(filePath, dstPath);
//        allFiles.push(path.resolve(dstPath));
//    });
//    restFiles = fh.copy()

    return scripts;

};

module.exports = min;