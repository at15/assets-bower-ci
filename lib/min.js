/**
 * Created by at15 on 7/10/14.
 */
// deal with the compress
var min = {};

var log4js = require('log4js');
log4js.configure({appenders: [
    { type: 'console' }
]
});
var log = log4js.getLogger();
log.setLevel('DEBUG');


module.exports = min;