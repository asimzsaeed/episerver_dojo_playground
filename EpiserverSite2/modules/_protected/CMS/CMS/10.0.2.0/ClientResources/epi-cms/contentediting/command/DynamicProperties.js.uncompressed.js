define("epi-cms/contentediting/command/DynamicProperties", [
    "dojo/_base/declare",
    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/contentediting/command/_LegacyDialogCommandBase",
    "epi-cms/ApplicationSettings",
//Resources
    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.contentdetails.command.dynamicproperties"
],

function (declare, ContentActionSupport, _LegacyDialogCommandBase, ApplicationSettings, resources) {

    return declare([_LegacyDialogCommandBase], {
        // summary:
        //      Toggles permanent in use notification on/off.
        //
        // tags:
        //      internal

        label: resources.label,
        tooltip: resources.tooltip,

        dialogPath: "Edit/EditDynProp.aspx",
        raiseCloseEvent: true,

        postscript: function () {
            this.inherited(arguments);

            //Hide the command if dynamic properties are disabled
            this.set("isAvailable", ApplicationSettings.isDynamicPropertiesEnabled);
        },


        _onModelChange: function () {
            // summary:
            //		Updates canExecute and isAvailable after the model has been updated.
            // tags:
            //		protected

            var contentData = this.model.contentData,
                hasAdminAccess = ContentActionSupport.hasAccess(contentData.accessMask, ContentActionSupport.accessLevel.Administer),
                canChangeContent = this.model.canChangeContent();

            this.set("canExecute", contentData.capabilities.dynamicProperties && hasAdminAccess && canChangeContent);
        }
    });
});
