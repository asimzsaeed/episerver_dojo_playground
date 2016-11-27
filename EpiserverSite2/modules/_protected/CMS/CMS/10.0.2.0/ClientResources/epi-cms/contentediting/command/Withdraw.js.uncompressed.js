define("epi-cms/contentediting/command/Withdraw", [
    "dojo/_base/declare",
    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/contentediting/command/_ChangeContentStatus",
//Resources
    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.toolbar.buttons"
],

function (
    declare,
    ContentActionSupport,
    _ChangeContentStatus,
    resources
) {

    return declare([_ChangeContentStatus], {
        // summary:
        //    Withdraw a ready to publish version to edit command.
        //
        // tags:
        //      internal

        name: "withdraw",
        label: resources.withdraw.label,
        tooltip: resources.withdraw.title,
        iconClass: "epi-iconPen",

        action: ContentActionSupport.saveAction.CheckOut | ContentActionSupport.saveAction.ForceCurrentVersion,

        contentActionSupport: null,

        postscript: function () {
            this.inherited(arguments);
            this.contentActionSupport = this.contentActionSupport || ContentActionSupport;
        },

        _execute: function () {
            // summary:
            //    Executes this command; save a content that has been sent for approval.
            //
            // tags:
            //    protected

            return this.inherited(arguments);
        },

        _onModelChange: function () {
            // summary:
            //    Updates canExecute after the model has been updated.
            // tags:
            //    protected

            this.inherited(arguments);

            var contentData = this.model.contentData,
                status = contentData.status,
                versionStatus = ContentActionSupport.versionStatus,
                hasAccessRights = this.contentActionSupport.isActionAvailable(contentData, ContentActionSupport.action.Create) &&
                                  !this.contentActionSupport.isActionAvailable(contentData, ContentActionSupport.action.Publish),
                canExecute = hasAccessRights && (status === versionStatus.CheckedIn);

            this.set("canExecute", canExecute);
            this.set("isAvailable", canExecute);
        }
    });

});
