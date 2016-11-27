define("epi-cms/widget/ContentTreeStoreModel", [
// dojo
    "dojo/_base/array",
    "dojo/_base/connect",
    "dojo/_base/declare",
    "dojo/_base/lang",

    "dojo/aspect",
    "dojo/Deferred",
    "dojo/promise/all",
    "dojo/when",
    "dojo/topic",
// epi
    "epi",
    "epi/dependency",
    "epi/shell/_StatefulGetterSetterMixin",
    "epi/shell/TypeDescriptorManager",
    "epi/shell/_ContextMixin",
    "epi/shell/ViewSettings",
// EPi CMS
    "epi-cms/ApplicationSettings",
    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/core/ContentReference",
    "epi-cms/widget/_HierarchicalModelMixin",
    "epi-cms/widget/viewmodel/_UpdateableStoreModelMixin"
],

function (
// dojo
    array,
    connect,
    declare,
    lang,

    aspect,
    Deferred,
    promiseAll,
    when,
    topic,
// epi
    epi,
    dependency,
    _StatefulGetterSetterMixin,
    TypeDescriptorManager,
    _ContextMixin,
    ViewSettings,
// EPi CMS
    ApplicationSettings,
    ContentActionSupport,
    ContentReference,
    _HierarchicalModelMixin,
    _UpdateableStoreModelMixin
) {

    return declare([_StatefulGetterSetterMixin, _HierarchicalModelMixin, _UpdateableStoreModelMixin, _ContextMixin], {
        // summary:
        //      A store model for tree widgets that only support content with a single root.
        //
        // tags:
        //      internal xproduct

        // store: [protected] dojo/store/api/Store
        //		Underlying store that will be queried for page tree items.
        store: null,

        // root: [public] ContentReference|String
        //		Id of the root content
        root: null,

        // notAllowToDelete: [public] List of item that we don't allow to delete. For example: Waste basket, start, root folder,...
        //		Id of the root content
        notAllowToDelete: null,

        // notAllowToCopy: [public] List of item that we don't allow to copy. For example: Waste basket, root folder,...
        //		Id of the root content
        notAllowToCopy: null,

        // typeIdentifiers: [protected] Array | String
        //		The set of type identifiers to be taken into account. Can either be an array or a comma separated string.
        typeIdentifiers: null,

        showAllLanguages: true,

        getChildrenQuery: "getchildren",

        getRootChildrenQuery: null,

        // _observers: [protected] Array
        //		Collection to store all the listeners from observed queries.
        _observers: null,

        // _defaultDataStoreName: [protected] String
        //		Default data store name to get from registry, if store is null.
        _defaultDataStoreName: "epi.cms.content.light",

        // additionalQueryOptions: [protected] Object
        //		Additional query options added when getting children. Set by inherited model.
        additionalQueryOptions: {},

        // createAsLocalAsset: [public] Boolean
        //      Indicate if the content should be created as local asset of its parent.
        createAsLocalAsset: false,

        // autoSelectPastedItem: Boolean
        //      Set to true if the pasted item automatically should be selected
        autoSelectPastedItem: true,

        constructor: function (args) {
            // summary:
            //		Construct the ContentTreeStoreModel object.

            declare.safeMixin(this, args);

            this._observers = {};
            this.store = this.store || dependency.resolve("epi.storeregistry").get(this._defaultDataStoreName);

            this._queryOptions = lang.mixin({
                ignore: ["query"],
                comparers: {
                    typeIdentifiers: lang.hitch(this, function (queryValue, instance) {
                        return array.some(queryValue, lang.hitch(this, function (item) {
                            return item === instance.typeIdentifier || TypeDescriptorManager.isBaseTypeIdentifier(instance.typeIdentifier, item);
                        }));
                    }),
                    referenceId: function (queryValue, instance) {
                        return ContentReference.compareIgnoreVersion(queryValue, instance.parentLink);
                    },
                    allLanguages: function (queryValue, instance) {
                        if (queryValue || !instance.currentLanguageBranch) {
                            return true;
                        }

                        return epi.areEqual(ApplicationSettings.currentContentLanguage, instance.currentLanguageBranch.languageId);
                    }
                },
                sort: this._getSortSettings(this.typeIdentifiers)
            }, this.additionalQueryOptions);

            var updateHandle = connect.subscribe("/epi/cms/contentdata/updated", this, function (updatedContent) {
                this.store.refresh(updatedContent.contentLink).then(lang.hitch(this, function () {
                    if (updatedContent.recursive) {
                        this.onItemChildrenReload(updatedContent);
                    }
                }));
            });

            //publish command has been executed: update children
            var childrenChangeHandle = connect.subscribe("/epi/cms/contentdata/childrenchanged", lang.hitch(this, this._childrenChanged));

            // To avoid tree not update when restored content to destination where haven't children before.
            var contentRestoreHandle = connect.subscribe("/epi/cms/contentdata/restored", this, function (restoredContent) {
                this._childrenChanged(restoredContent);
            });

            //when the store is refreshed, update the item
            var itemChangeHandle = aspect.after(this.store, "onItemChanged", lang.hitch(this, function (id, item) {
                this.onChange(item);
            }), true);

            this._handles = [updateHandle, childrenChangeHandle, contentRestoreHandle, itemChangeHandle];
        },

        destroy: function () {
            // summary:
            //		Destroy the object.

            for (var id in this._observers) {
                this._observers[id].cancel();

                this._observers[id] = null;
            }
            if (this._handles) {
                array.forEach(this._handles, function (handle) {
                    handle.remove();
                });

                this._handles = null;
            }
        },

        isSupportedType: function (dataType) {
            // summary:
            //      Check the supported type of data type selected.
            // dataType: [String]
            //      The type of data selected
            // tags:
            //      public

            return array.some(this.typeIdentifiers, function (type) {
                return type === dataType || TypeDescriptorManager.isBaseTypeIdentifier(dataType, type);
            });
        },

        _setShowAllLanguagesAttr: function (value) {
            this._set("showAllLanguages", value);
            this.onItemChildrenReload(this.root);
        },

        // =======================================================================
        // Methods for traversing hierarchy

        getRoot: function (onItem, onError) {
            // summary:
            //		Calls onItem with the root item for the tree, possibly a fabricated item.

            if (lang.isArray(this.root)) {
                onItem({});
            } else {
                when(this.store.get(this.root), onItem, onError);
            }
        },

        mayHaveChildren: function (item) {
            // summary:
            //		Tells if an item has or may have children.  Implementing logic here
            //		avoids showing +/- expando icon for nodes that we know don't have children.
            //		(For efficiency reasons we may not want to check if an element actually
            //		has children until user clicks the expando node)

            return item.hasChildren;
        },

        getChildren: function (parentItem, onComplete) {
            // summary:
            //		Calls onComplete() with array of child items of given parent item, all loaded.

            var id = this.getIdentity(parentItem),
                isRoot = id === this.root,
                queryType = isRoot && this.getRootChildrenQuery ? this.getRootChildrenQuery : this.getChildrenQuery,
                query = this._createQuery({ referenceId: id, query: queryType }),
                results = this.store.query(query, this._queryOptions),

                listener = lang.hitch(this, function (item) {
                    this.onChange(item);

                    when(this.store.query(query, this._queryOptions), lang.hitch(this, function (children) {
                        this.onChildrenChange(parentItem, children);
                    }));
                });

            var observer = this._observers[id];
            if (observer) {
                observer.cancel();
                delete this._observers[id];
            }

            // Observe the query result to update the parent node when have changes.
            this._observers[id] = results.observe(listener, true);

            when(results, onComplete);
        },

        _getSortSettings: function (/*String || Array*/typeIdentifiers) {
            // summary:
            //      Get sort settings by typeIdentifiers.
            // tags:
            //      protected virtual

            if (!typeIdentifiers) {
                return {};
            }

            if (typeIdentifiers instanceof String) {
                typeIdentifiers = [typeIdentifiers];
            }

            var self = this,
                sortColumn,
                sortSettings = [];

            typeIdentifiers.map(function (type) {
                sortColumn = TypeDescriptorManager.getValue(type, "sortKey");
                if (sortColumn) {
                    sortSettings.push(sortColumn.sortDescending ?
                            { attribute: sortColumn.columnName, descending: true } :
                            { attribute: sortColumn.columnName });
                }
            });

            return sortSettings;
        },

        _createQuery: function (queryBase, excludeType) {
            var typeIdentifiers = this.typeIdentifiers &&
                    (lang.isArray(this.typeIdentifiers) ? this.typeIdentifiers : this.typeIdentifiers.split(","));

            var language = this.showAllLanguages ? { allLanguages: true } : {},
                requestType = excludeType ? {} : { typeIdentifiers: typeIdentifiers };

            var query = lang.mixin(queryBase, requestType, language);

            return query;
        },

        _createChildrenQuery: function (queryBase, excludeType) {
            var childrenQuery = lang.mixin(queryBase, { query: "getchildren" });
            return this._createQuery(childrenQuery, excludeType);
        },

        move: function (source, target) {
            // summary:
            //      Move source item to target

            if (!target.contentLink) {
                target = this.store.get(target);
            }

            var deferreds = array.map(source, function (item) {

                return when(this.store.get(item.data.parentLink), lang.hitch(this, function (oldParent) {
                    return this.pasteItem(item.data, oldParent, target, false);
                }));
            }, this);

            return promiseAll(deferreds).then(lang.hitch(this, function (results) {
                if (target.contentLink === ApplicationSettings.wastebasketPage) {
                    // Filter the source array based on the results so that onDeleted is only called
                    // for items which were actually deleted.
                    var items = source.filter(function (i, index) {
                        return !!results[index];
                    });
                    if (items.length) {
                        this.onDeleted(items);
                    }
                }
            }));
        },

        remove: function (items) {
            // summary
            //      Removes (deletes) the source

            var deferreds = items.map(function (item) {
                return this.store.remove(item.data.contentLink);
            }, this);

            return promiseAll(deferreds).then(lang.hitch(this, function () {
                this.onDeleted(items);
            }));
        },

        copy: function (source, target) {
            // summary:
            //      Copy source to target
            var deferreds = array.map(source, function (item) {

                return when(this.store.get(item.data.parentLink), lang.hitch(this, function (oldParent) {
                    return this.pasteItem(item.data, oldParent, target, true);
                }));
            }, this);

            return promiseAll(deferreds);
        },

        pasteItem: function (childItem, oldParentItem, newParentItem, copy, sortIndex) {
            // summary:
            //		Move or copy an item from one parent item to another.
            // childItem: Item
            //      A reference to the item that should be moved or copied
            // oldParentItem: Item
            //      The curent parent item
            // newParentItem: Item
            //      The target item for the operation
            // copy: Boolean
            //      If true the childItem will be copied; otherwise it will be moved.
            // sortIndex: integer
            //      Optional sortIndex in the child collection of the new parent
            // returns: object
            //      An object indicating the result of the operation
            //
            // tags: public
            //

            // Having copy/paste/delete call pasteItem may seem a bit backwards, but since the drag & drop
            // is calling pasteItem() with all required arguments it becomes a bit messy to drop some arguments
            // here (i.e. old/new parent) and then do the lookup again.
            // Those methods also have to duplicate the notification logic

            var id = this.getIdentity(childItem),
                isDeleted = newParentItem && newParentItem.isWastebasket,
                method = copy ? this.store.copy : this.store.move,
                params = {
                    targetId: this.getIdentity(newParentItem),
                    createAsLocalAsset: this.createAsLocalAsset,
                    sortIndex: sortIndex
                };

            // Call move or copy on the store with arguments
            return method.call(this.store, id, params).then(lang.hitch(this, function (response) {
                // NOTE: The order of these reload notifications are important for the tree to properly re-select the current item.

                // if newParentItem is a wastebasket, which means that we are moving a content into a wastebasket,
                // let's trigger the onDelete event, so the Tree (or the widget that uses this model) will delete the node from _itemNodesMap,
                // to avoid caching problem when restoring content.
                if (isDeleted) {
                    this.onDelete(childItem, true/*deleteChildren*/);
                } else {
                    // Publish a children changed event for the new parent to ensure that the new parent node is updated if it exists in other tree structures.
                    // For example: Blocks tree and Media tree when copy/move items.
                    topic.publish("/epi/cms/contentdata/childrenchanged", newParentItem.contentLink);
                }

                var itemId = copy ? response.extraInformation : childItem.contentLink;

                var contentLink = ContentReference.toContentReference(itemId).createVersionUnspecificReference().toString();

                // Update child item due to in some case the content of it may change after moving(e.g. parent field)
                return when(this.store.refresh(contentLink), lang.hitch(this, function (item) {
                    this._onPasteComplete(item, copy, isDeleted, oldParentItem, newParentItem);
                    return response;
                }));
            }));
        },

        onPasteComplete: function () {
            // summary:
            //      Stub to do somethings when paste process complete
            // tags:
            //      public, callback
        },

        _onPasteComplete: function (item, copy, isDeleted, oldParentItem, newParentItem) {
            // summary:
            //		Executed after a paste operation has completed
            // item: Item
            //      The target item of the operation
            // copy: boolean
            //      If it was a copy operation or not
            // isDeleted: boolean
            //      If the operation resulted in the item being deleted, i.e. moved to the trash
            // oldParentItem: Item
            //      The curent parent item
            // newParentItem: Item
            //      The target item for the operation
            // tags: protected

            this.onPasteComplete();

            this._selectItemOnPasteComplete(item, copy, isDeleted, oldParentItem, newParentItem);

            this.inherited(arguments);
        },

        _selectItemOnPasteComplete: function (item, copy, isDeleted, oldParentItem, newParentItem) {
            // summary:
            //		Select an item after a paste operation has completed
            // item: Item
            //      The target item of the operation
            // copy: boolean
            //      If it was a copy operation or not
            // isDeleted: boolean
            //      If the operation resulted in the item being deleted, i.e. moved to the trash
            // oldParentItem: Item
            //      The curent parent item
            // newParentItem: Item
            //      The target item for the operation
            // tags: protected

            if (this.autoSelectPastedItem && item && item.contentLink && !isDeleted) {
                this.onSelect(item.contentLink, true);
            }
        },

        newItem: function (args, newParentItem) {
            // summary:
            //		Called when an item that's accepted in the tree is added by an external source, for instance by dragging an item from a listing to the tree.
            if (args.dndData && args.dndData.data) {
                var oldParentItem = this.getParentItem(args.dndData);
                this._pasteNewItem(args.dndData.data, oldParentItem, newParentItem);
            }
        },

        getParentItem: function (dndData) {
            if (dndData && dndData.data) {
                var parentLink = dndData.data["parentLink"];
                if (parentLink) {
                    parentLink = new ContentReference(parentLink).createVersionUnspecificReference().toString();
                }
                return { contentLink: parentLink };
            }
        },

        _pasteNewItem: function (childItem, oldParentItem, newParentItem) {
            //Right now we only support move actions when moving items from an external source to the tree. Might be changed in the future.
            this.pasteItem(childItem, oldParentItem, newParentItem, false/*copy*/);
        },

        _updateItemChanged: function (parentContentLink) {
            // update the parent cause of in some case its properties changed
            when(this.store.refresh(parentContentLink), lang.hitch(this, function (updatedItem) {
                // then update its children
                this._childrenChanged(updatedItem);
            }));
        },

        _childrenChanged: function (parent) {
            var dfd = new Deferred();

            this.getChildren(parent, lang.hitch(this, function (children) {
                this.onChildrenChange(parent, children);
                dfd.resolve(children);
            }));

            return dfd;
        },

        _isNodeAContextAncestor: function (nodeContentLink, context) {
            var dfd = new Deferred();

            this.getAncestors(context, function (arr) {

                var stack = arr.map(function (e) {
                    return e.contentLink;
                });
                var result = stack.indexOf(nodeContentLink) !== -1 || ContentReference.compareIgnoreVersion(nodeContentLink, context.id);

                dfd.resolve(result);
            });

            return dfd;
        },
        // =======================================================================
        // Inspecting items

        getIdentity: function (item) {
            // summary:
            //		Returns identity for an item

            if (lang.isObject(item)) {
                return this.store.getIdentity(item);
            }
            return item;
        },

        getObjectIconClass: function (/*Object*/item, /*String*/fallbackIconClass) {
            // summary:
            //      Get icon class for content based on its content link
            // item: [Object]
            //      Content item data
            // fallbackIconClass: [String]
            //      Default icon class in case nothing returned
            // tags:
            //      public, extension

            var defaultIconClass = TypeDescriptorManager.getValue(item.typeIdentifier, "iconClass");
            if (!defaultIconClass) {
                return fallbackIconClass;
            }

            var suffix = "";
            switch (parseInt(item.contentLink, 10)) {
                case ApplicationSettings.globalAssetsFolder:
                    suffix = "AllSites";
                    break;

                case ApplicationSettings.siteAssetsFolder:
                    suffix = "ThisSite";
                    break;

                default:
                    break;
            }

            return (suffix === "" && defaultIconClass === fallbackIconClass) ? defaultIconClass : (fallbackIconClass + " " + defaultIconClass + suffix);
        },

        getLabel: function (item) {
            // summary:
            //		Get the label for an item

            return item.name;
        },

        canExpandTo: function (item) {
            // summary:
            //		Test if the tree can expand to an item
            // item: Object
            //      The item
            // returns:
            //       A promise which resolves to true if the item can be reached, otherwise false.

            var deferred = new Deferred();

            this.getAncestors(item, lang.hitch(this, function (ancestors) {
                deferred.resolve(this.getIdentity(ancestors[0]) === this.root.id);
            }));

            return deferred.promise;
        },

        canCopy: function (item) {
            // summary:
            //		Determine whether the given item is able to be copied by the current user.
            // remarks:
            //      Override to implement additional check.
            // tags:
            //		public

            if (!item) {
                return false;
            }

            var reference = item.contentLink,
                isSystemPage = reference === this.root || (array.indexOf(this.notAllowToCopy, reference) >= 0);

            return !isSystemPage &&
                ContentActionSupport.hasAccess(item.accessMask, ContentActionSupport.accessLevel.Read) &&
                ContentActionSupport.hasProviderCapability(item.providerCapabilityMask, ContentActionSupport.providerCapabilities.Copy);
        },

        canCut: function (item) {
            // summary:
            //		Determine whether the given item is able to be cut by the current user.
            // tags:
            //		public

            if (!item) {
                return false;
            }

            var reference = item.contentLink,
                isSystemPage = reference === this.root || (array.indexOf(this.notAllowToDelete, reference) >= 0);

            return !isSystemPage &&
                ContentActionSupport.isActionAvailable(item, ContentActionSupport.action.Delete, ContentActionSupport.providerCapabilities.Move, true);
        },

        canDelete: function (item) {
            // summary:
            //		Determine whether the given item is able to be deleted by the current user.
            // tags:
            //		public

            if (!item) {
                return false;
            }

            var reference = item.contentLink,
                isSystemPage = reference === this.root || (array.indexOf(this.notAllowToDelete, reference) >= 0);

            return !isSystemPage &&
                ContentActionSupport.isActionAvailable(item, ContentActionSupport.action.Delete, ContentActionSupport.providerCapabilities.Delete, true);
        },

        canPaste: function (item, target, isCopy) {
            // summary:
            //      Determines whether the given item can be moved or copied from its current parent to a new location
            //      Primarily used when validating drag & drop operations.
            // tags:
            //      public

            if (!item || !target) {
                return false;
            }

            var isCopyToWastebasket = isCopy && target.isWastebasket,
                isCutToTheSameItem = !isCopy && (this.getIdentity(item) === this.getIdentity(target)),
                isCutToTheSameParent = !isCopy && (item.parentLink === this.getIdentity(target)),
                hasAccess = ContentActionSupport.isActionAvailable(target, ContentActionSupport.action.Create, ContentActionSupport.providerCapabilities.Create, true);

            return !target.isDeleted && !isCopyToWastebasket && !isCutToTheSameItem && !isCutToTheSameParent && hasAccess;
        },

        canEdit: function (item) {
            // summary:
            //		Determine whether the given item is able to be edit by the current user.
            // tags:
            //		public

            if (!item) {
                return false;
            }

            var reference = item.contentLink,
                isSystemPage = reference === this.root;

            return !isSystemPage && ContentActionSupport.hasAccess(item.accessMask, ContentActionSupport.accessLevel.Edit);
        },

        // =======================================================================
        // Callbacks

        onItemChildrenReload: function (/*Object*/parent) {
            // summary:
            //  Raised when the children of an item must be reloaded.
            //  The subscriber needs to call getChildren to get the updated children collection
        },

        onChange: function (/*dojo/data/Item*/ /*===== item =====*/) {
            // summary:
            //		Callback whenever an item has changed, so that Tree
            //		can update the label, icon, etc.   Note that changes
            //		to an item's children or parent(s) will trigger an
            //		onChildrenChange() so you can ignore those changes here.
            // tags:
            //		callback
        },

        onChildrenChange: function (/*===== parent, newChildrenList =====*/) {
            // summary:
            //		Callback to do notifications about new, updated, or deleted items.
            // parent: dojo/data/Item
            // newChildrenList: dojo/data/Item[]
            // tags:
            //		callback
        },

        onDelete: function (/*dojo/data/Item*/ /*===== item =====*/) {
            // summary:
            //		Callback when an item has been deleted.
            // description:
            //		Note that there will also be an onChildrenChange() callback for the parent
            //		of this item.
            // tags:
            //		callback
        },

        onDeleted: function (deletedItems) {
            // summary:
            //      Callback when an item has been deleted to set the parent folder as selected
            // item:
            //      item deleted
            // tags:
            //      public callback
            var item = deletedItems[0].data;

            if (item) {
                when(this.getCurrentContext(), lang.hitch(this, function (ctx) {
                    var isPage = item.capabilities.isPage;
                    when(this._isNodeAContextAncestor(item.contentLink, ctx), lang.hitch(this, function (isNodeAContextAncestor) {
                        if (isPage && !isNodeAContextAncestor) {
                            // Keep current editing page
                            return;
                        }

                        if (!isPage && isNodeAContextAncestor) {
                            //Delete an asset (block/folder/media,..) that are currently editing the default context for the view should be selected
                            topic.publish("/epi/shell/context/request", { uri: ViewSettings.settings.defaultContext });
                            return;
                        }

                        // Select parent node
                        this.onSelect(item.parentLink, true);
                    }));
                }));
            }
        },

        onSelect: function (item, setFocus, onComplete) {
            // summary:
            //      Raise event to set an item as selected
            // tags:
            //      callback
        }
    });
});
