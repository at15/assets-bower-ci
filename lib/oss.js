/**
 * Created by at15 on 14-11-10.
 */
var ossUploader = {};

var log = require('./log');
var OSS = require('oss-client');

ossUploader.toUpload = {};

/**
 *
 * config
 * {
 * "accessKeyId": "your key,
 * "accessKeySecret": "your secret"
 * }
 * @param config
 */
ossUploader.init = function (config) {
    var realConfig = {};
    if (typeof config === 'string') {
        realConfig = require(config);
        if (typeof realConfig !== 'object') {
            log.error('cant read oss config fileHelper');
        }
    } else {
        realConfig = config;
    }
    this.oss = OSS.create(realConfig);
};

ossUploader.uploadAssetsJson = function (parsedJson, webroot) {
    var me = this;
    // log.error(typeof parsedJson);
    for (var pageName in parsedJson) {
        if (!parsedJson.hasOwnProperty(pageName)) {
            continue;
        }
        var onePage = parsedJson[pageName];
        onePage.js.forEach(function (jsPath) {
            me._addToUpload(jsPath, webroot + '/' + jsPath);
        });

        onePage.css.forEach(function (cssPath) {
            me._addToUpload(cssPath, webroot + '/' + cssPath);
        });
    }
    this._realUpload();
};

ossUploader._addToUpload = function (objectName, realPath) {
    if (typeof this.toUpload[objectName] === 'undefined') {
        this.toUpload[objectName] = realPath;
    }
};

/**
 * @todo error handling
 * @private
 */
ossUploader._realUpload = function () {
    for (var objName in this.toUpload) {
        if (!this.toUpload.hasOwnProperty(objName)) {
            continue;
        }
        //console.log(this.toUpload);
        log.warn(objName);
        this.oss.putObject(
            {
                bucket: 'tongqu-fileHelper',
                object: objName,
                srcFile: this.toUpload[objName]
            }, function (err, result) {
                if (err) {
                    log.error(err);
                } else {
                    log.debug('uploaded');
                }
                //log.debug(result);
            });
    }
};
module.exports = ossUploader;