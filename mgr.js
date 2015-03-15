/**
 * Created by at15 on 15-3-10.
 */
// The new assets manager

// the mgr is just a test now

var config = require('./lib/config');
config.loadConfigJson('assets.json');
var parser = require('./lib/parser');
var min = require('./lib/min');

parser.init();
min.init();

var pages = config.getAllPages();
for (var pageName in pages) {
    if (!pages.hasOwnProperty(pageName)) {
        continue;
    }
    console.log('====== Page:', pageName, ' ======');
    if (config.pageNeedMin(pageName)) {
        console.log('page need min');
        min.page(pageName);
    } else {
        console.log(parser.getPage(pageName));
    }
}