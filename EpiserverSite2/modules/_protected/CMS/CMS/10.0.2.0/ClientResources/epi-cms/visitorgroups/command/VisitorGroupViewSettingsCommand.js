//>>built
define("epi-cms/visitorgroups/command/VisitorGroupViewSettingsCommand",["dojo/_base/declare","dijit/Destroyable","epi/shell/command/OptionCommand","./VisitorGroupViewSettingsModel","epi/i18n!epi/cms/nls/episerver.cms.widget.visitorgroupselector"],function(_1,_2,_3,_4,_5){return _1([_3,_2],{iconClass:"epi-iconUsers",model:null,optionsProperty:"options",property:"selectedGroup",optionsLabel:_5.header,postscript:function(){this.inherited(arguments);this.set("model",this.model||new _4());this.set("label",this.model.tooltip);this.set("active",!!this.model.selectedGroup);var _6=this;this.own(this.model.watch("tooltip",function(_7,_8,_9){_6.set("label",_9);}));this.own(this.model.watch("selectedGroup",function(_a,_b,_c){_6.set("active",!!_c);}));}});});