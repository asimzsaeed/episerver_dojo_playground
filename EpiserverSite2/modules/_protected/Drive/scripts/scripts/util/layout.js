define([
    'dojo/_base/declare',
    'dojo',
     "dojo/dom",
     "dijit/layout/ContentPane",
    'epi/shell/widget/Iframe',

    "../widgets/build/build",
],
function (declare, dojo, dom, ContentPane, Iframe, buildWidget) {
    return declare('Vizob.util.layout', [Iframe], {
        previewBox: null,
        scrollHeight:null,
        buildRendering: function () {
            this.inherited(arguments);
            this.previewBox = dojo.query('.epi-editorViewport-previewBox')[0];
        },
        loadContentById: function (id) {
            this.load(url, null);
            dojo.place(this.iframe, this.previewBox, 'only');
        },
        loadContentByUrl: function (url) {
            this.load(url, null);
            this.iframe.height = this.scrollHeight;
            dojo.place(this.iframe, this.previewBox, 'only');
        },
        loadBuild: function () {
            //var buildWidget = new Vizob.BuildWidget();
            this.previewBox = dojo.query('.epi-editorViewport-previewBox')[0];
            this.scrollHeight = this.previewBox.scrollHeight;
            var contentPane = new ContentPane({
                content: new Vizob.BuildWidget({}),
                region: "center",
                style: "height:" + this.scrollHeight + "px"
            });
            //dojo.place(contentPane, this.previewBox, 'only');
            dojo.empty(this.previewBox);
            contentPane.placeAt(this.previewBox).startup();
        }
    });
});