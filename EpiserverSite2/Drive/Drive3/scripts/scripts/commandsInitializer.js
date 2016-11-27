define([
    "dojo",
    "dojo/_base/declare",
    "dijit/layout/ContentPane",
    "dojo/query",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-class",
    "dijit/Dialog",

    "epi/_Module",
    "drive/scripts/menuWidget",
    "drive/scripts/vizBuildMode",
], function (
    dojo,
    declare,
    ContentPane,
    query,
     on,
     dom,
     domClass,
     Dialog,

    _Module,
    MenuWidget,
    vizBuildMode
) {
   
   

    return declare([_Module, ContentPane, MenuWidget, vizBuildMode], {
        initialize: function () {
            var _rootContainer = dom.byId("rootContainer");

            var driveShell =  new ContentPane({
                content: new MenuWidget({}),
                style: "height:50px",
                region: "bottom",
                splitter: true
            });

            driveShell.placeAt("rootContainer").startup();
            
            dojo.place(new vizBuildMode({}).templateString, dojo.body());


            var vizNode = dom.byId("viz");
            var cmdPreviewMode = query(".preview-mode", vizNode);
            var cmdBuildMode = query(".build-mode", vizNode);
            var cmdCommentMode = query(".comment-mode", vizNode);
            var cmdStatsMode = query(".stats-mode", vizNode);


            on(cmdPreviewMode, 'click', function (e) {
                console.log('cmdPreviewMode');
            });
            
            on(cmdBuildMode, 'click', function (e) {
                console.log('cmdBuildMode');

                

            });

            on(cmdCommentMode, 'click', function (e) {
                console.log('cmdCommentMode');
            });

            on(cmdStatsMode, 'click', function (e) {
                console.log('cmdStatsMode');
            });
           

        }

    });
});

