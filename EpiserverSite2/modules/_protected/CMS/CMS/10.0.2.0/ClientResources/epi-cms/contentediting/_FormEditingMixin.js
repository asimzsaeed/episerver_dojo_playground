//>>built
define("epi-cms/contentediting/_FormEditingMixin",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/Deferred","dojo/when","epi-cms/contentediting/SideBySideEditorWrapper","epi/shell/widget/FormContainer"],function(_1,_2,_3,_4,_5,_6,_7){return _2(null,{_form:null,_formWidgets:null,canHandleLeftOver:true,selectFormOnCreation:false,formSettings:null,connectOverlayItemsToFormWidgets:false,_formConnects:null,destroy:function(){this._removeAndDestroyForm();this._formWidgets=null;this.inherited(arguments);},_removeAndDestroyForm:function(){if(this._form){if(this.removeForm(this._form)){this._form.destroyRecursive();this._form=null;}var _8;while((_8=this._formConnects.pop())){this.disconnect(_8);_8=null;}this._formConnects=null;this._form=null;}for(var p in this._formWidgets){this._formWidgets[p]=null;}},_setupForm:function(){var _9=new _4();this._formWidgets={};this._form=this._createForm();this._formConnects=[this.connect(this._form,"onFieldCreated",this.onFieldCreated),this.connect(this._form,"onGroupCreated",this.onGroupCreated),this.connect(this._form,"onFormCreated",function(){_9.resolve();})];this.placeForm(this._form);_5(_9,_3.hitch(this,function(){this._finishFormCreation();}));},_createForm:function(){return new _7(_3.mixin({readOnly:!this.viewModel.canChangeContent(),metadata:this.viewModel.metadata,baseClass:"epi-cmsEditingForm",useDefaultValue:false},this.formSettings));},_createFormEditorWrappers:function(){for(var _a in this._formWidgets){var _b={name:_a,metadata:this.viewModel.getPropertyMetaData(_a)};var _c=_3.clone(this.viewModel.getProperty(_b.name));var _d=new _6({property:_b,propertyName:_a,value:_c,editorWidget:this._formWidgets[_a],contentModel:this.viewModel.contentModel,operation:this.viewModel._operation});_d.editorWidget.set("parent",_d);_d.editorWidget.set("editMode","formedit");this.connect(_d,"onValueChange","_onWrapperValueChange");this.connect(_d,"onCancel","_onWrapperCancel");this.connect(_d,"onStopEdit","_onWrapperStopEdit");this._createMapping(_a,_d);_b=null;_c=null;_d=null;}},_createMapping:function(_e,_f){var _10=_e.split(".");var _11=false;if(this.connectOverlayItemsToFormWidgets){while(_10.length>0){var _12=_10.join(".");var _13=this._mappingManager.find("propertyName",_12);_1.forEach(_13,function(_14){_11=true;_14.propertyName=_e;_14.wrapper=_14.wrapper||_f;});_10.pop();}}if(!_11){this._mappingManager.add({propertyName:_e,wrapper:_f});}},onSetActiveProperty:function(_15){var _16=this._mappingManager.find("propertyName",_15).filter(function(_17){return !!_17.wrapper;})[0];if(_16){_16.wrapper.startEdit();}},placeForm:function(_18){},removeForm:function(_19){},onFieldCreated:function(_1a,_1b){this._formWidgets[_1a]=_1b;if(this._addStateWatch){this._addStateWatch(_1b);}},onGroupCreated:function(_1c,_1d,_1e){if(_1d.contentViewModel!==undefined){_1d.set("contentViewModel",this.viewModel);}},_finishFormCreation:function(){_5(this.selectFormOnCreation?this.editLayoutContainer.selectChild(this._form):null,_3.hitch(this,this._removeLeftOver));this.toolbar.setItemProperty("editmodeswitch","state","");this._createFormEditorWrappers(this._form);this.onSetupEditModeComplete();},_removeLeftOver:function(){var _1f=this.editLayoutContainer,_20;if(_1f.leftOver){_20=_1f.selectedChildWidget===_1f.leftOver;_5(_20?_1f.selectChild(this.iframeWithOverlay):null,function(){var _21=_1f.leftOver;if(_21){_1f.removeChild(_21);_21.destroyRecursive();_1f=_1f.leftOver=null;}});}},onReadySetupEditMode:function(){this.inherited(arguments);this._removeAndDestroyForm();this._setupForm();},remapEditMode:function(){this.inherited(arguments);this._form&&this._form.set("readOnly",!this.viewModel.canChangeContent());}});});