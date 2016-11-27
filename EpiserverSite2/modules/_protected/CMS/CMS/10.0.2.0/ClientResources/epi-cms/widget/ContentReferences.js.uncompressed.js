require({cache:{
'url:epi-cms/widget/templates/ContentReferences.html':"﻿<div class=\"epi-contentReferences\">\r\n    <div data-dojo-attach-point=\"contentReferencesNotificationBar\" class=\"epi-notificationBar epi-notificationBarWithBorders epi-notificationBarItem\">\r\n        <div data-dojo-attach-point=\"contentReferencesNotificationNode\" class=\"epi-notificationBarText\" ></div>\r\n    </div>\r\n    <div class=\"epi-captionPanel\" data-dojo-attach-point=\"captionPanelNode\">\r\n        <strong data-dojo-attach-point=\"totalLinksNode\"></strong>\r\n        <div class=\"epi-floatRight\">\r\n            <button class=\"epi-chromelessButton\"\r\n                    data-dojo-type=\"dijit/form/Button\"\r\n                    data-dojo-attach-event=\"onClick:fetchData\"\r\n                    data-dojo-props=\"iconClass:'epi-iconReload'\">${res.buttons.refresh}</button>\r\n        </div>\r\n    </div>\r\n    <div data-dojo-attach-point=\"gridNode\"></div>\r\n</div>\r\n"}});
﻿define("epi-cms/widget/ContentReferences", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/keys",
    "dojo/when",
    //epi
    "epi-cms/dgrid/formatters",
    "epi/shell/TypeDescriptorManager",
    "epi/dependency",
    // Base class and mixins
    "./_GridWidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/Evented",
    // Resources
    "dojo/text!./templates/ContentReferences.html",
    "epi/i18n!epi/cms/nls/episerver.cms.widget.contentreferences",
    // Widgets used in the template
    "dijit/form/Button"
], function (
    declare,
    lang,
    domClass,
    domConstruct,
    domStyle,
    keys,
    when,
    formatters,
    TypeDescriptorManager,
    dependency,
    // Base class and mixins
    _GridWidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Evented,
    // Resources
    template,
    resources
) {

    return declare([_GridWidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
        // tags:
        //      internal

        // widget resources
        res: resources,

        // templateString: String
        //  Template for the widget
        templateString: template,

        storeKeyName: "epi.cms.contentreferences",

        contextChangeEvent: "dblclick",

        // trackActiveItem: [public] Boolean
        //      A flag indicating whether the item matching the current context should be highlight. The default value is false.
        trackActiveItem: false,

        // ignoreVersionWhenComparingLinks: [public] Boolean
        //      A flag indicating whether the version should be ignored when comparing content references.
        ignoreVersionWhenComparingLinks: false,

        _setTotalLinksAttr: { node: "totalLinksNode", type: "innerText" },

        _setNotificationAttr: { node: "contentReferencesNotificationNode", type: "innerText" },

        _setNotificationBarStyleAttr: function (value) {
            // summary:
            //      Sets the color for notification bar. 1 for green, 2 for orange and yellow for everything else
            // tags:
            //      protected
            switch (value) {
                case 1:          // green
                    domClass.add(this.contentReferencesNotificationBar, "epi-statusIndicator epi-statusIndicatorOk");
                    break;
                case 2:      // orange
                    domClass.add(this.contentReferencesNotificationBar, "epi-statusIndicator epi-statusIndicatorWarning");
                    break;
            }
        },

        _setNumberOfReferencesAttr: function (number) {
            // summary:
            //      sets the number of references, and widget notification, styles based on the number.
            // tags:
            //      protected

            var contentData = this.model.contentData,
                hasReferences = number > 0;

            var setNotificationStyleAndMessage = lang.hitch(this, function (resourceKey, styleType) {
                var text = TypeDescriptorManager.getResourceValue(contentData.typeIdentifier, resourceKey);

                this.set("notification", text);
                this.set("notificationBarStyle", styleType);
            });

            if (hasReferences) {
                if (contentData.hasChildren) {
                    setNotificationStyleAndMessage("referenceswithsubcontentwarning", 2);
                } else {
                    setNotificationStyleAndMessage("referenceswarning", 2);
                }
            } else {
                if (contentData.hasChildren) {
                    setNotificationStyleAndMessage("noreferenceswithsubcontentwarning", null);
                } else if (contentData.publicUrl) {
                    setNotificationStyleAndMessage("publicreferencesnote", null);
                } else {
                    setNotificationStyleAndMessage("noreferencesnote", 1);
                }
            }

            // build number of links text
            if (hasReferences) {
                var resourceText = number === 1 ? resources.totallink : resources.totallinks;
                var numberOfLinks = lang.replace(resourceText, [number]);
                this.set("totalLinks", numberOfLinks);
            }

            this._set("numberOfReferences", number);
        },

        _setShowToolbarAttr: function (value) {
            domStyle.set(this.captionPanelNode, "display", value ? "" : "none");
        },

        buildRendering: function () {
            // summary:
            //      Construct the UI for this widget. this.gridNode is initialized as a dGrid.
            // tags:
            //      protected
            var linkTemplate = this._getLinkTemplate();

            var gridSettings = lang.mixin({
                columns: {
                    name: {
                        renderCell: lang.hitch(this, "_renderContentItem")
                    },
                    language: {
                        className: "epi-width10",
                        renderCell: function (obj, language, node) {
                            when(dependency.resolve("epi.shell.Profile").getContentLanguage(), function (profileContentLanguage) {
                                if (language !== profileContentLanguage) {
                                    node.textContent = language;
                                }
                            });

                        }
                    },
                    treePath: {
                        className: "epi-width50",
                        get: function (item) {
                            return item.treePath.join("<span class=\"epi-breadCrumbsSeparator\">&gt;</span>");
                        },
                        ellipsisNoTooltip: true
                    },
                    view: {
                        className: "epi-width10",
                        label: " ",
                        formatter: function () {
                            return linkTemplate;
                        },
                        sortable: false
                    }
                },
                store: this.store,
                query: { id: this.model.contentData.contentLink },
                showHeader: false
            }, this.defaultGridMixin);

            this.inherited(arguments);

            this.grid = new this._gridClass(gridSettings, this.gridNode);

            // Hide the notification box if in show mode.
            domClass.toggle(this.contentReferencesNotificationBar, "dijitHidden", this.model.mode === "show");
        },

        startup: function () {
            this.inherited(arguments);

            // Setup event handling for click on the view link.
            this.grid.on(".dgrid-column-view a:click", lang.hitch(this, "_onChangeContext"));

            // Setup event handling for data fetching and do initial fetch.
            this.grid.on("dgrid-refresh-complete", lang.hitch(this, "_afterDataFetched"));
        },

        fetchData: function () {
            // summary:
            //      Fetches data by setting a query on the grid. A get children query will be performed on the store.
            // tags:
            //      protected

            this.grid.refresh();
        },

        _afterDataFetched: function (e) {
            when(e.results.total, lang.hitch(this, function (total) {
                this.set("numberOfReferences", total);
                this.set("showToolbar", total > 0);
                domStyle.set(this.grid.domNode, "visibility", (total > 0) ? "visible" : "hidden");
            }));
        },

        _onChangeContext: function (e) {
            // summary:
            //      Change the context to the content associated with the given row.
            // tags:
            //      private
            var row = this.grid.row(e),
                newContext = { uri: row.data.uri };

            this._requestNewContext(newContext, { sender: this });

            this.emit("viewReference");
        },

        _getLinkTemplate: function () {
            // summary:
            //      Returns an HTML string representing the view link.
            // tags:
            //      private
            var node = domConstruct.create("a", {
                "class": "epi-visibleLink",
                innerHTML: resources.view.label,
                title: resources.view.tooltip
            });

            return node.outerHTML;
        }
    });
});
