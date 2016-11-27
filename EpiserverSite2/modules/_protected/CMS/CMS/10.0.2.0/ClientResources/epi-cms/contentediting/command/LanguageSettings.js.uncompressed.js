define("epi-cms/contentediting/command/LanguageSettings", [
    "dojo/_base/declare",
    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/contentediting/command/_LegacyDialogCommandBase",

//Resources
    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.contentdetails.command.languagesettings"
],

function (declare, ContentActionSupport, _LegacyDialogCommandBase, resources) {

    return declare([_LegacyDialogCommandBase], {
        // summary:
        //      Toggles permanent in use notification on/off.
        //
        // tags:
        //      internal

        name: "LanguageSettings",
        label: resources.label,
        tooltip: resources.tooltip,

        dialogPath: "Edit/LanguageSettings.aspx",
        raiseCloseEvent: true,

        _onModelChange: function () {
            // summary:
            //		Updates canExecute and isAvailable after the model has been updated.
            // tags:
            //		protected

            var contentData = this.model.contentData,
                hasAdminAccess = ContentActionSupport.hasAccess(contentData.accessMask, ContentActionSupport.accessLevel.Administer);

            this.set("canExecute", contentData.capabilities.languageSettings && hasAdminAccess);
        }
    });
});
