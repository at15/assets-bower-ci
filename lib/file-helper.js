// deal with the file operation
var file = {};

var fs = require('fs');
var glob = require('glob');
var path = require('path');
var mkdirp = require('mkdirp');

var log4js = require('log4js');
log4js.configure({appenders: [
    { type: 'console' }
]
});
var log = log4js.getLogger();
log.setLevel('DEBUG');

/**
 * 根据通配符返回符合要求的所有文件的absolute path
 *
 * @param fileGlob
 * @returns {Array}
 */
file.glob = function (fileGlob) {
    var allFiles = [];
    if (typeof fileGlob !== 'object') {
        fileGlob = [fileGlob];
    }
    fileGlob.forEach(function (pattern) {
        var files = glob.sync(pattern, {});
        files.forEach(function (p) {
            allFiles.push(path.resolve(p));
        });
    });
    return allFiles;
};

/**
 * copy the file and create dir if dir don't exists
 *
 * @param src
 * @param dst
 */
file.copy = function (src, dst) {
    if (!fs.existsSync(path.dirname(dst))) {
        mkdirp.sync(path.dirname(dst));
    }
    fs.writeFileSync(dst, fs.readFileSync(src));
};

module.exports = file;
