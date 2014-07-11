/**
 * Created by at15 on 7/10/14.
 */
// deal with the compress
var min = {};

var log4js = require('log4js');
log4js.configure({appenders: [
    { type: 'console' }
]
});
var log = log4js.getLogger();
log.setLevel('DEBUG');

var UglifyJS = require("uglify-js"); // compress js
var CleanCSS = require('clean-css'); // compress css

// var minify = new CleanCSS().minify(content);

// return the minfiied css content
min.css = function (cssFiles) {
    var content = '';
    cssFiles.forEach(function (p) {
        if (path.extname(p) === '.css') {
            content += fs.readFileSync(p);
        }
    });
    var minify = new CleanCSS().minify(content);
    return minify;
};

// return minified js content.
// TODO:how to test?
min.js = function (jsFiles) {
    var realJsFiles = [];
    jsFiles.forEach(function (p) {
        if (path.extname(p) === '.js') {
            realJsFiles.push(p);
        }
    });
    var result = UglifyJS.minify(realJsFiles);
    return result.code;
};

/**
* minify css and write it to a file
*/
min.cssToFile = function (cssFiles) {
	// body...
};

module.exports = min;