/**
 * Created by W7_64 on 2014/7/11.
 */
var parse = {};
var log = require('./log');
var arrh = require('./arr');
var bowerh = require('./bower-helper');
var fileh = require('./file-helper');

// we can make the parser itself OOP !
function Parser(){
    this.loadedLibs = {};// record loaded libs, do the cache as well
    this.loadedFiles = {};// loaded files
}

Parser.prototype.parseLib = function(libConfig){
    if(typeof this.loadedLibs[libConfig.name] !== 'undefined'){
        return this.loadedLibs[libConfig.name];
    }
    // do the real parse, and also cache it
    var libFiles = this.parseLibReal(libConfig);
    this.loadedLibs[libConfig.name] = libFiles;
    // push the files
    arrh.merge(this.loadedFiles,libFiles);
    return this.loadedLibs[libConfig.name];
};

//TODO: 其实可以用从所有文件中减去已经加载过的文件来避免这个问题,这个对于自己自定义的group应该也会有帮助?
Parser.prototype.isLoaded = function (libName) {
   return typeof this.loadedLibs[libName] === 'object';
};

Parser.prototype.parseLibReal = function (libConfig) {
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
            var me = this;
            deps.forEach(function (dLibName) {
                // don't load this lib if it already loaded before
                if (!me.isLoaded(dLibName) ){
                    libFiles = arrh.merge(libFiles, me.parseLib(dLibName));
                }
            });
        }
        // get all the files for this lib
        var fileGlob = libConfig.files;
        libFiles = arrh.merge(libFiles, fileh.glob(fileGlob));
    }
    return libFiles;
};

parse.group = function (groupConfig) {
    log.debug('Parse group: ' + groupConfig.name);
    var groupFiles = [];
    var excludedLib = {};

    groupFiles = this.parseLibsFiles(groupConfig);

    if (groupFiles.length === 0) {
        log.warn('Group: ' + groupName + ' is empty!');
        return [];
    }


    var groupPath = this.getGroupPath(groupName);


};

module.exports = Parser;