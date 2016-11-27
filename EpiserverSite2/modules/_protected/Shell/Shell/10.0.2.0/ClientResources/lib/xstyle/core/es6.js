//>>built
define("xstyle/core/es6",[],function(){var _1={observe:Object.observe,defineProperty:Object.defineProperty&&(function(){try{Object.defineProperty({},"t",{});return true;}catch(e){}})(),promise:typeof Promise!=="undefined","WeakMap":typeof WeakMap==="function"};function _2(_3){return _1[_3];};var _4=_2("observe")?Object.observe:_2("defineProperty")?function _4(_5,_6){_6.addKey=_7;_6.remove=function(){_6=null;};function _7(_8){var _9="key"+_8;if(this[_9]){return;}else{this[_9]=true;}var _a=_5[_8];var _b=Object.getOwnPropertyDescriptor(_5,_8);if(_b&&_b.set){var _c=_b.set;var _d=_b.get;Object.defineProperty(_5,_8,{get:function(){return (_a=_d.call(this));},set:function(_e){_c.call(this,_e);if(_a!==_e){_a=_e;if(_6){_10(_6,this,_8);}}}});}else{Object.defineProperty(_5,_8,{get:function(){return _a;},set:function(_f){if(_a!==_f){_a=_f;if(_6){_10(_6,this,_8);}}}});}};}:function(_11,_12){if(!_13){_13=true;setInterval(function(){for(var i=0,l=_14.length;i<l;i++){_15(_16[i],_14[i],_17[i]);}},20);}var _18={};for(var i in _11){if(_11.hasOwnProperty(i)){_18[i]=_11[i];}}_14.push(_11);_16.push(_18);_17.push(_12);};var _19;function _10(_1a,_1b,_1c){if(_19){if(_19.indexOf(_1a)===-1){_19.push(_1a);}}else{_19=[_1a];setTimeout(function(){_19.forEach(function(_1d){var _1e=[];_1d.properties.forEach(function(_1f){_1e.push({target:_1d.object,name:_1f});});_1d(_1e);_1d.object=null;_1d.properties=null;});_19=null;},0);}_1a.object=_1b;var _20=_1a.properties||(_1a.properties=[]);if(_20.indexOf(_1c)===-1){_20.push(_1c);}};var _21=_2("observe")?Object.unobserve:function(_22,_23){if(_23.remove){_23.remove();}for(var i=0,l=_14.length;i<l;i++){if(_14[i]===_22&&_17[i]===_23){_14.splice(i,1);_16.splice(i,1);_17.splice(i,1);return;}}};var _14=[];var _16=[];var _17=[];var _13=false;function _15(_24,_25,_26){var _27;for(var i in _24){if(_24.hasOwnProperty(i)&&_24[i]!==_25[i]){_24[i]=_25[i];(_27||(_27=[])).push({name:i});}}for(var i in _25){if(_25.hasOwnProperty(i)&&!_24.hasOwnProperty(i)){_24[i]=_25[i];(_27||(_27=[])).push({name:i});}}if(_27){_26(_27);}};var id=1;function _28(){return _28;};var _29=function(){};_29.prototype.toJSON=_28;return {Promise:_2("promise")?Promise:(function(){function _2a(_2b){var _2c,_2d,_2e;var _2f=0;function _30(_31){if(_31&&_31.then){_31.then(_30,_32);}else{_2d=_31;_33();}};function _32(_34){_2e=_34;_33();};_2b(_30,_32);function _33(){_2c=true;for(var i=0,l=_2f.length;i<l;i++){_2f[i]();}_2f=0;};return {then:function(_35,_36){return new _2a(function(_37,_38){function _39(){try{if(_2e&&!_36){_38(_2e);}else{_37(_2e?_36(_2e):_35?_35(_2d):_2d);}}catch(newError){_38(newError);}};if(_2c){_39();}else{(_2f||(_2f=[])).push(_39);}});}};};return _2a;}()),WeakMap:_2("WeakMap")?WeakMap:function(_3a,_3b){var _3c="__"+(_3b||"")+id++;return _2("defineProperty")?{get:function(key){return key[_3c];},set:function(key,_3d){Object.defineProperty(key,_3c,{value:_3d,enumerable:false});}}:{get:function(key){var _3e=key[_3c];return _3e&&_3e.value;},set:function(key,_3f){var _40=key[_3c]||(key[_3c]=new _29());_40.value=_3f;}};},observe:_4,unobserve:_21,copy:function(_41,_42){for(var i in _42){_41[i]=_42[i];}return _41;}};});