/**
 * Created by at15 on 7/10/14.
 */
// some easy operation for array. don't care about efficiency currently

var arr = {};

var log4js = require('log4js');
log4js.configure({appenders: [
    { type: 'console' }
]
});
var log = log4js.getLogger();
log.setLevel('DEBUG');

arr.inArray = function (arr, needle) {
    var i, len = arr.length;
    if (len && arr[0] === needle) {
        return 0;
    }
    for (i = 0; i < len; i++) {
        if (needle === arr[i]) {
            return i;
        }
    }
    return -1;
};

arr.merge = function () {
    var arg = arguments;


    if (arg.length === 0) {
        log.warn('Nothing provided for arr.merge');
        return [];
    }

    // if you only got one array, why bother to merge?
    if (arg.length === 1) {
        log.warn('Should not provide only 1 argument for arr.merge');
        return arg[0];
    }

    var merged = [];

    for (var i = 0, paramLen = arg.length; i < paramLen; i++) {
        var oneArr = arg[i];
        for (var j = 0, arrLen= oneArr.length; j < arrLen; j++) {
            var s = oneArr[j];
            if (-1 === arr.inArray(merged, s)) {
                merged.push(s);
            }
        }
    }
    return merged;
};

module.exports = arr;
