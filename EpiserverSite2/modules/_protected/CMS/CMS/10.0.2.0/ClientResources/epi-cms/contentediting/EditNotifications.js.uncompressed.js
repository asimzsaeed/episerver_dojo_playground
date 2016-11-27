define("epi-cms/contentediting/EditNotifications", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented",

    "epi/shell/DestroyableByKey",
    "epi-cms/plugin-area/edit-notifications"
], function (
    declare,
    lang,
    Evented,

    DestroyableByKey,
    editNotifications
) {

    return declare([DestroyableByKey, Evented], {
        // summary:
        //    Watches and handles plugged editing notifications.
        // tags:
        //    internal

        _notificationChangedKey: "_EditingNotificationHandles",
        _notificationsKey: "_notifications",

        _notifications: null,

        postscript: function () {
            this.inherited(arguments);

            this.own(editNotifications.on("added, removed", this._watchNotifications.bind(this)));

            this._watchNotifications();
        },

        update: function (contentData, context) {
            // summary:
            //      Updates all notifications with current content data and context.
            // tags:
            //    public

            this._notifications.forEach(function (notification) {
                notification.set("value", {contentData: contentData, context: context});
            });
        },

        suspend: function () {
            // summary:
            //      Suspends all notifications
            // tags:
            //    public

            this._notifications.forEach(function (notification) {
                notification.set("isSuspended", true);
            });
        },

        wakeUp: function () {
            // summary:
            //      Wakes all notifications up.
            // tags:
            //    public

            this._notifications.forEach(function (notification) {
                notification.set("isSuspended", false);
            });
        },

        _watchNotifications: function () {
            // summary:
            //      Updates notifications when notifications are added or removed
            // tags:
            //      private

            this.destroyByKey(this._notificationsKey);
            this._notifications = editNotifications.get().map(function (notification) {
                this.ownByKey(this._notificationsKey, notification);
                return notification;
            }, this);



            this.destroyByKey(this._notificationChangedKey);
            this._notifications.forEach(function (notification) {
                this.ownByKey(
                    this._notificationChangedKey,
                    notification.watch("notification", function (name, oldValue, newValue) {
                        this.emit("changed", {
                            notification: notification,
                            oldValue: oldValue,
                            newValue: newValue
                        });
                    }.bind(this))
                );
            }, this);
        }
    });
});
