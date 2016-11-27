(function ($) {
    epi.shell.registerInitFunction(function () {
        $(".epi-navigation-global:first").epiNavigation();
    });
    $.widget("ui.epiNavigation", {
        /// <summary>
        ///     epiNavigation widget.
        ///     Depends: ui.core.js
        /// </summary>
        _init: function () {
            /// <summary>
            ///     epiNavigation widget initialization
            /// </summary>
            var self = this;

            this._keyPressHandler = function (e) {
                /// <summary>
                ///    Handler for navigation keyPress event.
                /// </summary>
                /// <param name="e" type="Event">
                ///     jQuery event object
                /// </param>
                var target = $(e.target);
                switch (e.which) {
                    case epi.shell.keyCode.space: // Space
                        if (self._isTopMenuItem(target) && self._hasSubMenu(target)) {
                            self._openSubMenu(target);
                            e.preventDefault();
                        } else {
                            target.bind("click", function (e) {
                                if (typeof this.onclick === "function") {
                                    this.onclick();
                                } else if (!e.isDefaultPrevented() && (typeof (this.click) === "undefined") && this.href.length !== 0) {
                                    window.location.href = this.href;
                                } else {
                                    this.click();
                                }
                            }).click();
                        }
                        break;
                }
            };

            this._keyDownHandler = function (e) {
                /// <summary>
                ///    Handler for navigation keydown event.
                /// </summary>
                /// <param name="e" type="Event">
                ///     jQuery event object
                /// </param>
                var target = $(e.target);
                switch (e.which) {
                    case epi.shell.keyCode.escape: // Escape
                        // Close sub menu
                        if (!self._isTopMenuItem(target)) {
                            self._closeSubMenu(target);
                        }
                        break;
                    case epi.shell.keyCode.arrowUp: // Arrow up
                        if (self._isTopMenuItem(target)) {
                            self._openSubMenu(target); // Open sub menu and focus on first element
                            e.preventDefault();
                        } else {
                            self._closeSubMenu(target); // Close sub menu (if configured like this) and focus top menu item
                        }
                        break;
                    case epi.shell.keyCode.arrowDown: // Arrow down
                        if (self._isTopMenuItem(target) && self._hasSubMenu(target)) {
                            self._openSubMenu(target); // Open sub menu and focus on first element
                            e.preventDefault();
                        } else if (self._isDropDownMenu(target)) {
                            self._openSubMenu(target); // Open sub menu and focus on first element
                            e.preventDefault();
                        } else {
                            self._siblingFocus(target, "next"); // Change focus to next sibling
                            e.preventDefault();
                        }
                        break;
                    case epi.shell.keyCode.arrowLeft: // Arrow left
                        self._siblingFocus(target, "previous"); // Change focus to previous sibling
                        break;
                    case epi.shell.keyCode.arrowRight: // Arrow right
                        self._siblingFocus(target, "next"); // Change focus to next sibling
                        break;
                }
            };

            this._clickHandler = function (e) {
                /// <summary>
                ///    Handler for navigation click event.
                /// </summary>
                /// <param name="e" type="Event">
                ///     jQuery event object
                /// </param>
                var target = $(e.target);
                if (!target.is("a")) {
                    target = target.closest("a");
                }

                if (self._isMenuSection(target)) {
                    self._openSubMenu(target);
                    e.preventDefault();
                } else if (self._isDropDownMenu(target)) {
                    self._openDropDownMenu(target);
                    e.preventDefault();
                } else {
                    self.element.trigger("navigate");
                }
            };

            this._moreMenuItemClickHandler = function (e) {
                var target = $(e.target);
                if (!target.is("a")) {
                    target = target.closest("a");
                }

                if (self._isDropDownMenu(target)) { // for the drop down menu - show 'More' menu
                    $('.epi-navigation-more-items-wrapper', this._topMenuBar).epiContextMenu('show');
                }

                self._clickHandler.call(this, e); // caling common menu clickHandler
            };

            this._makeNavigation();
        },

        _makeNavigation: function () {
            /// <summary>
            ///    Initialize of navigation menu
            /// </summary>
            this._focusClassName = "epi-navigation-focus";
            this._selectedClassName = "epi-navigation-selected";
            this._topMenuBar = $(".epi-navigation-container1", this.element);
            this._subMenuBar = $(".epi-navigation-container2", this.element);

            //Check if we are in RTL mode
            this._isRTL = $("body", document).css("direction") === "rtl";

            //Reset tab index on all anchors
            $("a", this._topMenuBar).attr("tabindex", -1)
                               .attr("aria-pressed", false);

            //Hide sub menus And move them to the sub menu bar
            $("li.epi-navigation-standard > ul", this._topMenuBar).appendTo(this._subMenuBar).hide();

            this._utilItemsContainer = $(".epi-navigation-container-utils", this.element);
            $("<ul></ul>").appendTo(this._utilItemsContainer);

            //Move all utils to top right menu bar
            $("li.epi-navigation-util", this._topMenuBar).appendTo($("ul", this._utilItemsContainer));
            //All items inside the utils container should be "tabbable"
            $("a", this._utilItemsContainer).attr("tabindex", 0)
                               .attr("aria-pressed", false);

            //Create the drop down menus
            var container = this.element;
            $("li.epi-navigation-dropdown>ul", container).each(function (i, item) {
                //Wrap each element inside a div
                item = $(item).wrap("<div></div>").parent();
                $(item).epiContextMenu({ appendTo: container, attachedTo: $(item).parent(), preventDefaultMenuItemAction: false, alignedRight: true });
            });

            //Find selected in tmop menu
            this._selectedTopItem = $("li." + this._selectedClassName + ">a", this._topMenuBar);
            if (this._selectedTopItem.length > 0) {
                this._setTopMenuItemSelected(this._selectedTopItem);
                if (this._hasSubMenu(this._selectedTopItem)) {
                    this._openSubMenu(this._selectedTopItem);
                }
            }

            this._initMoreMenu();

            // Add event handlers to menu by using event delegation.
            // Add WAI-ARIA roles
            this.element.bind("keydown", this._keyDownHandler)
                        .bind("keypress", this._keyPressHandler)
                        .bind("click", this._clickHandler);

            // Raise an event not bound to an element for propagation to dojo
            this.element.bind("layoutchange", function () {
                $.event.trigger("/epi/shell/globalnavigation/layoutchange");
            });

            this.element.attr("role", "menu");
            this._subMenuBar.attr("role", "presentation");
            this._topMenuBar.attr("role", "presentation");
        },

        _initMoreMenu: function () {
            // saving initial more menu title
            var moreMenuTitle = $('.epi-navigation-global_more .epi-navigation-menuText', this._topMenuBar).text();
            var standardMenuItems = $("ul:first", this._topMenuBar).children()
                    .not($('.epi-navigation-global_more', this._topMenuBar).parent());
            var summaryTopMenuWidth = this._utilItemsContainer.width();
            var maxItemWidth = 0;
            //Calculate max width
            standardMenuItems.each(function (i, item) {
                var itemWidth = $(item).width();
                summaryTopMenuWidth += itemWidth;
                if (itemWidth > maxItemWidth) {
                    maxItemWidth = itemWidth;
                }
            });

            this._topMenuBar.data("moreMenuTitle", moreMenuTitle);
            this._topMenuBar.data("standardMenuItems", standardMenuItems);
            this._topMenuBar.data("summaryTopMenuWidth", summaryTopMenuWidth);
            this._topMenuBar.data("maxItemWidth", maxItemWidth);

            this._createMoreMenuItem();

            // set 'More' menu autocreation on window resize event
            var self = this;
            self._isResizing = false;
            $(window).resize(function (e) {
                if (self._isResizing) {
                    return;
                }
                self._isResizing = true;
                self._removeMoreMenuItem();
                self._createMoreMenuItem();
                setTimeout(function () {
                    self._isResizing = false;
                }, 200); // to prevent hang of the IE6
            });

        },

        _createMoreMenuItem: function () {
            var standardMenuItems = this._topMenuBar.data("standardMenuItems");
            var summaryTopMenuWidth = this._topMenuBar.data("summaryTopMenuWidth");
            var maxItemWidth = this._topMenuBar.data("maxItemWidth")

            //If the More menu item is selected, remove the selection
            $('.epi-navigation-global_more', this._topMenuBar).parent().removeClass(this._selectedClassName);
            this._setMoreMenuTitle();
            var windowWidth = this._topMenuBar.width();

            // move some items to the More menu if they do not fit on the screen
            if (summaryTopMenuWidth > windowWidth) {
                this._moreMenuItem = $('.epi-navigation-global_more', this._topMenuBar).parent();
                var lastMenuItem = $("ul:first>li:last", this._topMenuBar);
                if (this._moreMenuItem[0] != lastMenuItem[0]) {
                    lastMenuItem.after(this._moreMenuItem);
                }
                var moreMenuHref = $("a", this._moreMenuItem)[0].href;
                var moreMenuId = moreMenuHref.substring(moreMenuHref.lastIndexOf("#") + 1, moreMenuHref.length);
                this._moreMenuSubmenu = $("<ul class='epi-navigation-more-items' id='" + moreMenuId + "'></ul>");
                var lastMenuItemIndex = standardMenuItems.length - 1;

                // additional space for More menu item
                summaryTopMenuWidth += maxItemWidth;

                while (summaryTopMenuWidth > windowWidth) {
                    var item = standardMenuItems.eq(lastMenuItemIndex);
                    lastMenuItemIndex--;
                    summaryTopMenuWidth -= $(item).width();
                    this._moreMenuSubmenu.prepend(item);

                    //Is the item selected?
                    if (item.hasClass(this._selectedClassName)) {
                        this._setMoreMenuTitle(item.text());
                        this._selectedTopItem = this._selectedTopItem.add($('.epi-navigation-global_more', this._topMenuBar).parent());
                        $('.epi-navigation-global_more', this._topMenuBar).parent().addClass(this._selectedClassName);
                    } else if ($("a:first", item).hasClass(this._focusClassName)) {
                        this._setMoreMenuTitle(item.text());
                        this._focusedItem = this._focusItem.add($('.epi-navigation-global_more', this._topMenuBar).parent());
                        $('.epi-navigation-global_more', this._topMenuBar).parent().addClass(this._focusClassName);
                    }
                    if (lastMenuItemIndex < 0) {
                        break;
                    }
                }
                //Show the more menu
                this._moreMenuItem.show();

                this._moreMenuSubmenu = this._moreMenuSubmenu.wrap("<div class='epi-navigation-more-items-wrapper'></div>").parent();
                this._moreMenuItem.append(this._moreMenuSubmenu);

                //Create a context menu of the more menu
                this._moreMenuSubmenu.epiContextMenu({ attachedTo: this._moreMenuItem, preventDefaultMenuItemAction: false, alignedRight: false, autohide: true });
                $("a", this._moreMenuSubmenu).bind("click", this._moreMenuItemClickHandler);
            } else {
                $('.epi-navigation-global_more', this._topMenuBar).parent().hide();
            }
        },

        _removeMoreMenuItem: function () {
            if (this._moreMenuSubmenu) {
                this._moreMenuSubmenu.epiContextMenu('hide');
            }
            if ($('.epi-navigation-more-items>li', this._topMenuBar).length > 0) {
                $('.epi-navigation-more-items>li>a', this._topMenuBar).unbind('click', this._moreMenuItemClickHandler);
                $('.epi-navigation-more-items>li>a>span', this._topMenuBar).removeClass('epi-contextMenuItemName');
                $('.epi-navigation-more-items>li', this._topMenuBar).insertBefore($('.epi-navigation-global_more').parent());

                $('.epi-navigation-global_more', this._topMenuBar).parent().find('.epi-navigation-more-items-wrapper').remove();
            }
        },

        _setMoreMenuTitle: function (text) {
            if (text == undefined) {
                text = this._topMenuBar.data("moreMenuTitle");
            }
            $('.epi-navigation-global_more .epi-navigation-menuText', this._topMenuBar).text(text);
        },

        // Helper functions for navigation
        _isTopMenuItem: function (menuItem) {
            /// <summary>
            ///     Returns true if the supplied menu item is a top menu item.
            /// </summary>
            /// <param name="menuItem" type="Element">
            ///     Menu item. A DOM or jQuery element.
            /// </param>
            /// <returns type="Boolean" />
            return menuItem.is("a:not(div.epi-navigation-container2 ul li a, div.epi-navigation-container1 div.epi-navigation-container-utils ul li a)");
        },

        _hasSubMenu: function (menuItem) {
            /// <summary>
            ///     Returns true if the supplied top menu item has a sub menu.
            /// </summary>
            /// <param name="menuItem" type="Element">
            ///     Menu item. A DOM or jQuery element.
            /// </param>
            /// <returns type="Boolean" />
            var targetId = menuItem[0].href.substring(menuItem[0].href.lastIndexOf("#") + 1, menuItem[0].href.length);

            return $("#" + targetId).length > 0;
        },

        _isMenuSection: function (menuItem) {
            return $(menuItem).closest("li").is(".epi-navigation-standard");
        },

        _isUtilMenu: function (menuItem) {
            return $(menuItem).closest("li").is(".epi-navigation-util");
        },

        _isDropDownMenu: function (menuItem) {
            return $(menuItem).closest("li").is(".epi-navigation-dropdown");
        },

        _isInsideMoreMenu: function (menuItem) {
            return $(menuItem).parents('.epi-navigation-more-items-wrapper').length > 0;
        },

        _setFocusedItem: function (menuItem) {
            if (this._focusItem) {
                this._focusItem
                    .attr("tabindex", -1)
                    .removeClass(this._focusClassName);
            }

            if (this._selectedTopItem) {
                this._selectedTopItem
                    .attr("tabindex", -1);
            }

            this._focusItem = menuItem;

            if (this._isInsideMoreMenu(menuItem)) {
                this._focusItem = this._focusItem.add($('.epi-navigation-global_more'));
                this._setMoreMenuTitle(menuItem.text());
            } else {
                this._setMoreMenuTitle();
            }

            this._focusItem
                .attr("tabindex", 0)
                .addClass(this._focusClassName);
        },

        _setTopMenuItemSelected: function (menuItem) {
            /// <summary>
            ///     Set supplied top menu item as selected.
            /// </summary>
            /// <param name="menuItem" type="Element">
            ///     Menu item. A DOM or jQuery element.
            /// </param>

            if (this._selectedTopItem) {
                this._selectedTopItem
                    .attr("tabindex", -1)
                    .attr("aria-pressed", false)
                    .removeClass(this._selectedClassName);
            }
            this._selectedTopItem = menuItem;

            if (this._isInsideMoreMenu(menuItem)) {
                this._selectedTopItem = this._selectedTopItem.add($('.epi-navigation-global_more').parent());
                this._setMoreMenuTitle(menuItem.text());
            } else {
                this._setMoreMenuTitle();
            }

            this._selectedTopItem
                .attr("tabindex", 0)
                .attr("aria-pressed", true)
                .addClass(this._selectedClassName)
                .focus();
        },

        _openSubMenu: function (menuItem) {
            /// <summary>
            ///     Open supplied menu items sub menu.
            /// </summary>
            /// <param name="menuItem" type="Element">
            ///     Menu item. A DOM or jQuery element.
            /// </param>

            var self = this;

            if (self._isDropDownMenu(menuItem)) {
                self._openDropDownMenu(menuItem);
                return;
            }

            //Get the target UL to show
            var targetId = menuItem[0].href.substring(menuItem[0].href.lastIndexOf("#") + 1, menuItem[0].href.length);

            //Get visibile child
            var visibleChild = $("ul:visible", this._subMenuBar);

            if ((visibleChild.length > 0 && visibleChild[0].id !== targetId) || visibleChild.length == 0) {
                //Hide all
                this._subMenuBar.children().hide();

                //Show it
                visibleChild = $("#" + targetId).show();

                //If it is a 'More' submenu add a connection to the 'More' context menu item
                var moreMenu = menuItem.closest("ul.epi-navigation-more-items");
                if (moreMenu.length > 0) {
                    visibleChild.data("parentMenuItem", $("a:first", this._moreMenuItem));
                } else {
                    //Add a connection to the parent menu item, used when closing the menu
                    visibleChild.data("parentMenuItem", menuItem);
                }

                //Trigger a layout change
                $(this.element).trigger("layoutchange");
            }

            //Select the top item
            this._setFocusedItem(menuItem);
            //Focus the first child A
            visibleChild.find("li:not(.epi-navigation-util):first a").focus();
        },

        _openDropDownMenu: function (menuItem) {
            var self = this;
            //Find the dropdown div and show it
            $(menuItem).siblings("div").epiContextMenu("show");
        },

        _closeSubMenu: function (menuItem) {
            /// <summary>
            ///     Close sub menu related to this menu item but only if navigation.options.autoCloseSubMenu is true.
            ///
            /// </summary>
            /// <param name="menuItem" type="Element">
            ///     Menu item. A DOM or jQuery element.
            /// </param>
            if (this._isTopMenuItem(menuItem) && this._hasSubMenu(menuItem)) {
                this._subMenuBar.children().hide();
                //Trigger a layout change
                $(this.element).trigger("layoutchange");
            } else {
                //Find parent i top left container
                var parent = menuItem.closest("ul").data("parentMenuItem");
                if (parent && parent.length > 0) {
                    parent.focus();
                }
            }
        },

        _siblingFocus: function (menuItem, direction) {
            /// <summary>
            ///     Set focus to sibling menu item.
            ///
            /// </summary>
            /// <param name="menuItem" type="Element">
            ///     Menu item. A DOM or jQuery element.
            /// </param>
            /// <param name="direction" type="String">
            ///     Direction: "next" or "previous".
            /// </param>
            var siblingListElement;

            //Arrow navigation should not work in the utils menu
            if (this._isUtilMenu(menuItem)) {
                return;
            }

            //If we are in RTL mode, swap direction
            if (this._isRTL) {
                if (direction === "next") {
                    direction = "previous";
                } else {
                    direction = "next";
                }
            }

            // Find the next (or previous) list item
            if (direction === "next") {
                siblingListElement = menuItem.closest("li:visible").next(":visible");
            } else {
                siblingListElement = menuItem.closest("li:visible").prev(":visible");
            }

            // If we are trying to go beyond last (or first) element
            // we want to shift focus to first (or last) item of the siblings.
            if (siblingListElement.length === 0) {
                if (direction === "next") {
                    siblingListElement = menuItem.closest("li:visible").siblings("li:visible:first");
                } else {
                    siblingListElement = menuItem.closest("li:visible").siblings("li:visible:last");
                }
            }

            var siblingMenuItem = $("a:first", siblingListElement);

            //If the current menu item has children, but not the next one, close the submenu
            if (this._isTopMenuItem(siblingMenuItem) && !this._hasSubMenu(siblingMenuItem)) {
                this._setFocusedItem(siblingMenuItem);
                this._closeSubMenu(menuItem);
            }

            // If it is a menu section and the section has children, open it.
            // Keep focus on the top item
            if (this._isMenuSection(siblingMenuItem) && this._hasSubMenu(siblingMenuItem)) {
                this._openSubMenu(siblingMenuItem);
            }
            siblingMenuItem.focus();
        }
    });

    $.extend($.ui.epiNavigation, {
        version: "0.1",
        defaults: {
            className: "epi-globalNavigation"
        }
    });
})(epiJQuery);



