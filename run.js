var assetMgr = require('./index');

console.log(assetMgr);
var mgr = assetMgr('assets.json');
mgr.readBower('jquery');