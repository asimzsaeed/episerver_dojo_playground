define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/layout/ContentPane",

        "epi/dependency",

        "dojo/domReady!",
],
    function (
        declare,
        lang,
        ContentPane,
        dependency

    ) {
        return declare([ContentPane], {
            constructor: function () {
                var registry = dependency.resolve("epi.storeregistry");
                
                new ContentPane({
                    content: "<p>I am initial content</p>",
                    style: "height:50px",
                    region: "bottom"
                }).placeAt("rootContainer").startup();
            }
        });
    });