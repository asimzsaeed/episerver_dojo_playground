//>>built
define("epi-cms/widget/viewmodel/HyperLinkSelectorViewModel",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/Stateful","dojo/io-query","dojo/dom-style","dojo/dom-construct","dojo/when","epi/string","epi/Url","epi/shell/TypeDescriptorManager","epi/shell/_StatefulGetterSetterMixin","epi-cms/core/PermanentLinkHelper"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){return _2([_4,_c],{_setProvidersAttr:function(_e){var _f=[];_1.forEach(_e,_3.hitch(this,function(_10){_f.push({name:_10.name,displayName:_10.displayName?_10.displayName:_10.name,title:_10.title?_10.title:"",groupname:"hyperLink_",widgetType:_10.widgetType,invisible:_10.invisible,settings:_3.mixin({roots:_10.roots,allowedTypes:_10.linkableTypes,isContentLink:(_10.linkableTypes&&_10.linkableTypes.length>0),allowedDndTypes:[],disabled:true,value:null,searchArea:_10.searchArea},_10.widgetSettings)});}));this.set("wrapperSettings",_f);},getContentData:function(_11){if(_11){return _d.getContent(_11,{allLanguages:true});}return null;},isBaseTypeIdentifier:function(_12,_13){return _b.isBaseTypeIdentifier(_12,_13);},getUrlValue:function(_14,_15,_16){if(!_14){return "";}var url=new _a(_14);if(_16){var _17=new _a(_16);if(this._areEqual(_17,url)){url.query=_3.mixin(_17.query,url.query);}}if(_15===""){delete url.query.epslanguage;}else{url.query.epslanguage=_15;}return url.toString();},_areEqual:function(_18,_19){return _18.scheme===_19.scheme&&_18.authority===_19.authority&&_18.path===_19.path&&_18.fragment===_19.fragment;}});});