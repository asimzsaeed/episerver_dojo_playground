//>>built
define("epi-cms/compare/command/CompareViewSelection",["dojo/_base/declare","epi/shell/command/OptionCommand"],function(_1,_2){return _1([_2],{_selectedSetter:function(_3){this.inherited(arguments);this.get("options").some(function(_4){if(_4.value===_3){this.set("iconClass",_4.iconClass);return true;}},this);}});});