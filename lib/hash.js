/**
 * Created by at15_000 on 2014/10/6.
 */

// generate hash for given file path,
// sync

var crypto = require('crypto');
var fs = require('fs');

// change the algo to sha1, sha256 etc according to your requirements

var hashed = {file_name: 'asdasdasdasdad'};

function hash(file_path) {
    if (typeof hashed[file_path] !== 'undefined') {
        return hashed[file_path];
    } else {
        var algo = 'md5';
        var shasum = crypto.createHash(algo);
        shasum.update(fs.readFileSync(file_path));
        // cache the result
        var hash_value = shasum.digest('hex');
        hashed[file_path] = hash_value;
        return hash_value;
    }
}

module.exports = hash;
