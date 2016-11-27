define("epi-cms/widget/viewmodel/_UpdateableStoreModelMixin", [
// dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",

    "dojo/Deferred",
    "dojo/Evented",
    "dojo/json",
    "dojo/topic",
    "dojo/when",
// epi
    "epi/dependency",

    "epi-cms/ApplicationSettings",
    "epi-cms/_ContentContextMixin",
    "epi-cms/core/ContentReference"
],

function (
// dojo
    array,
    declare,
    lang,

    Deferred,
    Evented,
    json,
    topic,
    when,
// epi
    dependency,

    ApplicationSettings,
    _ContentContextMixin,
    ContentReference
) {

    return declare(Evented, {
        // tags:
        //      internal mixin

        // updateableStore: [private] dojo/store
        //      Underlying store that will be post data to server for items.
        updateableStore: null,

        // updateableStoreKey: [public] string
        //      Dependency key to resolve the updateableStore
        updateableStoreKey: "epi.cms.contentdata",

        // currentContentService: [public] Object
        //      Instance of _ContentContextMixin because we can not mixin _ContentContextMixin directly.
        currentContentService: null,

        // propertyNames: [public] Object
        //      Maps between client side property names and their server side counterparts
        propertyNames: {
            name: "icontent_name",
            nameInUrl: "iroutable_routesegment"
        },

        // refreshTranslatedAncestors: [public] boolean
        //      If true ancestors of the changed node will be refreshed
        refreshTranslatedAncestors: true,

        // onAddDelegate: [public] function
        //      Will be executed after add
        onAddDelegate: null,

        postscript: function () {
            this._setupStore();
            this.currentContentService = new _ContentContextMixin();
        },

        _setupStore: function () {
            if (!this.updateableStore && this.updateableStoreKey) {
                this.updateableStore = dependency.resolve("epi.storeregistry").get(this.updateableStoreKey);
            }
        },

        rename: function (id, name) {
            // summary:
            //      Renames an item
            // tags:
            //      public

            var self = this,
                deferred = new Deferred();

            when(self.patch(id, { name: name, nameInUrl: null }), function (item) {
                when(self.refreshTranslated(id), function () {
                    deferred.resolve(item);
                }, function (e) {
                    deferred.reject(e);
                });
            }, function (e) {
                deferred.reject(e);
            });

            return deferred;
        },

        translate: function (item) {
            // summary:
            //      Creates a version translated into the current language
            // item: Item
            //      Item to translate
            // tags:
            //      public

            var self = this,
                id = self.getIdentity(item),
                model = {
                    masterLanguageVersionId: id,
                    name: item.name,
                    contentTypeId: item.contentTypeID
                };

            return when(self.updateableStore.put(model), function () {
                when(self.store.refresh(id), function () {
                    when(self.refreshTranslated(id), function () {
                        // Select and start edit UI of the translated node
                        self.onSelect(id, true, self.onAddDelegate);
                    });
                });
            });
        },

        add: function (/*Object*/item, /*Function?*/onComplete) {
            // summary:
            //      Add new item
            // item: [Object]
            //      New item data
            // onComplete: [Function?]
            //      Callback function to do something when new content created
            // tags:
            //      Public

            var self = this;

            var def = new Deferred();

            when(self.updateableStore.add(item), function (response) {
                var id = self.getContentId(response),
                    parentId = self.getParentIdentity(item),
                    refreshDeferred = null;

                when(self.updateableStore.get(id), function (/*dojo/data/Item*/addedItem) {
                    if (self.getParentIdentity(addedItem) !== parentId) {
                        refreshDeferred = typeof onComplete == "function" && onComplete();
                    }

                    when(refreshDeferred, function () {
                        when(self._childrenChanged(parentId), function () {
                            when(self.refreshTranslated(id), function () {
                                self.onSelect(id, true, self.onAddDelegate);
                                def.resolve(addedItem);
                            });
                        });
                    });
                });
            });

            return def.promise;
        },

        patch: function (id, properties) {
            // summary:
            //      Patches the item with the submitted id and updates cache on success
            // id:
            //      Identity of the item to patch
            // properties:
            //      Properties to patch for the item
            // tags:
            //      public

            var self = this,
                deferred = new Deferred(),
                patchData = { id: id, properties: {} };

            //Fix the properties and change the names if needed
            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    patchData.properties[this._convertPropertyName(key)] = json.stringify(properties[key]);
                }
            }

            when(self.updateableStore.patch(patchData, { id: patchData.id }), function (item) {
                if (item && item.successful) {
                    var cacheData = {
                        contentLink: id,
                        properties: patchData.properties,
                        capabilities: { supportsVersions: false } // TODO: This is temporary until we have implemented dependant store capabilities checks
                    };
                    lang.mixin(cacheData, properties);

                    when(self.updateableStore.patchCache(cacheData), deferred.resolve, deferred.reject);
                } else {
                    return deferred.reject(item && item.validationErrors);
                }
            });

            return deferred;
        },

        _convertPropertyName: function (name) {
            return this.propertyNames[name] || name;
        },

        refreshTranslated: function (/*String*/contentId) {
            // summary:
            //      Refresh translated ancestor contents
            // tags:
            //      public

            var self = this,
                deferred = new Deferred(),
                failed;

            // Used to filter which ancestors to refresh
            function filter(item) {
                var id = self.getIdentity(item),
                    parentId = self.getParentIdentity(item);

                if (parentId === self.root || // is subroot
                    id === self.root || // is root
                    !item.missingLanguageBranch) { // already translated
                    return false;
                }

                return true;
            }

            if (!self.refreshTranslatedAncestors) {
                return deferred.resolve();
            }

            // Then refresh the ancestors
            when(self.refreshAncestors(contentId, filter), function (refreshedItems) {
                if (!(refreshedItems instanceof Array) || refreshedItems.length === 0) {
                    deferred.resolve();
                    return;
                }

                // Reverse array in order to get nearest ancestor
                refreshedItems.reverse();

                var hadAnyUntranslatedAncestor = array.some(refreshedItems, function (item) {
                    if (!!item.missingLanguageBranch) {
                        failed = self.getLabel(item);
                        return true;
                    }

                    return false;
                });

                // Check if any ancestors were not translated, in that case show notification of this
                when(self.store.get(contentId), function (contentItem) {
                    if (hadAnyUntranslatedAncestor && contentItem && !contentItem.missingLanguageBranch) {
                        self.emit("translationFailed", failed);
                    }

                    deferred.resolve();
                });
            });

            return deferred;
        },

        getContentId: function (/*String*/contentLink) {
            // summary:
            //      Get content link without its work version
            // tags:
            //      private

            return ContentReference.toContentReference(contentLink).id.toString();
        },

        _onPasteComplete: function (item, copy, isDeleted, oldParentItem, newParentItem) {
            // summary:
            //      Executed after a paste operation has completed
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

            if (!item) {
                return;
            }

            if (!isDeleted) {
                this.refreshTranslated(this.getIdentity(item));
            } else {
                this.currentContentService.getCurrentContent().then(lang.hitch(this, function (currentContent) {
                    var isSameAsCurrentContent = ContentReference.compareIgnoreVersion(item, currentContent) && currentContent.isDeleted;
                    // Do nothing if it's not belong to our repository.
                    if (!isSameAsCurrentContent) {
                        return;
                    }

                    var query = this._createQuery({ referenceId: this.getIdentity(oldParentItem), query: this.getChildrenQuery }, true);
                    when(this.store.query(query, this._queryOptions), lang.hitch(this, function (children) {
                        var newContextId = oldParentItem ? oldParentItem.contentLink : null;
                        // Show start page if our parent is poor.
                        if (!children || !(children instanceof Array) || children.length <= 0) {
                            newContextId = ApplicationSettings.startPage;
                        }
                        if (newContextId) {
                            var contextParameters = { uri: "epi.cms.contentdata:///" + newContextId };
                            topic.publish("/epi/shell/context/request", contextParameters);
                        }
                    }));
                })).otherwise(function () {});
            }
        }

    });

});
