define("epi-cms/contentediting/command/ManageExpiration", [

// Dojo
    "dojo/_base/connect",
    "dojo/_base/declare",
    "dojo/_base/Deferred",
    "dojo/_base/lang",

// EPi CMS
    "epi",
    "epi/datetime",
    "epi-cms/contentediting/ExpirationDialog",
    "epi-cms/contentediting/viewmodel/ExpirationDialogViewModel",
    "epi-cms/contentediting/ContentActionSupport",

// EPi Framework
    "epi/shell/command/_Command",
    "epi/shell/widget/dialog/Dialog",

// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.widget.expirationeditor",
    "epi/i18n!epi/nls/episerver.shared"
], function (

// Dojo
    connect,
    declare,
    Deferred,
    lang,

// EPi CMS
    epi,
    epiDatetime,
    ExpirationDialog,
    ExpirationDialogViewModel,
    ContentActionSupport,

// EPi Framework
    _Command,
    Dialog,

// Resources
    resources,
    sharedResources
    ) {

    return declare([_Command], {
        // summary:
        //      Displays the manage expiration dialog for the current content.
        //
        // tags:
        //      internal

        label: resources.dialogtitle,

        tooltip: resources.dialogtitle,

        viewModel: null,

        cssClass: "epi-chromelessButton epi-visibleLink",

        _execute: function () {
            // summary:
            //		Toggles the value of the given property on the model.
            // tags:
            //		protected

            var dialog = this.createDialog();

            dialog.on("execute", lang.hitch(this, this._onExecute));
            dialog.show();
        },

        createDialog: function () {
            // summary:
            //		Create the ExpirationDialog instance.
            // tags:
            //		internal

            var dialogViewModel = this.get("viewModel");

            var content = new ExpirationDialog({ model: dialogViewModel });

            return new Dialog({
                defaultActionsVisible: false,
                confirmActionText: sharedResources.action.save,
                content: content,
                title: resources.dialogtitle
            });
        },

        _onModelChange: function () {
            // summary:
            //		Updates canExecute after the model has been updated.
            // tags:
            //		protected

            var model = this.get("model");
            if (!model || !model.contentData) {
                this.set("canExecute", false);
                return;
            }

            var properties = model.contentData.properties,
                expireBlock = properties.iversionable_expire;

            var canExecute = model.canChangeContent() &&
                             ContentActionSupport.hasAccess(model.contentData.accessMask, ContentActionSupport.accessLevel.Publish); // Ensure the user has Publish access right

            // Command is not available until the metadata resolves
            this.set("canExecute", false);

            Deferred.when(model.getPropertyMetaData("iversionable_expire"), lang.hitch(this, function (metadata) {
                this.set("viewModel", new ExpirationDialogViewModel({
                    metadata: metadata,
                    contentLink: model.contentLink,
                    contentName: model.contentData.name,
                    value: expireBlock,
                    minimumExpireDate: properties.iversionable_startpublish
                }));

                this.set("canExecute", canExecute);
            }));

        },

        _onExecute: function (value) {
            var model = this.get("model");
            model.saveAndPublishProperty("iversionable_expire", value);
        }
    });
});
