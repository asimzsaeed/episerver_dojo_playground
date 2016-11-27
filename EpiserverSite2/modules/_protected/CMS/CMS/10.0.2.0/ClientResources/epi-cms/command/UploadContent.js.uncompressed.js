define("epi-cms/command/UploadContent", [
    "dojo/_base/declare",
    "epi/shell/command/_Command",
    "epi/shell/DestroyableByKey",
    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/core/ContentReference"
], function (
    declare,
    _Command,
    DestroyableByKey,
    ContentActionSupport,
    ContentReference
) {
    return declare([_Command, DestroyableByKey], {
        // summary:
        //      A command that starts the upload new content process when executed.
        // tags:
        //      internal

        // fileList: [public] Array
        //      A array of files to upload. When null, only show upload form to
        //      select files for uploading; otherwise, upload files in list.
        fileList: null,

        // createAsLocalAsset: [public] Boolean
        //      Indicate if the content should be created as local asset of its parent.
        createAsLocalAsset: false,

        _execute: function () {
            // summary:
            //      Executes this command; call upload method from model.
            // tags:
            //      protected

            var contentLinkWithoutWorkId = ContentReference.toContentReference(this.model.contentLink).createVersionUnspecificReference();

            this.viewModel.upload(this.fileList, contentLinkWithoutWorkId.toString(), this.createAsLocalAsset);

            this.fileList = null; // clear fileList after uploading, to avoid of displaying last uploaded item on upload dialog.
        },

        _onModelChange: function () {
            // summary:
            //      Updates canExecute after the model has been updated.
            // tags:
            //      protected

            var model = this.model,
                canExecute = model && ContentActionSupport.hasProviderCapability(model.providerCapabilityMask, ContentActionSupport.providerCapabilities.Create) &&
                             ContentActionSupport.hasAccess(model.accessMask, ContentActionSupport.accessLevel.Create);

            this.destroyByKey("isSearchingWatch");
            this.viewModel && this.ownByKey("isSearchingWatch", this.viewModel.watch("isSearching", this._onModelChange.bind(this)));

            this.set("canExecute", !!(canExecute && this.viewModel && !this.viewModel.get("isSearching")));
        }
    });
});
