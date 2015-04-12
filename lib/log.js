/**
 * Created by W7_64 on 2014/7/11.
 */

// Todo: Standardize error throwing.

// OldTodo: allow different config in different env.

var config = require('./config');
var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'console'
        }
    ]
});
var log = log4js.getLogger();

log.raise = function (message, object) {
    log.fatal(message);
    if (object) {
        log.fatal(object);
    }
    throw new Error(message);
};

module.exports = log;