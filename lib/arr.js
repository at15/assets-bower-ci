/**
 * Created by at15 on 7/10/14.
 */
// some easy operation for array. don't care about efficiency currently

var arr = {};

var log = require('./log');

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

// 返回两个数组中共同的部分
arr.common = function(s1,s2){
    var common = [];
    for(var i = 0, len = s2.length;i<len;i++){
        if(-1 !== arr.inArray(s1,s2[i])){
            common.push(s2[i]);
        }
    }
    return common;
};

// 从src中减去subtraction
arr.subtract = function(src,subtraction){
    for(var i= 0,len = src.length;i<len;i++){
        if(-1 !== arr.inArray(subtraction,src[i])){
            src.splice(i,1);
        }
    }
    return src;
};

module.exports = arr;
