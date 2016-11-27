define("epi/shell/dnd/Target", [
    "dojo/_base/declare",
    "dojo/dom-class",
    "./Source"
], function (
    declare,
    domClass,
    Source
) {
    return declare([Source], {
        // tags:
        //      internal

        constructor: function (node, params) {
            // summary:
            //		a constructor of the Target --- see the `dojo/dnd/Source.constructor` for details
            this.isSource = false;
            domClass.remove(this.node, "dojoDndSource");
        }
    });

});
