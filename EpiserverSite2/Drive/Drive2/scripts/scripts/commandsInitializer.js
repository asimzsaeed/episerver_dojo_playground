define([
    "dojo",
    "dojo/_base/declare",
    "epi/_Module",
    "epi/dependency",
    "epi/routes",
    "drive/scripts/commandsProvider",
     "epi/shell/store/Throttle",
     "epi/shell/store/JsonRest"
], function (
    dojo,
    declare,
    _Module,
    dependency,
    routes,
    CommandsProvider,
    Throttle,
    JsonRest
) {
    return declare([_Module], {
        initialize: function () {
            this.inherited(arguments);
            var commandsProvider = new CommandsProvider();
            var commandregistry = dependency.resolve("epi.globalcommandregistry");
            var area = "epi.cms.globalToolbar";
            //var area = "epi.cms.publishmenu";
            //var area = "epi.cms.globalToolbar";
            //var area = "epi.cms.contentdetailsmenu";
            //var area = "epi.cms.assets";
            commandregistry.registerProvider(area, commandsProvider);
        }
    });
});

