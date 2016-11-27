define("epi-cms/project/command/_ProjectCommand", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    // Parent class and mixins
    "epi/shell/command/_Command",
    "dijit/Destroyable"
], function (
    declare,
    lang,
    // Parent class and mixins
    _Command,
    Destroyable
) {

    return declare([_Command, Destroyable], {
        // summary:
        //      A base class for project commands which watches the selectedProject property and causes
        //      _setCanExecute to be called when it changes.
        // tags:
        //      internal

        modelPropertyToWatch: "selectedProject",


        _onModelChange: function () {
            // summary:
            //      Updates canExecute after the model has been updated.
            // tags:
            //      protected

            var model = this.model;

            this.set("canExecute", !!model);

            if (model) {
                // The command shouldn't be executable if a project is not selected so watch the selectedProject property
                // to update the canExecute when this changes.
                this.own(model.watch(this.modelPropertyToWatch, lang.hitch(this, "_setCanExecute")));

                // Set canExecute based on the current state of the model.
                this._setCanExecute();
            }
        },

        _setCanExecute: function () {
            // summary:
            //      Sets canExecute based on the state of the model.
            // tags:
            //      abstract
        }
    });
});
