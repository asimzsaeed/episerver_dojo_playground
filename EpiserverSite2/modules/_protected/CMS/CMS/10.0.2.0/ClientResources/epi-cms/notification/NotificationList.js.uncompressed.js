require({cache:{
'url:epi-cms/notification/templates/NotificationList.html':"<div class=\"epi-notification-list epi-menu--inverted\">\n    <div class=\"epi-menuInverted epi-invertedTooltip\">\n        <div class=\"epi-tooltipDialogTop\">\n            <span data-dojo-attach-point=\"headerNode\">${res.header}</span>\n            <div class=\"dijitTooltipConnector\"></div>\n        </div>\n        <div data-dojo-type=\"dijit/Toolbar\"\n             data-dojo-attach-point=\"toolbar\"\n             class=\"epi-flatToolbar\">\n            <div data-dojo-attach-point=\"toolbarGroupNode\" class=\"epi-floatRight\"></div>\n        </div>\n        <div data-dojo-attach-point=\"listNode\"></div>\n    </div>\n</div>\n"}});
define("epi-cms/notification/NotificationList", [
    "dojo/_base/connect",
    "dojo/_base/declare",
    "dojo/keys",
    "dojo/on",
    "./viewmodels/NotificationListViewModel",
    "./notificationFormatter",

    // Resources
    "dojo/text!./templates/NotificationList.html",
    "epi/i18n!epi/cms/nls/episerver.cms.notification.list",

    // Grid
    "dgrid/OnDemandList",
    "dgrid/Keyboard",
    "dgrid/Selection",

    "epi/shell/dgrid/Focusable",
    "epi/shell/dgrid/Formatter",
    "epi-cms/dgrid/WithContextMenu",

    // Epi
    "epi-cms/ApplicationSettings",
    "epi/shell/command/builder/ButtonBuilder",
    "epi/shell/command/builder/MenuAssembler",

    // Parent class and mixins
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    // Widgets in template
    "dijit/Toolbar"
], function (
    connect,
    declare,
    keys,
    on,
    NotificationListViewModel,
    formatter,

    // Resources
    template,
    res,

    // Grid
    OnDemandList,
    Keyboard,
    Selection,
    Focusable,
    Formatter,
    WithContextMenu,

    // EPi
    ApplicationSettings,
    ButtonBuilder,
    MenuAssembler,

    // Parent class and mixins
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin
) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      UI notifications list
        //
        // tags:
        //      internal

        // templateString: [protected] String
        //      A string that represents the widget template.
        templateString: template,

        _listClass: declare([OnDemandList, Formatter, Selection, Keyboard, WithContextMenu, Focusable]),

        _list: null,

        res: res,

        postMixInProperties: function () {

            this.inherited(arguments);

            // Set the current content language on the formatter
            formatter.contentLanguage = ApplicationSettings.currentContentLanguage;

            if (!this.model) {
                this.own(
                    this.model = new NotificationListViewModel()
                );
            }
        },

        buildRendering: function () {

            this.inherited(arguments);

            this._setupToolbar();
            this._setupList();
        },

        startup: function () {

            if (this._started) {
                return;
            }
            this.inherited(arguments);

            this.model.initialize().then(function () {
                this._list.startup();
                this._list.set("store", this.model.store, this.model.query, this.model.queryOptions);
                this.own(
                    on(this.model, "notification-allread", this._list.refresh.bind(this._list)),
                    on(this.domNode, connect._keypress, this._onKeypress.bind(this))
                );
                this.emit("loaded");
            }.bind(this));
        },

        focus: function () {
            // summary:
            //      Set focus to the project item list.
            // tags:
            //      public

            var position;

            if (this._list) {
                position = this._list.getScrollPosition();
                this._list.focus();
                this._list.scrollTo(position);
            }
        },

        layout: function () {
            // summary:
            //      Resize the version selector and its children.
            // tags:
            //      public

            this.inherited(arguments);

            this._list.resize();
        },

        _setupList: function () {
            // summary:
            //      Creates the actual notification list and hooks up
            //      the event handlers.
            // tags:
            //      private

            var actionHandler = this._readNotification.bind(this);

            // We stop the propagation on contextMenu clicks so as not to trigger the dgrid-row click event
            this._list = new this._listClass({
                className: "epi-notification-list__item-list epi-card-list epi-grid-max-height--300",
                cleanEmptyObservers: false,
                commandCategory: "itemContext",
                deselectOnRefresh: false,
                formatters: formatter.card,
                keepScrollPosition: true,
                noDataMessage: res.nodatamessage,
                stopPropagation: true,
                sort: this.model.queryOptions && this.model.queryOptions.sort
            }, this.listNode);

            this._list.contextMenu.addProvider(this.model);

            // Own the list and the event handlers.
            this.own(
                this._list,
                this._list.on("dgrid-select", this._selected.bind(this)),
                this._list.on(".dgrid-row:click", actionHandler),
                this._list.addKeyHandler(keys.ENTER, actionHandler),
                on.once(this._list, "dgrid-refresh-complete", this.focus.bind(this))
            );
        },

        _readNotification: function () {
            // summary:
            //
            // tags:
            //      private

            this.model.readSelectedNotification();
            this.emit("change", {});
        },

        _selected: function (e) {
            // summary:
            //      Handles the selected notification in the list.
            // tags:
            //      private
            var value = e && e.rows && e.rows[0].data;

            // We set the selectedNotification in the model in order to expose it to the commands in the contextmenu
            this.model.set("selectedNotification", value);
        },

        _setupToolbar: function () {
            // summary:
            //      Sets up notifications toolbar.
            // tags:
            //      private

            var buttonBuilder = new ButtonBuilder({
                settings: {
                    "class": "epi-chromeless epi-visibleLink"
                }
            });

            var configuration = [{
                builder: buttonBuilder,
                category: "toolbarContext",
                target: this.toolbarGroupNode
            }];

            this.own(
                new MenuAssembler({
                    configuration: configuration,
                    commandSource: this.model
                })
            );
        },

        _onKeypress: function (/*Event*/ e) {
            // summary:
            //		Handle tab keyboard events
            // tags:
            //		private

            if (e.charOrCode !== keys.TAB) {
                return;
            }

            this.toolbar.focused
                ? this._list.focus()
                : this.toolbar.focus();

            e.preventDefault();
            e.stopPropagation();
        }
    });
});
