//>>built
define("epi/shell/widget/_AddByDefinition",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/Deferred","dojo/dom","dojo/dom-construct","dojo/dom-style","dojo/when","dijit","dijit/_Widget","dijit/ToolbarSeparator","dijit/Menu","dijit/MenuSeparator","epi/shell/widget/WidgetFactory","dijit/CheckedMenuItem","dijit/MenuItem","dijit/form/Button","dijit/form/ComboButton","dijit/form/DropDownButton","dijit/form/RadioButton","epi/shell/widget/PopupMenuItem","epi/shell/widget/Toolbar","epi/shell/widget/ToolbarLabel","epi/shell/widget/ToolbarDropDownButton"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e){return _2(null,{_widgetTypeTemplates:{checkedmenuitem:{widgetType:"dijit/CheckedMenuItem"},menu:{widgetType:"dijit/Menu"},menuitem:{widgetType:"dijit/MenuItem"},popupmenu:{widgetType:"epi/shell/widget/PopupMenuItem"},button:{widgetType:"dijit/form/Button"},combo:{widgetType:"dijit/form/ComboButton"},dropdown:{widgetType:"epi/shell/widget/ToolbarDropDownButton"},radio:{widgetType:"dijit/form/RadioButton"},toolbargroup:{widgetType:"epi/shell/widget/Toolbar"},label:{widgetType:"epi/shell/widget/ToolbarLabel"}},constructor:function(){this._widgetFactory=new _e();this._widgetMap={};},postMixInProperties:function(){this.connect(this._widgetFactory,"onWidgetHierarchyCreated",_3.hitch(this,function(_f,_10){this._widgetMap[_10.name]=_f;if(_10.firstChildIsContainer){_f.containerWidget=_f.getChildren()[0];}}));var _11=function(_12,_13){var _14=_12.get("dropDown");if(!_14){_14=new _c();_12.set("dropDown",_14);}_14.addChild(_13);if(!_13.separator){_13.set("separator","dijit/MenuSeparator");}};this._widgetFactory.addHandler("dijit/form/ComboButton",_11);},buildRendering:function(){this.inherited(arguments);_5.setSelectable(this.domNode,false);},_toComponentDefinition:function(_15){var _16=this._getComponentDefinitionTemplate(_15);_16.name=_15.name;_16.settings=_3.mixin({label:_15.label||"",showLabel:_15.label,title:_15.title||"",disabled:_15.disabled||false},_15.settings);if(_15.iconClass){_16.settings.iconClass=_15.iconClass;}var _17={onClick:_15.action};_16.connections=_3.mixin(_17,_15.connections);return _16;},_getComponentDefinitionTemplate:function(_18){var _19=_3.mixin({},this._widgetTypeTemplates[_18.type]||this._widgetTypeTemplates["button"]);if(_18.widgetType){_19.widgetType=_18.widgetType;}return _19;},_getWidget:function(_1a){return this._widgetMap[_1a];},_addSingle:function(_1b){if(this._getWidget(_1b.name)){return;}var _1c=this._getWidget(_1b.parent)||this;var _1d=this._toComponentDefinition(_1b);var def=new _4();_8(this._widgetFactory.createWidgets(_1c,_1d),_3.hitch(this,function(_1e){var _1f=_1e[0];if(_1b.tooltip){var _20=_1b.tooltip;var _21=function(e){_9.showTooltip(_20,e.target);};var _22=function(e){_9.hideTooltip(e.target);};this.connect(_1f.domNode,"onmouseenter",_21);this.connect(_1f.domNode,"onmouseleave",_22);}this._addSeparators(_1f);def.resolve();}),function(e){console.error(e.stack||e);def.reject(e);});return def.promise;},_addSeparators:function(_23){var _24=_23.getParent();if(!_24){return;}var _25=_24.getChildren();var i=_1.indexOf(_25,_23);var _26=(i>0)?_25[i-1]:null;if(_26&&!this._isSeparator(_26)){if(_23.separate){this.addSeparator(_23,"before");}else{if(_26.separate){this.addSeparator(_26,"after");}}}var _27=(_25.length>i)?_25[i+1]:null;if(_27&&!this._isSeparator(_27)&&(_23.separate||_27.separate)){this.addSeparator(_23,"after");}},_getSiblingOfWidget:function(_28,dir){var _29=_28.domNode;do{_29=_29[dir];}while(_29&&(_29.nodeType!==1||!_9.byNode(_29)));return _29&&_9.byNode(_29);},add:function(_2a){var _2b=this;var _2c=function(_2d){var _2e=_2d.shift();if(!_2e){return null;}return _8(_2b._addSingle(_2e),function(){return _2c(_2d);});};if(_3.isArray(_2a)){return _2c(_2a);}else{this._addSingle(_2a);}},addSeparator:function(_2f,_30){var _31=function(){if(_2f.separator){var _32=_2f.separator.replace(/\./g,"/"),_33=new _4();require([_32],function(_34){_33.resolve(new _34());});return _33.promise;}return new _b();};_8(_31(),_3.hitch(this,function(_35){var _36=_2f?_2f.domNode:this.domNode;_6.place(_35.domNode,_36,_30);}));},_removeSingle:function(_37){var _38=this._widgetMap[_37];delete this._widgetMap[_37];if(_38){this._removeSeparators(_38);_38.destroy();}},_removeSeparators:function(_39){if(!_39.domNode){return;}var _3a=_39.getParent();if(!_3a){return;}var _3b;var _3c=_3a.getChildren();var i=_1.indexOf(_3c,_39);var _3d=(_3c.length>i)?_3c[i+1]:null;var _3e=(i>0)?_3c[i-1]:null;if(_3d&&this._isSeparator(_3d)&&_3c.length>=i+2){_3b=_3d;_3d=_3c[i+2];if(_3d.separate&&i>0){if(_3e&&this._isSeparator(_3e)){_3e.destroy();return;}}else{_3b.destroy();}}if(_3e&&this._isSeparator(_3e)&&i-2>=0){_3b=_3e;_3e=_3c[i-2];if(!_3e.separate){_3b.destroy();}}},_isSeparator:function(_3f){return _3f instanceof _b||_3f instanceof _d;},remove:function(_40){if(_3.isArray(_40)){_1.forEach(_40,_3.hitch(this,this._removeSingle));}else{this._removeSingle(_40);}},clear:function(){for(var _41 in this._widgetMap){this._removeSingle(_41);}},destroy:function(){this.clear();this.inherited(arguments);},setItemProperty:function(_42,_43,_44){if(_3.isArray(_42)){_1.forEach(_42,function(_45){this._setInternal(_45,_43,_44);});}else{this._setInternal(_42,_43,_44);}},setItemVisibility:function(_46,_47){var _48=this._widgetMap[_46];if(_48){_7.set(_48.domNode,{display:(_47?"":"none")});_48.set("itemVisibility",_47);}},_setInternal:function(_49,_4a,_4b){var _4c=this._widgetMap[_49];if(_4c){_4c.set(_4a,_4b);}}});});