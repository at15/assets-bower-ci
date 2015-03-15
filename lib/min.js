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
var hash = require('./hash');// add hash to file name
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

// return the minfiied css content
// TODO:css can also have map file.
min.css = function (cssFiles) {
    var content = '';
    cssFiles.forEach(function (p) {
        if (path.extname(p) === '.css') {
            content += fs.readFileSync(p);
        }
    });
    var minify = new CleanCSS().minify(content);
    return minify.styles;
};

// return minified js content.
// TODO:how to test?
min.js = function (jsFiles, mapFileName) {
    var realJsFiles = [];
    jsFiles.forEach(function (p) {
        if (path.extname(p) === '.js') {
            realJsFiles.push(p);
        }
    });
    // TODO:move the need min stuff to min.lib
    if (config.needMapFile()) {
        return UglifyJS.minify(realJsFiles, {
            outSourceMap: mapFileName
        });
    }
};

min.page = function (pageName) {

};

min.lib = function (name) {
    if (typeof minLibs[name] === 'object') {
        return minLibs[name];
    }
    // do the real min
    var minFiles = [];
    minLibs[name] = minFiles;
    return minFiles;
};

min.group = function (name) {
    if (typeof minGroups[name] === 'object') {
        return minGroups[name];
    }
    // do the real min
    var toMinFiles = [];
    var groupConfig = config.getGroup(name);
    if (typeof groupConfig.libs === 'object') {
        groupConfig.libs.forEach(function (libName) {
            toMinFiles = arrh.merge(toMinFiles, min.lib(libName));
        });
    }
    if (typeof groupConfig.files === 'object') {
        toMinFiles = arrh.merge(toMinFiles, fh.glob(groupConfig.files));
    }
    return minGroups[name] = min.files(toMinFiles);
};

min.files = function (files) {
    var jsFiles = fh.split(files, 'js');
    var cssFiles = fh.split(files,'css');
    // TODO:the dst folder? or we just store everything in memory?
    if(jsFiles.length){

    }
    if(cssFiles.length){

    }
};

min.libOld = function (opt) {
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