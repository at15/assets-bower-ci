/**
 * Created by at15 on 15-5-16.
 */
'use strict';

var config = require('./config');
var fh = require('./file-helper');
var parser = require('./parser');
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
        if (typeof outputResults.js === 'object') {
            this.js = this.js.concat(outputResults.js);
        } else {
            this.js.push(outputResults.js);
        }
    }

    if (outputResults.css) {
        if (typeof outputResults.css === 'object') {
            this.css = this.css.concat(outputResults.css);
        } else {
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
    this.config.libs.forEach(function (libName) {
        var libFiles = parser.getLib(libName);
        if (me.needMin()) {
            var compressed = min.lib(libName, libFiles);
            // TODO:this will cause the file to be wrote multiple times
            me.add(output.writeCompressedLib(compressed, libName));
        } else {
            me.add(output.writeUncompressed(libFiles));
        }
    });
};

Page.prototype.processGroup = function () {
    var me = this;
    this.config.groups.forEach(function (groupName) {
        var groupFiles = parser.getGroup(groupName);
        if (me.needMin()) {
            var compressed = min.group(groupName, groupFiles);
            me.add(output.writeCompressedGroup(compressed, groupName));
        } else {
            me.add(output.writeUncompressed(groupFiles));
        }
    });
};

Page.prototype.processFiles = function () {
    var me = this;
    var files = fh.glob(this.config.files);
    if (this.needMin()) {
        var compressed = min.files(files);
        me.add(output.writeCompressedPage(compressed, me.pageName));
    } else {
        me.add(output.writeUncompressed(files));
    }
};

Page.prototype.processAll = function () {
    if (typeof this.config.libs === 'object') {
        this.processLib();
    }
    if (typeof this.config.groups === 'object') {
        this.processGroup();
    }
    if (typeof this.config.files === 'object') {
        this.processFiles();
    }
};

module.exports = Page;
