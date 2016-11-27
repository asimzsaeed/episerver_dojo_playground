define("epi-cms/contentediting/command/_LegacyDialogCommandBase", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/promise/all",

    "dojo/topic",
// epi
    "epi/routes",
    "epi/shell/command/_Command",
    "epi/UriParser",

    "epi-cms/core/ContentReference",
    "epi-cms/legacy/LegacyDialogPopup"
],

function (
// dojo
    declare,
    lang,
    whenAll,

    topic,
// epi
    routes,
    _Command,
    UriParser,

    ContentReference,
    LegacyDialogPopup
) {

    return declare([_Command], {
        // summary:
        //      Base class for any command that needs to open a dialogs from the legacy user interface
        //      canExecute is updated to false if the content is changing its status, and restore when done.
        // tags:
        //      private abstract

        dialogPath: null,
        raiseCloseEvent: null,
        routeParams: null,
        dialogParams: null,
        canExecute: true,

        getContentReference: function (/*Boolean*/withVersion) {
            // summary:
            //      Returns a content reference used when assembling the route parameters.

            var contentLink = lang.getObject("model.contentData.contentLink", false, this),
                contentReference = contentLink ? new ContentReference(contentLink) : null;

            if (contentReference) {
                contentReference = withVersion ? contentReference.toString() : contentReference.createVersionUnspecificReference().toString();
            }
            return contentReference;
        },

        getRouteParams: function () {
            // summary:
            //  Override to customize the parameters used for getting the route url for the opened dialog

            return {
                id: this.getContentReference(),
                path: this.dialogPath,
                moduleArea: "LegacyCMS",
                IsInLegacyWrapper: true
            };
        },

        getDialogParams: function () {
            // summary:
            //  Override to supply custom parameters to to the dialog.
            //
            // returns:
            //  An empty object
            return {};
        },

        _createDialog: function (/*object*/dialogParams, /*object*/routeParams) {
            // summary:
            //      Creates and returns a new LegacyDialogPopup
            //
            // dialogParams:
            //      An object containing parameters overriding any default dialog constructor arguments
            //
            // routeParams:
            //      An object with properties used for constructing the dialog url.
            //
            // tags: private
            var standardDialogParams = {
                url: routes.getActionPath(routeParams),
                dialogArguments: window.document,
                autoFit: true,
                onClose: lang.hitch(this, function () {
                    var contentReference = this.getContentReference();
                    if (this.raiseCloseEvent && contentReference) {
                        //update context
                        topic.publish("/epi/cms/contentdata/updated", {
                            contentLink: contentReference,
                            recursive: true
                        });
                    }
                })
            };

            return new LegacyDialogPopup(lang.mixin({}, standardDialogParams, dialogParams));
        },

        _execute: function () {
            whenAll([this.getDialogParams(), this.getRouteParams()]).then(lang.hitch(this, function (params) {
                var dialog = this._createDialog.apply(this, params);
                dialog.show();
            }));
        }

    });

});
