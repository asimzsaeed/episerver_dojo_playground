require({cache:{
'url:epi-cms/widget/templates/HierarchicalList.html':"﻿<div class=\"epi-hierarchicalList\">\r\n    <div class=\"epi-gadgetInnerToolbar\" data-dojo-attach-point=\"searchBoxNode\">\r\n        <div data-dojo-attach-point=\"searchBox\"\r\n             data-dojo-type=\"epi/shell/widget/SearchBox\"\r\n             data-dojo-props=\"triggerContextChange: this.triggerContextChange, triggerChangeOnEnter: true, encodeSearchText: true\">\r\n        </div>\r\n    </div>\r\n    <div data-dojo-attach-point=\"container\"\r\n         data-dojo-type=\"dijit/layout/BorderContainer\"\r\n         data-dojo-props=\"gutters: false\">\r\n\r\n        <div data-dojo-attach-point=\"contentNode\">\r\n            <div class=\"epi-secondaryGadgetContainer epi-gadgetTopContainer\"\r\n                 data-dojo-attach-point=\"tree\"\r\n                 data-dojo-type=\"epi-cms/widget/FolderTree\"\r\n                 data-dojo-props=\"region:'center', splitter:false, model: this.model.treeStoreModel, showRoot: false, contextMenu: this.contextMenu\"></div>\r\n            <div class=\"epi-gadgetBottomContainer\"\r\n                 data-dojo-attach-point=\"listContainer\"\r\n                 data-dojo-type=\"dijit/layout/BorderContainer\"\r\n                 data-dojo-props=\"region:'bottom', splitter:true, gutters: false\">\r\n                <div class=\"epi-createContentContainer\"\r\n                     data-dojo-attach-point=\"createContentArea\"\r\n                     data-dojo-type=\"dijit/layout/_LayoutWidget\"\r\n                     data-dojo-props=\"region:'top', splitter:false\">\r\n                    <button type=\"button\" class=\"epi-flat epi-chromeless\"\r\n                            data-dojo-type=\"dijit/form/Button\"\r\n                            data-dojo-attach-point=\"createContentAreaButton\"></button>\r\n                </div>\r\n                <div data-dojo-attach-point=\"list\"\r\n                     data-dojo-type=\"epi-cms/widget/ContentList\"\r\n                     data-dojo-props=\"region:'center', splitter:false, store: this.model.store, queryOptions: this.model.listQueryOptions, contextMenu: this.contextMenu, resources: this.res\">\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div data-dojo-attach-point=\"resultNode\" style=\"display:none\">\r\n            <div data-dojo-attach-point=\"searchResultList\"\r\n                 data-dojo-type=\"epi-cms/widget/ContentList\"\r\n                 data-dojo-props=\"region:'center', splitter:false, store: this.model.searchStore, queryOptions: this.model.searchResultQueryOptions, contextMenu: this.contextMenu, resources: this.res\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n",
'url:epi-cms/widget/templates/AssetsDropZone.html':"﻿<div class=\"epi-assetsDropZone\">\r\n    <span class=\"dijitReset dijitInline epi-dropZoneText\">${res.dropzonedescription}</span>\r\n</div>\r\n"}});
﻿define("epi-cms/widget/HierarchicalList", [
// dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/keys",
    "dojo/on",
    "dojo/when",

// dijit
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/_LayoutWidget",
    "dijit/layout/BorderContainer", // Used in template

// dojox
    "dojox/html/entities",

// epi
    "epi/string",
    "epi/shell/command/_WidgetCommandBinderMixin",
    "epi/shell/widget/_ModelBindingMixin",
    "epi/shell/DestroyableByKey",
    "epi/shell/widget/dialog/Alert",

    "epi/shell/widget/ContextMenu",
    "epi/shell/widget/SearchBox",
    "epi-cms/widget/FolderTree",
    "epi-cms/widget/ContentList",
    "epi-cms/widget/FilesUploadDropZone",
    "epi-cms/widget/UploadUtil",
    "epi-cms/widget/viewmodel/HierarchicalListViewModel",

// template
    "dojo/text!./templates/HierarchicalList.html",
    "dojo/text!./templates/AssetsDropZone.html",

// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.widget.hierachicallist"
],

function (
// dojo
    array,
    declare,
    lang,
    aspect,
    domClass,
    domConstruct,
    domGeometry,
    domStyle,
    keys,
    on,
    when,

// dijit
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _LayoutWidget,
    BorderContainer,

//dojox
    htmlEntities,

// epi
    epistring,

    _WidgetCommandBinderMixin,
    _ModelBindingMixin,
    DestroyableByKey,
    Alert,

    ContextMenu,
    SearchBox,
    FolderTree,
    ContentList,
    DropZone,
    UploadUtil,
    HierarchicalListViewModel,

// template
    template,
    dropZoneTemplate,

// Resources
    res
) {

    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, _ModelBindingMixin, _WidgetCommandBinderMixin, DestroyableByKey], {
        // summary:
        //      Base widget for displaying the panel with tree on top and list for displaying leaf's items, as well as the search box on very top.
        // tags:
        //      internal abstract

        contextMenu: null,

        templateString: template,

        showRoot: false,

        // showThumbnail: [public] Boolean
        //      Flag to indicate this widget allowed to show a thumbnail in the list.
        showThumbnail: false,

        // enableDndFileDropZone: [public] Boolean
        //      Flag to indicate this widget allowed to show drop zone widget ("epi-cms/widget/FilesUploadDropZone" that care about native DnD files from browser) or not.
        enableDndFileDropZone: false,

        // showCreateContentArea: [public] Boolean
        //      Flag to indicate this widget allowed to show create content area by default or not.
        showCreateContentArea: false,

        triggerContextChange: false,

        res: res,

        modelClassName: HierarchicalListViewModel,

        // hierarchicalListClass: [readonly] String
        //      The CSS class to be used on the hierarchical list.
        hierarchicalListClass: "",

        // noDataMessage: [public] String
        //      No data message for list widget
        noDataMessage: "",

        // noSearchResultMessage: [public] String
        //      No search result message for search result list.
        noSearchResultMessage: res.nosearchresults,

        // createContentIcon: [public] String
        //      The icon class to be used in the create content area of the list.
        createContentIcon: "",

        // createContentText: [public] String
        createContentText: "",

        modelBindingMap: {
            searchRoots: ["searchRoots"],
            searchArea: ["searchArea"],
            listQuery: ["listQuery"],
            currentTreeItem: ["currentTreeItem"],
            currentListItem: ["currentListItem"],
            editingListItem: ["editingListItem"],
            searchListQuery: ["searchListQuery"]
        },

        _setSearchAreaAttr: function (value) {
            this.searchBox.set("area", value);
        },

        _setSearchRootsAttr: function (value) {
            this.searchBox.set("searchRoots", value);
        },

        _setListQueryAttr: function (value) {
            this.list.set("query", value);
        },

        _setSearchListQueryAttr: function (value) {
            this.searchResultList.set("query", value);
            this._showSearchResults(value);
        },

        _setCurrentTreeItemAttr: function (value) {
            if (value) {
                this._toggleActive(this.tree, this.list);

                when(this.tree.selectContent(value.toString()), lang.hitch(this, function () {
                    var selectedNode = this.tree.getNodesByItem(value.toString())[0];
                    if (selectedNode) {
                        this.tree.model.set("previousSelection", {
                            selectedContent: selectedNode,
                            selectedAncestors: selectedNode.getTreePath()
                        });
                    }
                }));
            }
        },

        _setCurrentListItemAttr: function (value) {
            this.list.set("currentItem", value);
            this._toggleActive(this.list, this.tree);
        },

        _setEditingListItemAttr: function (value) {
            this.list.set("editingItem", value);
        },

        _setShowRootAttr: function (value) {
            this.tree.set("showRoot", value);
        },

        postMixInProperties: function () {
            this.inherited(arguments);

            if (!this.model && !this.commandProvider && this.modelClassName) {
                var modelClass = declare(this.modelClassName);
                this.model = this.commandProvider = new modelClass({ repositoryKey: this.repositoryKey });
            }
            this.setupContextMenu();
        },

        setupContextMenu: function () {
            // summary: set up the context menu
            //
            // tags:
            //      public
            this.own(this.contextMenu = new ContextMenu({ category: "context" }));
            this.contextMenu.addProvider(this.model);
        },

        postCreate: function () {
            this.inherited(arguments);

            domClass.add(this.domNode, this.hierarchicalListClass);

            this._setupTree();
            this._setupCreateContentArea();
            this._setupList();

            if (this.enableDndFileDropZone) {
                this._setupDropZone();
            }

            this._toggleCreateContentArea(this.showCreateContentArea);

            this.model.startup();

            // Watching instead of binding since we need the old value as well
            this.own(
                this.model.clipboardManager.watch("data", lang.hitch(this, this._updateClipboardIndicators)),
                this.searchBox.on("searchBoxChange", lang.hitch(this, this._onSearchTextChanged)),
                this.model.watch("isSearching", lang.hitch(this, function () {
                    //Disable the drop zone if the user is searching
                    if (this._dropZone) {
                        this._dropZone.set("enabled", !this.model.get("isSearching"));
                    }
                }))
            );
        },

        startup: function () {
            this.inherited(arguments);

            if (this.contextMenu) {
                this.contextMenu.startup();
            }
        },

        destroy: function () {
            this.model.destroy();

            this.inherited(arguments);
        },

        layout: function () {

            // Add class to show drop area
            if (this.enableDndFileDropZone) {
                var grid = this.list.grid;
                if (grid) {
                    domClass.add(grid.bodyNode, "epi-drop-area");
                }
                var searchResultList = this.searchResultList.grid;
                if (searchResultList) {
                    domClass.add(searchResultList.bodyNode, "epi-drop-area");
                }
            }

            var searchBoxSize = domGeometry.getMarginBox(this.searchBoxNode),
                containerSize = {
                    h: this._contentBox.h - searchBoxSize.h,
                    w: this._contentBox.w,
                    l: this._contentBox.l,
                    t: this._contentBox.t
                };

            this.container.resize(containerSize);
        },

        _toggleCreateContentArea: function (display) {
            // summary:
            //      Toggle display of the create content area
            // display: [Boolean]
            // tags:
            //      protected

            domStyle.set(this.createContentArea.domNode, "display", display ? "" : "none");

            // Since the create area may no longer be visible we need to re-layout the container to ensure
            // the contents are displated correctly.
            this.listContainer.layout();
        },

        _toggleActive: function (activeWidget, inactiveWidget) {
            // summary:
            //      Toggle visual indication between tree and list
            //
            // activeWidget:
            //      The widget to enable active visuals for
            //
            // inactiveWidget:
            //      The widget to disabe active visuals for

            domClass.remove(inactiveWidget.domNode, "epi-focused");
            domClass.add(activeWidget.domNode, "epi-focused");
        },

        _showNotification: function (message) {
            // summary:
            //      Uses the alert dialog implementation to show notification with the supplied message
            //
            // message:
            //      html encoded string to show in notification dialog
            //
            // tags:
            //      public callback

            var dialog = new Alert({
                description: epistring.toHTML(message)
            });

            dialog.show();
        },

        _onSearchTextChanged: function (searchText) {
            // summary:
            //      Callback method for when the user has search for some content
            // tags:
            //      private callback

            // When we are searching listen to itemSelected on the searchResultList otherwise listen to changes on the default list
            this._wireItemSelectedEvent(searchText ? this.searchResultList : this.list);

            this.model.onSearchTextChanged(searchText);
        },

        _showSearchResults: function (searchQuery) {
            domStyle.set(this.contentNode, "display", !!searchQuery ? "none" : "");
            domStyle.set(this.resultNode, "display", !searchQuery ? "none" : "");
            this.container.layout();
        },

        _onDrop: function (evt, fileList) {
            fileList = UploadUtil.filterFileOnly(fileList);
            if (!fileList || fileList.length <= 0) { // ignore folder dropping
                return;
            }

            var uploadCommand = this.model.getCommand("uploadDefault");
            if (!uploadCommand) {
                return;
            }

            uploadCommand.set("fileList", fileList);
            uploadCommand.execute();

            // Hide the search result list by clearing the search box
            this.searchBox.clearValue();
        },

        _setupDropZone: function () {
            // summary:
            //      Setup drop zone for entire widget.
            // tags:
            //      private

            // Create drop zone
            this.own(this._dropZone = new DropZone({ templateString: dropZoneTemplate, res: res, outsideDomNode: this.container.domNode }));
            domConstruct.place(this._dropZone.domNode, this.domNode, "first");

            this.connect(this._dropZone, "onDrop", this._onDrop);

            var uploadCommand = this.model.getCommand("uploadDefault");
            if (uploadCommand) {
                var dropZone = this._dropZone;
                this.own(
                    uploadCommand.watch("canExecute", function (name, oldValues, newValues) {
                        dropZone.set("enabled", newValues); // disable drop zone in case does not have permission to upload.
                    })
                );
            }
        },

        _setupTree: function () {
            // summary:
            //      Implementation should implement this, to setup the content tree. For example, command binding.
            //
            // tags:
            //      protected

            var registry = this.model._commandRegistry;

            function treeClickHandler(item, node, e) {
                this.model.onTreeItemSelected(item, this.tree.model.isTypeOfRoot(item));
            }

            function copyOrCuthandler(copy) {
                copy ? registry.copy.command.execute() : registry.cut.command.execute();
            }

            this.own(
                on(this.tree, "copyOrCut", copyOrCuthandler),
                on(this.tree, "select", lang.hitch(this, treeClickHandler)),
                on(this.tree, "paste", function () {
                    registry.paste.command.execute();
                }),
                on(this.tree, "delete", function () {
                    registry["delete"].command.execute();
                }),
                               aspect.after(this.tree, "onClick", lang.hitch(this, treeClickHandler), true)
                           );

            this.model._commandRegistry.rename.command.set("renameDelegate", lang.hitch(this, function (model) {
                this.tree.getNodesByItem(model)[0].edit();
            }));
        },

        _setupCreateContentArea: function () {
            // summary:
            //      Setup create content area for list widget
            // tags:
            //      protected

            this.createContentAreaButton.set("iconClass", this.createContentIcon);
            this.createContentAreaButton.set("label", this.createContentText);

            this.own(
                // Connect to create new item link when there's no children for the current parent.
                this.createContentAreaButton.on("click", lang.hitch(this, "_onCreateAreaClick"))
            );
        },


        _wireItemSelectedEvent: function (list) {
            // summary:
            //      Attach to the itemSelected list on the list to the models onListItemSelected
            // list: dgrid
            //      The list to attach the event on
            // tags:
            //      private
            this.destroyByKey("itemSelectedWatch");
            this.ownByKey("itemSelectedWatch", on(list, "itemSelected", lang.hitch(this.model, this.model.onListItemSelected)));
        },
        _setupList: function () {
            // summary:
            //      Implementation should implement this, to setup the content list. For example, command binding.
            //
            // tags:
            //      protected
            var registry = this.model._commandRegistry;


            this._wireItemSelectedEvent(this.list);

            this.own(
                aspect.after(this.model, "onListItemUpdated", lang.hitch(this.list, function (deferred) {
                    when(deferred, lang.hitch(this, this.editContent));
                })),
                this.searchResultList.grid.addKeyHandler(keys.ESCAPE, lang.hitch(this.searchBox, this.searchBox.clearValue)),
                aspect.after(this.model.treeStoreModel, "onDeleted", lang.hitch(this, function (items) {
                    array.forEach(items, function (item) {
                        var searchResultRow = this.searchResultList.grid.row(item.data.contentLink);
                        if (searchResultRow && searchResultRow.data) {
                            this.searchResultList.grid.removeRow(searchResultRow);
                        }
                    }, this);
                }), true)
            );

            this.searchBox.on("keyup", lang.hitch(this, function (e) {
                if (e.keyCode === keys.ENTER) {
                    e.preventDefault();
                    this.searchResultList.editSelectedContent();
                }
            }));

            this.searchBox.on("keydown", lang.hitch(this, function (e) {
                if (e.keyCode === keys.DOWN_ARROW || e.keyCode === keys.UP_ARROW) {
                    e.preventDefault();
                    this.searchResultList.grid.moveSelection(e.keyCode === keys.UP_ARROW);
                }
            }));

            // TODO: When it possible to do a breaking change we should remove the changeContextOnItemSelection variable and
            //       create a callback method that can be overridden in child classes, instead of calling the command explicitly.
            if (this.model.changeContextOnItemSelection) {
                var itemSelectAction =  function () {
                    registry.edit.command.execute();
                };
                this.own(
                    on(this.list, "itemAction", itemSelectAction),
                    on(this.searchResultList, "itemAction", itemSelectAction)
                );
            }
            if (this.showThumbnail) {
                domClass.add(this.list.grid.domNode, "epi-thumbnailContentList");
                domClass.add(this.searchResultList.grid.domNode, "epi-thumbnailContentList");
            }
            this.list.set("noDataMessage", this.noDataMessage);
            this.searchResultList.set("noDataMessage", this.noSearchResultMessage);
        },

        _onCreateAreaClick: function () {
            // summary:
            //      A callback function which is executed when the create area is clicked.
            // tags:
            //      protected

            // TODO: Remove in 8.0
            //       Kept to stop a breaking change. We can remove the emit for the next major since
            //       inheriting classes can just override the _onCreateAreaClick method.
            this.list.emit("createItemAction", {});
        },

        _onSearchAction: function (value) {
            // summary:
            //      Implementation should implement this, to process search action.
            //
            // value:
            //      Search string
            //
            // tags:
            //      protected

            this.model.onSearch(value.metadata);
        },

        // =======================================================================
        // Clipboard handling

        _updateClipboardIndicators: function (name, oldValues, newValues) {

            var isCopy = this.model.clipboardManager.isCopy();

            if (oldValues instanceof Array) {
                array.forEach(oldValues, function (clip) {
                    this.tree.toggleCut(clip.data, false);
                    this.list.toggleCut(clip.data, false);
                    this.searchResultList.toggleCut(clip.data, false);
                }, this);
            }

            if (!isCopy && newValues instanceof Array) {
                array.forEach(newValues, function (clip) {
                    this.tree.toggleCut(clip.data, true);
                    this.list.toggleCut(clip.data, true);
                    this.searchResultList.toggleCut(clip.data, true);
                }, this);
            }
        }

    });

});
