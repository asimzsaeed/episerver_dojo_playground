define("epi-cms/component/MediaViewModel", [
// dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",

    "dojo/dom-class",

    "dojo/when",
// epi
    "epi",
    "epi/shell/widget/dialog/Dialog",

    "epi-cms/core/ContentReference",

    "epi-cms/widget/viewmodel/HierarchicalListViewModel",
    "epi-cms/widget/viewmodel/MultipleFileUploadViewModel",
    "epi-cms/widget/MultipleFileUpload",

    "epi-cms/command/UploadContent",
    "epi-cms/command/EditImage",
    "epi-cms/command/DownloadMedia",
// resource
    "epi/i18n!epi/cms/nls/episerver.cms.components.media"
],

function (
// dojo
    array,
    declare,
    lang,

    domClass,

    when,
// epi
    epi,
    Dialog,

    ContentReference,

    HierarchicalListViewModel,
    MultipleFileUploadViewModel,
    MultipleFileUpload,

    UploadContentCommand,
    EditImageCommand,
    DownloadCommand,
// resources
    resources
) {

    return declare([HierarchicalListViewModel], {
        // summary:
        //      Handles search and tree to list browsing widgets.
        // tags:
        //      internal

        // Dialog widget for uploading new media
        _dialog: null,

        _getTypesToCreate: function () {
            // No create commands for media since upload is used instead.
            return [];
        },

        _setupCommands: function () {
            // summary:
            //      Creates and registers the commands used.
            // tags:
            //      protected

            this.inherited(arguments);

            var settings = {
                selection: this.selection,
                model: this
            };

            var customCommands = {
                uploadDefault: {
                    command: new UploadContentCommand(lang.mixin({
                        iconClass: "epi-iconPlus",
                        label: resources.command.label,
                        resources: resources,
                        viewModel: this
                    }, settings))
                },
                upload: {
                    command: new UploadContentCommand(lang.mixin({
                        category: "context",
                        iconClass: "epi-iconUpload",
                        label: resources.linktocreateitem,
                        viewModel: this
                    }, settings)),
                    isAvailable: this.menuType.ROOT | this.menuType.TREE,
                    order: 2
                },
                editImage: {
                    command: new EditImageCommand(lang.mixin({
                        category: "context",
                        forceContextChange: true,
                        label: resources.command.openineditor
                    }, settings)),
                    isAvailable: this.menuType.LIST,
                    order: 3
                },
                download: {
                    command: new DownloadCommand(lang.mixin({
                        category: "context",
                        label: resources.command.download
                    }, settings)),
                    isAvailable: this.menuType.LIST,
                    order: 4
                }
            };

            this._commandRegistry = lang.mixin(this._commandRegistry, customCommands);

            this.pseudoContextualCommands.push(this._commandRegistry.uploadDefault.command);
            this.pseudoContextualCommands.push(this._commandRegistry.upload.command);
        },

        _updateTreeContextCommandModels: function (model) {
            // summary:
            //      Update model of commands in case selected content is folder
            // tags:
            //      private

            this.inherited(arguments);

            this._commandRegistry.uploadDefault.command.set("model", model);
            this._commandRegistry.upload.command.set("model", model);
        },

        upload: function (/*Array*/fileList, /*String?*/targetId, /*Boolean?*/createAsLocalAsset) {
            // summary:
            //      Upload multiple files.
            // fileList: [Array]
            //      List files to upload.
            //      When null, only show upload form to select files for uploading.
            //      Otherwise, upload files in list.
            // targetId: [String?]
            //      Parent content id
            // createAsLocalAsset: [Boolean?]
            // tags:
            //      protected

            // only create diaglog if it is not available, otherwise, re-use it.
            var uploader = new MultipleFileUpload({
                model: new MultipleFileUploadViewModel({
                    store: this.get("store"),
                    query: this.get("listQuery")
                })
            });

            uploader.on("beforeUploaderChange", lang.hitch(this, function () {
                this._uploading = true;
            }));

            // close multiple files upload dialog when stop uploading
            uploader.on("close", lang.hitch(this, function (uploading) {
                this._dialog && (uploading ? this._dialog.hide() : this._dialog.destroy());
            }));

            // Reload current folder of tree, to reflect changes
            uploader.on("uploadComplete", lang.hitch(this, function (/*Array*/uploadFiles) {
                // Set current tree item again to reload items in list.
                if (uploader.createAsLocalAsset) {
                    when(this.treeStoreModel && typeof this.treeStoreModel.refreshRoots === "function" && this.treeStoreModel.refreshRoots(this), lang.hitch(this, function () {
                        // Turn-off createAsLocalAsset
                        uploader.set("createAsLocalAsset", false);
                        // Update uploading directory after create a new real one local asset folder for the given content
                        uploader.set("uploadDirectory", this.get("currentTreeItem").id);
                        // Update content list query after create a new real one local asset folder for the given content
                        uploader.model.set("query", this.get("listQuery"));
                    }));
                } else {
                    this.onListItemUpdated(uploadFiles);
                    this.set("currentTreeItem", this.get("currentTreeItem"));
                }

                if (this._dialog && !this._dialog.open) {
                    this._dialog.destroy();
                }

                this._uploading = false;
            }));

            this._dialog = new Dialog({
                title: resources.linktocreateitem,
                dialogClass: "epi-dialog-upload",
                content: uploader,
                autofocus: true,
                defaultActionsVisible: false,
                closeIconVisible: false,
                destroyOnHide: false
            });

            // only show close button for multiple files upload dialog
            this._dialog.definitionConsumer.add({
                name: "close",
                label: epi.resources.action.close,
                action: function () {
                    uploader.close();
                }
            });

            this._dialog.resize({ w: 700 });
            this._dialog.show();

            var selectedContent = createAsLocalAsset ? this.selection.data[0].data : this.store.get(targetId);
            when(selectedContent, lang.hitch(this, function (content) {
                // Update breadcumb on upload dialog.
                this._buildBreadcrumb(content, uploader);

                // Set destination is current tree item.
                uploader.set("uploadDirectory", targetId || this.get("currentTreeItem").id);
                uploader.set("createAsLocalAsset", createAsLocalAsset);

                uploader.upload(fileList);
            }));
        },

        onListItemUpdated: function (updatedItems) {
            // summary:
            //      Refresh the editing media if it have a new version
            // updatedItems: [Array]
            //      Collection of the updated item. In this case, they are files.
            // tags:
            //      public, extension

            var store = this.store;

            return when(this.getCurrentContext(), function (currentContext) {
                var contentWithoutVersion = (new ContentReference(currentContext.id)).createVersionUnspecificReference().toString();

                return when(store.get(contentWithoutVersion), function (currentContent) {
                    var editingMedia = array.filter(updatedItems, function (updatedItem) {
                        return currentContent.name.toLowerCase() === updatedItem.fileName.toLowerCase();
                    })[0];
                    return editingMedia ? currentContent : null;
                });
            });
        },

        _buildBreadcrumb: function (contentItem, uploader) {
            // summary:
            //      Build breadcrumb for the provided content
            // contentItem: Object
            //      The provided content
            // uploader: Object
            //      The multiple file upload control
            // tags:
            //      private

            if (!uploader) {
                return;
            }

            // Do not add more items when current content is sub root
            if (this.treeStoreModel.isTypeOfRoot(contentItem)) {
                uploader.set("breadcrumb", [contentItem]);
                return;
            }

            this.treeStoreModel.getAncestors(contentItem.contentLink, lang.hitch(this, function (ancestors) {
                var ancestor,
                    paths = [contentItem];

                for (var i = ancestors.length - 1; i >= 0; i--) {
                    ancestor = ancestors[i];
                    paths.unshift(ancestor);

                    // Break after first sub root or context root
                    if (this.treeStoreModel.isTypeOfRoot(ancestor)) {
                        break;
                    }
                }

                uploader.set("breadcrumb", paths);
            }));
        },

        getContextualParentLink: function (/* Object */ contentItem, /* Object */ context) {
            // summary:
            //      Retrieves the contextual parent link for given contentItem and context. If the found link is not in "DOM", then returns the last added item in the [roots].
            // contentItem:
            //      The contentItem object.
            // context:
            //      The currently loaded context.
            // tags:
            //      protected

            var link = this.inherited(arguments);

            // sometimes we hide the immidiate parentLink (in case of media gadget) then we need to set the parent as last added item in roots.
            var previousSelection = this.treeStoreModel.get("previousSelection");
            if (previousSelection && previousSelection.selectedContent) {

                // we need to query the Tree in order to find out if the item is hidden or not
                var treeItem = previousSelection.selectedContent.tree.getNodesByItem(link)[0];

                if (treeItem === undefined) {
                    link = this.roots[this.roots.length - 1];
                }
            }


            return link;
        }
    });

});
