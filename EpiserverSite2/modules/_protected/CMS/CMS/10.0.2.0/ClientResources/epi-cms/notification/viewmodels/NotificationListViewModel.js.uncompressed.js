define("epi-cms/notification/viewmodels/NotificationListViewModel", [
// dojo
    "dojo/_base/declare",
    "dojo/Evented",
    "dojo/Stateful",
    "dojo/topic",
    "dojo/when",

// dijit
    "dijit/Destroyable",

// epi
    "epi/dependency",

// Commands
    "../command/MarkNotificationAsRead",
    "../command/MarkAllNotificationsAsRead"
], function (
// dojo
    declare,
    Evented,
    Stateful,
    topic,
    when,

// dijit
    Destroyable,

// epi
    dependency,

// Commands
    MarkNotificationAsRead,
    MarkAllNotificationsAsRead
) {
    return declare([Stateful, Evented, Destroyable], {
        // summary:
        //      The view model for the epi-cms/notification/NotificationList
        // tags:
        //      internal

        // store: [public]
        //      A store for interacting with notification
        store: null,

        // service: [public]
        //      A service for interacting with notification
        service: null,

        // query: [public] Object
        query: null,

        // queryOptions: [public] Object
        queryOptions: null,

        // commands: [public] epi/shell/command/_Command[]
        //      Commands to be consumed by the view.
        commands: null,

        // selectedNotification: [public] Object
        //      The currently selected notification
        selectedNotification: null,

        postscript: function () {

            this.inherited(arguments);

            this.queryOptions = this.queryOptions || { sort: [{ attribute: "posted", descending: true }] };
            this.store = this.store || dependency.resolve("epi.storeregistry").get("epi.cms.notification");
            this.service = this.service || dependency.resolve("epi.cms.NotificationService");
            this.query = this.query || {};

            this._createCommands();
        },

        initialize: function () {
            // summary:
            //      Makes necessary preparations so that the view model can start operating
            // returns: Promise
            //
            // tags:
            //      public

            return when(null);
        },

        readSelectedNotification: function () {
            // summary:
            //      Change to the notification context after we have marked the notification as read
            // tags:
            //      public

            this.markSelectedNotificationAsRead();
            this.gotoSelectedNotificationOrigin();
        },

        getCommands: function () {
            // summary:
            //      Returns all available commands
            // tags:
            //      public

            return this.commands;
        },

        gotoSelectedNotificationOrigin: function () {
            // summary:
            //      Changes context to the selected notification context uri
            // tags:
            //      public

            if (!this.selectedNotification || !this.selectedNotification.link) {
                return;
            }

            var contextUri = this.selectedNotification.link;

            topic.publish("/epi/shell/context/request",  { uri: contextUri }, { sender: this });
        },

        markSelectedNotificationAsRead: function () {
            // summary:
            //      Mark selected notification as read
            // tags:
            //      public

            if (!this.selectedNotification) {
                return;
            }

            this.service.markAsRead(this.selectedNotification.id)
                .then(this.set.bind(this, "selectedNotification"));
        },

        markAllAsRead: function () {
            // summary:
            //      Mark all user notifications as read
            // tags:
            //      public

            this.service.markAllAsRead()
                .then(this.emit.bind(this, "notification-allread", {}));
        },

        _createCommands: function () {
            var commands = [
                new MarkNotificationAsRead({ model: this, order: 10 }),
                new MarkAllNotificationsAsRead({ model: this })
            ];

            this.own.apply(this, commands);

            this.set({
                commands: commands
            });
        }
    });
});
