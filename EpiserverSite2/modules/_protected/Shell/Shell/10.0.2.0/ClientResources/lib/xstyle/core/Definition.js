//>>built
define("xstyle/core/Definition",["xstyle/core/utils","xstyle/core/es6"],function(_1,_2){function _3(_4){this.computeValue=_4;if(_4&&_4.reverse){this.setReverseCompute(_4.reverse);}};var _5={};var _6=1;function _7(_8,_9,_a){if(_9&&_9.forElement){return {forElement:function(_b){_b=_9.selectElement?_9.selectElement(_b):_b;var _c=["_cache_"+_8.id];if(_c in _b){var _d=_b[_c+"observe"];if(_d.addKey){_d.addKey(_a);}return _b[_c][_a];}var _e=_b[_c]=_9.forElement(_b);var _f=_b[_c+"observe"]=_11(_8,_e,_a,{elements:[_b]});_b.xcleanup=function(_10){if(_10){_2.unobserve(_e,_f);}};return _e[_a];}};}};function _11(_12,_13,key,_14){var _15=_12._properties;var _16;if(typeof _13=="object"){_16=function(_17){for(var i=0;i<_17.length;i++){var _18=_15[_17[i].name];if(_18&&_18.invalidate){_18.invalidate(_14);}}};_2.observe(_13,_16);if(_16.addKey){_16.addKey(key);}}return _16;};_3.prototype={id:"x-variable-"+_6++,cache:_5,valueOf:function(){var _19=this.dependents||this._properties;if(_19){if(this.cache!==_5){return this.cache;}}var _1a=this;var _1b=this.computeValue;if(_1b.then){return (this.cache=_1b.then(function(_1c){_1a.computeValue=_1c;var _1d=_1a.cache=_1c();if(_1d&&_1d.then){_1d.then(function(_1e){_1a.cache=_1e;});}return _1d;}));}else{var _1f=_1a.cache=_1b();if(_1f&&_1f.then){_1f.then(function(_20){_1a.cache=_20;});}return _1f;}},property:function(key){var _21=this._properties||(this._properties={});var _22=_21[key];if(!_22){var _23=this;_22=_21[key]=new _3(function(){return _1.when(_23.valueOf(),function(_24){if(_24&&_24.forRule){return {forRule:function(_25){_25=_24.selectRule?_24.selectRule(_25):_25;var _26=["_cache_"+_23.id];var _27;if(_26 in _25){_27=_25[_26];}else{_27=_25[_26]=_24.forRule(_25);}if(_27&&_27.forElement){return _7(_23,_27,key);}else{var _28=_25[_26+"observe"];if(_28){if(_28.addKey){_28.addKey(key);}else{_25[_26+"observe"]=_11(_23,_27,key,{rules:[_25]});}}}return _27[key];}};}if(_24&&_24.forElement){return _7(_23,_24,key);}var _29=_23.cacheObserve;if(!_29){_29=_23.cacheObserve=_11(_23,_24,key);}else{if(_29.addKey){_29.addKey(key);}}return _24[key];});});_22.key=key;_22.parent=this;_22.put=function(_2a){return _1.when(_23.valueOf(),function(_2b){if(_2b.forRule){return {forRule:function(_2c){return _2d(_2b.forRule(_2c));}};}function _2d(_2e){if(_2e.forElement){return {forElement:function(_2f){_2e.forElement(_2f)[key]=_2a;}};}_2e[key]=_2a;};_2d(_2b);});};_22.id=this.id+"-"+key;}return _22;},invalidate:function(_30){var _31=this.cacheObserve;if(_31){_2.unobserve(this.cache,_31);this.cacheObserve=null;}this.cache=_5;var i,l,_32=this._properties;for(i in _32){_32[i].invalidate(_30);}var _33=this.dependents||0;for(i=0,l=_33.length;i<l;i++){try{_33[i].invalidate(_30);}catch(e){console.error(e,"invalidating a definition");}}},dependencyOf:function(_34){(this.dependents||(this.dependents=[])).push(_34);},notDependencyOf:function(_35){var _36=this.dependents||0;for(var i=0;i<_36.length;i++){if(_36[i]===_35){_36.splice(i--,1);}}},setReverseCompute:function(_37){this.put=function(){var _38=_37.apply(this,arguments);this.invalidate();return _38;};},setCompute:function(_39){this.computeValue=_39;if(_39&&_39.reverse){this.setReverseCompute(_39.reverse);}this.invalidate();},setSource:function(_3a){this.computeValue=function(){return _3a;};this.invalidate();},observe:function(_3b){if(this.computeValue){_3b(this.valueOf());}var _3c=this;return this.dependencyOf({invalidate:function(){_3b(_3c.valueOf());}});},newElement:function(){return _1.when(this.valueOf(),function(_3d){return _3d&&_3d.newElement&&_3d.newElement();});}};return _3;});