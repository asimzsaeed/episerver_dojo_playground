//>>built
define("epi/shell/command/builder/OptionsBuilderMixin",["epi","dojo/_base/declare","dojo/_base/lang","dojo/on","dojox/html/entities","dijit/CheckedMenuItem","../OptionGroup","epi/shell/widget/MenuHeaderSeparator","epi/shell/DestroyableByKey"],function(_1,_2,_3,on,_4,_5,_6,_7,_8){return _2([_8],{optionItemClass:"",constructor:function(_9){_2.safeMixin(this,_9);},startup:function(){this.inherited(arguments);this._addOptionMenuItems();},_addOptionMenuItems:function(){if(!this._started){return;}this.getChildren().forEach(function(_a){this.removeChild(_a);if(typeof _a.destroy==="function"){_a.destroy();}},this);this._createOptionMenuItems(this.model).forEach(this.addChild.bind(this));},_createOptionMenuItems:function(_b){var _c=[];var _d=_b.get("options");if(!_3.isArray(_d)){return _c;}if(_b.optionsLabel){_c.push(new _7({label:_b.optionsLabel}));}_d.forEach(function(_e){if(_e instanceof _6){_c.push(new _7({label:_e.label}));_c=_c.concat(this._createOptionMenuItems(_e));}else{_c.push(this._createMenuItem(_e,_b));}},this);return _c;},_setModelAttr:function(_f){this._set("model",_f);this.destroyByKey("optionsWatch");this.ownByKey("optionsWatch",_f.watch("options",this._addOptionMenuItems.bind(this)));},_createMenuItem:function(_10,_11){var _12=new _5({label:_4.encode(_10.label),checked:_1.areEqual(_11.get("selected"),_10.value),"class":this.optionItemClass});_12.own(on(_12,"click",function(){_11.set("selected",_10.value);}));_12.own(_11.watch("selected",function(_13,_14,_15){_12.set("checked",_1.areEqual(_15,_10.value));}));return _12;}});});