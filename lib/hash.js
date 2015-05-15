/**
 * Created by at15_000 on 2014/10/6.
 */

'use strict';

// generate hash for given fileHelper path, sync
var crypto = require('crypto');
var fs = require('fs');
var cached = {fileName: 'asdasdasdasdad'};

function hashByData(data) {
    // TODO:allow change algo
    var algo = 'md5';
    var shasum = crypto.createHash(algo);
    shasum.update(data);
    return shasum.digest('hex');
}

function hashByFilePath(filePath) {
    if (typeof cached[filePath] !== 'undefined') {
        return cached[filePath];
    } else {
        var hashValue = hashByData(fs.readFileSync(filePath));
        cached[filePath] = hashValue;
        return hashValue;
    }
}

var hash = {
    path: hashByFilePath,
    data: hashByData
};

module.exports = hash;
