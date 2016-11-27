//>>built
require({cache:{"url:epi-cms/contentediting/templates/ContentDetails.html":"<ul class=\"epi-form-container__section\">\r\n    <ul data-dojo-type=\"epi/shell/layout/SimpleContainer\" data-dojo-attach-point=\"widgetContainer\"></ul>\r\n    <li class=\"epi-form-container__section__row\">\r\n        <label>${resources.visibleto.title}</label>\r\n        <div class=\"epi-previewableTextBox-wrapper dijitInline\">\r\n            <span data-dojo-attach-point=\"visibleToNode\" class=\"epi-previewableTextBox-text dojoxEllipsis dijitInline\"></span>\r\n            <div data-dojo-type=\"dijit/form/Button\" data-dojo-attach-point=\"manageAccessRightsButton\" data-dojo-attach-event=\"onClick: _onManageAccessRightsClick\" class=\"epi-chromelessButton epi-chromelessLinkButton epi-functionLink epi-valign--top\">${resources.manage}</div>\r\n        </div>\r\n    </li>\r\n    <li class=\"epi-form-container__section__row\">\r\n        <label>${resources.existinglanguages}</label>\r\n        <span data-dojo-attach-point=\"languagesNode\" class=\"epi-previewableTextBox-text dijitInline\"></span>\r\n    </li>\r\n    <li class=\"epi-form-container__section__row\">\r\n        <label>${resources.idandtypename}</label>\r\n        <div class=\"epi-previewableTextBox-wrapper dijitInline\">\r\n            <span class=\"epi-previewableTextBox-text dojoxEllipsis dijitInline\">\r\n                <span data-dojo-attach-point=\"idNode\"></span>, <span data-dojo-attach-point=\"typeNode\"></span>\r\n            </span>\r\n        </div>\r\n    </li>\r\n    <li class=\"epi-form-container__section__row\">\r\n        <label></label>\r\n        <div data-dojo-attach-point=\"dropdownButton\" data-dojo-type=\"dijit/form/DropDownButton\" class=\"dijit dijitReset dijitInline epi-mediumButton\">\r\n            <span>${resources.toolsbutton.label}</span>\r\n            <div data-dojo-type=\"dijit/DropDownMenu\" data-dojo-attach-point=\"additionalActionsMenu\"></div>\r\n        </div>\r\n    </li>\r\n</ul>"}});define("epi-cms/contentediting/ContentDetails",["dojo","dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/_base/url","dojo/_base/window","dojo/dom-style","dojo/dom-construct","dojo/on","dojo/topic","dijit/_TemplatedMixin","dijit/_WidgetBase","dijit/_WidgetsInTemplateMixin","epi","epi/shell/widget/_ModelBindingMixin","epi/shell/command/builder/MenuBuilder","epi/shell/command/builder/MenuAssembler","epi/i18n!epi/cms/nls/episerver.cms.contentediting.contentdetails","dojo/text!./templates/ContentDetails.html"],function(_1,_2,_3,_4,_5,_6,_7,_8,on,_9,_a,_b,_c,_d,_e,_f,_10,res,_11){return _3([_b,_a,_c,_e],{templateString:_11,_setContentTypeNameAttr:{node:"typeNode",type:"innerHTML"},_setContentIdAttr:{node:"idNode",type:"innerHTML"},_setExistingLanguagesAttr:function(_12){this.languagesNode.innerHTML="";_2.forEach(_12,function(_13,idx){var elm,_14=idx===_12.length-1;if(_13.isCurrentLanguage){elm=_8.create("span",{innerHTML:_13.urlSegment});}else{var url=new _1._Url(window.top.location.href);elm=_8.create("a",{innerHTML:_13.urlSegment,href:[url.scheme,"://",url.authority,url.path,"?language=",_13.text,"#context=epi.cms.contentdata:///",_13.contentLink].join(""),"class":"epi-visibleLink"});}_8.place(elm,this.languagesNode);if(!_14){_8.place(_6.doc.createTextNode(", "),this.languagesNode);}},this);},_setVisibleToAttr:function(_15){this.visibleToNode.innerHTML=_15?res.visibleto.everyone:res.visibleto.restricted;},_setManageAccessRightsVisibleAttr:function(_16){_7.set(this.manageAccessRightsButton.domNode,"display",_16?"":"none");},resources:null,modelBindingMap:{contentTypeName:["contentTypeName"],contentId:["contentId"],existingLanguages:["existingLanguages"],visibleToEveryOne:["visibleTo"]},_menuAssembler:null,postMixInProperties:function(){this.inherited(arguments);this.resources=_1.mixin({},_d.resources.action,res);},postCreate:function(){this.inherited(arguments);var _17=new _f();this._menuAssembler=new _10({configuration:[{builder:_17,target:this.additionalActionsMenu}],commandSource:this.model});this.dropdownButton.set("title",this.resources.toolsbutton.tooltip);},destroy:function(){if(this._menuAssembler){this._menuAssembler.destroy();}this.inherited(arguments);if(this.model){this.model.destroy();}},_setModelAttr:function(_18){this.inherited(arguments);if(this._menuAssembler){this._menuAssembler.set("commandSource",this.model);}if(this.model&&this.model.accessRightsCommand){this.own(this.model.accessRightsCommand.watch("canExecute",_4.hitch(this,function(){this.set("manageAccessRightsVisible",this.model.accessRightsCommand.canExecute);})));}},_onManageAccessRightsClick:function(){if(this.model&&this.model.accessRightsCommand){this.model.accessRightsCommand.execute();}}});});