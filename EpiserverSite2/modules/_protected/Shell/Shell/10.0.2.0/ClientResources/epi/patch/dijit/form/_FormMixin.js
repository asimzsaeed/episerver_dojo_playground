//>>built
define("epi/patch/dijit/form/_FormMixin",["dojo/_base/array","dojo/_base/lang","dijit/form/_FormMixin"],function(_1,_2,_3){_2.mixin(_3.prototype,{_setValueAttr:function(_4){var _5={};_1.forEach(this._getDescendantFormWidgets(),function(_6){if(!_6.name){return;}var _7=_5[_6.name]||(_5[_6.name]=[]);_7.push(_6);});for(var _8 in _5){if(!_5.hasOwnProperty(_8)){continue;}var _9=_5[_8],_a=_2.getObject(_8,false,_4);if(_a===undefined){continue;}if(!_2.isArray(_a)){if(_a===null&&_9[0].multiple){_a=null;}else{_a=[_a];}}if(typeof _9[0].checked=="boolean"){_1.forEach(_9,function(w){w.set("value",_1.indexOf(_a,w.value)!==-1);});}else{if(_9[0].multiple){_9[0].set("value",_a);}else{_1.forEach(_9,function(w,i){w.set("value",_a[i]);});}}}}});_3.prototype._setValueAttr.nom="_setValueAttr";});