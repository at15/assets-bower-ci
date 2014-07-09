var assetMgr = require('./index');

//console.log(assetMgr);
var mgr = new assetMgr('assets.json');
//mgr.readBower('jquery');
//mgr.readBower('bootstrap');// bs's main don't need glob
//mgr.readBower('fontawesome');// bs's main don't need glob

//console.log(mgr.readBower('jquery'));
//console.log(mgr.readBower('bootstrap'));
//console.log(mgr.readBower('fontawesome'));

//console.log(mgr.parseLib('date-time'));

//console.log(mgr.parseGroup('base'));

//console.log(mgr.parsePage('act'));

//mgr.parseAllPage();

var jq = mgr.readBower('jquery');
mgr.copyBower(jq);