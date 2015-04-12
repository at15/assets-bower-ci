/**
 * Created by W7_64 on 2014/7/11.
 */

// Todo: Standardize error throwing.

// TODO:allow different config in different env
var env = require('./env');
var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'console'
        }
    ]
});
var log = log4js.getLogger();

// set level according to env. TODO:use the env lib
//if(process.env.ENVIRONMENT === 'development'){
//
//}
log.setLevel('DEBUG');
module.exports = log;