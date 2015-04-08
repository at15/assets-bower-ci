/**
 * Created by at15_000 on 2014/10/6.
 */

// generate hash for given fileHelper path,
// sync

var crypto = require('crypto');
var fs = require('fs');

// change the algo to sha1, sha256 etc according to your requirements

var hashed = {fileName: 'asdasdasdasdad'};

function hash(filePath) {
    if (typeof hashed[filePath] !== 'undefined') {
        return hashed[filePath];
    } else {
        var algo = 'md5';
        var shasum = crypto.createHash(algo);
        shasum.update(fs.readFileSync(filePath));
        // cache the result
        var hash_value = shasum.digest('hex');
        hashed[filePath] = hash_value;
        return hash_value;
    }
}

module.exports = hash;
