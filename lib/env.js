/**
 * Created by at15 on 15-3-7.
 */
// a wrapper for environment variables
var env = {
    _data: process.env,
    // env.get('distFolder')
    // env.get('color','red')
    // env.get('color','',true)
    get: function (name) {
        if (typeof this._data[name] !== 'undefined') {
            return this._data[name];
        }
        // throw error if this config is a must and cant use default value
        if (arguments.length === 3 && arguments[2] === true) {
            throw new Error('config item ' + name + ' not found');
        }
        // there is default value
        if (arguments.length === 2) {
            return arguments[1];
        }
        // null if we got nothing
        return null;
    },
    // for test. change the env variables on the fly
    refresh: function () {
        this._data = process.env;
    }
};

module.exports = env;