define("epi-cms/contentediting/command/ContentAreaCommands", [
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/Stateful",
    "./BlockRemove",
    "./BlockEdit",
    "./MoveVisibleToPrevious",
    "./MoveVisibleToNext",
    "./Personalize",
    "./SelectDisplayOption"
], function (array, declare, Stateful, Remove, Edit, MoveVisibleToPrevious, MoveVisibleToNext, Personalize, SelectDisplayOption) {

    return declare([Stateful], {
        // tags:
        //      internal

        commands: null,

        constructor: function () {
            this.commands = [
                new Edit(),
                new SelectDisplayOption(),
                new Personalize(),
                new MoveVisibleToPrevious(),
                new MoveVisibleToNext(),
                new Remove()
            ];
        },

        _modelSetter: function (model) {
            this.model = model;

            array.forEach(this.commands, function (command) {
                command.set("model", model);
            });
        }
    });
});
