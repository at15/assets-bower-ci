/**
 * Created by at15 on 14-7-8.
 */
var tq = {};
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

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
    // console.log('copy ' + src + ' to ' + dst);
    if (!fs.existsSync(path.dirname(dst))) {
        mkdirp.sync(path.dirname(dst));
    }
    fs.writeFileSync(dst, fs.readFileSync(src));
};



module.exports = tq;