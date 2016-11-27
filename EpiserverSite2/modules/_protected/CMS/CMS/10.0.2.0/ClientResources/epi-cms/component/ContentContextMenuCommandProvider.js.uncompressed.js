define("epi-cms/component/ContentContextMenuCommandProvider", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/array",
// epi
    "epi/shell/command/_CommandProviderMixin",

    "../command/CopyContent",
    "../command/CutContent",
    "../command/PasteContent",
    "../command/TranslateContent",
    "../command/DeleteContent",

    "../widget/CreateCommandsMixin",

    "epi/shell/selection"
],

function (
// dojo
    declare,
    array,
// epi
    _CommandProviderMixin,
    CopyCommand,
    CutCommand,
    PasteCommand,
    TranslateCommand,
    DeleteCommand,

    CreateCommandsMixin,

    Selection
) {

    return declare([_CommandProviderMixin, CreateCommandsMixin], {
        // summary:
        //      Command provider for content context menus
        // tags:
        //      internal xproduct

        // treeModel: [Object]
        //      Model use for the commands
        treeModel: null,

        clipboardManager: null,

        _settings: null,
        _newContentCommand: null,
        _translateContentCommand: null,

        constructor: function (params) {
            declare.safeMixin(this, params);
        },

        postscript: function () {
            this.inherited(arguments);

            //Create the commands
            this._settings = {
                category: "context",
                model: this.treeModel,
                clipboard: this.clipboardManager,
                selection: new Selection()
            };

            this._translateContentCommand = new TranslateCommand({ category: "context"});

            var createCommands = this.getCreateCommands(),
                commands = [];

            for (var key in createCommands) {
                commands.push(createCommands[key].command);
            }

            commands.push(
                this._translateContentCommand,
                new CutCommand(this._settings),
                new CopyCommand(this._settings),
                new PasteCommand(this._settings),
                new DeleteCommand(this._settings)
            );

            this.set("commands", commands);
        },

        updateCommandModel: function (model) {
            // summary:
            //      Updates the model for the commands.
            // tags:
            //      public

            array.forEach(this.get("commands"), function (command) {
                if (command.isInstanceOf(this.createCommandClass) || command.popup) {
                    command.set("model", model);
                }
            }, this);

            this._translateContentCommand.set("model", model);
            this._settings.selection.set("data", [{ type: "epi.cms.contentdata", data: model}]);
        }

    });

});
