/**
 * Created by at15 on 14-7-10.
 */
var helper = {};

var fs = require('fs');
var path = require('path');

var fh = require('./file-helper');
var log = require('./log');

helper.getPkgPath = function (pkgName) {
    return 'bower_components/' + pkgName;
};

helper.read = function (pkgName) {

    var pkg = {
        name: pkgName,
        files: []
    };

    var bowerPath = helper.getPkgPath(pkgName);
    var bowerJsonPath = bowerPath + '/bower.json';
    var bowerJson = {};
    try {
        bowerJson = JSON.parse(fs.readFileSync(bowerJsonPath));
    } catch (e) {
        log.warn('Can\'t read bower.json for ' + pkgName +
            ' in ' + bowerJsonPath);
        // need to try .bower.json
        bowerJsonPath = bowerPath + '/.bower.json';
        try {
            bowerJson = JSON.parse(fs.readFileSync(bowerJsonPath));
        } catch (e) {
            log.error('Can\'t read bower.json for ' + pkgName +
                ' in ' + bowerJsonPath);
            return pkg;
        }
    }
    // console.log(bowerJson);

    //TODO: get the dependencies

    // change the directory
    var cwd = process.cwd();
    process.chdir(bowerPath);

    var mainFilesGlob = bowerJson.main;
    pkg.files = fh.glob(mainFilesGlob);

    // go back to the previous dir
    process.chdir(cwd);

    return pkg;

};

/**
 * 把某个库的文件按照结构复制到某个文件夹下
 *
 * @param pkg
 * @param dstFolder
 * @returns {Array}
 */
helper.copy = function (pkg, dstFolder) {
    
    if (typeof dstFolder === 'undefined') {
        log.error('DstFolder is not set, can\'t copy pkg files');
        return [];
    }

    var libPath = dstFolder + '/' + pkg.name;
    var bowerPath = path.resolve(this.getPkgPath(pkg.name));
    var rPath;
    var dstPath;
    var allFiles = [];
    pkg.files.forEach(function (filePath) {
        rPath = path.relative(bowerPath, filePath);
        dstPath = path.join(libPath, rPath);
        fh.copy(filePath, dstPath);
        allFiles.push(path.resolve(dstPath));
    });
    return allFiles;
};

module.exports = helper;