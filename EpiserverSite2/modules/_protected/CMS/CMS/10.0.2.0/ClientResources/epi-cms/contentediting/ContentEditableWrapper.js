//>>built
define("epi-cms/contentediting/ContentEditableWrapper",["dojo/_base/connect","dojo/_base/declare","dojo/_base/event","dojo/_base/lang","dojo/dom-style","dojo/Deferred","dojo/keys","dojo/on","dojo/query","dojo/when","epi/string","epi-cms/contentediting/_EditorWrapperBase"],function(_1,_2,_3,_4,_5,_6,_7,on,_8,_9,_a,_b){var _c=[];for(var _d in _7){_c.push(_7[_d]);}return _2([_b],{_emptyValue:"&nbsp;",hasInlineEditor:true,closeOnViewportClick:false,destroy:function(){(this.blockDisplayNode&&this.editorWidget)&&_8(this.blockDisplayNode).html(_a.encodeForWebString(this.value,this.editorWidget.uiSafeHtmlTags));this.inherited(arguments);},startEdit:function(){var _e=this.getInherited(arguments);_9(this._getEditor(),_4.hitch(this,function(_f){this._showOverlay(false);_e.apply(this);this.focus();}));},_onTryToStopWithInvalidValue:function(){},_getEditor:function(){this._adjustContentSize();if(this.editorWidget){this.editorWidget.set("value",this.value);return this.editorWidget;}var _10=new _6(),_11=this.blockDisplayNode,_12=this.editorWidgetType,_13=_4.mixin(this.editorParams,{blockDisplayNode:_11,value:this.value});require([_12],_4.hitch(this,function(_14){var _15=this.editorWidget=new _14(_13);this.editorWidget.placeAt(this.overlayItem.domNode);_15.own(on(_11,"blur",_4.hitch(this,this._trySaveValue)),on(_11,"keydown",_4.hitch(this,this._onEditorKeyPress)),_15.watch("state",_4.hitch(this,function(_16,_17,_18){this._showOverlay(_18==="Error");})));_10.resolve(_15);}));this.own(this.overlayItem.watch("sourceItemNode",_4.hitch(this,function(_19,_1a,_1b){if(this.editorWidget&&_1b===null){this.editorParams.blockDisplayNode=null;this.editorWidget.destroy();this.editorWidget=null;}})));return _10.promise;},_adjustContentSize:function(){var _1c=this.blockDisplayNode;_1c.innerHTML=this._emptyValue;_5.set(_1c,"minHeight",_5.getComputedStyle(_1c).height);},_onEditorKeyPress:function(e){if(this.editing){if(_1.isCopyKey(e)&&!e.altKey){var _1d=e.keyCode?String.fromCharCode(e.keyCode).toLowerCase():"";switch(_1d){case "a":case "c":case "x":case "v":break;default:if(_c.indexOf(e.keyCode)===-1){e.preventDefault();}break;}}else{switch(e.keyCode){case _7.ESCAPE:this.cancel();break;case _7.ENTER:case _7.TAB:_3.stop(e);this._trySaveValue();break;default:this.isModified=true;break;}}}},_trySaveValue:function(){var _1e=_4.hitch(this,function(){if(this.editorWidget&&this.editorWidget.isValid()){this.cancel();}});this.editing&&(this.hasPendingChanges()?this.tryToStopEditing(true):_1e());},_showOverlay:function(_1f){_5.set(this.overlayItem.domNode,"display",_1f?"":"none");},_removeEditingFeatures:function(){this._showOverlay(true);this.editorWidget&&this.editorWidget._removeEditingFeatures();}});});