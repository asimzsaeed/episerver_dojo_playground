define([
    "dojo/_base/declare",
    "dojo/dom",
    "dijit/layout/ContentPane",

    "epi/_Module",
    "drive/scripts/widgets/loader/loader"
], function (
    declare,
    dom,
    ContentPane,

    _Module,
    LoaderWidget
) {
    return declare([_Module, ContentPane, LoaderWidget], {
        initialize: function () {
            var _rootContainer = dom.byId("rootContainer");

            var driveShell =  new ContentPane({
                content: new LoaderWidget({}),
                style: "height:50px",
                region: "bottom",
                splitter: true
            });

            driveShell.placeAt("rootContainer").startup();
        }
    });
});

