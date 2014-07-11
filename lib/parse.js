/**
 * Created by W7_64 on 2014/7/11.
 */
var parse = {};
var log = require('./log');
var arrh = require('./arr');
var bowerh = require('./bower-helper');
var fileh = require('./file-helper');

parse.isLoaded = function (libName, excluded) {
    if (arrh.inArray(excluded, libName)) {
        return true;
    } else {
        return false;
    }
};

parse.lib = function (libConfig, excluded) {
    var libFiles = [];
    var libName = libConfig.name;
    if (libConfig.bower) {
        var bowerPkg = bowerh.read(libName);
        libFiles = bowerh.copy(bowerPkg);
    } else {
        // get all the dependencies(lib)
        if (typeof libConfig.dependencies === 'object') {
            var deps = libConfig.dependencies;
            log.debug('Loading dependencies for ' + libName);
            deps.forEach(function (d) {
                if (!parse.isLoaded(d, excluded)) {
                    libFiles = arrh.merge(libFiles, parse.parseLib(d));
                }
            });
        }
        // get all the files
        var fileGlob = libConfig.files;
        libFiles = arrh.merge(libFiles, fileh.glob(fileGlob));
    }
    return libFiles;
};

parse.group = function (groupConfig) {

};

module.exports = parse;