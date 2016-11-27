//>>built
define("epi-cms/widget/UrlSelector",["dojo/_base/declare","dojo/_base/lang","dojo/dom-class","dojo/dom-style","dojo/when","dojo/aspect","dojo/Deferred","epi/shell/widget/_ModelBindingMixin","epi/shell/widget/dialog/Dialog","epi/Url","epi-cms/widget/LinkEditor","epi-cms/widget/_SelectorBase","epi-cms/core/PermanentLinkHelper","epi/i18n!epi/cms/nls/episerver.cms.widget.editlink"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e){return _1([_c,_8],{resource:_e,linkHelper:_d,postMixInProperties:function(){this.inherited(arguments);if(!this.model&&this.modelClassName){var _f=_1(this.modelClassName);this.model=new _f();}},startup:function(){if(this._started){return;}this.inherited(arguments);!this.value&&this.set("value",null);},isValid:function(){return (!this.required||(!this.get("isEmpty")));},_onDialogShow:function(){this.inherited(arguments);var _10=this.get("value");this.dialogContent.set("value",{href:_10});},_onDialogExecute:function(){var _11=this.dialogContent.get("value");this.set("value",_11.href);},_getDialog:function(){this.dialogContent=new _b({modelType:this.metadata.additionalValues["modelType"],hiddenFields:["text","title","target","language"]});this.own(this.dialogContent);return new _9({title:this._getTitle(),dialogClass:"epi-dialog-portrait",content:this.dialogContent,destroyOnHide:false,defaultActionsVisible:false});},_setValueAttr:function(_12){if(!_12){this.set("isEmpty",true);this._setValueAndFireOnChange(null);return;}this.set("isEmpty",false);this._setValueAndFireOnChange(_12);},_setValueAndFireOnChange:function(_13){var _14=this.get("value");this._set("value",_13);var _15=true;if(!_14&&!_13){_15=false;}else{if(_13&&_13===_14){_15=false;}}if(_15){this.onChange(_13);}if(this._valueChangedPromise){this._valueChangedPromise.cancel("");this._valueChangedPromise=null;}if(_13){this._getLinkName(_13).then(_2.hitch(this,this._updateDisplayNode));}else{this._updateDisplayNode(null);}},_getLinkName:function(_16){this._valueChangedPromise=new _7();_5(this.linkHelper.getContent(_16,{allLanguages:true}),_2.hitch(this,function(_17){var _18={name:_17?_17.name:_16};if(this._valueChangedPromise){this._valueChangedPromise.resolve(_18);}}));return this._valueChangedPromise.promise;},_getTitle:function(){return _2.replace(this.value?this.resource.title.template.edit:this.resource.title.template.create,this.resource.title.action);}});});