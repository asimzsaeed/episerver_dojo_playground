//>>built
define("epi-cms/compare/command/CompareCommandProvider",["dojo/_base/declare","epi-cms/component/command/_GlobalToolbarCommandProvider","./CompareSettingsModel","./CompareViewSelection","epi/shell/command/ToggleCommand","epi-cms/command/_NonEditViewCommandMixin","epi/i18n!epi/cms/nls/episerver.cms.compare.command"],function(_1,_2,_3,_4,_5,_6,_7){var _8=_1([_5,_6]);return _1([_2],{postscript:function(){this.inherited(arguments);var _9=new _3();var _a={category:"compare"};this.add("commands",new _8({category:"compare",settings:_a,label:_7.togglecompare.label,iconClass:"epi-iconCompare",model:_9,property:"enabled"}));this.add("commands",new _4({category:"compare",settings:_a,model:_9,label:_7.compareviewselection.label,optionsLabel:_7.compareviewselection.label,optionsProperty:"modeOptions",property:"mode"}));}});});