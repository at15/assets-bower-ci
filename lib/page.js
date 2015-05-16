/**
 * Created by at15 on 15-5-16.
 */
var config = require('./config');

function Page(pageName) {
    this.pageName = pageName;
    this.config = config.getPage(this.pageName);
    this.proceeded = {
        lib: []
    };
}

Page.prototype.needMin = function () {
    return config.pageNeedMin(this.pageName);
};

Page.prototype.processLib = function () {

};

Page.prototype.processGroup = function () {

};

Page.prototype.processFiles = function () {

};