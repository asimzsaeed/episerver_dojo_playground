define("epi-cms/contentediting/PseudoContextualCommandDecorator", [
// dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",

    "dojo/aspect",
// epi
    "epi/shell/command/_Command",
    "epi/shell/command/_ClipboardCommandMixin",
    "epi/shell/command/_SelectionCommandMixin"
],

function (
// dojo
    array,
    declare,
    lang,

    aspect,
// epi
    _Command,
    _ClipboardCommandMixin,
    _SelectionCommandMixin
) {

    return declare(null, {
        // summary:
        //      Decorates commands for a pseudo contextual content
        // tags:
        //      internal

        // =======================================================================
        // Public functions

        destroy: function () {

            this._clearContextualCommandHandlers();
        },

        decorateCommands: function (/*Arrays*/commands, /*dojo/data/Item*/newModel, /*Function?*/pseudoContextualRootFilter) {
            // summary:
            //      Converts the given commands to work in case pseudo contextual content
            // commands: [Array]
            //      A collection of object that is instance of "epi/shell/command/_Command" class
            // newModel: [dojo/data/Item]
            // pseudoContextualRootFilter: [Function?]
            //      Command filter function
            // tags:
            //      public

            this._clearContextualCommandHandlers();

            if (!(commands instanceof Array) || commands.length <= 0 || typeof newModel !== "object") {
                return;
            }

            this._decorateCommands(commands, newModel, pseudoContextualRootFilter);
        },

        // =======================================================================
        // Private functions

        _decorateCommands: function (/*Arrays*/commands, /*dojo/data/Item*/newModel, /*Function?*/pseudoContextualRootFilter) {
            // summary:
            //      Converts the given commands to work in case pseudo contextual content
            // commands: [Array]
            //      A collection of object that is instance of "epi/shell/command/_Command" class
            // newModel: [dojo/data/Item]
            // pseudoContextualRootFilter: [Function?]
            //      Command filter function
            // tags:
            //      public

            array.forEach(commands, function (command) {
                if (!this._isValidCommand(command)) {
                    return;
                }

                // Do nothing if the current selected item is a real contextual content
                if (typeof pseudoContextualRootFilter === "function" && !pseudoContextualRootFilter(this._isNormalCommand(command) ? command.model : command.get("selectionData"))) {
                    return;
                }

                this._onAroundCommandExecute(command, newModel);
            }, this);
        },

        _onAroundCommandExecute: function (/*Object*/command, /*Object*/newModel) {
            // summary:
            //      Stub to do something before and after the execution of the given command object
            // command: [Object]
            //      An instance of "epi/shell/command/_Command"
            // newModel: [Object]
            //      An instance of "dojo/data/Item"
            // tags:
            //      private

            var self = this;
            self._contextualCommandHandlers.push(aspect.around(command, "execute", function (originalFunction) {
                return function () {
                    var originalData = self._decorateCommandBeforeExecute(command, newModel);

                    originalFunction.apply(command, arguments);

                    self._restoreCommandAfterExecute(command, originalData);
                };
            }));
        },

        _decorateCommandBeforeExecute: function (/*Object*/command, /*Object*/newModel) {
            // summary:
            //      Stub to do something before execution of the given command object
            // command: [Object]
            //      An instance of "epi/shell/command/_Command"
            // newModel: [Object]
            //      An instance of "dojo/data/Item"
            // returns: [Object] original command data
            //      Default data:
            //          canExecute: [Boolean]
            //          isAvailable: [Boolean]
            //          createAsLocalAsset: [Boolean]
            //      Optional data:
            //          model: [Object]
            //          data: [Object]
            // tags:
            //      private

            var originalData = this._decorateCommand(command);

            if (this._isNormalCommand(command)) {
                lang.mixin(originalData, this._decorateNormalCommand(command, newModel));
            } else if (command.isInstanceOf(_SelectionCommandMixin)) {
                lang.mixin(originalData, this._decorateSelectionCommand(command, newModel));
            }

            command.set({
                canExecute: true,
                isAvailable: true,
                createAsLocalAsset: true
            });

            return originalData;
        },

        _decorateCommand: function (/*Object*/command) {
            // summary:
            //      Decorates the given command: marks it always TRUE for "canExecute", "isAvailable" and "createAsLocalAsset" flags
            // command: [Object]
            //      An instance of "epi/shell/command/_Command"
            // returns: [Object] original command data
            //      canExecute: [Boolean]
            //      isAvailable: [Boolean]
            //      createAsLocalAsset: [Boolean]
            // tags:
            //      private

            var originalData = {
                createAsLocalAsset: command.get("createAsLocalAsset")
            };

            command.isInstanceOf(_ClipboardCommandMixin) && command.unwatchClipboardChange();
            command.isInstanceOf(_SelectionCommandMixin) && command.unwatchSelectionChange();

            return originalData;
        },

        _decorateNormalCommand: function (/*Object*/command, /*Object*/newModel) {
            // summary:
            //      Decorates the given command in order to make it work fine with pseudo contextual content
            // command: [Object]
            //      An instance of "epi/shell/command/_Command"
            // newModel: [Object]
            //      An instance of "dojo/data/Item"
            // returns: [Object] original command data
            //      model: [Object]
            // tags:
            //      private

            var originalData = {
                model: command.get("model")
            };

            // Normal command case
            // If the given command object is instance of "epi/shell/command/_Command" only
            command.set("model", newModel);

            return originalData;
        },

        _decorateSelectionCommand: function (/*Object*/command, /*Object*/newModel) {
            // summary:
            //      Decorates the given command in order to make it work fine with pseudo contextual content
            // command: [Object]
            //      An instance of "epi/shell/command/_SelectionCommandMixin"
            // newModel: [Object]
            //      An instance of "dojo/data/Item"
            // returns: [Object] original command data
            //      data: [Object]
            // tags:
            //      private

            var originalData = {
                data: command.get("selectionData")
            };

            // Selection command case
            // If the given command object is instance of "epi/shell/command/_Command" and had mixed-in "epi/shell/command/_SelectionCommandMixin"
            var model = command.get("model");
            if (model && typeof model.refreshRoots == "function") {
                command.onRefreshSelection = function () {
                    return model.refreshRoots();
                };
            }

            command.selection.set("data", [{
                data: newModel,
                type: command.get("selectionType")
            }]);

            return originalData;
        },

        _restoreCommandAfterExecute: function (/*Object*/command, /*Object*/originalData) {
            // summary:
            //      Stub to do something after execution of the given command object
            // command: [Object]
            //      An instance of "epi/shell/command/_Command"
            // originalData: [Object]
            // tags:
            //      private

            this._restoreCommand(command, originalData);

            if (this._isNormalCommand(command)) {
                this._restoreNormalCommand(command, originalData);

                return;
            }

            // _SelectionCommandMixin
            if (command.isInstanceOf(_SelectionCommandMixin)) {
                this._restoreSelectionCommand(command, originalData);
            }
        },

        _restoreCommand: function (/*Object*/command, /*Object*/originalData) {
            // summary:
            //      Restores the given command to its original states
            // command: [Object]
            //      An instance of "epi/shell/command/_Command"
            // originalData: [Object]
            // tags:
            //      private

            command.set("createAsLocalAsset", originalData.createAsLocalAsset);

            command.isInstanceOf(_ClipboardCommandMixin) && command.watchClipboardChange();
            command.isInstanceOf(_SelectionCommandMixin) && command.watchSelectionChange();
        },

        _restoreNormalCommand: function (/*Object*/command, /*Object*/originalData) {
            // summary:
            //      Restores the given normal command to its original states
            // command: [Object]
            //      An instance of "epi/shell/command/_Command"
            // originalData: [Object]
            // tags:
            //      private

            command.set("model", originalData.model);
        },

        _restoreSelectionCommand: function (/*Object*/command, /*Object*/originalData) {
            // summary:
            //      Restores the given selection command to its original states
            // command: [Object]
            //      An instance of "epi/shell/command/_SelectionCommandMixin"
            // originalData: [Object]
            // tags:
            //      private

            command.selection.set("data", originalData.data);
        },

        _clearContextualCommandHandlers: function () {
            // summary:
            //      Clear all handlers for pseudo contextual content commands
            // tags:
            //      private

            if (this._contextualCommandHandlers instanceof Array && this._contextualCommandHandlers.length > 0) {
                array.forEach(this._contextualCommandHandlers, function (handler) {
                    typeof handler.remove === "function" && handler.remove();
                });
            }

            this._contextualCommandHandlers = [];
        },

        _isNormalCommand: function (/*Object*/command) {
            // summary:
            //      Verifies the given command object is normal command or not
            //      The given command must be an instance of "epi/shell/command/_Command" only
            // command: [Object]
            //      The given object to verifies
            // returns: [Boolean]
            // tags:
            //      private

            return !(command.isInstanceOf(_SelectionCommandMixin) || command.isInstanceOf(_ClipboardCommandMixin));
        },

        _isValidCommand: function (/*Object*/command) {
            // summary:
            //      Verifies the given object is instance of "epi/shell/command/_Command" class or not.
            //      In additional, the given command must have its model.
            // command: [Object]
            //      The given object to verifies
            // returns: [Boolean]
            // tags:
            //      private

            return !!(command && command.isInstanceOf(_Command) && command.model);
        }

    });

});
