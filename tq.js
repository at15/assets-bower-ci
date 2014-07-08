/**
 * Created by at15 on 14-7-8.
 */
var tq = {};

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

module.exports = tq;