//>>built
require({cache:{"url:epi-cms/widget/templates/HierarchicalList.html":"<div class=\"epi-hierarchicalList\">\r\n    <div class=\"epi-gadgetInnerToolbar\" data-dojo-attach-point=\"searchBoxNode\">\r\n        <div data-dojo-attach-point=\"searchBox\"\r\n             data-dojo-type=\"epi/shell/widget/SearchBox\"\r\n             data-dojo-props=\"triggerContextChange: this.triggerContextChange, triggerChangeOnEnter: true, encodeSearchText: true\">\r\n        </div>\r\n    </div>\r\n    <div data-dojo-attach-point=\"container\"\r\n         data-dojo-type=\"dijit/layout/BorderContainer\"\r\n         data-dojo-props=\"gutters: false\">\r\n\r\n        <div data-dojo-attach-point=\"contentNode\">\r\n            <div class=\"epi-secondaryGadgetContainer epi-gadgetTopContainer\"\r\n                 data-dojo-attach-point=\"tree\"\r\n                 data-dojo-type=\"epi-cms/widget/FolderTree\"\r\n                 data-dojo-props=\"region:'center', splitter:false, model: this.model.treeStoreModel, showRoot: false, contextMenu: this.contextMenu\"></div>\r\n            <div class=\"epi-gadgetBottomContainer\"\r\n                 data-dojo-attach-point=\"listContainer\"\r\n                 data-dojo-type=\"dijit/layout/BorderContainer\"\r\n                 data-dojo-props=\"region:'bottom', splitter:true, gutters: false\">\r\n                <div class=\"epi-createContentContainer\"\r\n                     data-dojo-attach-point=\"createContentArea\"\r\n                     data-dojo-type=\"dijit/layout/_LayoutWidget\"\r\n                     data-dojo-props=\"region:'top', splitter:false\">\r\n                    <button type=\"button\" class=\"epi-flat epi-chromeless\"\r\n                            data-dojo-type=\"dijit/form/Button\"\r\n                            data-dojo-attach-point=\"createContentAreaButton\"></button>\r\n                </div>\r\n                <div data-dojo-attach-point=\"list\"\r\n                     data-dojo-type=\"epi-cms/widget/ContentList\"\r\n                     data-dojo-props=\"region:'center', splitter:false, store: this.model.store, queryOptions: this.model.listQueryOptions, contextMenu: this.contextMenu, resources: this.res\">\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div data-dojo-attach-point=\"resultNode\" style=\"display:none\">\r\n            <div data-dojo-attach-point=\"searchResultList\"\r\n                 data-dojo-type=\"epi-cms/widget/ContentList\"\r\n                 data-dojo-props=\"region:'center', splitter:false, store: this.model.searchStore, queryOptions: this.model.searchResultQueryOptions, contextMenu: this.contextMenu, resources: this.res\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n","url:epi-cms/widget/templates/AssetsDropZone.html":"<div class=\"epi-assetsDropZone\">\r\n    <span class=\"dijitReset dijitInline epi-dropZoneText\">${res.dropzonedescription}</span>\r\n</div>\r\n"}});define("epi-cms/widget/HierarchicalList",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/aspect","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/keys","dojo/on","dojo/when","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","dijit/layout/_LayoutWidget","dijit/layout/BorderContainer","dojox/html/entities","epi/string","epi/shell/command/_WidgetCommandBinderMixin","epi/shell/widget/_ModelBindingMixin","epi/shell/DestroyableByKey","epi/shell/widget/dialog/Alert","epi/shell/widget/ContextMenu","epi/shell/widget/SearchBox","epi-cms/widget/FolderTree","epi-cms/widget/ContentList","epi-cms/widget/FilesUploadDropZone","epi-cms/widget/UploadUtil","epi-cms/widget/viewmodel/HierarchicalListViewModel","dojo/text!./templates/HierarchicalList.html","dojo/text!./templates/AssetsDropZone.html","epi/i18n!epi/cms/nls/episerver.cms.widget.hierachicallist"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,on,_a,_b,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15,_16,_17,_18,_19,_1a,_1b,_1c,_1d,res){return _2([_d,_b,_c,_12,_11,_13],{contextMenu:null,templateString:_1c,showRoot:false,showThumbnail:false,enableDndFileDropZone:false,showCreateContentArea:false,triggerContextChange:false,res:res,modelClassName:_1b,hierarchicalListClass:"",noDataMessage:"",noSearchResultMessage:res.nosearchresults,createContentIcon:"",createContentText:"",modelBindingMap:{searchRoots:["searchRoots"],searchArea:["searchArea"],listQuery:["listQuery"],currentTreeItem:["currentTreeItem"],currentListItem:["currentListItem"],editingListItem:["editingListItem"],searchListQuery:["searchListQuery"]},_setSearchAreaAttr:function(_1e){this.searchBox.set("area",_1e);},_setSearchRootsAttr:function(_1f){this.searchBox.set("searchRoots",_1f);},_setListQueryAttr:function(_20){this.list.set("query",_20);},_setSearchListQueryAttr:function(_21){this.searchResultList.set("query",_21);this._showSearchResults(_21);},_setCurrentTreeItemAttr:function(_22){if(_22){this._toggleActive(this.tree,this.list);_a(this.tree.selectContent(_22.toString()),_3.hitch(this,function(){var _23=this.tree.getNodesByItem(_22.toString())[0];if(_23){this.tree.model.set("previousSelection",{selectedContent:_23,selectedAncestors:_23.getTreePath()});}}));}},_setCurrentListItemAttr:function(_24){this.list.set("currentItem",_24);this._toggleActive(this.list,this.tree);},_setEditingListItemAttr:function(_25){this.list.set("editingItem",_25);},_setShowRootAttr:function(_26){this.tree.set("showRoot",_26);},postMixInProperties:function(){this.inherited(arguments);if(!this.model&&!this.commandProvider&&this.modelClassName){var _27=_2(this.modelClassName);this.model=this.commandProvider=new _27({repositoryKey:this.repositoryKey});}this.setupContextMenu();},setupContextMenu:function(){this.own(this.contextMenu=new _15({category:"context"}));this.contextMenu.addProvider(this.model);},postCreate:function(){this.inherited(arguments);_5.add(this.domNode,this.hierarchicalListClass);this._setupTree();this._setupCreateContentArea();this._setupList();if(this.enableDndFileDropZone){this._setupDropZone();}this._toggleCreateContentArea(this.showCreateContentArea);this.model.startup();this.own(this.model.clipboardManager.watch("data",_3.hitch(this,this._updateClipboardIndicators)),this.searchBox.on("searchBoxChange",_3.hitch(this,this._onSearchTextChanged)),this.model.watch("isSearching",_3.hitch(this,function(){if(this._dropZone){this._dropZone.set("enabled",!this.model.get("isSearching"));}})));},startup:function(){this.inherited(arguments);if(this.contextMenu){this.contextMenu.startup();}},destroy:function(){this.model.destroy();this.inherited(arguments);},layout:function(){if(this.enableDndFileDropZone){var _28=this.list.grid;if(_28){_5.add(_28.bodyNode,"epi-drop-area");}var _29=this.searchResultList.grid;if(_29){_5.add(_29.bodyNode,"epi-drop-area");}}var _2a=_7.getMarginBox(this.searchBoxNode),_2b={h:this._contentBox.h-_2a.h,w:this._contentBox.w,l:this._contentBox.l,t:this._contentBox.t};this.container.resize(_2b);},_toggleCreateContentArea:function(_2c){_8.set(this.createContentArea.domNode,"display",_2c?"":"none");this.listContainer.layout();},_toggleActive:function(_2d,_2e){_5.remove(_2e.domNode,"epi-focused");_5.add(_2d.domNode,"epi-focused");},_showNotification:function(_2f){var _30=new _14({description:_10.toHTML(_2f)});_30.show();},_onSearchTextChanged:function(_31){this._wireItemSelectedEvent(_31?this.searchResultList:this.list);this.model.onSearchTextChanged(_31);},_showSearchResults:function(_32){_8.set(this.contentNode,"display",!!_32?"none":"");_8.set(this.resultNode,"display",!_32?"none":"");this.container.layout();},_onDrop:function(evt,_33){_33=_1a.filterFileOnly(_33);if(!_33||_33.length<=0){return;}var _34=this.model.getCommand("uploadDefault");if(!_34){return;}_34.set("fileList",_33);_34.execute();this.searchBox.clearValue();},_setupDropZone:function(){this.own(this._dropZone=new _19({templateString:_1d,res:res,outsideDomNode:this.container.domNode}));_6.place(this._dropZone.domNode,this.domNode,"first");this.connect(this._dropZone,"onDrop",this._onDrop);var _35=this.model.getCommand("uploadDefault");if(_35){var _36=this._dropZone;this.own(_35.watch("canExecute",function(_37,_38,_39){_36.set("enabled",_39);}));}},_setupTree:function(){var _3a=this.model._commandRegistry;function _3b(_3c,_3d,e){this.model.onTreeItemSelected(_3c,this.tree.model.isTypeOfRoot(_3c));};function _3e(_3f){_3f?_3a.copy.command.execute():_3a.cut.command.execute();};this.own(on(this.tree,"copyOrCut",_3e),on(this.tree,"select",_3.hitch(this,_3b)),on(this.tree,"paste",function(){_3a.paste.command.execute();}),on(this.tree,"delete",function(){_3a["delete"].command.execute();}),_4.after(this.tree,"onClick",_3.hitch(this,_3b),true));this.model._commandRegistry.rename.command.set("renameDelegate",_3.hitch(this,function(_40){this.tree.getNodesByItem(_40)[0].edit();}));},_setupCreateContentArea:function(){this.createContentAreaButton.set("iconClass",this.createContentIcon);this.createContentAreaButton.set("label",this.createContentText);this.own(this.createContentAreaButton.on("click",_3.hitch(this,"_onCreateAreaClick")));},_wireItemSelectedEvent:function(_41){this.destroyByKey("itemSelectedWatch");this.ownByKey("itemSelectedWatch",on(_41,"itemSelected",_3.hitch(this.model,this.model.onListItemSelected)));},_setupList:function(){var _42=this.model._commandRegistry;this._wireItemSelectedEvent(this.list);this.own(_4.after(this.model,"onListItemUpdated",_3.hitch(this.list,function(_43){_a(_43,_3.hitch(this,this.editContent));})),this.searchResultList.grid.addKeyHandler(_9.ESCAPE,_3.hitch(this.searchBox,this.searchBox.clearValue)),_4.after(this.model.treeStoreModel,"onDeleted",_3.hitch(this,function(_44){_1.forEach(_44,function(_45){var _46=this.searchResultList.grid.row(_45.data.contentLink);if(_46&&_46.data){this.searchResultList.grid.removeRow(_46);}},this);}),true));this.searchBox.on("keyup",_3.hitch(this,function(e){if(e.keyCode===_9.ENTER){e.preventDefault();this.searchResultList.editSelectedContent();}}));this.searchBox.on("keydown",_3.hitch(this,function(e){if(e.keyCode===_9.DOWN_ARROW||e.keyCode===_9.UP_ARROW){e.preventDefault();this.searchResultList.grid.moveSelection(e.keyCode===_9.UP_ARROW);}}));if(this.model.changeContextOnItemSelection){var _47=function(){_42.edit.command.execute();};this.own(on(this.list,"itemAction",_47),on(this.searchResultList,"itemAction",_47));}if(this.showThumbnail){_5.add(this.list.grid.domNode,"epi-thumbnailContentList");_5.add(this.searchResultList.grid.domNode,"epi-thumbnailContentList");}this.list.set("noDataMessage",this.noDataMessage);this.searchResultList.set("noDataMessage",this.noSearchResultMessage);},_onCreateAreaClick:function(){this.list.emit("createItemAction",{});},_onSearchAction:function(_48){this.model.onSearch(_48.metadata);},_updateClipboardIndicators:function(_49,_4a,_4b){var _4c=this.model.clipboardManager.isCopy();if(_4a instanceof Array){_1.forEach(_4a,function(_4d){this.tree.toggleCut(_4d.data,false);this.list.toggleCut(_4d.data,false);this.searchResultList.toggleCut(_4d.data,false);},this);}if(!_4c&&_4b instanceof Array){_1.forEach(_4b,function(_4e){this.tree.toggleCut(_4e.data,true);this.list.toggleCut(_4e.data,true);this.searchResultList.toggleCut(_4e.data,true);},this);}}});});