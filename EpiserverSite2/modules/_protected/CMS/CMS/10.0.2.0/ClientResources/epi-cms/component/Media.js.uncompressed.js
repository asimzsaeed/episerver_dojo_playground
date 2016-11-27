define("epi-cms/component/Media", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",

    "dojo/dom-class",
    "dojo/dom-style",

    "dojo/on",
    "dojo/topic",
// epi-cms
    "epi-cms/component/MediaViewModel",
    "epi-cms/widget/HierarchicalList",
// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.widget.hierachicallist",
    "epi/i18n!epi/cms/nls/episerver.cms.components.media"
],

function (
// dojo
    declare,
    lang,

    domClass,
    domStyle,

    on,
    topic,
// epi
    MediaViewModel,
    HierarchicalList,
// Resources
    hierarchicalListResources,
    resources
) {

    return declare([HierarchicalList], {
        // summary:
        //      Media management component
        // tags:
        //      internal

        res: resources,

        // enableDndFileDropZone: [public] Boolean
        //      Flag to indicate this widget allowed to show drop zone widget ("epi-cms/widget/FilesUploadDropZone" that care about native DnD files from browser) or not.
        enableDndFileDropZone: true,

        // showCreateContentArea: [public] Boolean
        //      Flag to indicate this widget allowed to show create content area by default or not.
        showCreateContentArea: true,

        showThumbnail: true,

        modelClassName: MediaViewModel,

        noDataMessage: resources.nocontent,

        // hierarchicalListClass: [readonly] String
        //      The CSS class to be used on the content list.
        hierarchicalListClass: "epi-mediaList",

        // createContentText: [public] String
        //      Upload file text
        createContentText: resources.dropareatitle,

        postCreate: function () {

            this.inherited(arguments);

            this.list.set("noDataMessage", this.res.nocontent);

            this.own(
                this.model.getCommand("upload").watch("canExecute", lang.hitch(this, function (name, oldValue, newValue) {
                    this._toggleCreateContentArea(newValue);
                }))
            );
        },

        _onCreateAreaClick: function () {
            // summary:
            //      A callback function which is executed when the create area is clicked.
            // tags:
            //      protected
            this.inherited(arguments);
            this.model._commandRegistry.uploadDefault.command.execute();
        },

        // =======================================================================
        // List setup

        _setupCreateContentArea: function () {
            // summary:
            //      Setup create content area for list widget
            // tags:
            //      protected
            this.inherited(arguments);

            var buttonNode = this.createContentAreaButton.domNode;
            domClass.remove(buttonNode, "epi-flat");
            domClass.add(buttonNode, "epi-button--full-width");
        }
    });

});
