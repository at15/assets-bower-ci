/**
 * Created by at15 on 15-5-16.
 */
var config = require('./config');
var fh = require('./file-helper');
var min = require('./min');
var output = require('./output');

function Page(pageName) {
    this.pageName = pageName;
    this.config = config.getPage(this.pageName);
    this.proceeded = {
        lib: []
    };
    this.js = [];
    this.css = [];
}

Page.prototype.needMin = function () {
    return config.pageNeedMin(this.pageName);
};
Page.prototype.add = function (outputResults) {
    if (outputResults.js) {
        if(typeof outputResults.js === 'object'){
            this.js = this.js.concat(outputResults.js);
        }else{
            this.js.push(outputResults.js);
        }
    }

    if (outputResults.css) {
        if(typeof outputResults.css === 'object'){
            this.css = this.css.concat(outputResults.css);
        }else{
            this.css.push(outputResults.css);
        }
    }
};

Page.prototype.get = function () {
    return {
        js: this.js,
        css: this.css
    };
};

Page.prototype.processLib = function () {
    //console.log(this.config);
    var me = this;
    if (this.needMin()) {
        this.config.libs.forEach(function (libName) {
            me.add(output.writeCompressedLib(
                min.lib(libName),
                libName));
        });
    }else{
        // TODO:copy all lib files with hash.
    }
};

Page.prototype.processGroup = function () {
    var me = this;
    if(this.needMin()){
        this.config.groups.forEach(function (groupName) {
            me.add(output.writeCompressedGroup(
                min.group(groupName),
                groupName));
        });
    }else{
        // TODO:cp with hash as above
    }
};

Page.prototype.processFiles = function () {
    var me = this;
    if(this.needMin()){
        me.add(output.writeCompressedPage(
            min.files(fh.glob(this.config.files)),
            me.pageName));
    }else{
        // TODO:cp and has as above
    }
};

Page.prototype.processAll = function () {
    if(typeof this.config.libs === 'object'){
        this.processLib();
    }
    if(typeof this.config.groups === 'object'){
        this.processGroup();
    }
    if(typeof this.config.files === 'object'){
        this.processFiles();
    }
};

module.exports = Page;