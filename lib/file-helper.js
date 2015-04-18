'use strict';

// deal with the file operation
var fileHelper = {};

var fs = require('fs');
var glob = require('glob');
var pathjs = require('path');
var mkdirp = require('mkdirp');

var log = require('./log');
var lodash = require('lodash');
var hash = require('./hash'); // add hash to fileHelper name

fileHelper.readJson = function (path) {
    var json = {};
    try {
        json = JSON.parse(fs.readFileSync(path));
    } catch (e) {
        log.error('Cannot parse json ' + path);
    }
    return json;
};

/**
 * 根据通配符返回符合要求的所有文件的absolute path
 *
 * @param fileGlob
 * @returns {Array}
 */
fileHelper.glob = function (fileGlob) {
    var allFiles = [];
    if (typeof fileGlob !== 'object') {
        fileGlob = [fileGlob];
    }
    fileGlob.forEach(function (pattern) {
        var files = glob.sync(pattern, {});
        if (files.length === 0) {
            log.error('Pattern "' + pattern + '" matches no file');
        } else {
            files.forEach(function (p) {
                allFiles.push(pathjs.resolve(p));
            });
        }
    });
    return allFiles;
};

fileHelper.dfs = function (dir) {
    var result = [];
    var root = fs.readdirSync(dir);
    for (var i = 0; i < root.length; i++) {
        var filePath = dir + '/' + root[i];
        var stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            result = result.concat(fileHelper.dfs(filePath));
        } else {
            result.push(filePath);
        }
    }
    return result;
};

/**
 *  write fileHelper and create the dir if dir don't exists
 *
 * @param dst
 * @param data
 */
fileHelper.write = function (dst, data) {
    if (!fs.existsSync(pathjs.dirname(dst))) {
        mkdirp.sync(pathjs.dirname(dst));
    }
    fs.writeFileSync(dst, data);
};

/**
 * copy the fileHelper and create dir if dir don't exists
 *
 * @param src
 * @param dst
 */
fileHelper.copy = function (src, dst) {
    if (!fs.existsSync(pathjs.dirname(dst))) {
        mkdirp.sync(pathjs.dirname(dst));
    }
    fs.writeFileSync(dst, fs.readFileSync(src));
};

// resolve the absolute path to relative path to the root
fileHelper.resolve = function (files, root) {
    var resolvedPath = [];
    if (typeof root === 'undefined') {
        log.error('root is undefined!');
        return files;
    }
    files.forEach(function (p) {
        resolvedPath.push(pathjs.relative(root, p));
    });
    return resolvedPath;
};

// split files by their extension
fileHelper.split = function (files, exts) {
    // 给index补上前面的点
    if (typeof exts === 'string') {
        exts = [exts];// make it an array
    }
    exts = exts.map(function (ext) {
        if (ext.indexOf('.') !== 0) {
            ext = '.' + ext;
        }
        return ext;
    });

    var rFiles = [];
    files.forEach(function (f) {
        if (lodash.includes(exts, pathjs.extname(f))) {
            rFiles.push(f);
        }
    });
    return rFiles;
};

fileHelper.rename = function (olrPath, newPath) {
    fs.renameSync(olrPath, newPath);
};

fileHelper.addHash = function (filePath, hashLength) {
    var hashValue = hash(filePath);
    var jsPath = pathjs.join(
        pathjs.dirname(filePath),
        name + '-' + hashValue.substr(0, hashLength) + '.min.js'
    );
    fileHelper.rename(filePath, jsPath);
};

module.exports = fileHelper;
