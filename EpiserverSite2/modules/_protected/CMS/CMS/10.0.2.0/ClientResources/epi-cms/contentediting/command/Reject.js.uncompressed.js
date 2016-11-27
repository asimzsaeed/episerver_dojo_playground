define("epi-cms/contentediting/command/Reject", [
    "dojo/_base/declare",
    "epi/shell/command/_Command",
    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/contentediting/command/_ChangeContentStatus",

//Resources
    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.toolbar.buttons"
],

function (
    declare,
    _Command,
    ContentActionSupport,
    _ChangeContentStatus,
    resources
) {

    return declare([_ChangeContentStatus], {
        // summary:
        //      Reject current content changes.
        //
        // tags:
        //      internal

        name: "reject",
        label: resources.reject.label,
        tooltip: resources.reject.title,
        iconClass: "epi-iconStop",

        action: ContentActionSupport.action.Reject,

        _execute: function () {
            // summary:
            //		Executes this command. Reject content sent for review.
            // tags:
            //		protected

            return this.inherited(arguments);
        },

        _onModelChange: function () {
            // summary:
            //		Updates canExecute after the model has been updated.
            // tags:
            //		protected

            this.inherited(arguments);

            var contentData = this.model.contentData,
                status = contentData.status,
                versionStatus = ContentActionSupport.versionStatus,
                canExecute = (status === versionStatus.CheckedIn) && this.model.canChangeContent(ContentActionSupport.action.Publish);

            this.set("canExecute", canExecute);
            this.set("isAvailable", canExecute);
        }
    });

});
