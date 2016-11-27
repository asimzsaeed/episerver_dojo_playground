define("epi-cms/command/EditImage", [
    // dojo
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    // epi
    "epi/dependency",
    "epi/routes",
    "epi/Url",
    "epi/UriParser",
    "epi/shell/TypeDescriptorManager",

    // EPi CMS
    "epi-cms/ApplicationSettings",
    "epi-cms/core/ContentReference",
    "epi-cms/legacy/LegacyDialogPopup",
    "epi-cms/contentediting/command/_LegacyDialogCommandBase",
    "epi/shell/command/_SelectionCommandMixin"
], function (
    // dojo
    declare,
    lang,
    topic,
    // epi
    dependency,
    routes,
    Url,
    UriParser,
    TypeDescriptorManager,

    // EPi CMS
    ApplicationSettings,
    ContentReference,
    LegacyDialogPopup,
    _LegacyDialogCommandBase,
    _SelectionCommandMixin
) {

    return declare([_LegacyDialogCommandBase, _SelectionCommandMixin], {
        // tags:
        //      public

        // canExecute: [readonly] Boolean
        //      Flag which indicates whether this command is able to be executed.
        canExecute: false,

        // iconClass: [readonly] String
        //      The icon class of the command to be used in visual elements.
        iconClass: "epi-iconNewWindow",

        // _segmentIdSeperator: [readonly] String
        //      Default id seperator string.
        _segmentIdSeperator: ",,",

        postscript: function () {
            this.inherited(arguments);
            this.contextService = this.contextService || dependency.resolve("epi.shell.ContextService");
        },

        getRouteParams: function () {
            // summary:
            //      Gets the parameters for creating a route to the legacy content.
            var target = this._getTarget();

            return this.contextService.query({ uri: "epi.cms.contentdata:///" + target.contentLink})
                .then(function (context) {
                    var imageId = new UriParser(context.uri).getId();
                    return {
                        moduleArea: "LegacyCMS",
                        path: "Edit/ImageEditor/ImageEditor.aspx",
                        IsInLegacyWrapper: false,
                        imageId: imageId
                    };
                });
        },

        _createDialog: function (dialogParams, routeParams) {
            // summary:
            //      Creates and returns a new LegacyDialogPopup
            //
            // dialogParams: Object
            //      An object containing parameters overriding any default dialog constructor arguments
            //
            // routeParams: Object
            //      An object with properties used for constructing the dialog url.
            // tags:
            //      private

            var content = this._getTarget();

            if (content) {
                var onCallback = function (returnValue) {
                    if (returnValue) {
                        // Request context change when save or save as asset image
                        topic.publish("/epi/shell/context/request", { url: returnValue.src }, { forceReload: true });
                    }
                };

                lang.mixin(dialogParams, {
                    url: routes.getActionPath(routeParams),
                    dialogArguments: {
                        src: content.permanentLink,
                        contentLink: routeParams.imageId
                    },
                    onCallback: onCallback
                });
            }

            return new LegacyDialogPopup(dialogParams);
        },

        _onModelChange: function () {
            // summary:
            //      Updates canExecute after the model has been updated.
            // tags:
            //      protected

            if (!ApplicationSettings.imageEditorEnabled) {
                if (this.get("isAvailable")) {
                    this.set("isAvailable", false);
                }
                return;
            }

            var target = this._getTarget(),
                canExecute = this.model &&  // Ensure that there is a model available.
                             target &&  // Ensure there is something selected.
                             TypeDescriptorManager.isBaseTypeIdentifier(target.typeIdentifier, "episerver.core.icontentimage");  // Check that it is image content.

            this.set("canExecute", !!canExecute);

        },

        _getTarget: function () {
            // summary:
            //      Returns the target for the file operation from the current selection.
            // tags:
            //      protected
            var selection = this.selection && this.selection.data,
                target = selection && selection.length === 1 && selection[0];

            return target && (target.type === "epi.cms.contentdata") ? target.data : null;
        }
    });
});
