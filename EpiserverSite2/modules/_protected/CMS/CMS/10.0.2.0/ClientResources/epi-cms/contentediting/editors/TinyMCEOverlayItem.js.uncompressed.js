define("epi-cms/contentediting/editors/TinyMCEOverlayItem", [
    "dojo/_base/declare",

    "epi/shell/widget/overlay/Item"
], function (
    declare,
    Item
) {
    return declare([Item], {
       // summary:
       //       Overlay item for the TinyMCE editor that disables all DND drops on the overlay
       // tags:
       //       internal

        postMixInProperties: function () {
            this.inherited(arguments);

            // Disable DND on the overlay item
            this.allowedDndTypes = [];
        }
    });
});
