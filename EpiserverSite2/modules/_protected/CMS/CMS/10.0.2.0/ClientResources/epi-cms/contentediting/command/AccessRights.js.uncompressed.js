define("epi-cms/contentediting/command/AccessRights", [
    "dojo/_base/declare",
    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/contentediting/command/_LegacyDialogCommandBase",

//Resources
    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.contentdetails.command.accessrights"
],

function (declare, ContentActionSupport, _LegacyDialogCommandBase, resources) {

    return declare([_LegacyDialogCommandBase], {
        // summary:
        //      Toggles permanent in use notification on/off.
        //
        // tags:
        //      internal

        name: "AccessRights",
        label: resources.label,
        tooltip: resources.tooltip,

        dialogPath: "Edit/EditSecurity.aspx",
        raiseCloseEvent: true,

        _onModelChange: function () {
            // summary:
            //		Updates canExecute and isAvailable after the model has been updated.
            // tags:
            //		protected

            var contentData = this.model.contentData,
                hasAdminAccess = ContentActionSupport.hasAccess(contentData.accessMask, ContentActionSupport.accessLevel.Administer),
                canChangeContent = this.model.canChangeContent();

            this.set("canExecute", contentData.capabilities.securable && hasAdminAccess && canChangeContent);
        }
    });
});
