//>>built
define("dgrid/util/touch",["dojo/on","dojo/query"],function(on,_1){var _2={tapRadius:10,dbltapTime:250,selector:function(_3,_4,_5){return function(_6,_7){var _8=_4.bubble;if(_8){_4=_8;}else{if(_5!==false){_5=true;}}return on(_6,_4,function(_9){var _a=_9.target;if(_a.nodeType==3){_a=_a.parentNode;}while(!_1.matches(_a,_3,_6)){if(_a==_6||!_5||!(_a=_a.parentNode)){return;}}return _7.call(_a,_9);});};},countCurrentTouches:function(_b,_c){if(!("touches" in _b)){return -1;}var i,_d,_e;for(i=0,_d=0;(_e=_b.touches[i]);++i){if(_c.contains(_e.target)){++_d;}}return _d;}};function _f(_10,_11,evt,_12){if(evt.targetTouches.length>1){return;}var _13=evt.changedTouches[0],_14=_13.screenX,_15=_13.screenY;_12&&evt.preventDefault();var _16=on(_10,"touchend",function(evt){var end=evt.changedTouches[0];if(!evt.targetTouches.length){if(Math.abs(end.screenX-_14)<_2.tapRadius&&Math.abs(end.screenY-_15)<_2.tapRadius){_12&&evt.preventDefault();_11.call(this,evt);}_16.remove();}});};function tap(_17,_18){return on(_17,"touchstart",function(evt){_f(_17,_18,evt);});};function _19(_1a,_1b){var _1c,_1d;return on(_1a,"touchstart",function(evt){if(!_1c){_f(_1a,function(evt){_1c=evt.changedTouches[0];_1d=setTimeout(function(){_1c=_1d=null;},_2.dbltapTime);},evt);}else{_f(_1a,function(evt){if(!_1c){return;}var _1e=evt.changedTouches[0];if(Math.abs(_1e.screenX-_1c.screenX)<_2.tapRadius&&Math.abs(_1e.screenY-_1c.screenY)<_2.tapRadius){_1d&&clearTimeout(_1d);_1c=_1d=null;_1b.call(this,evt);}},evt,true);}});};_2.tap=tap;_2.dbltap=_19;return _2;});