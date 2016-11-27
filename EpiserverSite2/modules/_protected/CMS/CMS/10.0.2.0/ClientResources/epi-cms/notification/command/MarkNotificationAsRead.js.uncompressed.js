define("epi-cms/notification/command/MarkNotificationAsRead", [
    "dojo/_base/declare",
    "dojo/_base/lang",
// Parent class and mixins
    "epi/shell/command/_Command",
    "dijit/Destroyable",
// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.notification.command"
],
function (
    declare,
    lang,
// Parent class and mixins
    _Command,
    Destroyable,
// Resources
    res
) {
    return declare([_Command, Destroyable], {
        // summary:
        //      A command for marking notification as read.
        // tags:
        //      internal

        // category: [readonly] String
        //      A category which provides a hint about how the command could be displayed.
        category: "itemContext",

        // label: [public] String
        //      The action text of the command to be used in visual elements.
        label: res.markasread,

        // canExecute: [public] Boolean
        //      Flag which indicates whether this command is able to be executed.
        canExecute: false,

        // modelPropertyToWatch: [public] String
        //      Property to watch on the model.
        modelPropertyToWatch: "selectedNotification",

        _execute: function () {
            // summary:
            //      Executes this command assuming canExecute has been checked.
            // tags:
            //      protected

            return this.model.markSelectedNotificationAsRead();
        },

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
            //      private

            var notification = this.model.selectedNotification;
            var canExecute = !!notification && !notification.hasRead;
            this.set("canExecute", canExecute);
        }

    });
});
