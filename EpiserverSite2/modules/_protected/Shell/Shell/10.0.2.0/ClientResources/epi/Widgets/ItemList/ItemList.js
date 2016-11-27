(function ($) {

    $.widget("ui.epiItemList", {
        /// <summary>
        ///     epiItemList widget.
        ///     Depends: ui.core.js, pager.js
        /// </summary>
        _init: function () {
            /// <summary>
            ///     epiItemList widget initialization
            /// </summary>
            var self = this;

            var options = this.options;

            var list = (this.list = this.element)
                .attr("role", "select")
                .addClass(options.listClass);

            var item, contentDiv, toolbar, content;

            this._listItems = [];

            this._selectedIndex = -1;

            list.children()
                .each(function (i) {
                    $(this).addClass(options.listItemClass);
                    content = $(this).html();
                    $(this).html("");
                    item = self._createListItem().addClass(options.listItemContentClass);
                    if (i === 0) {
                        item.attr("tabindex", "0");
                    }
                    toolbar = $('<div/>').epiToolbar({ buttons: options.buttons });
                    item.append(content)
                        .append(toolbar);
                    $(this).append(item);
                    self._listItems[self._listItems.length] = item;
                });

            if (options.paging) {
                this._createPager(options.pages, options.currentPage);
            }
        },

        addItem: function (content) {
            /// <summary>
            ///     Add a new listItem to the list
            /// </summary>
            /// <param name="content" type="jQuery or html">
            ///     The content that should be appended to the new listItem
            /// </param>
            /// <param name="element" type="Boolean">
            ///    Tells if it is the first object in the list. (If we are to give initial focus if no selected element exsists.
            /// </param>
            var self = this;
            var options = this.options;
            var isFirst = (this.list.children().length === 0);

            var toolbar = $('<div/>').epiToolbar({ buttons: options.buttons });
            var item = this._createListItem().append(content).append(toolbar);
            var listItem = $("<li/>").addClass(options.listItemClass).append(item);

            this._listItems[this._listItems.length] = item;

            this.list.append(listItem);

            return this;
        },

        changePagerDisplay: function (page, keepFocus) {
            /// <summary>
            ///     Changes which item that is selected. Delegates to the goToPage method on the pager.
            ///     Note, will only update the look of the pager, not the content of the list.
            ///     Throws pagerpagechanged event.
            /// </summary>
            /// <param name="page" type="Integer">
            ///     The index of the page to move to.
            /// </param>
            /// <param name="keepFocus" type="jQuery">
            ///     An object to keep focus on after selecting the page.
            /// </param>
            if (this.pager) {
                this.pager.epiPager('goToPage', page, keepFocus);
            }
        },

        clear: function () {
            /// <summary>
            ///     Clears the list of items.
            /// </summary>
            this._selectedIndex = -1;
            this.list.children()
                .each(function (i) {
                    $(this).remove();
                });
            this._listItems.splice(0, this._listItems.length);
            return this;
        },

        getSelectedListItem: function () {
            /// <summary>
            ///     Getter that returns the selected Listitem
            /// </summary>
            return this._listItems[this.getSelectedIndex()];
        },

        getSelectedIndex: function () {
            /// <summary>
            ///     Getter that returns the index of the selected Listitem
            /// </summary>
            return this._selectedIndex;
        },

        getListItem: function (index) {
            /// <summary>
            ///     Getter that returns a listitem based on the index supplied
            /// </summary>
            return this._listItems[index];
        },

        getAllListItems: function () {
            /// <summary>
            ///     Getter that returns All listitems in the list
            /// </summary>
            return this._listItems;
        },

        setNumberOfPages: function (pages) {
            /// <summary>
            ///     Update the number of pages on the pager.
            /// </summary>
            /// <param name="pages" type="Integer">
            ///     The new value for the number of pages.
            /// </param>
            var self = this;

            //if we have less than 2 pages we should remove the pager since its not needed.
            if (pages < 2) {
                this.pager.remove();
                this.pager = null;
                return this;
            }

            //If we have no pager we create a new pager with the new value for the amount of pages.
            //Else we just update the number of pages.
            if (typeof this.pager === "undefined" || this.pager === null) {
                this._createPager(pages, this.options.currentPage);
            } else {
                this.pager.epiPager('changeNumberOfPages', pages);
            }
        },

        setSelectedIndex: function (index) {
            /// <summary>
            ///     Setter that sets the selectedindex.
            /// </summary>
            /// <param name="index" type="Integer">
            ///     the index of the new selected index
            /// </param>
            var options = this.options;
            if (index < this._listItems.length && index > -1) {
                this._focusedElement = this.getListItem(index);
                this._triggerSelect();
            } else if (index === -1) {
                var _isPreviouslySelected = ((typeof this._selectedIndex !== "undefined") && (this._selectedIndex > -1));

                //Change old selected item to the default item class;
                if (_isPreviouslySelected) {
                    this.getSelectedListItem().removeClass(options.listItemSelectedClass)
                        .addClass(options.listItemContentClass);
                    this.getSelectedListItem().removeAttr("aria-selected");
                    $("." + options.listItemButtonSelectedClass, this.getSelectedListItem()).removeClass(options.listItemButtonSelectedClass)
                        .addClass(options.listItemButtonClass);
                }
                this._selectedIndex = -1;
            }
            return this;
        },

        _createPager: function (pages, currentpage) {
            var self = this;
            (this.pager = $('<div/>'))
                    .epiPager({ pages: pages, currentPage: currentpage })
                    .insertAfter(this.list)
                    .bind("epipagerpagechanged", function (e, data) {
                        self._pagerPageChanged(e, data);
                    });
        },

        _pagerPageChanged: function (e, data) {
            /// <summary>
            ///    Function that runs when the page change event is triggered on the pager.
            /// </summary>
            /// <param name="e" type="Event">
            ///     The ajax event that led us here.
            /// </param>
            /// <param name="data" type="Object">
            ///    The object with the data to paste to the dashboard.
            /// </param>
            this._trigger("pagechanged", null, data);
        },

        _createListItem: function () {
            /// <summary>
            ///    Creates the wrapping div that handles the mouse and keyboard events.
            /// </summary>
            var self = this;
            var options = this.options;
            var item = $("<div/>").addClass(options.listItemContentClass)
                    .attr("role", "option")
                    .mouseenter(function (e) {
                        $(this).addClass(options.listItemContentHoverClass);
                    })
                    .mouseleave(function (e) {
                        $(this).removeClass(options.listItemContentHoverClass);
                    })
                    .keydown(function (e) {
                        self._onKeyDown(e);
                    })
                    .keypress(function (e) {
                        self._onKeyPress(e);
                    })
                    .focus(function () {
                        self._focusedElement = $(this);
                    })
                    .click(function () {
                        self._focusedElement = $(this);
                        self._triggerSelect();
                    });
            return item;
        },

        _triggerSelect: function () {
            /// <summary>
            ///     Triggers the select event. (used when a listitem is clicked or pressed on using keyboard navigation)
            /// </summary>

            this._updateSelectGraphics();
            this._trigger("select", null, this._focusedElement);
        },

        _triggerPageChanged: function (data) {
            /// <summary>
            ///     Triggers the select event. (used when a listitem is clicked or pressed on using keyboard navigation)
            /// </summary>
            this._trigger("pagechanged", null, data);
        },

        _updateSelectGraphics: function () {
            /// <summary>
            ///    Updates the graphical elements of the list when selected item is changed.
            /// </summary>
            var options = this.options;

            var isPreviouslySelected = ((typeof this._selectedIndex !== "undefined") && (this._selectedIndex > -1));

            //Change old selected item to the default item class;
            if (isPreviouslySelected) {
                this.getSelectedListItem().removeClass(options.listItemSelectedClass)
                    .addClass(options.listItemContentClass); //Cannot use toggleClass since as default we have the same class as selected.
                this.getSelectedListItem().removeAttr("aria-selected");
                this.getSelectedListItem().attr("tabindex", "-1");
            }

            //Update button graphics
            if (options.listItemButtonSelectedClass !== "" && options.listItemButtonClass !== "") {
                if (isPreviouslySelected) {
                    $("." + options.listItemButtonSelectedClass, this.getSelectedListItem()).removeClass(options.listItemButtonSelectedClass)
                        .addClass(options.listItemButtonClass);
                }
                $("." + options.listItemButtonClass, this._focusedElement).removeClass(options.listItemButtonClass)
                        .addClass(options.listItemButtonSelectedClass);
            }

            this._selectedIndex = this._getIndexForObject(this._focusedElement);

            this._focusedElement.removeClass(options.listItemContentClass)
                    .addClass(options.listItemSelectedClass);
            this._focusedElement.attr("aria-selected", true);

            this._focusedElement.attr("tabindex", 0);

        },

        _getIndexForObject: function (object) {
            /// <summary>
            ///    Returns the index for a sertain ListItem
            /// </summary>
            /// <param name="object" type="jQuery">
            ///     the ListItem object to find in the list.
            /// </param>
            var listItem = object.parent();

            return listItem.prevAll().length;
        },

        _getSiblingItem: function (direction) {
            /// <summary>
            ///     Gets the next button in the pager.
            /// </summary>
            /// <param name="element" type="jQuery">
            ///     The object to find the next button element for.
            /// </param>
            /// <returns type="jQuery" />
            var listItem = this._focusedElement.parent();
            var siblingItem;
            if (direction === -1) {
                siblingItem = listItem.prev();
            } else if (direction === 1) {
                siblingItem = listItem.next();
            } else {
                return this._focusedElement;
            }

            var siblingLink = siblingItem.children().eq(0);
            if (siblingLink && siblingLink.is(":visible")) {
                return siblingLink;
            } else {
                return this._focusedElement;
            }
        },

        _onKeyDown: function (e) {
            /// <summary>
            ///     Event listener for keydown event.
            /// </summary>
            /// <param name="e" type="Event">
            ///     Event object
            /// </param>
            if (epi.shell.isArrowKey(e.which) && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                if (epi.shell.keyCode.arrowRight === e.which || epi.shell.keyCode.arrowDown === e.which) {
                    this._moveFocus(1);
                } else if (epi.shell.keyCode.arrowLeft === e.which || epi.shell.keyCode.arrowUp === e.which) {
                    this._moveFocus(-1);
                }
            }
        },

        _onKeyPress: function (e) {
            /// <summary>
            ///     Event listener for keypress event.
            /// </summary>
            /// <param name="e" type="Event">
            ///     Event object
            /// </param>
            if ((e.which === epi.shell.keyCode.enter || e.which === epi.shell.keyCode.space) && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                this._triggerSelect();
                e.preventDefault();
            }
        },

        _moveFocus: function (direction) {
            /// <summary>
            ///     Moves the current focus 1 step to the right of the current focus (Only if that is possible)
            /// </summary>
            this._focusedElement.attr("tabindex", "-1");
            var elem = this._getSiblingItem(direction);
            $(elem).attr("tabindex", "0");
            elem.focus();

        }
    });

    $.extend($.ui.epiItemList, {
        version: "0.1",
        eventPrefix: "epiitemlist",
        getter: "getSelectedListItem getSelectedIndex getListItem getAllListItems",
        setter: "setSelectedIndex setNumberOfPages",
        defaults: {
            listClass: "epi-itemList",
            listItemClass: "epi-itemList-wrapper",
            listItemContentClass: "epi-itemList-content",
            listItemContentHoverClass: "epi-itemList-hover",
            listItemSelectedClass: "epi-itemList-content",
            listItemButtonClass: "epi-iconToolbar-add",
            listItemButtonSelectedClass: "",
            paging: false,
            pages: 1,
            currentPage: 1,
            buttons: {
            // <example>
            //  exampleButton: {
            //      text: "text",               // The text inside the link (button).
            //      description: "no-title",          // The title of the button
            //      buttonClass: "no-class",    // The class of the button icon
            //      click: function(e) { },     // The function to run when clicked
            //      clickable: false,           // If the button should be clickable
            //      tabIndex: -1                // What tabindex the button should have
            //  }
            // </example>
            }
        }
    });

})(epiJQuery);
