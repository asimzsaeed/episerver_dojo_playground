define("epi-cms/widget/viewmodel/TrashViewModel", [
// Dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/Deferred",
    "dojo/_base/lang",
    "dojo/topic",
    "dojo/Stateful",
    "dojo/_base/json",

// EPi Framework
    "epi/epi",
    "epi/shell/_StatefulGetterSetterMixin",
    "epi/shell/TypeDescriptorManager",
    "epi/dependency",

// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.components.trash"
],

function (
// Dojo
    array,
    declare,
    Deferred,
    lang,
    topic,
    Stateful,
    json,

// EPi Framework
    epi,
    _StatefulGetterSetterMixin,
    TypeDescriptorManager,
    dependency,

// Resources
    resources
    ) {
    return declare([Stateful, _StatefulGetterSetterMixin], {
        // summary:
        //      The view model for trash component widget
        //
        // tags:
        //      internal

        resources: resources,

        // trashes: [List]
        //      List of trash, including system and content provider's trash.
        trashes: null,

        // currentTrash: [Object]
        //      Current active trash to get content from.
        currentTrash: null,

        // queryOptions: [Object]
        //      Query options object, which contains query object and options object, to get content for a specific trash.
        queryOptions: null,

        // isEmptyTrash: [Boolean]
        //      State of Empty Trash action.
        isEmptyTrash: false,

        // storeRegistry: [Object]
        //      The store registry.
        storeRegistry: null,

        // contentStore: [Object]
        //      Represents the REST store to get data.
        contentStore: null,

        // contentStore: [Object]
        //      Represents the REST store to get trashes.
        trashStore: null,

        // showAllLanguages: [bool]
        //      Flag to indicate whether should we get all language for content in trash.
        showAllLanguages: true,

        // _contentRepositoryDescriptors: [Object]
        //      Contains settings for different content repositories, like root and contained types.
        _contentRepositoryDescriptors: null,

        postscript: function () {
            this.inherited(arguments);

            this.storeRegistry = dependency.resolve("epi.storeregistry");

            this.contentStore = this.contentStore || this._getStore();
            this.trashStore = this.trashStore || this.storeRegistry.get("epi.cms.wastebasket");

            this._contentRepositoryDescriptors = dependency.resolve("epi.cms.contentRepositoryDescriptors");

            if (!this.trashes) {
                this._createTrashes();
            }
        },

        destroy: function () {
            epi.removeDelegateAspects(this.contentStore);
        },

        _getStore: function () {
            var store = this.storeRegistry.get("epi.cms.content.light"),
                model = this;
            var hierarchicalStore = epi.delegate(store, {
                // the Tree plugin for dGrid needs these 2 functions to be available in store:
                getChildren: function (parent, options) {
                    var currentTrash = model.get("currentTrash"),
                        queryOptions = model._createQueryOptions(currentTrash);

                    lang.mixin(queryOptions.query, { referenceId: parent.contentLink });
                    return this.query(queryOptions.query, queryOptions.options);
                },

                mayHaveChildren: function (parent) {
                    return parent.hasChildren;
                }
            }, ["notify"]);

            return hierarchicalStore;
        },

        _createTrashes: function () {
            Deferred.when(this.trashStore.query(), lang.hitch(this, function (trashes) {
                this.set("trashes", lang.clone(trashes));
            }));
        },

        _setCurrentTrashAttr: function (trash) {
            // summary:
            //      Sets current trash
            // tags:
            //      private
            this._set("currentTrash", trash);

            if (trash.isRequireLoad) {
                this.updateTrash(trash);
                trash.isRequireLoad = false;
            }
        },

        getEmptyTrashConfirmMessage: function (trashName) {
            // summary:
            //      Get the empty trash confirm message
            // trashName: String
            //      The name of the trash to append to the confirm message if there are more than one provider
            // tags:
            //      public
            var confirmMessage = resources.emptytrash.singleproviderdescription;

            if (this.trashes.length > 1) {
                confirmMessage = resources.emptytrash.description.replace("{0}", trashName);
            }

            return confirmMessage;
        },

        updateTrash: function (trash) {
            // summary:
            //      Process active trash only, otherwise return empty list.
            // tags:
            //      public

            if (trash && trash.active) {
                this.set("queryOptions", this._createQueryOptions(trash)); // ask widget to update UI, by using this query
            } else {
                this.set("queryOptions", null);
            }
        },

        _createQueryOptions: function (trash) {
            // summary:
            //      Creates a query options object from input trash.
            // tags:
            //      private

            var query = { referenceId: trash.wasteBasketLink, query: "getchildren" };
            var options = { ignore: ["query"], comparers: this._createComparers() };

            if (this.showAllLanguages) {
                lang.mixin(query, { allLanguages: this.showAllLanguages });
                options.ignore.push("allLanguages");
            }

            if (trash.deletedBy) {
                lang.mixin(query, { deletedBy: trash.deletedBy });
            }

            if (trash.isSearchable) {
                lang.mixin(query, { isSearchable: trash.isSearchable });
                options.ignore.push("isSearchable");
            }

            if (trash.queryText) {
                lang.mixin(query, { query: "searchdeletedcontent" });
                lang.mixin(query, { matchProvider: true });
                lang.mixin(query, { queryText: trash.queryText });
            }

            return { query: query, options: options };
        },

        _createComparers: function () {
            // summary:
            //      Creates a comparer which check type identifier, to be used in CustomQueryEngine to filter content by type identifier.
            // tags:
            //      private

            return {
                referenceId: function (required, object) {
                    return required === object.parentLink;
                }
            };
        },

        emptyTrash: function (trashId) {
            // summary:
            //		Delete all items from a specific trash.
            // tags:
            //		public

            if (trashId) {
                Deferred.when(this.trashStore.executeMethod("Empty", trashId), lang.hitch(this, function (response) {
                    // Get all trashes that have specific trash id.
                    var trashes = array.filter(this.get("trashes"), function (trash) {
                        return trash && trash.wasteBasketLink === trashId;
                    });
                    // loop through all affected trashes, turn the isRequireLoad flag to true
                    array.forEach(trashes, function (trash) {
                        trash.deletedByUsers = [];
                        trash.isRequireLoad = true;
                        trash.deletedByUsers = [];
                    });
                    this.isEmptyTrash = true;
                    topic.publish("/epi/cms/trash/empty", response.extraInformation);

                    // let's refresh the data of current trash now
                    if (this.currentTrash.wasteBasketLink === trashId) {
                        this.set("currentTrash", this.currentTrash);
                    }

                    // ask UI to show alert message if needed
                }), lang.hitch(this, function (response) {
                    if (response.status === 403) {
                        this.set("actionResponse", resources.emptytrash.accessdenied);
                    }
                }
                ));
            }
        },

        restore: function (sourceContent, targetLink) {
            // summary:
            //		Restore content from a specific trash to specific content.
            //  source: Content
            //      The content source to restore
            // targetLink: ContentLink
            //      The target link to restore
            // tags:
            //		public

            if (sourceContent && sourceContent.contentLink && sourceContent.isDeleted && targetLink) {
                Deferred.when(this.contentStore.move(sourceContent.contentLink, { targetId: targetLink }), lang.hitch(this, function (response) {
                    if (response) {
                        //TODO: We shouldn't have to do a refresh here
                        this.contentStore.refresh(sourceContent.contentLink);
                        // Refresh parent in order to show expand/collapse icon correctly
                        // and then refresh current trash.
                        if (sourceContent.parentLink !== this.currentTrash.wasteBasketLink) {
                            this.contentStore.refresh(sourceContent.parentLink).then(lang.hitch(this, function () {
                                this.updateTrash(this.currentTrash);
                            }));
                        }

                        //TODO: This is just pure luck that it works, we should wait for the prommise to resolve
                        var destination = this.contentStore.get(targetLink);
                        if (destination && !destination.hasChildren) {
                            this.contentStore.refresh(targetLink).then(function (newParent) {
                                topic.publish("/epi/cms/contentdata/restored", newParent);
                            });
                        }
                    }
                }), lang.hitch(this, function (response) {
                    this.set("actionResponse", response.xhr ? json.fromJson(response.xhr.responseText) : resources.restore.error);
                }));
            }
        },

        getOldParent: function (contentLink) {
            // summary:
            //		Get old parent of specific contentLink.
            // tags:
            //		public

            var df = new Deferred();
            Deferred.when(this.contentStore.query({ referenceId: contentLink, query: "getrestorepoint", allLanguages: true }), function (parentContent) {
                var parent = parentContent && lang.isArray(parentContent) && parentContent.length > 0 ? parentContent[0] : null;
                df.resolve(parent);
            });

            return df;
        }
    });
});
