define("epi-cms/widget/viewmodel/HierarchicalListViewModel", [
// dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",

    "dojo/Stateful",
    "dojo/when",
    "dijit/registry",
//epi
    "epi",
    "epi/dependency",

    "epi/shell/ClipboardManager",
    "epi/shell/command/_CommandProviderMixin",
    "epi/shell/selection",
    "epi/shell/TypeDescriptorManager",
//epi-cms
    "epi-cms/_MultilingualMixin",
    "epi-cms/contentediting/_ContextualContentContextMixin",
    "epi-cms/core/ContentReference",
    "epi-cms/widget/ContentForestStoreModel",
    "epi-cms/widget/ContextualContentForestStoreModel",
//command
    "epi-cms/widget/command/NewFolder",
    "epi-cms/command/RenameFolder",
    "epi-cms/widget/CreateCommandsMixin",
    "epi-cms/command/CopyContent",
    "epi-cms/command/CutContent",
    "epi-cms/command/DeleteContent",
    "epi-cms/command/PasteContent",
    "epi-cms/command/TranslateContent",
    "epi-cms/component/command/ViewTrash",
    "epi-cms/component/command/ChangeContext"
],

function (
// dojo
    array,
    declare,
    lang,
    topic,

    Stateful,
    when,
    registry,
// epi
    epi,
    dependency,

    ClipboardManager,
    _CommandProviderMixin,
    Selection,
    TypeDescriptorManager,
//epi-cms
    _MultilingualMixin,
    _ContextualContentContextMixin,
    ContentReference,
    ContentForestStoreModel,
    ContextualContentForestStoreModel,
//command
    NewFolderCommand,
    RenameFolderCommand,
    CreateCommandsMixin,
    CopyContentCommand,
    CutContentCommand,
    DeleteContentCommand,
    PasteContentCommand,
    TranslateContentCommand,
    ViewTrashCommand,
    ChangeContextCommand
) {

    return declare([Stateful, _ContextualContentContextMixin, _MultilingualMixin, CreateCommandsMixin], {
        // summary:
        //      Handles search and tree to list browsing widgets.
        //
        // tags:
        //      internal xproduct

        // menuType: [readonly] Object
        //      Enum used with commands to set in what context they should be available.
        menuType: { ROOT: 1, TREE: 2, LIST: 4 },

        // searchArea: [readonly] String
        //      Used with the search component when querying to scope the search.
        searchArea: "",
        // searchRoots: [readonly] String
        //      Used with the search component to set the roots to search in.
        searchRoots: "",

        // clipboardManager: [const] ClipboardManager
        //      Used to handle copy-paste operations with the commands.
        clipboardManager: null,

        // selection: [const] Selection
        //      Used to handle currently selected items for the commands.
        selection: null,

        // commands: [readonly] _Command[]
        //      Used to handle currently selected items for the commands.
        commands: null,

        // createCommands: [readonly] _Command[]
        //      Used to handle currently selected items for the commands.
        createCommands: null,

        // createHierarchyCommands: [readonly] _Command[]
        //      Used to handle currently selected items for the commands.
        createHierarchyCommands: null,

        // pseudoContextualCommands: [readonly] _Command[]
        //      Used to handle currently selected items for the commands.
        pseudoContextualCommands: null,

        // currentTreeItem:  ContentReference
        //      The currently selected tree item.
        currentTreeItem: null,

        // currentListItem:  ContentReference
        //      The currently selected list item.
        currentListItem: null,

        // listQuery: Query
        //      Query object holding parameters to get the children.
        //      of the current tree item
        listQuery: null,

        // listQueryOptions: Object
        //      Extra parameters needed to query the store for the list items.
        listQueryOptions: null,

        // showAllLanguages: Boolean
        //      Indicates if to query for items only in current language context or not.
        showAllLanguages: true,

        // treeStoreModelClass: [const] Function
        //      Class to use as model for the tree.
        treeStoreModelClass: null,

        // treeStoreModel: [const] TreeStoreModel
        //      TreeStoreModel instance.
        treeStoreModel: null,

        // store: [const] Dojo/Store
        //      Store instance used for all server queries.
        store: null,

        // searchStore: [const] Dojo/Store
        //      Store instance used for all server search queries.
        searchStore: null,

        // storeKey: [const] String
        //      Key to resolve store from dependency.
        storeKey: "epi.cms.content.light",

        // mainNavigationTypes: String[]
        //      Which types to filter for tree queries. Also used with trash command.
        mainNavigationTypes: null,

        // containedTypes: [const] String[]
        //       Which types to filter for list queries.
        containedTypes: null,

        _showAllLanguagesSetter: function (value) {
            this.showAllLanguages = value;
            this._updateListQuery(this.currentTreeItem);

            // If we are searching we need to re-run the query otherwise the search result will still contain content in other languages
            if (this.get("isSearching")) {
                var searchListQuery = this.get("searchListQuery");
                this._updateSearchListQuery(searchListQuery.queryText);

            }
            this.treeStoreModel.set("showAllLanguages", value);
        },

        _currentTreeItemSetter: function (value) {
            this.currentTreeItem = value;
            this._updateListQuery(value);
        },

        postscript: function (args) {
            this.inherited(arguments);
            this.contentRepositoryDescriptors = this.contentRepositoryDescriptors || dependency.resolve("epi.cms.contentRepositoryDescriptors");

            declare.safeMixin(this, this.contentRepositoryDescriptors[args.repositoryKey]);

            this.clipboardManager = this.clipboardManager || new ClipboardManager();
            this.selection = this.selection || new Selection();
            this.store = this.store || dependency.resolve("epi.storeregistry").get(this.storeKey);
            this.searchStore = this.searchStore || dependency.resolve("epi.storeregistry").get("epi.cms.content.search");

            this._setupTreeStoreModel();

            this._setupCommands();
            this.set("commands", this._commandRegistry.toArray());

            this._setupSearchRoots();

            this.set("listQueryOptions", this.treeStoreModel._queryOptions);
        },

        startup: function () {
            // summary:
            //      Allows the view model to start reacting to external input.
            // tags:
            //      protected

            this.inherited(arguments);

            this._setupSelection();
        },

        getCommand: function (commandName) {
            // summary:
            //      Gets a command by command name
            // tags:
            //      protected

            return this._commandRegistry[commandName] ? this._commandRegistry[commandName].command : null;
        },

        contentContextChanged: function (context, callerData) {
            // summary:
            //      Called when the currently loaded content changes. I.e. a new content data object is loaded into the preview area.
            //      Override _ContextContextMixin.contentContextChanged
            // tags:
            //      protected

            this._setupSearchRoots();

            if (!this._isSupportedContent(context)) {
                return;
            }

            var self = this,
                oldListRef = self.get("currentListItem"),
                listRef = ContentReference.toContentReference(context.id);

            var isSearching = this.get("isSearching");
            when(self.store.get(listRef.createVersionUnspecificReference().toString()), function (currentContent) {

                var parentContextLink = self.getContextualParentLink(currentContent, context);

                var treeRef = ContentReference.toContentReference(parentContextLink);

                // Just want to store the current selected content when the context changed.
                // So that, do not need to wait any action from the store.
                self.set("editingListItem", listRef);

                if (callerData && callerData.forceReload || !ContentReference.compareIgnoreVersion(oldListRef, listRef)) {
                    when(self.store.get(treeRef.createVersionUnspecificReference().toString()), function (model) {
                        self.treeStoreModel && when(self.treeStoreModel.canExpandTo(model), function (canExpand) {
                            if (canExpand) {
                                self.set("currentTreeItem", treeRef);
                                self.set("currentListItem", listRef);

                                // If we aren't searching we should update the command models with the context item
                                if (!isSearching) {
                                    self._updateCommands(model, self.menuType.LIST);
                                }
                            }
                        });
                    });
                }
            });
        },

        getContextualParentLink: function (/* Object */ contentItem, /* Object */ context) {
            // summary:
            //      Retrieves the contextual parent link based on given contentItem and context. In case no link found, it returns the first item in the [roots].
            // contentItem:
            //      The list item (contentlink)
            // context:
            //      The currently loaded context.
            // tags:
            //      protected

            var previousSelection = this.treeStoreModel.get("previousSelection");
            var contextParentLink = previousSelection && this.hasContextual(previousSelection.selectedAncestors) && contentItem.assetsFolderLink != null ? contentItem.assetsFolderLink : context.parentLink;

            return contextParentLink || this.roots[0];

        },

        onSearchTextChanged: function (searchText) {
            // summary:
            //      Updates the search results and clears selection and commands.
            // searchText:
            //      The text the user is searching for.
            // tags:
            //      protected

            this.set("isSearching", !!searchText);

            this._updateSearchListQuery(searchText);

            // If the user has clear the search text and an item has previously been selected in the list we need to update command model with that item
            if (!this.get("isSearching") && this.currentListItem) {
                var self = this;
                when(this.store.get(this.currentListItem.createVersionUnspecificReference().toString())).then(function (contentItem) {
                    self._updateCommands(contentItem, self.menuType.LIST);
                });
            } else {
                this._updateCommands(null, this.menuType.LIST);
            }
        },

        onSearch: function (metadata) {
            // summary:
            //      Handles changes as a result of a user search
            // metadata:
            //      Search result
            // tags:
            //      public

            when(this.store.get(metadata.id), lang.hitch(this, function (model) {
                var currentListItem = ContentReference.toContentReference(model.contentLink);
                this.set("editingListItem", currentListItem);
                this.set("currentListItem", currentListItem);
                this.set("currentTreeItem", ContentReference.toContentReference(model.parentLink));
                this._updateCommands(model, this.menuType.LIST);
            }));
        },

        onTreeItemSelected: function (model, isRoot) {
            // summary:
            //      Handles changes to the selection in the tree and updates the view model
            // tags:
            //      public

            var oldRef = this.get("currentTreeItem"),
                newRef = ContentReference.toContentReference(model.contentLink),
                menuType = isRoot ? this.menuType.ROOT : this.menuType.TREE;

            this._updateCommands(model, menuType);

            if (!ContentReference.compareIgnoreVersion(oldRef, newRef) && ContentReference.emptyContentReference !== newRef) {
                this.set("currentTreeItem", newRef);
            }
        },

        onListItemSelected: function (model) {
            // summary:
            //      Handles changes to the slection in the list and updates the viev model
            // tags:
            //      public

            var oldRef = this.get("currentListItem"),
                newRef = ContentReference.toContentReference(model.contentLink);

            this._updateCommands(model, this.menuType.LIST);

            if (!ContentReference.compareIgnoreVersion(oldRef, newRef)) {
                this.set("currentListItem", newRef);
            }
        },

        onListItemUpdated: function (updatedItems) {
            // summary:
            //      Refresh the editing media if it have a new version
            // updatedItems: [Array]
            //      Collection of the updated item
            // tags:
            //      public, extension
        },

        _isSupportedContent: function (/*Object*/content) {
            // summary:
            //      Indicates whether the given content is a type contained by this widget.
            // content:
            //      Object to validate
            // tags:
            //      private
            return !!(content && content.id) && this.containedTypes.some(function (type) {
                return TypeDescriptorManager.isBaseTypeIdentifier(content.dataType, type);
            });
        },

        _setupSelection: function () {
            // summary:
            //      Get target tree item and list item for selection
            // tags:
            //      protected

            when(this.getCurrentContext(), lang.hitch(this, function (ctx) {

                var rootId;

                if (!this._isContentContext(ctx) || !this._isSupportedContent(ctx)) {
                    // TODO: Fix this hack of always using the first item in roots
                    rootId = ContentReference.toContentReference(this.roots[0]).toString();
                    when(this.store.get(rootId), lang.hitch(this, function (model) {
                        this.onTreeItemSelected(model, true);
                    }));
                } else {
                    this.contentContextChanged(ctx, null);
                }
            }));
        },

        _setupTreeStoreModel: function () {
            // summary:
            //      Creates an configures the treeStoreModel.
            // tags:
            //      protected

            if (!this.treeStoreModelClass) {
                //Assign the default tree store model class if no custom one has been assigned.
                this.treeStoreModelClass = this.enableContextualContent ? ContextualContentForestStoreModel : ContentForestStoreModel;
            }

            var treeModel = new this.treeStoreModelClass({
                store: this.store,
                roots: this.roots,
                typeIdentifiers: this.mainNavigationTypes,
                containedTypes: this.containedTypes,
                notAllowToCopy: this.preventCopyingFor,
                notAllowToDelete: this.preventDeletionFor,
                notSupportContextualContents: this.preventContextualContentFor,
                autoSelectPastedItem: false,
                onAddDelegate: lang.hitch(this, function (node) {
                    var targetNode = registry.getEnclosingWidget(node.domNode),
                        target = targetNode && targetNode.item,
                        canExecute = (typeof (this.treeStoreModel.canEdit) === "function") && this.treeStoreModel.canEdit(target);

                    if (canExecute) {
                        node.edit();


                        // Publish the children change AFTER the user has change the name of the new folder or canceled the editor
                        // REMARK: We need to do this after the change otherwise the editing will be canceled because the children change replaced the child items in the tree
                        // TODO: This should be handled by the tree model
                        var publish = function () {
                            topic.publish("/epi/cms/contentdata/childrenchanged", target.parentLink);
                        };

                        var handle = node.on("rename", function () {
                            handle.remove();

                            publish();
                        });

                        var cancelHandle = node.on("cancelEdit", function () {
                            cancelHandle.remove();

                            publish();
                        });

                    }
                }),
                onRefreshRoots: lang.hitch(this, this._setupSearchRoots),
                additionalQueryOptions: {
                    sort: this._getSortSettings()
                }
            });

            this.set("treeStoreModel", treeModel);
        },

        _getSortSettings: function () {
            // summary:
            //      Returns the list of sort criteria.
            // tags:
            //      protected

            return [{ attribute: "name", descending: false }];
        },

        _setupSearchRoots: function () {
            // summary:
            //      Creates and configures the treeStoreModel.
            // tags:
            //      protected

            var roots = this.roots instanceof Array && this.roots.length > 0 ? lang.clone(this.roots) : [];
            when(this.getCurrentContent()).then(lang.hitch(this, function (content) {

                var assetsFolderLink = content && content.assetsFolderLink;
                if (assetsFolderLink && typeof this._getPseudoContextualContent === "function" && assetsFolderLink !== this._getPseudoContextualContent().toString()) {
                    roots.push(assetsFolderLink);
                }
            })).always(lang.hitch(this, function () {
                this.set("searchRoots", roots.join(","));
            }));
        },

        _setupCommands: function () {
            // summary:
            //      Creates and registers the commands used.
            // tags:
            //      protected

            var menuType = this.menuType;

            var settings = {
                category: "context",
                model: this.treeStoreModel,
                selection: this.selection,
                clipboard: this.clipboardManager
            };

            this.createHierarchyCommands = {};
            var index = 1;

            // Create commands for the navigation types.
            array.forEach(this.mainNavigationTypes, function (type) {
                this.createHierarchyCommands[type] = {
                    command: new NewFolderCommand(lang.mixin({ typeIdentifier: type }, settings)),
                    isAvailable: menuType.ROOT | menuType.TREE,
                    order: index
                };
                index = index + 1;
            }, this);

            this.createCommands = this.getCreateCommands(index);

            var commands = {
                rename: {
                    command: new RenameFolderCommand({ category: "context" }),
                    isAvailable: menuType.TREE,
                    order: 10
                },
                cut: {
                    command: new CutContentCommand(settings),
                    isAvailable: menuType.TREE | menuType.LIST,
                    order: 20
                },
                copy: {
                    command: new CopyContentCommand(settings),
                    isAvailable: menuType.TREE | menuType.LIST,
                    order: 30
                },
                paste: {
                    command: new PasteContentCommand(settings),
                    isAvailable: menuType.ROOT | menuType.TREE,
                    order: 40
                },
                edit: {
                    command: new ChangeContextCommand({
                        category: "context",
                        forceReload: true,
                        forceContextChange: true
                    }),
                    isAvailable: this.menuType.LIST,
                    order: 3
                },
                translate: {
                    command: new TranslateContentCommand(),
                    isAvailable: this.menuType.TREE | this.menuType.LIST
                },
                "delete": {
                    command: new DeleteContentCommand(settings),
                    isAvailable: menuType.TREE | menuType.LIST,
                    order: 50
                },
                trash: {
                    command: new ViewTrashCommand({ typeIdentifiers: this.mainNavigationTypes, order: 60 }),
                    order: 60
                },
                sort: function () {
                    var commands = [];
                    for (var key in this) {
                        if (key !== "toArray" && key !== "sort" && this.hasOwnProperty(key)) {
                            var index = this[key].order;
                            if (!index) {
                                index = 100;
                            }
                            commands.push([index, this[key].command]);
                        }
                    }

                    commands.sort(function (a, b) {
                        return a[0] - b[0];
                    });

                    return commands;
                },
                toArray: function () {
                    var sortedCommand = this.sort();
                    var commands = [];
                    array.forEach(sortedCommand, function (key) {
                        commands.push(key[1]);
                    });

                    return commands;
                }
            };

            this._commandRegistry = lang.mixin(this._commandRegistry, this.createHierarchyCommands, this.createCommands, commands);

            this.pseudoContextualCommands = this._getPseudoContextualCommands();
        },

        _updateListQuery: function (itemRef) {
            // summary:
            //      Creates a new query and updates the listQuery property.
            // tags:
            //      protected

            var id,
                query = null;

            // remove all mainNavigationTypes from containedTypes, to avoid of displaying Folder in Content List
            var contentTypes = array.filter(this.containedTypes, function (item) {
                return this.mainNavigationTypes.indexOf(item) < 0;
            }, this);

            if (itemRef) {
                id = itemRef.toString();
                query = this._createListChildrenQuery(id, this.showAllLanguages, contentTypes);
            }

            this.set("listQuery", query);
        },

        _updateSearchListQuery: function (searchText) {
            // summary:
            //      Creates a new query and updates the listQuery property.
            // tags:
            //      protected

            var query = null;

            if (searchText) {
                query = this._createListSearchQuery(searchText, this.showAllLanguages);
            }

            this.set("searchListQuery", query);
        },

        _createListSearchQuery: function (searchText, showAllLanguages) {
            return {
                queryText: searchText,
                query: "searchcontent",
                allLanguages: showAllLanguages,
                contentSearchAreas: this.get("searchArea"),
                searchRoots: this.get("searchRoots"),
                maxResults: 1000,
                filterDeleted: true
            };
        },

        _createListChildrenQuery: function (id, showAllLanguages, contentTypes) {
            return { referenceId: id, query: "getchildren", allLanguages: showAllLanguages, typeIdentifiers: contentTypes };
        },

        _updateSelection: function (model) {
            // summary:
            //      Updates the selection manager to the current model. Used when commands execute.
            // tags:
            //      protected

            this.selection.set("data", model ? [{ type: "epi.cms.contentdata", data: model }] : []);
        },

        _updateCommands: function (model, menuType) {
            // summary:
            //      Updates the current model for all commands needing this.
            // tags:
            //      protected

            this._updateSelection(model);

            if (typeof this.treeStoreModel.isSupportedType === "function" && model && this.treeStoreModel.isSupportedType(model.typeIdentifier)) {
                this._updateTreeContextCommandModels(model);
                this.decoratePseudoContextualCommands(this.pseudoContextualCommands);
            }

            this._commandRegistry.translate.command.set("model", model);
            this._commandRegistry.translate.command.set("executeDelegate", null);
            this._commandRegistry.edit.command.set("model", model);

            // Set custom availability last in case the command has
            // default logic for changing this in the model change handling
            this._updateCommandAvailability(menuType);
        },

        _updateTreeContextCommandModels: function (model) {
            // summary:
            //      Update model of commands in case selected content is a navigation node.
            // tags:
            //      private

            this._updateCreateCommandModels(model);

            this._commandRegistry.rename.command.set("model", model);
        },

        _updateCreateCommandModels: function (model) {
            // summary:
            //      Update model of create commands.
            // tags:
            //      protected

            var commands = this.createCommands;
            for (var key in commands) {
                commands[key].command.set("model", model);
            }
        },

        _getPseudoContextualCommands: function () {
            // summary:
            //      Get commands to decorates
            // returns: [Array]
            //      Array of command object that each is instance of "epi/shell/command/_Command" class
            // tags:
            //      private

            var key,
                commands = [];

            for (key in this.createCommands) {
                commands.push(this.createCommands[key].command);
            }

            for (key in this.createHierarchyCommands) {
                commands.push(this.createHierarchyCommands[key].command);
            }

            commands.push(this._commandRegistry.paste.command);

            return commands;
        },

        _updateCommandAvailability: function (menuType) {
            // summary:
            //      Updates the availability of the command dependant on which menu types it is registered for.
            // tags:
            //      protected

            var registry = this._commandRegistry,
                isAvailableFlags;

            for (var key in registry) {
                if (key !== "toArray" && registry.hasOwnProperty(key)) {
                    isAvailableFlags = registry[key].isAvailable;
                    if (isAvailableFlags) {
                        var command = registry[key].command;
                        this._updateAvailabilityForSpecificCommand(command, menuType, isAvailableFlags);
                    }
                }
            }
        },

        _updateAvailabilityForSpecificCommand: function (command, menuType, isAvailableFlags) {
            // we don't want to update availability of TranslateCommand because her model knows better when to be available
            if (!command.isInstanceOf(TranslateContentCommand)) {
                command.set("isAvailable", !!(isAvailableFlags & menuType));
            }
        },

        upload: function (fileList) {
            // summary:
            //      Implementation needs to overwrite this to process upload files action.
            // fileList:
            //      List files to upload.
            //      When null, only show upload form to select files for uploading.
            //      Otherwise, upload files in list.
            // tags:
            //      protected
        }

    });

});
