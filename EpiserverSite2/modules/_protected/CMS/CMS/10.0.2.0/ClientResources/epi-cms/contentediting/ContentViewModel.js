//>>built
define("epi-cms/contentediting/ContentViewModel",["dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/Deferred","dojo/_base/lang","dojo/topic","dojo/on","dojo/when","dojo/promise/all","dojo/Stateful","dijit/Destroyable","dgrid/List","dgrid/extensions/DijitRegistry","epi","epi/dependency","epi/shell/UndoManager","epi/shell/conversion/ObjectConverterRegistry","epi/shell/widget/dialog/Alert","epi/shell/Stateful","../ApplicationSettings","./ContentActionSupport","./ContentEditingValidator","./ContentModelServerSync","./Operation","epi/i18n!epi/cms/nls/episerver.cms.contentediting","epi/i18n!epi/cms/nls/episerver.cms.components.versions"],function(_1,_2,_3,_4,_5,_6,on,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15,_16,_17,res,_18){return _3([_9,_a],{contentModel:null,metadata:null,syncService:null,editorFactory:null,validator:null,contentDataStore:null,profileHandler:null,languageContext:null,enableAutoSave:true,_converterRegistry:null,_contentVersionStore:null,_syncRetryTimeout:60000,undoManager:null,contextTypeName:"",contentLink:null,contentData:null,viewName:null,isCreatingNewVersion:false,hasUndoSteps:false,hasRedoSteps:false,isValid:true,hasPendingChanges:false,lastSaved:null,isSaved:true,isSaving:false,isOnline:true,hasErrors:false,isChangingContentStatus:false,isSuspended:false,constructor:function(){this.contentModel=new _12();},postscript:function(){this.inherited(arguments);this.profileHandler=this.profileHandler||_e.resolve("epi.shell.Profile");this.metadataManager=this.metadataManager||_e.resolve("epi.shell.MetadataManager");this.projectService=this.projectService||_e.resolve("epi.cms.ProjectService");this.currentContentLanguage=this.currentContentLanguage||_13.currentContentLanguage;this.contentDataStore=this.contentDataStore||_e.resolve("epi.storeregistry").get("epi.cms.contentdata");if(!this._contentVersionStore){this._contentVersionStore=_e.resolve("epi.storeregistry").get("epi.cms.contentversion");}this.undoManager=this.undoManager||new _f();this.validator=this.validator||new _15({contextId:this.get("contentLink"),contextTypeName:this.contextTypeName});if(!this.syncService){this._createSyncService();}var _19=_5.hitch(this,function(_1a,_1b,_1c){this.set(_1a,_1c);});this._operation=new _17();this.own(this.syncService.watch("hasPendingChanges",_19),this.validator.watch("isValid",_19),this.validator.watch("hasErrors",_19),this.undoManager.watch("hasUndoSteps",_19),this.undoManager.watch("hasRedoSteps",_19),on(this._operation,"commit",_5.hitch(this,this._commitChanges)));},setActiveProperty:function(_1d){this.onSetActiveProperty(_1d);},suspend:function(){this.set("isSuspended",true);this.onContentChange();this.onSuspend();},onSuspend:function(){},wakeUp:function(){this.set("isSuspended",false);},destroy:function(){this.clear();this.inherited(arguments);},clear:function(){this.undoManager.clear();},_createSyncService:function(){var _1e=new _16({contentLink:this.get("contentLink"),contentDataStore:this.contentDataStore});this.syncService=_1e;},connectLocal:function(_1f,obj,evt,_20){if(!_5.isArray(_1f)){throw Error("First argument to connectLocal must be an Array");}return _1f.push(_2.connect(obj,evt,this,_20));},disconnectLocal:function(_21){if(_5.isArray(_21)){var _22;while((_22=_21.pop())){_2.disconnect(_22);}}},resetNotifications:function(){this.validator.clearErrorsBySource(this.validator.validationSource.client);},beginOperation:function(){this._operation.begin();},endOperation:function(){this._operation.end();},abortOperation:function(){this._operation.abort();},getProperty:function(_23){return this.contentModel.get(_23);},setProperty:function(_24,_25,_26){this._setModelProperty(_24,_25,_26);},saveAndPublishProperty:function(_27,_28){return _7(this.syncService.saveAndPublishProperty(_27,_28),_5.hitch(this,function(_29){this.contentModel.set(_27,_28);return _7(_8([this.contentDataStore.refresh(_29.contentLink),_29.publishedContentLink?this.contentDataStore.refresh(_29.publishedContentLink):null]),_5.hitch(this,function(_2a){var _2b=_2a[0];this.set("contentData",_2b);return _29;}));}));},_commitChanges:function(_2c){var _2d=[];_2c.forEach(function(_2e){_2d.push({propertyName:_2e.propertyName,value:_2e.oldValue,oldValue:_2e.value});},this);this.undoManager.createStep(this,this._saveProperties,[_2d],"Edit properties");},_saveProperties:function(_2f){this.beginOperation();_1.forEach(_2f,function(p){this._setModelProperty(p.propertyName,p.value,p.oldValue);},this);this.endOperation();},_setModelProperty:function(_30,_31,_32){_32=_32===undefined?this.contentModel.get(_30):_32;this.set("isSaved",false);this.contentModel.set(_30,_31);this._operation.save({propertyName:_30,value:_31,oldValue:_32});this.syncService.scheduleForSync(_30,_31);this.enableAutoSave&&this.save();this.onPropertyEdited(_30,_31);},onPropertyEdited:function(_33,_34){},onPropertySaved:function(_35,_36){},onPropertyReverted:function(_37,_38){this.contentModel.set(_37,_38);},_onSynchronizeSuccess:function(_39,_3a,_3b){_1.forEach(_3a,_5.hitch(this,function(_3c){this.validator.clearPropertyErrors(_3c.name,this.validator.validationSource.server);this._patchContentDataStore(_39,_3c.name,null,_3c.value);this.onPropertySaved(_3c.name,_3c.value);}));this.validator.setGlobalErrors(_3b.validationErrors,this.validator.validationSource.server);},_onSynchronizeFailure:function(_3d,_3e,_3f,_40){var _41=[];_1.forEach(_3e,function(_42){if("successful" in _42){if(_42.successful){this.validator.clearPropertyErrors(_42.name,this.validator.validationSource.server);}else{if(_42.committed){this.validator.setPropertyErrors(_42.name,[{errorMessage:_42.validationErrors,severity:this.validator.severity.error}],this.validator.validationSource.server);}else{_41.push(_42);}}}},this);if(_41.length){var _43=_1.map(_41,function(_44){return _44.validationErrors;});this._showErrorsDialog(res.autosave.title,res.autosave.error,_43,_5.hitch(this,function(){_1.forEach(_41,function(_45){this.onPropertyReverted(_45.name,_45.value);},this);}));}if(_40){if(_40.validationErrors){this.validator.setGlobalErrors(_40.validationErrors,this.validator.validationSource.server);}else{this.validator.clearGlobalErrors(this.validator.validationSource.server);}}},_showErrorsDialog:function(_46,_47,_48,_49){var _4a=new (_3([_b,_c]))({className:"epi-grid-max-height--300"});_4a.renderArray(_48);_4a.startup();new _11({title:_46,description:_47,content:_4a,onAction:_49}).show();},_contentLinkChanged:function(_4b,_4c){this.set("contentLink",_4c);this.syncService.contentLink=_4c;this.validator.setContextId(_4c);if(!this.get("isSuspended")){var _4d={uri:"epi.cms.contentdata:///"+_4c};_6.publish("/epi/shell/context/request",_4d,{sender:this,contextIdSyncChange:true,trigger:"internal"});}},ensureWritableVersion:function(){var _4e=this.get("contentLink");if(!this.contentData.isNewVersionRequired){return _4e;}if(this._isCreatingNewVersionDeferred&&!this._isCreatingNewVersionDeferred.isFulfilled()){return this._isCreatingNewVersionDeferred.promise;}else{this._isCreatingNewVersionDeferred=new _4();}this.isCreatingNewVersion=true;_7(this._contentVersionStore.put({originalContentLink:_4e}),_5.hitch(this,function(_4f){this.contentDataStore.refresh(_4f.contentLink).then(_5.hitch(this,function(_50){this.set("contentData",_50);})).always(_5.hitch(this,function(){this.isCreatingNewVersion=false;this._contentLinkChanged(_4e,_4f.contentLink);this._isCreatingNewVersionDeferred.resolve(_4f);}));}),_5.hitch(this,function(_51){console.error(_51);this.isCreatingNewVersion=false;this._isCreatingNewVersionDeferred.reject(_51);}));return this._isCreatingNewVersionDeferred.promise;},validate:function(){var def;if(!this.validator){def=new _4();def.resolve();}else{def=this.validator.validate();}return def;},revertToPublished:function(){var _52=this.get("contentLink");_7(this._contentVersionStore.remove(_52),_5.hitch(this,function(){this._loadPublishedVersion(_52);}),_5.hitch(this,function(_53){var _54;if(_53.status===403){_54=_18.deleteversion.cannotdeletepublished;}else{if(_53.status===404){_54=res.versionstatus.versionnotfound;}}if(_54){new _11({description:_54,onAction:_5.hitch(this,function(){this._loadPublishedVersion(_52);})}).show();}}));},_loadPublishedVersion:function(_55){_7(this._contentVersionStore.query({contentLink:_55,language:this.languageContext?this.languageContext.language:"",query:"getpublishedversion"}),_5.hitch(this,function(_56){if(_56!==null){var _57={uri:"epi.cms.contentdata:///"+_56.contentLink,context:this};_6.publish("/epi/shell/context/request",_57,{sender:this,forceReload:true});}}));},createDraft:function(){var _58=this.get("contentLink"),_59=this.contentData.isCommonDraft&&this.contentData.status===_14.versionStatus.DelayedPublish&&!this.projectService.isProjectModeEnabled;return _7(this._contentVersionStore.put({originalContentLink:_58,isCommonDraft:_59}),_5.hitch(this,function(_5a){var _5b={uri:"epi.cms.contentdata:///"+_5a.contentLink,context:this};_6.publish("/epi/shell/context/request",_5b,{sender:this});_6.publish("/epi/cms/content/statuschange/","common-draft",{id:_5a.contentLink});}));},editCommonDraft:function(){var _5c=this.get("contentLink");return _7(this._contentVersionStore.query({contentLink:_5c,query:"getcommondraftversion"}),_5.hitch(this,function(_5d){var _5e={uri:"epi.cms.contentdata:///"+_5d.contentLink,context:this};_6.publish("/epi/shell/context/request",_5e,{sender:this});}));},_populateContentModel:function(_5f,_60){var _61={},_62,_63;for(var _64 in _5f){var _65=_60.getPropertyMetadata(_64);var _66=_5f[_64];if(_65.hasSubProperties()){_61[_64]=this._populateContentModel(_66,_65);}else{_61[_64]=_66;_62=_65.customEditorSettings.converter;if(_62){_63=_10.getConverter(_62,"runtimeType");if(_63){_61[_64]=_63.convert(_62,"runtimeType",_66);}}}}return _61;},getPropertyMetaData:function(_67){return _7(this._getMetadata(),function(_68){return _68.getPropertyMetadata(_67);});},reload:function(){return _7(_8([this.contentDataStore.get(this.get("contentLink")),this._getMetadata(true)]),_5.hitch(this,function(_69){var _6a=_69[0],_6b=_69[1];this.set("contentData",_6a);var _6c=this.get("contentModel");var _6d=this._populateContentModel(_6a.properties,_6b);for(var _6e in _6d){if(_6d.hasOwnProperty(_6e)&&!_d.areEqual(_6c.get(_6e),_6d[_6e])){_6c.set(_6e,_6d[_6e]);}}}));},_getMetadata:function(_6f){var _70=this.get("metadata");if(!_6f&&_70){return _70;}var _71=this;return _7(this.metadataManager.getMetadataForType("EPiServer.Core.ContentData",{contentLink:this.get("contentLink")}),function(_72){_71.set("metadata",_72);return _72;});},save:function(){if(!this.isOnline){var def=new _4();def.resolve(true);return def;}return this._save();},_save:function(){var def=new _4(),_73=_5.hitch(this,function(_74){if(_74){if(_74.successful){this._onSynchronizeSuccess(_74.contentLink,_74.properties,_74);}else{this._rescheduleProperties(_74.properties);this._onSynchronizeFailure(_74.contentLink,_74.properties,_74.validationErrors,_74);}if(_74&&_74.hasContentLinkChanged){this._contentLinkChanged(_74.contentLink,_74.oldContentLink);}}this.set("isOnline",true);this.set("lastSaved",new Date());this.set("isSaving",false);this.set("isSaved",true);def.resolve(true);}),_75=_5.hitch(this,function(_76){this.set("hasErrors",true);this.set("isSaving",false);this.set("isSaved",false);this.set("isOnline",false);if(_76){this._rescheduleProperties(_76.properties);}setTimeout(_5.hitch(this,function(){this.set("isOnline",true);this._save();}),this._syncRetryTimeout);def.reject(_76);});if(!this.hasPendingChanges){_73();}else{_7(this.ensureWritableVersion()).then(_5.hitch(this,function(){this.set("isSaving",true);return this.syncService.save();})).then(_73).otherwise(_75);}return def;},_rescheduleProperties:function(_77){_1.forEach(_77,_5.hitch(this,function(_78){if(!this.syncService.pendingSync(_78.name)){this.syncService.scheduleForSync(_78.name,_78.value);}}));},undo:function(){!this.get("isSuspended")&&this.undoManager.undo();},redo:function(){!this.get("isSuspended")&&this.undoManager.redo();},_patchContentDataStore:function(_79,_7a,_7b,_7c){var _7d={};_5.setObject(_7a,_7c,_7d);return this.contentDataStore.patchCache({contentLink:_79,changedBy:this.profileHandler.userName,saved:(new Date()).toISOString(),properties:_7d});},changeContentStatus:function(_7e){var _7f=this.get("contentLink");var def=new _4();this.set("isChangingContentStatus",true);var _80=_5.hitch(this,function(_81){var _82=_81&&_81.success;var _83=this.validator;if(_82){if(_7e===_14.action.Publish||_7e===_14.action.CheckIn||_7e===(_14.saveAction.CheckIn|_14.saveAction.DelayedPublish|_14.saveAction.ForceCurrentVersion)){this.set("lastSaved",null);}if(_83){_83.clearGlobalErrors(_83.validationSource.server);}var _84={id:_81.id,oldId:_7f};_6.publish("/epi/cms/content/statuschange/",_7e,_84);def.resolve(_84);}else{if(_81&&_81.validationErrors){if(_83){_83.setGlobalErrors(_81.validationErrors,_83.validationSource.server);_83.validate();}def.reject(null);}else{def.reject((_81&&_81.errorMessage)?_81.errorMessage:res.publish.error);}}this.set("isChangingContentStatus",false);});var _85=_5.hitch(this,function(_86){_6.publish("/epi/cms/action/showerror");def.reject((_86&&_86.errorMessage)?_86.errorMessage:res.publish.error);this.set("isChangingContentStatus",false);});this.onContentChange();_7(this.validate(),_5.hitch(this,function(){_7(this.save(),_5.hitch(this,function(){_7(this.contentDataStore.executeMethod("ChangeStatus",this.get("contentLink"),{action:_7e}),_80,_85);}),_85);}),_85);return def;},onContentChange:function(){},hasEditAccess:function(){return _14.hasAccess(this.contentData.accessMask,_14.accessLevel.Edit);},hasAccess:function(_87){var _88=!this.languageContext||!this.languageContext.isTranslationNeeded;return _88&&_14.isActionAvailable(this.contentData,_87||_14.action.Edit,_14.providerCapabilities.Edit);},canTranslateContent:function(){if(this.viewLanguage&&this.languageContext&&this.viewLanguage!==this.currentContentLanguage){return false;}return true;},canChangeContent:function(_89){var _8a=this.projectService.isProjectModeEnabled&&this.contentData.isPartOfAnotherProject;return !_8a&&this.canEditCurrentLanguage()&&this.hasAccess(_89);},canEditCurrentLanguage:function(){if(!this.languageContext){return true;}return this.languageContext.language===this.currentContentLanguage;},_contentDataSetter:function(_8b){this.contentData=_8b;if(_8b.contentLink!==undefined){this.set("contentLink",_8b.contentLink);}},_showOverlayGetter:function(){var _8c=this.getProperty("iversionable_shortcut");if(_8c&&_8c.pageShortcutType){return _8c.pageShortcutType!==4;}return true;}});});