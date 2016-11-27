(function ($) {

    $.widget("ui.epiPager", {
        /// <summary>
        ///     epiPager widget.
        ///     Depends: ui.core.js
        /// </summary>
        _init: function () {
            /// <summary>
            ///     epiPager widget initialization
            /// </summary>
            var self = this;
            var options = this.options;

            this._pages = options.pages;

            var pagerContainer = (this.pagerContainer = this.element)
                        .addClass(options.pagerContainerClass);

            this._listId = epi.shell.generateId("Pager");

            var pagerList = (this.pagerList = $('<ul></ul>'))
                        .addClass(options.pagerListClass)
                        .attr("id", this._listId)
                        .attr("role", "navigation")
                        .keydown(function (e) {
                            self._onKeyDown(e);
                        })
                                               .appendTo(pagerContainer);

            this._addPrevButtons();

            for (i = 1; i <= this._pages; i = i + 1) {
                this._addPage((options.currentPage === i), i);
            }

            this._addNextButtons();

            this._updateButtonVisibility();

        },

        _addPrevButtons: function () {
            /// <summary>
            ///     Adds Previous and First button to the pager component
            /// </summary>
            var self = this;
            var options = this.options;
            var firstButton = (this.firstButton = this._addPage(false, "&laquo;", function () {
                self.goToPage(1, $(this)); return false;
            }));
            var previousButton = (this.previousButton = this._addPage(false, "&lsaquo;", function () {
                self.goToPage(options.currentPage - 1, $(this)); return false;
            }));
        },

        _addNextButtons: function () {
            /// <summary>
            ///     Adds Next and Last button to the pager component
            /// </summary>
            var self = this;
            var options = this.options;
            var nextButton = (this.nextButton = this._addPage(false, "&rsaquo;", function () {
                self.goToPage(options.currentPage + 1, $(this)); return false;
            }));
            var lastButton = (this.lastButton = this._addPage(false, "&raquo;", function () {
                self.goToPage(self._pages, $(this)); return false;
            }));
        },

        _addPage: function (selected, text, clickMethod, insertAfterTarget) {
            /// <summary>
            ///     Adds a page/button to the pager component
            /// </summary>
            /// <param name="selected" type="Boolean">
            ///     Boolean that sets if the button should be selected or not.
            /// </param>
            /// <param name="text" type="String">
            ///     String with the text that should be displayed on the button.
            /// </param>
            /// <param name="clickMethod" type="function">
            ///     A function that should be run when the button is clicked.
            /// </param>
            /// <returns type="jQuery" />
            var options = this.options;
            var self = this;

            var pagerItem = (this.pagerItem = $('<li></li>'))
                        .addClass(options.pagerItemClass);

            // If we have no click method we define a method for the page to use on click. We also set a class for those that dont have this function.
            if (typeof clickMethod !== "function") {
                clickMethod = function () {
                    self.goToPage(text); return false;
                };
            }

            var link = $('<a href="#"></a>')
                .attr("title", text)
                .attr("role", "button")
                .focus(function () {
                    self._focusedElement = $(this);
                })
                .append(text)
                .click(clickMethod)
                .appendTo(pagerItem);

            if (selected) {
                link.addClass(options.pagerSelectedClass)
                    .attr("tabindex", "0")
                    .attr("aria-selected", "true");
            } else {
                link.addClass(options.pagerLinkClass)
                    .attr("tabindex", "-1");
            }
            if (typeof insertAfterTarget === "undefined") {
                pagerItem.appendTo(this.pagerList);
            } else {
                pagerItem.insertAfter(insertAfterTarget);
            }

            return $(pagerItem);

        },

        _removePage: function (index) {
            /// <summary>
            ///     Removes a page from the pager.
            /// </summary>
            /// <param name="index" type="Integer">
            ///     The index of the page to remove.
            /// </param>
            this._getObjectForIndex(index).parent().remove();
            this._pages = this._pages - 1;
        },

        _updateButtonVisibility: function () {
            /// <summary>
            ///     Updates the visibility of the first, last, next and previous buttons.
            ///     They should not be shown if we are on the first or last page (when the buttons have no effect anyways)
            /// </summary>
            var options = this.options;

            //We cannot use .show() and .hide() since that makes jQuery add a display attribute to the li:s that destroy our display: inline;
            //from the CSS.

            this.nextButton.css("display", "none").attr("aria-hidden", "true");
            this.lastButton.css("display", "none").attr("aria-hidden", "true");
            this.firstButton.css("display", "none").attr("aria-hidden", "true");
            this.previousButton.css("display", "none").attr("aria-hidden", "true");

            ((options.currentPage < this._pages) && this.nextButton.removeAttr("style").removeAttr("aria-hidden"));
            ((options.currentPage < this._pages) && this.lastButton.removeAttr("style").removeAttr("aria-hidden"));
            ((options.currentPage > 1) && this.firstButton.removeAttr("style").removeAttr("aria-hidden"));
            ((options.currentPage > 1) && this.previousButton.removeAttr("style").removeAttr("aria-hidden"));
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
            if (e.ctrlKey || e.altKey || e.shiftKey) {
                // Do something
            } else {
                if (epi.shell.isArrowKey(e.which)) {
                    if (epi.shell.keyCode.arrowRight === e.which) {
                        this._moveFocus(1);
                    } else if (epi.shell.keyCode.arrowLeft === e.which) {
                        this._moveFocus(-1);
                    }
                }
            }
        },

        _moveFocus: function (direction) {
            /// <summary>
            ///     Moves the current focus 1 step to the right of the current focus (Only if that is possible)
            /// </summary>
            this._focusedElement.blur();
            this._getSiblingItem(direction).focus();

        },

        _getObjectForIndex: function (index) {
            /// <summary>
            ///     Gets the button with the specified index.
            /// </summary>
            /// <param name="index" type="Integer">
            ///     The index of the object
            /// </param>
            /// <returns type="jQuery" />
            return $('[title=' + index + ']', this.pagerList);
        },

        changeNumberOfPages: function (newPages) {
            /// <summary>
            ///     Update the amount of pages in the pager.
            /// </summary>
            /// <param name="newPages" type="Integer">
            ///     The new amount of pages needed for the pager.
            /// </param>
            var self = this;
            var options = this.options;
            if (newPages < this._pages) {
                //We need to remove some pages in the end of the pager.
                while (newPages !== this._pages) {
                    this._removePage(this._pages);
                }
            } else if (newPages > this._pages) {
                //Add some pages to the pager
                while (newPages !== this._pages) {
                    this._addPage(false, this._pages + 1, null, this._getObjectForIndex(this._pages).parent());
                    this._pages = this._pages + 1;
                }
            }
            //If the current selected page is outside the max pages we go to the last page.
            if (options.currentPage > this._pages) {
                this.goToPage(this._pages);
            } else {
                this._updateButtonVisibility();
            }
        },

        goToPage: function (page, keepFocus) {
            /// <summary>
            ///     Changes which item that is selected. (used by the buttons onClick events).
            ///     Throws pagerpagechanged event.
            /// </summary>
            /// <param name="page" type="Integer">
            ///     The index of the page to move to.
            /// </param>
            /// <param name="keepFocus" type="jQuery">
            ///     An object to keep focus on after selecting the page.
            /// </param>

            var self = this;

            var options = this.options;
            var previousPage = options.currentPage;
            var newLinkObject;

            if (page !== previousPage) {

                var previousLinkObject = this._getObjectForIndex(previousPage);
                newLinkObject = this._getObjectForIndex(page);

                previousLinkObject.removeClass(options.pagerSelectedClass)
                    .addClass(options.pagerLinkClass)
                    .removeAttr("aria-selected")
                    .attr("tabindex", "-1");

                newLinkObject.removeClass(options.pagerLinkClass)
                    .addClass(options.pagerSelectedClass)
                    .attr("aria-selected", "true")
                    .attr("tabindex", "0");

            }

            options.currentPage = page;

            var dataObj = { pages: this._pages, currentPage: options.currentPage };

            self._trigger("pagechanged", null, dataObj);

            this._updateButtonVisibility();

            if ((typeof keepFocus !== "undefined") && keepFocus.is(":visible")) {
                this._focusedElement.blur();
                keepFocus.focus();
            } else if (typeof keepFocus !== "undefined") {
                newLinkObject = this._getObjectForIndex(page);
                newLinkObject.focus();
            }
        }
    });

    $.extend($.ui.epiPager, {
        version: "0.1",
        eventPrefix: "epipager",
        defaults: {
            pages: 1,
            currentPage: 1,
            pagerContainerClass: "epi-pager",
            pagerListClass: "epi-pager-group",
            pagerItemClass: "epi-pager-item",
            pagerLinkClass: "epi-pager-link",
            pagerLinkFocusClass: "epi-pager-link-focus",
            pagerSelectedClass: "epi-pager-selected"
        }
    });

})(epiJQuery);
