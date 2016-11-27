define("epi-cms/component/SharedBlocks", [
// dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",

    "dojo/on",
// epi
    "epi-cms/widget/HierarchicalList",
    "epi-cms/component/SharedBlocksViewModel",
// resources
    "epi/i18n!epi/cms/nls/episerver.cms.components.createblock",
    "epi/i18n!epi/cms/nls/contenttypes.blockdata"
],

function (
// dojo
    array,
    declare,
    lang,
    aspect,

    on,
// epi
    HierarchicalList,
    SharedBlocksViewModel,
// resources
    componentResources,
    res
) {

    return declare([HierarchicalList], {
        // summary:
        //      Shared blocks component
        // tags:
        //      internal

        // showCreateContentArea: [public] Boolean
        //      Flag which indicates whether the create content area should be displayed on startup.
        showCreateContentArea: false,

        modelClassName: SharedBlocksViewModel,

        noDataMessage: componentResources.nocontent,

        // hierarchicalListClass: [readonly] String
        //      The CSS class to be used on the content list.
        hierarchicalListClass: "epi-blockList",

        // createContentIcon: [public] String
        //      The icon class to be used in the create content area of the list.
        createContentIcon: "epi-iconPlus",

        // createContentText: [public] String
        createContentText: res.create,

        buildRendering: function () {
            this.inherited(arguments);

            // Aspect the renderQuery method on the grid to get the number of items rendered after a query has executed
            // We can't depend on the "dgrid-refresh-complete" event from the grid because it might not always return the correct result
            // e.g if two refresh were initiated at almost the same time we will only get the event for the first refresh call
            var self = this;
            this.own(aspect.after(this.list.grid, "renderQuery", function (results) {
                results.then(function (results) {
                    var showCreateContentArea = results.length > 0 ? false : self.model.getCommand("newBlockDefault").get("canExecute");
                    self._toggleCreateContentArea(showCreateContentArea);
                });
            }));
        },

        _onCreateAreaClick: function () {
            // summary:
            //      A callback function which is executed when the create area is clicked.
            // tags:
            //      protected
            this.inherited(arguments);
            this.model._commandRegistry.newBlockDefault.command.execute();
        },

        // =======================================================================
        // List setup

        _setupList: function () {

            this.inherited(arguments);

            var registry = this.model._commandRegistry,
                listWidget = this.list;

            this.own(
                on(listWidget, "copyOrCut", function copyOrCuthandler(copy) {
                    copy ? registry.copy.command.execute() : registry.cut.command.execute();
                }),
                on(listWidget, "delete", function () {
                    registry["delete"].command.execute();
                })
            );
        }

    });

});
