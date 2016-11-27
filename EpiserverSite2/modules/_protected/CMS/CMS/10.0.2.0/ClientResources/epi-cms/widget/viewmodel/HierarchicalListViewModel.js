//>>built
define("epi-cms/widget/viewmodel/HierarchicalListViewModel",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/topic","dojo/Stateful","dojo/when","dijit/registry","epi","epi/dependency","epi/shell/ClipboardManager","epi/shell/command/_CommandProviderMixin","epi/shell/selection","epi/shell/TypeDescriptorManager","epi-cms/_MultilingualMixin","epi-cms/contentediting/_ContextualContentContextMixin","epi-cms/core/ContentReference","epi-cms/widget/ContentForestStoreModel","epi-cms/widget/ContextualContentForestStoreModel","epi-cms/widget/command/NewFolder","epi-cms/command/RenameFolder","epi-cms/widget/CreateCommandsMixin","epi-cms/command/CopyContent","epi-cms/command/CutContent","epi-cms/command/DeleteContent","epi-cms/command/PasteContent","epi-cms/command/TranslateContent","epi-cms/component/command/ViewTrash","epi-cms/component/command/ChangeContext"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15,_16,_17,_18,_19,_1a,_1b,_1c){return _2([_5,_f,_e,_15],{menuType:{ROOT:1,TREE:2,LIST:4},searchArea:"",searchRoots:"",clipboardManager:null,selection:null,commands:null,createCommands:null,createHierarchyCommands:null,pseudoContextualCommands:null,currentTreeItem:null,currentListItem:null,listQuery:null,listQueryOptions:null,showAllLanguages:true,treeStoreModelClass:null,treeStoreModel:null,store:null,searchStore:null,storeKey:"epi.cms.content.light",mainNavigationTypes:null,containedTypes:null,_showAllLanguagesSetter:function(_1d){this.showAllLanguages=_1d;this._updateListQuery(this.currentTreeItem);if(this.get("isSearching")){var _1e=this.get("searchListQuery");this._updateSearchListQuery(_1e.queryText);}this.treeStoreModel.set("showAllLanguages",_1d);},_currentTreeItemSetter:function(_1f){this.currentTreeItem=_1f;this._updateListQuery(_1f);},postscript:function(_20){this.inherited(arguments);this.contentRepositoryDescriptors=this.contentRepositoryDescriptors||_9.resolve("epi.cms.contentRepositoryDescriptors");_2.safeMixin(this,this.contentRepositoryDescriptors[_20.repositoryKey]);this.clipboardManager=this.clipboardManager||new _a();this.selection=this.selection||new _c();this.store=this.store||_9.resolve("epi.storeregistry").get(this.storeKey);this.searchStore=this.searchStore||_9.resolve("epi.storeregistry").get("epi.cms.content.search");this._setupTreeStoreModel();this._setupCommands();this.set("commands",this._commandRegistry.toArray());this._setupSearchRoots();this.set("listQueryOptions",this.treeStoreModel._queryOptions);},startup:function(){this.inherited(arguments);this._setupSelection();},getCommand:function(_21){return this._commandRegistry[_21]?this._commandRegistry[_21].command:null;},contentContextChanged:function(_22,_23){this._setupSearchRoots();if(!this._isSupportedContent(_22)){return;}var _24=this,_25=_24.get("currentListItem"),_26=_10.toContentReference(_22.id);var _27=this.get("isSearching");_6(_24.store.get(_26.createVersionUnspecificReference().toString()),function(_28){var _29=_24.getContextualParentLink(_28,_22);var _2a=_10.toContentReference(_29);_24.set("editingListItem",_26);if(_23&&_23.forceReload||!_10.compareIgnoreVersion(_25,_26)){_6(_24.store.get(_2a.createVersionUnspecificReference().toString()),function(_2b){_24.treeStoreModel&&_6(_24.treeStoreModel.canExpandTo(_2b),function(_2c){if(_2c){_24.set("currentTreeItem",_2a);_24.set("currentListItem",_26);if(!_27){_24._updateCommands(_2b,_24.menuType.LIST);}}});});}});},getContextualParentLink:function(_2d,_2e){var _2f=this.treeStoreModel.get("previousSelection");var _30=_2f&&this.hasContextual(_2f.selectedAncestors)&&_2d.assetsFolderLink!=null?_2d.assetsFolderLink:_2e.parentLink;return _30||this.roots[0];},onSearchTextChanged:function(_31){this.set("isSearching",!!_31);this._updateSearchListQuery(_31);if(!this.get("isSearching")&&this.currentListItem){var _32=this;_6(this.store.get(this.currentListItem.createVersionUnspecificReference().toString())).then(function(_33){_32._updateCommands(_33,_32.menuType.LIST);});}else{this._updateCommands(null,this.menuType.LIST);}},onSearch:function(_34){_6(this.store.get(_34.id),_3.hitch(this,function(_35){var _36=_10.toContentReference(_35.contentLink);this.set("editingListItem",_36);this.set("currentListItem",_36);this.set("currentTreeItem",_10.toContentReference(_35.parentLink));this._updateCommands(_35,this.menuType.LIST);}));},onTreeItemSelected:function(_37,_38){var _39=this.get("currentTreeItem"),_3a=_10.toContentReference(_37.contentLink),_3b=_38?this.menuType.ROOT:this.menuType.TREE;this._updateCommands(_37,_3b);if(!_10.compareIgnoreVersion(_39,_3a)&&_10.emptyContentReference!==_3a){this.set("currentTreeItem",_3a);}},onListItemSelected:function(_3c){var _3d=this.get("currentListItem"),_3e=_10.toContentReference(_3c.contentLink);this._updateCommands(_3c,this.menuType.LIST);if(!_10.compareIgnoreVersion(_3d,_3e)){this.set("currentListItem",_3e);}},onListItemUpdated:function(_3f){},_isSupportedContent:function(_40){return !!(_40&&_40.id)&&this.containedTypes.some(function(_41){return _d.isBaseTypeIdentifier(_40.dataType,_41);});},_setupSelection:function(){_6(this.getCurrentContext(),_3.hitch(this,function(ctx){var _42;if(!this._isContentContext(ctx)||!this._isSupportedContent(ctx)){_42=_10.toContentReference(this.roots[0]).toString();_6(this.store.get(_42),_3.hitch(this,function(_43){this.onTreeItemSelected(_43,true);}));}else{this.contentContextChanged(ctx,null);}}));},_setupTreeStoreModel:function(){if(!this.treeStoreModelClass){this.treeStoreModelClass=this.enableContextualContent?_12:_11;}var _44=new this.treeStoreModelClass({store:this.store,roots:this.roots,typeIdentifiers:this.mainNavigationTypes,containedTypes:this.containedTypes,notAllowToCopy:this.preventCopyingFor,notAllowToDelete:this.preventDeletionFor,notSupportContextualContents:this.preventContextualContentFor,autoSelectPastedItem:false,onAddDelegate:_3.hitch(this,function(_45){var _46=_7.getEnclosingWidget(_45.domNode),_47=_46&&_46.item,_48=(typeof (this.treeStoreModel.canEdit)==="function")&&this.treeStoreModel.canEdit(_47);if(_48){_45.edit();var _49=function(){_4.publish("/epi/cms/contentdata/childrenchanged",_47.parentLink);};var _4a=_45.on("rename",function(){_4a.remove();_49();});var _4b=_45.on("cancelEdit",function(){_4b.remove();_49();});}}),onRefreshRoots:_3.hitch(this,this._setupSearchRoots),additionalQueryOptions:{sort:this._getSortSettings()}});this.set("treeStoreModel",_44);},_getSortSettings:function(){return [{attribute:"name",descending:false}];},_setupSearchRoots:function(){var _4c=this.roots instanceof Array&&this.roots.length>0?_3.clone(this.roots):[];_6(this.getCurrentContent()).then(_3.hitch(this,function(_4d){var _4e=_4d&&_4d.assetsFolderLink;if(_4e&&typeof this._getPseudoContextualContent==="function"&&_4e!==this._getPseudoContextualContent().toString()){_4c.push(_4e);}})).always(_3.hitch(this,function(){this.set("searchRoots",_4c.join(","));}));},_setupCommands:function(){var _4f=this.menuType;var _50={category:"context",model:this.treeStoreModel,selection:this.selection,clipboard:this.clipboardManager};this.createHierarchyCommands={};var _51=1;_1.forEach(this.mainNavigationTypes,function(_52){this.createHierarchyCommands[_52]={command:new _13(_3.mixin({typeIdentifier:_52},_50)),isAvailable:_4f.ROOT|_4f.TREE,order:_51};_51=_51+1;},this);this.createCommands=this.getCreateCommands(_51);var _53={rename:{command:new _14({category:"context"}),isAvailable:_4f.TREE,order:10},cut:{command:new _17(_50),isAvailable:_4f.TREE|_4f.LIST,order:20},copy:{command:new _16(_50),isAvailable:_4f.TREE|_4f.LIST,order:30},paste:{command:new _19(_50),isAvailable:_4f.ROOT|_4f.TREE,order:40},edit:{command:new _1c({category:"context",forceReload:true,forceContextChange:true}),isAvailable:this.menuType.LIST,order:3},translate:{command:new _1a(),isAvailable:this.menuType.TREE|this.menuType.LIST},"delete":{command:new _18(_50),isAvailable:_4f.TREE|_4f.LIST,order:50},trash:{command:new _1b({typeIdentifiers:this.mainNavigationTypes,order:60}),order:60},sort:function(){var _54=[];for(var key in this){if(key!=="toArray"&&key!=="sort"&&this.hasOwnProperty(key)){var _55=this[key].order;if(!_55){_55=100;}_54.push([_55,this[key].command]);}}_54.sort(function(a,b){return a[0]-b[0];});return _54;},toArray:function(){var _56=this.sort();var _57=[];_1.forEach(_56,function(key){_57.push(key[1]);});return _57;}};this._commandRegistry=_3.mixin(this._commandRegistry,this.createHierarchyCommands,this.createCommands,_53);this.pseudoContextualCommands=this._getPseudoContextualCommands();},_updateListQuery:function(_58){var id,_59=null;var _5a=_1.filter(this.containedTypes,function(_5b){return this.mainNavigationTypes.indexOf(_5b)<0;},this);if(_58){id=_58.toString();_59=this._createListChildrenQuery(id,this.showAllLanguages,_5a);}this.set("listQuery",_59);},_updateSearchListQuery:function(_5c){var _5d=null;if(_5c){_5d=this._createListSearchQuery(_5c,this.showAllLanguages);}this.set("searchListQuery",_5d);},_createListSearchQuery:function(_5e,_5f){return {queryText:_5e,query:"searchcontent",allLanguages:_5f,contentSearchAreas:this.get("searchArea"),searchRoots:this.get("searchRoots"),maxResults:1000,filterDeleted:true};},_createListChildrenQuery:function(id,_60,_61){return {referenceId:id,query:"getchildren",allLanguages:_60,typeIdentifiers:_61};},_updateSelection:function(_62){this.selection.set("data",_62?[{type:"epi.cms.contentdata",data:_62}]:[]);},_updateCommands:function(_63,_64){this._updateSelection(_63);if(typeof this.treeStoreModel.isSupportedType==="function"&&_63&&this.treeStoreModel.isSupportedType(_63.typeIdentifier)){this._updateTreeContextCommandModels(_63);this.decoratePseudoContextualCommands(this.pseudoContextualCommands);}this._commandRegistry.translate.command.set("model",_63);this._commandRegistry.translate.command.set("executeDelegate",null);this._commandRegistry.edit.command.set("model",_63);this._updateCommandAvailability(_64);},_updateTreeContextCommandModels:function(_65){this._updateCreateCommandModels(_65);this._commandRegistry.rename.command.set("model",_65);},_updateCreateCommandModels:function(_66){var _67=this.createCommands;for(var key in _67){_67[key].command.set("model",_66);}},_getPseudoContextualCommands:function(){var key,_68=[];for(key in this.createCommands){_68.push(this.createCommands[key].command);}for(key in this.createHierarchyCommands){_68.push(this.createHierarchyCommands[key].command);}_68.push(this._commandRegistry.paste.command);return _68;},_updateCommandAvailability:function(_69){var _6a=this._commandRegistry,_6b;for(var key in _6a){if(key!=="toArray"&&_6a.hasOwnProperty(key)){_6b=_6a[key].isAvailable;if(_6b){var _6c=_6a[key].command;this._updateAvailabilityForSpecificCommand(_6c,_69,_6b);}}}},_updateAvailabilityForSpecificCommand:function(_6d,_6e,_6f){if(!_6d.isInstanceOf(_1a)){_6d.set("isAvailable",!!(_6f&_6e));}},upload:function(_70){}});});