define("epi-cms/contentediting/command/WorkflowTask", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/dom-class",

    "dojo/io-query",
// epi
    "epi",
    "epi-cms/ApplicationSettings",
    "epi-cms/contentediting/command/_LegacyDialogCommandBase",
    "epi-cms/core/ContentReference",
// resources
    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.command.workflowtask"
], function (
// dojo
    declare,
    lang,

    domAttr,
    domClass,

    ioQuery,
// epi
    epi,
    ApplicationSettings,
    _LegacyDialogCommandBase,
    ContentReference,

// resources
    resources
) {

    return declare([_LegacyDialogCommandBase], {
        // summary:
        //      Workflow task view command
        // tags:
        //      internal

        label: resources.label,
        tooltip: resources.tooltip,
        cssClass: "epi-chromelessButton epi-visibleLink",

        dialogPath: "Edit/WorkflowTask.aspx",
        raiseCloseEvent: true,

        postscript: function () {
            this.inherited(arguments);

            //Hide the command if workflows are disabled
            this.set("isAvailable", ApplicationSettings.isWorkflowsEnabled);
        },

        getDialogParams: function () {
            var self = this;
            return {
                dialogTitle: resources.title, // Set custom title for the legacy dialog
                legacyButtonQuery: "div span.epi-cmsButton", // Custom query to get the legacy buttons
                // Custom handler for mapping dialog buttons process
                onMapDialogButton: function (/*DOM*/legacyButton) {
                    return self._mapDialogButtons(legacyButton);
                },
                // Custom handler to close the legacy dialog after its content changed
                onLoad: function (/*Object*/wrapper) {
                    self._closeLegacyDialogOnRedirect(wrapper, this);
                },
                showCloseButton: true
            };
        },

        getRouteParams: function () {
            // summary:
            //      Overridden to mixin parameters to open the correct task from our model

            return lang.mixin(this.inherited(arguments), {
                id: this.getContentReference(true),
                task: this.model.task.taskId
            });
        },

        _onModelChange: function () {
            // summary:
            //      Updates canExecute and isAvailable after the model has been updated.
            // tags:
            //      protected

            var model = this.model;
            var canExecute = !!(model && model.contentData && !model.contentData.isDeleted && model.task && model.task.taskId);
            this.set("canExecute", canExecute);
        },

        _isCancelButton: function (/*DOM*/legacyButton) {
            // summary:
            //      Verify the given DOM node is a legacy "Cancel" button or not
            // tags:
            //      private

            return legacyButton && domClass.contains(legacyButton, "epi-cmsButton-Cancel");
        },

        _mapDialogButtons: function (/*DOM*/legacyButton) {
            // summary:
            //      Verify if the given button can map to dialog button or not
            // tags:
            //      private

            // Verify this button should map or not
            return !(this._isCancelButton(legacyButton) || domClass.contains(legacyButton, "epi-cmsButton-ViewMode"));
        },

        _closeLegacyDialogOnRedirect: function (/*Object*/wrapper, /*Object*/dialog) {
            // summary:
            //      Close legacy dialog if it loaded the container page without any parameters
            // tags:
            //      private

            var uri = wrapper.containerIframe.contentWindow.location.href, // Get loaded uri
                query = uri.substring(uri.indexOf("?") + 1, uri.length), // Get query string from the given uri
                queryObject = ioQuery.queryToObject(query); // Convert query string to object
            // Verify if the dialog redirected to the container page that not contains the indicated parameters, close the dialog.
            if (!queryObject || !(queryObject.task)) {
                dialog.hide();
            }
        }
    });

});
