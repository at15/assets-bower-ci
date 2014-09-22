/**
 * Created by at15 on 14-9-22.
 */
// 把html变成js(仅适用于angularjs的模板)

// 1. 生成js
// 2. 生成php
var log = require('./log');
var fs = require('fs');
var util = require('util');

var fh = require('./file-helper');

var HTML_TEMPLATE = "<script type='text/ng-template' id=\"%s\">%s</script>";

var TEMPLATE_DECLARED_MODULE = "angular.module(\'%s\').run([\'$templateCache\', function($templateCache) {\n" +
    "  $templateCache.put(\'%s\',\n    \'%s\');\n" +
    "}]);\n";

var html2js = {};

function escapeContent(content) {
    content = String(content);
    return content.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r?\n/g, "\\n' +\n    '");
}

html2js.check = function (opt) {
    if (typeof opt.src === 'undefined') {
        log.error('src for nghtml2js is not defined');
        return false;
    }
    // if(typeof opt.dst === 'undefined'){
    // 	log.error('dst for nghtml2js is not defined');
    // 	return false;
    // }
    if (typeof opt.module === 'undefined') {
        log.warn('module is not set, tqApp by default');
        opt.module = 'tqApp';
    }

    if (typeof opt.url === 'undefined') {
        log.error('url for nghtml2js is not defined');
        return false;
    }
    return true;
};

html2js.toJs = function (opt) {
    if (!html2js.check(opt)) {
        console.log(opt);
        //throw new Error('cant pass check for to js');
        return '';
    }


    // do the real stuff
    var content = escapeContent(fs.readFileSync(opt.src));
    content = util.format(TEMPLATE_DECLARED_MODULE, opt.module, opt.url, content);
    return content;
};

html2js.toPhp = function () {

};

module.exports = html2js;