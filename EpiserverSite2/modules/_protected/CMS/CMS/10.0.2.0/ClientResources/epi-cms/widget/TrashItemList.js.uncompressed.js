require({cache:{
'url:epi-cms/widget/templates/TrashItemList.html':"﻿<div>\r\n    <div class=\"epi-trashHeader clearfix\">\r\n        <div class=\"epi-gadgetInnerToolbar\" data-dojo-attach-point=\"searchBoxContainer\">\r\n            <div data-dojo-type=\"epi/shell/widget/SearchBox\" data-dojo-attach-point=\"searchBox\"></div>\r\n        </div>\r\n        <span class=\"epi-removedByContainer\">\r\n            <label for=\"removedBy_${id}\">${resources.removedby}</label>\r\n            <select data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"removedBy\" id=\"removedBy_${id}\" data-dojo-attach-event='onChange: _onDeletedByChange'>\r\n            </select>\r\n        </span>\r\n    </div>\r\n    <div data-dojo-attach-point=\"gridContainerNode\"></div>\r\n</div>"}});
﻿define("epi-cms/widget/TrashItemList", [
// Dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/window",

    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-style",

    "dojo/aspect",
    "dojo/keys",
    "dojo/Evented",
    "dojo/query",
    "dojo/html",
    "dojo/Stateful",
    "dojo/string",
    "dojo/when",
// Dijit
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/Select",

// Dojox
    "dojox/widget/Standby",

// DGrid
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dgrid/Keyboard",
    "dgrid/tree",
    "dgrid/extensions/ColumnResizer",
    "dgrid/util/mouse",
    "put-selector/put",

// EPi
    "epi",
    "epi/dependency",
    "epi/shell/dgrid/Formatter",
    "epi/shell/dgrid/util/misc",
    "epi/shell/TypeDescriptorManager",
    "epi/shell/widget/SearchBox",
    "epi/shell/widget/_ModelBindingMixin",
    "epi/datetime",
    "epi/username",

// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.components.trash",
    "dojo/text!./templates/TrashItemList.html"
],

function (
// Dojo
    array,
    declare,
    lang,
    window,

    domClass,
    domConstruct,
    domGeometry,
    domStyle,

    aspect,
    keys,
    Evented,
    query,
    html,
    Stateful,
    string,
    when,
// Dijit
    _Widget,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Select,

// Dojox
    Standby,

// DGrid
    OnDemandGrid,
    DgridSelection,
    Keyboard,
    Tree,
    ColumnResizer,
    MouseUtil,
    put,

// EPi
    epi,
    dependency,
    Formatter,
    GridMiscUtil,
    TypeDescriptorManager,
    SearchBox,
    _ModelBindingMixin,
    epiDate,
    username,

// Resources
    resources,
    template
) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Evented, Stateful, _ModelBindingMixin], {
        // summary:
        //      A widget to display content in trash for a specific trash.
        //
        // tags:
        //      internal

        resources: resources,

        epi: epi,

        templateString: template,

        _grid: null,

        _observers: {},

        _setQueryOptionsAttr: function (queryOptions) {
            this._set("queryOptions", queryOptions);
            this._initialize();
        },

        updateRemovedBy: function (queryOptions) {
            // summary:
            //      Update user list in Removed by selector.
            // tags:
            //      protected

            var currentTrash = this.model.get("currentTrash");

            // Update when empty trash
            if (this.model.isEmptyTrash) {
                this.bindDefaultUserSelector();
                return;
            }

            var results = this.store.query({ referenceId: queryOptions.query.referenceId, query: "getblockrootchildren"});

            // Listen when store observe query to rebind user selector and update trashes.
            var listener = lang.hitch(this, function (item, removedFrom, insertedInto) {
                var providerName = currentTrash.isDefaultProvider ? "" : currentTrash.name;

                when(this.model.trashStore.query({ providerName: providerName }), lang.hitch(this, function (trash) {
                    if (trash) {
                        var deletedByUsers = trash.deletedByUsers;

                        // Update property of current trash
                        currentTrash.deletedByUsers = deletedByUsers;

                        // Rebind user selector
                        this.bindUserSelector(deletedByUsers);
                    }
                }));
            });
            var id = currentTrash.name,
                observer = this._observers[id];

            if (observer) {
                observer.cancel();
                delete this._observers[id];
            }

            // Observe the query result to update the parent node when have changes.
            this._observers[id] = results.observe(listener, true);
        },

        destroy: function () {
            // summary:
            //      Destroy the object.
            for (var id in this._observers) {
                this._observers[id].cancel();
                delete this._observers[id];
            }

            if (this._standby) {
                this._standby.destroyRecursive();
                this._standby = null;
            }

            if (this._grid) {
                this._grid.destroy();
                this._grid = null;
            }

            this.inherited(arguments);
        },

        clearSelection: function () {
            this._grid.clearSelection();
            // NOTE:
            // It is necessary to set the _lastSelected to null due a bug on the dgrid where
            // after deselecting a row it cannot be selected again. If the _lastSelected isn't
            // "clear", it will assume that the same row is selected and it will not apply all
            // styling (highlighted selected classes).
            // The bug report can be found here: https://github.com/SitePen/dgrid/issues/295
            this._grid._lastSelected = null;
        },

        postCreate: function () {
            this.inherited(arguments);

            this.bindUserSelector(this.model.get("currentTrash").deletedByUsers);

            this.searchBox.encodeSearchText = true;
            this.searchBox.on("searchBoxChange", lang.hitch(this, function (queryText) {
                this.emit("searchBoxChange", queryText);
            }));

            // Sets the "selected" class on the item for styling purposes
            // Overrides this function from "dijit/form/_FormSelectWidget" to setable blank value menu item to selected
            this.removedBy._updateSelection = function () {
                this._set("value", this._getValueFromOpts());
                var val = this.value;
                if (!lang.isArray(val)) {
                    val = [val];
                }

                array.forEach(this._getChildren(), function (child) {
                    var isSelected = array.some(val, function (v) {
                        return child.option && (v === child.option.value);
                    });
                    domClass.toggle(child.domNode, this.baseClass + "SelectedOption", isSelected);
                    child.domNode.setAttribute("aria-selected", isSelected);
                }, this);
            };
        },

        resize: function () {
            // summary:
            //      Resize this widget to the given dimensions.
            // tags:
            //      protected

            // make the grid 100% height
            if (this._grid) {
                var top = domGeometry.position(this._grid.domNode).y;
                var bodyHeight = domGeometry.position(window.body()).h;
                domStyle.set(this._grid.domNode, "height", (bodyHeight - top) + "px");
            }
        },

        _initialize: function () {
            // Enable/Disable search box by content provider search capability
            this.searchBox.set("disabled", !this.queryOptions.query.isSearchable);

            if (!this._grid) {
                this._grid = this._createGrid(this.store, this.queryOptions);
                domConstruct.place(this._grid.domNode, this.gridContainerNode);
            } else { // update _grid's store and query instead of creating new instance
                this._showStandby(true);
                if (this.queryOptions) {
                    this._grid.set("queryOptions", this.queryOptions.options);
                    this._grid.set("query", this.queryOptions.query);
                }
            }
            this.resize(); // grid data changed, so we need to update its height
        },

        bindDefaultUserSelector: function () {
            // summary:
            //      Bind default [Any] value to selection.
            // tags:
            //      protected

            // Turn off change notifications while we make all these changes
            this.removedBy._onChangeActive = false;

            this.removedBy.removeOption(this.removedBy.options);
            this.removedBy.addOption({ label: epi.resources.text.anyone, value: "" });

            // Turn on change notifications when we made all these changes
            this.removedBy._onChangeActive = true;
        },

        bindUserSelector: function (userList) {
            // summary:
            //      Bind waste basket users to selection.
            // tags:
            //      protected

            if (userList) {
                // Get current selected item.
                var currentSelected = this.removedBy.get("value");

                this.bindDefaultUserSelector();

                // Turn off change notifications while we make all these changes
                this.removedBy._onChangeActive = false;
                array.forEach(userList, function (userName) {
                    this.removedBy.addOption({ label: this._createUserFriendlyUsername(userName), value: userName });
                }, this);

                // Reset current value for RemovedBy
                this.removedBy.set("value", currentSelected);

                // Turn on change notifications when we made all these changes
                this.removedBy._onChangeActive = true;
            }
        },

        _createGrid: function (store, queryOptions) {
            // summary:
            //      Creates and returns grid for displaying content.
            // tags:
            //      private

            var gridClass = declare([OnDemandGrid, DgridSelection, Keyboard, Formatter, ColumnResizer]);
            var grid = new gridClass({
                store: store,
                columns: {
                    name: Tree({
                        field: "name",
                        label: epi.resources.header.name,
                        renderCell: lang.hitch(this, this._renderTreeNode)
                    }),
                    removedOn: {
                        field: "deleted",
                        label: epi.resources.header.removed,
                        formatters: [this._localizeDate, GridMiscUtil.ellipsis]
                    },
                    by: {
                        field: "deletedBy",
                        label: epi.resources.header.by,
                        formatters: [this._createUserFriendlyUsername, GridMiscUtil.ellipsis]
                    },
                    action: { // Restore menu
                        label: " ",
                        formatter: this._renderActionMenu,
                        sortable: false
                    }
                },
                minWidth: 100,
                noDataMessage: this._getNoDataMessage(),
                selectionMode: "single"

            });

            this._standby = new Standby({ target: grid.domNode, color: "#fff" }).placeAt(document.body);
            this._standby.startup();

            this.own(
                aspect.after(grid, "expand", function (target) {
                    var row = target.element ? target : grid.row(target),
                        container = query(row.element).parent()[0];

                    // In firefox, at the first time of expand in grid tree, container's height always smaller than its child.
                    // So that, on the first click to expand a node, nothing happenned.
                    // Clear container's height in order to make container take auto height in this case.
                    if (container) {
                        domStyle.set(container, "height", "");
                    }
                }, true)
            );

            aspect.after(grid, "_processScroll", lang.hitch(this, function () {
                this._showStandby(false);
            }));

            this._showStandby(true);

            // small hack here to remove noDataMessage when store has been notified that new content has been moved to Trash.
            // This should have been implemented in dgrid/List
            // TODO consider a better fix?
            aspect.before(grid, "adjustRowIndices", function (firstRow) {
                if (firstRow) {
                    array.forEach(query("div.dgrid-no-data", this.contentNode), function (div) {
                        html.set(div, "");
                    });
                }
            });

            aspect.around(grid, "insertRow", lang.hitch(this, this._aroundInsertRow));

            // Don't show collap/expand icon when searching
            aspect.before(grid, "renderArray", lang.hitch(this, function (results, beforeNode, options) {
                var querySearch = this.queryOptions.query;
                if (querySearch && querySearch.query === "searchdeletedcontent") {
                    results.map(function (object) {
                        if (object) {
                            object.hasChildren = false;
                        }
                    });
                }
            }));


            if (queryOptions) {
                grid.set("queryOptions", queryOptions.options);
                grid.set("query", queryOptions.query);
            }

            var mouseOverClass = "epi-dgrid-mouseover";
            grid.on(MouseUtil.enterRow, function (evt) {
                domClass.add(this, mouseOverClass); // add mouse over css class when hover a row
            });
            grid.on(MouseUtil.leaveRow, function (evt) {
                domClass.remove(this, mouseOverClass); // remove mouse over css class
            });

            grid.on(".epi-gridAction:click", lang.hitch(this, function (evt) { // on restore action clicking
                var row = grid.row(evt);
                this.emit("itemClick", row);
            }));

            // Handle ENTER key event for the grid action cell
            grid.on(".dgrid-column-action:keydown", lang.hitch(this, function (e) {
                if (e.keyCode === keys.ENTER && !e.shiftKey && !e.altKey && !e.ctrlKey) {
                    var row = grid.row(e);
                    this.emit("itemClick", row);
                }
            }));

            return grid;
        },

        _renderTreeNode: function (object, data, td, options) {
            if (object && object.thumbnailUrl) {
                var image = domConstruct.create("img", {
                    src: object.thumbnailUrl + string.substitute("?${0}", [new Date().getTime()]),
                    "class": "epi-thumbnail"
                }, td);
                domConstruct.place(GridMiscUtil.ellipsis(GridMiscUtil.htmlEncode(data)), td);
            } else {
                var iconNodeClass = TypeDescriptorManager.getValue(object.typeIdentifier, "iconClass") || "epi-iconObjectPage";
                domConstruct.place(GridMiscUtil.icon(iconNodeClass + " epi-objectIcon", GridMiscUtil.ellipsis(GridMiscUtil.htmlEncode(data))), td);
            }
        },

        _renderActionMenu: function (value) {
            // summary:
            //      Returns HTML string, represents the action menu.
            // tags:
            //      private

            var data = {
                title: resources.restore.tooltip,
                label: resources.restore.label
            };

            return lang.replace("<a class=\"epi-gridAction epi-visibleLink\" title=\"{title}\">{label}</a>", data);
        },

        _localizeDate: function (value) {
            // summary:
            //      Returns localized, friendly date as string.
            // tags:
            //      private
            return epiDate.toUserFriendlyString(value);
        },

        _createUserFriendlyUsername: function (name) {
            // summary:
            //      Returns friendly user name as string.
            // tags:
            //      private
            return username.toUserFriendlyString(GridMiscUtil.htmlEncode(name));
        },

        _onDeletedByChange: function (newValue) {
            // summary:
            //      Callback when DeletedBy value is changed.
            // tags:
            //      private

            // When empty trash, don't need fire change event to avoid duplicate message.
            if (this.model.isEmptyTrash) {
                this.model.isEmptyTrash = false;
                return;
            }

            this.emit("deletedByChange", newValue);
        },

        _showStandby: function (visible) {
            // summary:
            //      Set standby visibility.
            // tags:
            //      private

            if (!this._standby) {
                return;
            }
            if (visible) {
                if (!this._standby.isVisible()) {
                    this._standby.show();
                }
            } else {
                this._standby.hide();
            }
        },

        _getNoDataMessage: function () {
            // summary:
            //      Get message in case have no data.
            // tags:
            //      private

            return "<span><span class=\"dijitReset dijitInline\">" + resources.trashitemempty + "</span></span>";
        },

        _aroundInsertRow: function (original) {
            // summary:
            //      Called 'around' the insertRow method to add more class for current row.
            // tags:
            //      protected

            return lang.hitch(this, function (object, parent, beforeNode, i, options) {

                // Call original method
                var row = original.apply(this._grid, arguments);

                if (object && object.thumbnailUrl) {
                    domClass.add(row, "epi-mediaContent");
                }

                return row;
            });
        }

    });

});
