/**
 * Created by at15 on 14-7-8.
 */
var tq = {};
var fs = require('fs');
var path = require('path');

tq.inArray = function (arr, niddle) {
    var i, len = arr.length;
    if (len && arr[0] === niddle) {
        return 0;
    }
    for (i = 0; i < len; i++) {
        if (niddle === arr[i]) {
            return i;
        }
    }
    return -1;
};

// copy file sync
tq.cp = function (src, dst) {
    console.log('copy ' + src + ' to ' + dst);
    if(!fs.exists(path.dirname(dst))){
        fs.mkdirp
    }
    var content = fs.readFileSync(src);
    fs.writeFileSync(dst, content);
};
module.exports = tq;