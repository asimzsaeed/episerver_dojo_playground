//>>built
define("epi/shell/command/builder/_Builder",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dijit/registry"],function(_1,_2,_3,_4){return _2(null,{settings:null,postscript:function(_5){if(_5){_3.mixin(this,_5);}},create:function(_6,_7){var _8=this._create(_6);_8._command=_6;_8._commandCategory=_6.category;this._addToContainer(_8,_7);},remove:function(_9,_a){var _b=_a.getChildren(),_c=_b.length,i=0;for(;i<_c;i++){var _d=_b[i];if(_d._command===_9){_a.removeChild(_d);_d.destroy();return true;}}return false;},_create:function(){},_addToContainer:function(_e,_f){var _10=null;if(_e._command){var _11=this._getSortOrder(_e);this._getChildren(_f).some(function(_12,_13){var _14=this._getSortOrder(_12);if(_14>_11){_10=_13;return true;}},this);}_e.placeAt(_f,_10);},_getSortOrder:function(_15){return (_15._command&&_15._command.order)?_15._command.order:0;},_getChildren:function(_16){if(typeof (_16.getChildren)==="function"){return _16.getChildren();}else{return _4.findWidgets(_16);}}});});