//>>built
define("epi-cms/widget/IFrameController",["dojo/_base/array","dojo/_base/declare","epi/shell/widget/Iframe","epi-cms/contentediting/StandardToolbar"],function(_1,_2,_3,_4){return _2([_3],{templateString:"<div data-dojo-attach-point=\"toolbarArea\" /><iframe data-dojo-attach-point=\"iframe\" class=\"dijitReset\" src=\"${url}\" role=\"presentation\" frameborder=\"0\" style=\"width:100%;\"></iframe>",postCreate:function(){this.inherited(arguments);this.toolbar=new _4();this.toolbar.placeAt(this.toolbarArea,"first");},_constructQuery:function(_5){return {uri:_5.uri,id:_5.id||""};},updateView:function(_6,_7,_8){if(_6&&_6.skipUpdateView){return;}this.toolbar.update({currentContext:_7,viewConfigurations:{availableViews:_6.availableViews,viewName:_6.viewName}});var _9=_1.filter(_6.availableViews,function(_a){return _a.key===_6.viewName;});if(_9.length===0){return;}this.load(_9[0].viewType,{query:this._constructQuery(_7)},true);}});});