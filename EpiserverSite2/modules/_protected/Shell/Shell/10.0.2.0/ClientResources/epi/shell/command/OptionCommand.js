//>>built
define("epi/shell/command/OptionCommand",["dojo/_base/declare","epi/shell/command/_Command","dijit/Destroyable"],function(_1,_2,_3){return _1([_2,_3],{options:null,optionsLabel:"",optionsProperty:null,selected:null,property:null,_execute:function(){this.model.set(this.property,this.selected);},_onModelChange:function(){var _4=this,_5=this.model;this.set("canExecute",!!_5);if(_5){this.set("selected",this.model.get(this.property));this.own(_5.watch(this.property,function(_6,_7,_8){_4.set("selected",_8);}));}},_optionsGetter:function(){return this.options||(this.model&&this.optionsProperty&&this.model.get(this.optionsProperty));},_selectedSetter:function(_9){var _a=this.selected;this.selected=_9;if(_a!==_9){this.execute();}}});});