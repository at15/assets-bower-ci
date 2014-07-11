/**
 * Created by W7_64 on 2014/7/11.
 */
var log4js = require('log4js');
log4js.configure({appenders: [
    { type: 'console' }
]
});
var log = log4js.getLogger();
log.setLevel('DEBUG');
module.exports = log;