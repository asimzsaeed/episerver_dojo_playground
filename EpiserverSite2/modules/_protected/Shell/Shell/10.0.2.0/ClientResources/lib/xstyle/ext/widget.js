//>>built
define("xstyle/ext/widget",["dojo/Deferred"],function(_1){var _2=0;var _3={"true":true,"false":false,"null":null};function _4(_5,_6,_7,_8){if(_8){var _9="x-widget-"+_2++;_8.addSheetRule("."+_9,_8.cssText);_9=" "+_9;}if(_5.eachProperty){var _a={};_5.eachProperty(function(_b,_c){_b=_b.replace(/-\w/g,function(_d){return _d.charAt(1).toUpperCase();});_c=_4(_c);if(_b=="type"&&_6){_7=_c;}else{_a[_b]=_c;}});_5=_a;if(_7){if(window[_7]){_e(window[_7]);}require(typeof _7=="string"?_7.split(/\s*,\s*/):_7,_e);function _e(_f,_10){if(_10){_f=dojo.declare([].slice.call(arguments,0));}var _11=_f.prototype;for(var _12 in _a){var _13=_a[_12];if(_12 in _11){var _14=typeof _11[_12];if(_14=="string"||typeof _13!="string"){}else{if(_14=="number"){_a[_12]=+_13;}else{_a[_12]=eval(_13);}}}}_6(function(_15){var _16=new _f(_a,_15);if(_9){_16.domNode.className+=" "+_9;}});};}else{if(_6){console.error("No type defined for widget");}}}else{if(typeof _5=="object"){}else{if(_5.charAt(0)=="'"||_5.charAt(0)=="\""){_5=eval(_5);}else{if(!isNaN(_5)){_5=+_5;}else{if(_3.hasOwnProperty(_5)){_5=_3[_5];}}}}}return _5;};function _17(_18){return {widget:function(_19,_1a){var _1b=[];_19.replace(/require\s*\(\s*['"]([^'"]*)['"]\s*\)/g,function(t,_1c){_1b.push(_1c);});require(_1b);return function(_1d){require(_1b,function(){with(_18){var _1e=eval(_19);var _1f=_1e.prototype;var _20={};if(_1f){_1a.eachProperty(function(t,_21,_22){if(_21 in _1f){var _23=typeof _1f[_21];if(_23=="string"||typeof _22!="string"){_20[_21]=_22;}else{if(_23=="number"){_20[_21]=+_22;}else{_20[_21]=eval(_22);}}}});}_1e(_20,_1d);}});};},role:"layout"};};var def=new _17({});_17.widget=def.widget;_17.role=def.role;return {put:function(_24,_25){return {then:function(_26){var _27=new _1();_4(_24[0].eachProperty?_24[0]:_25,function(_28){_27.resolve({forElement:function(_29){_28(_29);}});},typeof _24=="string"&&_24,_25);return _27.then(_26);}};},parse:_4};});