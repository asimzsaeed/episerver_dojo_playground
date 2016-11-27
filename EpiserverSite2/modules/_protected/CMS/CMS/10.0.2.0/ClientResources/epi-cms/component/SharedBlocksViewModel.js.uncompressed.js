define("epi-cms/component/SharedBlocksViewModel", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",
// epi
    "epi-cms/widget/viewmodel/HierarchicalListViewModel",

// command
    "./command/NewBlock",
    "epi-cms/command/ShowAllLanguages"
],

function (
// dojo
    declare,
    lang,
// epi
    HierarchicalListViewModel,

// command
    NewBlockCommand,
    ShowAllLanguagesCommand
) {

    return declare([HierarchicalListViewModel], {
        // summary:
        //      Handles search and tree to list browsing widgets.
        // tags:
        //      internal

        _updateTreeContextCommandModels: function (model) {
            // summary:
            //      Update model of commands in case selected content is folder
            // tags:
            //      private

            this.inherited(arguments);

            var translateDelegate = lang.hitch(this.treeStoreModel, this.treeStoreModel.translate);
            this._commandRegistry.translate.command.set("model", model);
            this._commandRegistry.translate.command.set("executeDelegate", translateDelegate);

            this._commandRegistry.newBlockDefault.command.set("model", model);
        },

        _setupCommands: function () {
            // summary:
            //      Creates and registers the commands used.
            // tags:
            //      protected

            this.inherited(arguments);

            var customCommands = {
                newBlockDefault: {
                    command: new NewBlockCommand({
                        viewModel: this
                    })
                },
                allLanguages: {
                    command: new ShowAllLanguagesCommand({ model: this }),
                    order: 55
                }
            };

            this._commandRegistry = lang.mixin(this._commandRegistry, customCommands);

            this.pseudoContextualCommands.push(this._commandRegistry.newBlockDefault.command);
        }
    });
});
