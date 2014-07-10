// deal with the file operation
var file = {};
var glob = require('glob');
var path = require('path');

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

module.exports = file;
