(function ($, epi) {
    $.widget("ui.epiTinyMCESettings", {
        /// <summary>
        ///     epiTinyMCESettings widget.
        ///     Used to display the tinyMCE settings in admin mode.
        ///     Depends: ui.core.js, ui.sortable.js
        /// </summary>
        _init: function () {
            /// <summary>
            ///     epiTinyMCESettings widget initialization
            /// </summary>
            var options = this.options,
            self = this,

            addSelector = options.addRowButtonSelector;
            delSelector = options.delRowButtonSelector;
            clearSelector = options.clearButtonSelector;

            this._refresh();

            if (addSelector !== "") {
                $(addSelector).click(function (e) {
                    self._addRow(e);
                });
            }
            if (delSelector !== "") {
                $(delSelector).click(function (e) {
                    self._removeRow(e);
                });
            }
            if (clearSelector !== "") {
                $(clearSelector).click(function (e) {
                    self._clearRows(e);
                });
            }
            this._buttonEnableDisable();

        },
        getRowsAsString: function () {
            /// <summary>
            ///     Convert the sorted objects to a string with separators used to split rows/buttons.
            /// </summary>
            var options = this.options;
            var lists = $(this.options.sortableSelector).sortable('asArray');
            var returnstring = "", innerstring;

            lists.each(function () {
                if ($(this).hasClass(options.activeRowsClass)) {
                    innerstring = "";
                    $(this).children().each(function () {
                        innerstring += $(this).attr("id") + options.buttonSeparator;
                    });
                    innerstring = innerstring.substr(0, innerstring.length - options.buttonSeparator.length); // Remove the trailing ,
                    returnstring += innerstring + options.rowSeparator;
                }
            });
            returnstring = returnstring.substr(0, returnstring.length - options.rowSeparator.length); // Remove the trailing ##
            return returnstring;
        },
        disable: function () {
            /// <summary>
            ///     Disable the sortable functionality.
            /// </summary>
            var options = this.options;
            var addSelector = options.addRowButtonSelector;
            var delSelector = options.delRowButtonSelector;
            var clearSelector = options.clearButtonSelector;

            $(options.sortableSelector).sortable('disable');
            if (addSelector !== "") {
                $(addSelector).unbind('click');
                $(addSelector).hide();
            }
            if (delSelector !== "") {
                $(delSelector).unbind('click');
                $(delSelector).hide();
            }
            if (clearSelector !== "") {
                $(clearSelector).unbind('click');
                $(clearSelector).hide();
            }

            $(options.inactiveTableSelector).hide();
            $(options.inactiveToolsHeadingSelector).hide();
            $(options.buttonContainerSelector).hide();

        },
        enable: function () {
            /// <summary>
            ///     Enable the sortable functionality.
            /// </summary>
            var self = this;
            var options = self.options;

            $(options.sortableSelector).sortable('enable');

            var addSelector = options.addRowButtonSelector;
            var delSelector = options.delRowButtonSelector;
            var clearSelector = options.clearButtonSelector;

            if (addSelector !== "") {
                $(addSelector).click(function (e) {
                    self._addRow(e);
                });
                $(addSelector).show();
            }
            if (delSelector !== "") {
                $(delSelector).click(function (e) {
                    self._removeRow(e);
                });
                $(delSelector).show();
            }
            if (clearSelector !== "") {
                $(clearSelector).click(function (e) {
                    self._clearRows(e);
                });
                $(clearSelector).show();
            }

            $(options.inactiveTableSelector).show();
            $(options.inactiveToolsHeadingSelector).show();
            $(options.buttonContainerSelector).show();
        },
        _buttonEnableDisable: function () {
            /// <summary>
            ///     Function that enables and disables Add/remove row depending on criteria of number of current rows.
            ///     Also enables/disables Clear Rows button depending on if there are any tools in any row.
            /// </summary>
            var options = this.options,
                activeSelector = "ul." + options.activeRowsClass,
                activeLists = $(activeSelector),
                activeListslength = activeLists.length,
                addSelector = options.addRowButtonSelector,
                delSelector = options.delRowButtonSelector;

            if (activeListslength < 2) {
                if (delSelector !== "") {
                    $(delSelector).attr("disabled", "disabled");
                }
            } else {
                if (delSelector !== "") {
                    $(delSelector).removeAttr("disabled");
                }
            }

            if (activeListslength > 9) {
                if (addSelector !== "") {
                    $(addSelector).attr("disabled", "disabled");
                }
            } else {
                if (addSelector !== "") {
                    $(addSelector).removeAttr("disabled");
                }
            }

            this._buttonClearRowEnableDisable();
        },

        _buttonClearRowEnableDisable: function () {
            /// <summary>
            ///     Function that enables and disables Clear Rows button depending on if there are any tools in any row.
            /// </summary>
            var o = this.options,
                clearSelector = o.clearButtonSelector;

            if (clearSelector !== "") {
                var toolsInLists = false;
                $("ul." + o.activeRowsClass).each(function (i) {
                    if ($(this).children().length) {
                        toolsInLists = true;
                    }
                });

                if (toolsInLists) {
                    $(clearSelector).removeAttr("disabled");
                } else {
                    $(clearSelector).attr("disabled", "disabled");
                }
            }
        },

        _onReceive: function (e, ui) {
            /// <summary>
            ///     Event that fires when a sortable container receives an item. (When an item is moved from one list to another. Not when moved within a list)
            /// </summary>
            /// <param name="e" type="Event">
            ///     The jQuery event object
            /// </param>
            /// <param name="ui" type="Object">
            ///     A jQuery ui Object that contains information like target, wich item is beeng dragged, helper...
            /// </param>
            var item;
            var options = this.options;

            if (ui.item.children().eq(0).hasClass(options.cloneableClass) && (ui.sender.attr("class") !== ui.item.parent().attr("class"))) {
                //if we are moving a locked item from the master container we add a clone back to the master container.
                //else if we are moving a locked item back to the master container that item is removed (so we dont get duplicate items in master container)
                if (ui.sender.hasClass(options.inactiveRowsClass)) {
                    item = ui.item;
                    ui.sender.prepend(item.clone().show());
                    this._sortList(ui.sender);
                } else {
                    ui.item.remove();
                }
            }

            this._buttonClearRowEnableDisable();

        },
        _onSortStop: function (e, ui) {
            /// <summary>
            ///     Event that fires when a sortable container stops the sort of an item. (When an item changes position)
            /// </summary>
            /// <param name="e" type="Event">
            ///     The jQuery event object
            /// </param>
            /// <param name="ui" type="Object">
            ///     A jQuery ui Object that contains information like target, wich item is beeng dragged, helper...
            /// </param>
            if (ui.item.parent().hasClass(this.options.inactiveRowsClass)) {
                var pluginId = ui.item.attr("id"),
                        pluginIdArray = pluginId.split(this.options.pluginSeparator),
                        groupSelector = "#" + pluginIdArray[2],
                        groupList = $(groupSelector);

                groupList.append(ui.item.show());
                this._sortList(groupList);
            }
            this._trigger("receive", null, {});
        },
        _sortList: function (list) {
            /// <summary>
            ///     Function to sort a list of buttons in tinyMCESettings
            /// </summary>
            /// <param name="list" type="jQuery">
            ///     A jQuery object representing the list to sort.
            /// </param>
            var i, sorted, lowest,
                asSortedArray = [],
                self = this,
                options = self.options;

            list.children().each(function (i) {
                lowest = self._getFirst(list);
                asSortedArray[i] = lowest;
                lowest.remove();
            });
            for (i in asSortedArray) {
                list.append(asSortedArray[i]);
            }
        },
        _getFirst: function (list) {
            /// <summary>
            ///     Function to to get the item in the list with the lowest sortindex.
            /// </summary>
            /// <param name="list" type="jQuery">
            ///     A jQuery object representing the list to ge tthe listitem from.
            /// </param>
            var i, currentIndex, currentObj,
                options = this.options,
                lowestInt = parseInt((list.children().eq(0).attr("id")).split(options.pluginSeparator)[3], 10),
                lowestObj = list.eq(0);

            list.children().each(function (i) {
                currentIndex = parseInt(($(this).attr("id")).split(options.pluginSeparator)[3], 10);
                if (lowestInt >= currentIndex) {
                    lowestInt = currentIndex;
                    lowestObj = $(this);
                }
            });
            return lowestObj;
        },
        _addRow: function (e) {
            /// <summary>
            ///     Adds a sortable row/object to the collection of sortables. This event only runs if the is a connected add button.
            /// </summary>
            /// <param name="e" type="Event">
            ///     Javascript Event object
            /// </param>
            var activeSelector = "ul." + this.options.activeRowsClass,
                activeLists = $(activeSelector),
                activeListslength = activeLists.length;

            if (activeListslength > 9) {
                return; //If we have filled 10 active lists we dont want to add another
            }
            var lastList = activeLists.eq(activeListslength - 1);

            //Make a copy of the last listand clean it of sub objects.
            var newlist = lastList.clone();
            newlist.children().each(function (i) {
                $(this).remove();
            });
            if (this.options.listsHasContainers) {
                var parent = lastList.parent().clone();
                parent.children().each(function (i) {
                    $(this).remove();
                });
                parent.insertAfter(lastList.parent()).append(newlist);
            } else {
                newlist.insertAfter(lastList);
            }
            this._refresh(newlist);
            this._buttonEnableDisable();
        },
        _removeRow: function (e) {
            /// <summary>
            ///     Removes a sortable row/object to the collection of sortables. This event only runs if the is a connected remove button.
            /// </summary>
            /// <param name="e" type="Event">
            ///     Javascript Event object
            /// </param>
            var pluginId, pluginIdArray, groupSelector, groupList, lastList,
                self = this,
                options = self.options,
                activeLists = $("ul." + options.activeRowsClass),
                activeListslength = activeLists.length;

            if (activeListslength < 2) {
                return; // If we only have 1 active list and 1 inactive we dont want to remove the only active.
            }

            lastList = activeLists.eq(activeListslength - 1);
            if (lastList.children().length > 0) {
                //First show dialog to warn if it is not empty
                if (options.useModalConfirm) {
                    //TODO: When using this epiDialog we need to fix so that localization works on the button.
                    //Do this by instead making the object first and setting buttons[localized string] = function.
                    //This is not done since we at the moment dont ude epiDialog here.
                    //Also some functionality Changes needs to be implemented.
                    //                    $(options.dialogSelector).epiDialog({
                    //                        width: 340,
                    //                        title: options.dialogTitle,
                    //                        buttons: {
                    //                            "Cancel": function() {
                    //                                $(this).epiDialog("close");
                    //                            },
                    //                            "Delete": function() {
                    //                                lastList.children().each(function() {
                    //                                    self._returnButton($(this));
                    //                                }); lastList.remove();

                    //                            }
                    //                        }
                    //                    });
                    //                    $('#dialog').epiDialog('open');
                } else {
                    if (confirm($(options.dialogSelector).html())) {

                        lastList.children().each(function () {
                            self._returnButton($(this));
                        });
                    } else {
                        return;
                    }
                }
            }

            lastList.remove();
            this._buttonEnableDisable();

            this._trigger("receive", null, {});
        },
        _clearRows: function () {
            /// <summary>
            ///     Remove all buttons from all active toolrows. These will be returned to the inactivetools area.
            /// </summary>
            var pluginId, pluginIdArray, groupSelector, groupList,

                self = this,
                options = self.options,
                activeRowsSelector = "ul." + options.activeRowsClass,
                lists = $(activeRowsSelector);

            if (confirm(options.clearWarning)) {
                lists.each(function (i) {
                    $(this).children().each(function (index) {
                        self._returnButton($(this));
                    });
                });
            } else {
                return;
            }

            this._buttonEnableDisable();
            this._trigger("receive", null, {});
        },
        _returnButton: function (plugin) {
            /// <summary>
            ///     Returns the button to correct group and sorts in within the group.
            /// </summary>
            var pluginIdArray, groupSelector, groupList, pluginId;
            pluginId = plugin.attr("id");
            pluginIdArray = pluginId.split(this.options.pluginSeparator);
            groupSelector = "#" + pluginIdArray[2];
            groupList = $(groupSelector);
            if (pluginIdArray[1] !== "separator") {
                groupList.append(plugin.show());
                this._sortList(groupList);
            } else {
                plugin.remove();
            }
        },
        _refresh: function (rowsToRefresh) {
            /// <summary>
            ///     Method to refresh the containers so that they are properly initiated.
            /// </summary>
            var self = this;
            var sortselector = this.options.sortableSelector;
            this.sortableObject = $(sortselector).sortable({
                cursorAt: {top: 3, left: 3},
                connectWith: sortselector
            });

            $(sortselector).disableSelection();

            if (typeof (rowsToRefresh) == "undefined") {
                rowsToRefresh = $(this.options.sortableSelector);
            }

            rowsToRefresh.bind('sortreceive', function (event, ui) {
                //This is for handling the separatorcode. It cannot bind to the sort or sort stop event since it needs the sender info.
                self._onReceive(event, ui);
            });

            rowsToRefresh.bind('sortstop', function (event, ui) {
                //This is for handling sorting the button into the right inactive row and sortindex. It cannot be in the receive function
                //since receive is not trigger when an item is moved within the same row
                self._onSortStop(event, ui);
            });
        }
    });

    $.extend($.ui.epiTinyMCESettings, {
        version: "0.1",
        eventPrefix: "epitinymcesettings",
        getter: "getRowsAsArrays getRowsAsString",
        defaults: {
            defaultAction: "",  // URL for the default view.
            sortableSelector: "", // Selector to choose wich objects to have sortable.
            cloneableClass: "locked", //Class that identifies a locked object that cannot be moved only cloned
            lockedListId: "",
            activeRowsClass: "epi-editorConfig-activeToolsRow",
            inactiveRowsClass: "epi-editorConfig-inactiveTools",
            buttonContainerSelector: ".epi-buttonContainer-small",
            inactiveTableSelector: "#inactiveTable",
            inactiveToolsHeadingSelector: "#inactiveToolsHeading",
            rowSeparator: "##",
            buttonSeparator: ",",
            pluginSeparator: "_",
            addRowButtonSelector: "",
            delRowButtonSelector: "",
            clearButtonSelector: "",
            dialogSelector: "#dialog",
            dialogTitle: "",
            clearWarning: "Default clear warning message!.. Please globalize!",
            useModalConfirm: false
        }
    });
})(epiJQuery, epi);
