/**
 * Created by at15 on 14-7-10.
 */
var helper = {};

var fs = require('fs');
var path = require('path');
var fh = require('./file-helper');

var log4js = require('log4js');
log4js.configure({appenders: [
    { type: 'console' }
]
});
var log = log4js.getLogger();
log.setLevel('DEBUG');

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

module.exports = helper;