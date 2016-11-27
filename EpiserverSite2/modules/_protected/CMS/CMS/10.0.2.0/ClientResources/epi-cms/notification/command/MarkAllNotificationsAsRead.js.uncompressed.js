define("epi-cms/notification/command/MarkAllNotificationsAsRead", [
    "dojo/_base/declare",
    "epi/shell/command/_Command",

    // Resources
    "epi/i18n!epi/cms/nls/episerver.cms.notification.list"
], function (
    declare,
    Command,

    // Resources
    res
) {
    return declare(Command, {
        // summary:
        //      A command for marking all notifications as read
        // tags:
        //      internal

        // showLabel: [public] Boolean
        //      Flag which indicates if the label should be shown
        showLabel: true,

        // isAvailable: [public] Boolean
        //      Flag which indicates whether this command is available in the current context.
        isAvailable: true,

        // canExecute: [public] Boolean
        //      Flag which indicates whether this command is able to be executed.
        canExecute: true,

        // category: [readonly] String
        //      A category which provides a hint about how the command could be displayed.
        category: "toolbarContext",

        // label: [public] String
        //    The action text of the command to be used in visual elements.
        label: res.markallasread,

        _execute: function () {
            // summary:
            //      Executes this command assuming canExecute has been checked.
            // tags:
            //      protected

            this.model.markAllAsRead();
        }
    });
});
