/**
 * Created by at15 on 14-11-10.
 */

var OSS = require('oss-client');

var option = require('../config/oss.json');

console.log(option);
var oss = OSS.create(option);

// upload sth
/*
 * srcFile: 上传的文件路径
 * userMetas: 可选，object类型，用户自定义header，如: x-oss-meta-location
 */
oss.putObject({
    bucket: 'tongqu-image',
    object: 'asd',
    srcFile: 'mgr.js'
}, function (err, result) {
    if (!err) {
        console.log(result);
    } else {
        console.log(err);
    }
});