(function ($, epi) {
    var epi = epi || {};

    $.widget("ui.epiTabView", {
        /// <summary>
        ///     epiTabView widget.
        ///     Used to break content into tab sections to save space.
        ///     Depends: ui.core.js
        /// </summary>
        _init: function () {
            /// <summary>
            ///     epiTabView widget initialization
            /// </summary>
            var self = this;
            var o = this.options;

            this.element.addClass(o.tabViewClass);

            this.ul = $("ul:first", this.element)
                                .addClass(o.ulClass)
                                .attr("role", "tablist");

            this.lis = this.ul.children("li")
                                .addClass(o.liClass);

            this.tabPanelContainer = $("div:first", this.element)
                                        .addClass(o.tabPanelContainerClass);

            // Create tabs from lis
            this.lis.not(":has(a)").wrapInner(document.createElement("a"));

            // Init tab collections. Tab collections needs to be updated when tabs are added, removed, sorted etc.
            this._setTabCollections();

            // TODO: Check if number of tabs and tabContent match and if not take proper action.
            var itemCheck = this.tabs.length - this.tabPanels.length;
            if (itemCheck < 0) { // number of tabs are less than tabContent
                // Get rid of last tab??
            } else if (itemCheck > 0) {
                // Add empty tabContent container??
            }

            // Add css, event handlers and attributes to each tab
            this.tabs.each(function (i) {
                var tab = $(this);
                self._getUniqueId(tab);
                self._addTabSettings(tab, i);
            });

            // Add CSS and attributes to each tabpanel
            // TODO: When lazy load of tabPanels is implemented we don't want to overwrite href of tab below.
            this.tabPanels.each(function (i) {
                var tabPanel = $(this);
                var id = self._getUniqueId(tabPanel);
                var tabId = self.tabs.eq(i)
                            .attr("href", "#" + id)
                            .attr("id");

                self._addTabPanelSettings(tabPanel, tabId);
            });

            // AddButton lets the user create new tabs
            this._createAddButton();

            this._createTabMenu();

            // Show default tab
            var selected = o.selected;
            if (selected >= 0 && selected < this.tabs.length) {
                this._show(selected);
            } else {
                this.tabs.eq(0).attr("tabindex", 0);
            }

            this._updateRemovable();
        },

        add: function (url, label, tabId, index) {
            /// <summary>
            ///     Adds a new tab (and panel) to the tabView
            /// </summary>
            /// <param name="url" type="String">
            ///     An http url or id of an existing element in the page indicating tabPanel content
            /// </param>
            /// <param name="label" type="String">
            ///     The label of the tab to create
            /// </param>
            /// <param name="tabId" type="String">
            ///     Id of the tab (id attribute of the link element representing the tab)
            /// </param>
            /// <param name="index" type="Integer">
            ///     Index position indicating where to insert the new tab. Defaults to last.
            /// </param>

            var o = this.options;

            var tabLength = this.tabs.length;
            if (typeof index === "undefined" || index >= tabLength) {
                index = o.addButton ? tabLength - 1 : tabLength;
            }
            var tabTemplate = '<li><a id="' + tabId + '" href="#{href}">' + o.tabTemplate + '</a></li>';
            var li = $(tabTemplate.replace(/#\{href\}/g, url).replace(/#\{label\}/g, label)).addClass(o.liClass);

            var tab = $("a", li);
            var tabId = this._getUniqueId(tab);

            var tabPanel;
            var tabPanelId = !url.indexOf("#") ? url.replace("#", "") : null;

            if (tabPanelId) {
                tabPanel = $("#" + tabPanelId);
                if (!tabPanel.length) {
                    tabPanel = $(o.tabPanelTemplate).attr("id", tabPanelId);
                }
            } else {
                tabPanel = $(o.tabPanelTemplate);
                this._getUniqueId(tabPanel);
            }

            if (index >= this.lis.length) {
                li.appendTo(this.ul);
                tabPanel.appendTo(this.tabPanelContainer);
            } else {
                li.insertBefore(this.lis[index]);
                tabPanel.insertBefore(this.tabPanels[index]);
            }
            if (this.selectedTabIndex >= index) {
                this.selectedTabIndex++;
            }

            this._setTabCollections();

            this._addTabSettings(tab);
            this._addTabPanelSettings(tabPanel, tabId);

            this._updateRemovable();
            // TODO: Trigger add event
        },

        length: function () {
            /// <summary>
            ///     Returns the number of tabs in the tabView (excluding any addButton tab).
            /// </summary>
            return this.options.addButton ? this.tabs.length - 1 : this.tabs.length;
        },

        replacePanelContent: function (content, index) {
            /// <summary>
            ///     Replaces the content in the tab panel.
            /// </summary>
            /// <param name="content" type="String or jQuery Element">
            ///     HTML,text or Jquery element to replace existing content with
            /// </param>
            /// <param name="index" type="Integer">
            ///     Zero-based index position of the panel to replace content in.
            /// </param>

            // Use tabs.length instead of this.length since it includes addButtonTab (if enabled) and we need to be able to add content to this as well.
            if (typeof index === "undefined" || index > this.tabs.length) {
                index = this.length();
            }
            if (typeof content.jquery !== "undefined") {
                this.tabPanels.eq(index)
                            .empty();
                content.appendTo(this.tabPanels.eq(index));
            } else {
                this.tabPanels.eq(index).html(content);
            }

        },

        remove: function (index) {
            /// <summary>
            ///     Removes tab and panel from the tabView.
            /// </summary>
            /// <param name="index" type="Integer">
            ///     Zero-based index position of the tab to remove.
            /// </param>
            var tabLength = this.options.addButton ? this.tabs.length - 1 : this.tabs.length;

            if (index > tabLength) {
                return;
            }

            if (this._trigger("remove", null, this._createArgs(index)) === true) {
                // We have to remove the tab menu if the user removes the tab
                // since we want to keep it for other tabs.
                if (this.tabMenu) {
                    this.tabMenu.appendTo(this.element).hide();
                }

                this.lis.eq(index).remove();
                this.tabPanels.eq(index).remove();

                this._setTabCollections();

                // When selectedTab is removed move focus to next tab or
                // in case last tab was removed the previous tab.
                tabLength = this.options.addButton ? this.tabs.length - 1 : this.tabs.length;
                if (index === this.selectedTabIndex && tabLength > 0) {
                    this._show(index + (index < tabLength ? 0 : -1));
                }

                this._updateRemovable();
            }

        },

        select: function (index) {
            /// <summary>
            ///     Selects a tab in the tabView.
            ///     Triggers select event (and addselect for addButtonTab) before selecting to enable eventHandlers
            ///     to take proper action (and preventing event by returning false).
            /// </summary>
            /// <param name="index" type="Integer or jQuery Element">
            ///     Zero-based index position of the tab to select.
            /// </param>
            if (typeof index.jquery !== "undefined") {
                index = index.closest("li").prevAll().length;
            }

            if ((this._isAddButton(index) && this._trigger("addselect", null, this._createArgs(index)) === false) ||
                    this._trigger("select", null, this._createArgs(index)) === false) {
                this.tabs.eq(index).blur();
                return false;
            }
            this._show(index, true);
        },

        setTabName: function (name, index) {
            /// <summary>
            ///     Set the name of a tab
            /// </summary>
            /// <param name="index" type="Integer">
            ///     Zero-based index position of the tab to select.
            /// </param>
            /// <param name="index" type="Integer">
            ///     Zero-based index position of the tab to select.
            /// </param>
            if (index >= 0 && index <= this.length()) {
                this.tabs.eq(index).text(name);
            }
        },

        getTabPanel: function (index) {
            if (index >= 0 && index <= this.length()) {
                var requestedPanel = this.tabPanels.eq(index);
                return requestedPanel;
            }
        },

        _setTabCollections: function () {
            /// <summary>
            ///    Init tab collections. Tab collections needs to be updated when tabs are added, removed, sorted etc.
            /// </summary>
            this.lis = this.ul.children("li");
            this.tabs = this.ul.children("li").children("a");
            this.tabPanels = this.tabPanelContainer.children();
        },

        _addTabSettings: function (tab) {
            /// <summary>
            ///    Set required attributes, classes and eventlisteners on a tab.
            /// </summary>
            var self = this;
            var o = this.options;

            tab.addClass(o.tabClass)
                    .attr("role", "tab")
                    .attr("tabindex", -1)
                    .keydown(function (e) {
                        if (!o.disabled) self._navigateOnArrowKeys(e);
                    })
                    .keydown(function (e) {
                        if (!o.disabled) return self._navigateOnSpecialKeyCombinations(e);
                    })
                    .keypress(function (e) {
                        if (!o.disabled) e.stopPropagation();
                    })
                    .click(function (e) {
                        if (!o.disabled) self.select($(this).closest("li").prevAll().length); e.preventDefault();
                    });
        },

        _addTabPanelSettings: function (tabPanel, tabId) {
            /// <summary>
            ///    Set required attributes, classes and eventlisteners on a tabPanel.
            /// </summary>
            var self = this;
            var o = this.options;

            tabPanel.addClass(o.tabPanelClass)
                        .attr("aria-labelledby", tabId)
                        .attr("role", "tabpanel")
                        .attr("aria-hidden", true)
                        .keydown(function (e) {
                            if (!o.disabled) return self._navigateOnSpecialKeyCombinations(e);
                        })
                        .keypress(function (e) {
                            if (!o.disabled) e.stopPropagation();
                        })
                                               .hide();
        },

        _createAddButton: function () {
            /// <summary>
            ///     Creates an add button tab and panel if options.addButton is true
            ///     The panel is however empty and needs to get content by implementation.
            /// </summary>
            var o = this.options;
            if (o.addButton) {
                var addButtonLi = $(o.addButtonTemplate
                                        .replace(/#\{addButtonTitle\}/g, o.addButtonTitle)
                                        .replace(/#\{addButtonText\}/g, o.addButtonText)
                                    ).addClass(o.addButtonLiClass)
                                    .appendTo(this.ul);

                var addButtonTab = $("a", addButtonLi);
                this._addTabSettings(addButtonTab);

                var addButtonTabId = this._getUniqueId(addButtonTab);

                var addButtonPanel = $(o.tabPanelTemplate).appendTo(this.tabPanelContainer);

                this._addTabPanelSettings(addButtonPanel, addButtonTabId);

                this._setTabCollections();
            }
        },

        _createTabMenu: function () {
            /// <summary>
            ///     Creates a tab menu tool list and context menu which is shown on selected tab.
            ///     The menu items are dependant on the tabView options.removable, sortable and editable.
            /// </summary>
            var o = this.options;
            var self = this;
            if (!(this.menuEnabled = o.removable || o.sortable || o.editable)) {
                return;
            }

            var menuButtons = {
                contextMenuButton: {
                    text: o.menuText,
                    buttonClass: "epi-iconToolbar-menu",
                    click: function (e) {
                        if (!o.disabled) {
                            self._showContextMenu();
                        }
                    }
                }
            };

            if (o.removable) {
                menuButtons.deleteButton = {
                    text: o.deleteText,
                    buttonClass: "epi-iconToolbar-delete",
                    click: function (e) {
                        if (!o.disabled) {
                            self.remove(self.selectedTabIndex);
                        }
                    }
                };
            }

            this.tabMenu = $("<ul/>").epiToolbar({ buttons: menuButtons });
            $("a", this.tabMenu).attr("tabindex", -1);

            var contextMenuButton = this.tabMenu.epiToolbar("getButton", "contextMenuButton")
                                                .bind("focus", function (e) {
                                                    self.tabs.eq(self.selectedTabIndex).focus();
                                                });

            // Create contextmenu and associate it with the toolbar contextMenuButton.
            this.contextMenu = $("<div/>").epiContextMenu({ attachedTo: contextMenuButton });

            // Add menu items to contextMenu
            if (o.editable) {
                var editMenuItem = this.contextMenu.epiContextMenu("add", "edit", "#", o.editText)
                                                    .epiContextMenu("getMenuItem", "edit");
            }
            if (o.removable) {
                var deleteMenuItem = this.contextMenu.epiContextMenu("add", "delete", "#", o.deleteText)
                                                    .epiContextMenu("getMenuItem", "delete");
            }
            this._contextMenuClickHandler = function (e, clickedItem) {
                if (editMenuItem && clickedItem === editMenuItem.get(0)) {
                    self._trigger("edit", null, self._createArgs());
                } else if (deleteMenuItem && clickedItem === deleteMenuItem.get(0)) {
                    self.remove(self.selectedTabIndex);
                }
            };

            this.contextMenu.bind("epimenuclick", function (e, clickedItem) {
                self._contextMenuClickHandler(e, clickedItem);
            })
                                       .appendTo($("li", this.tabMenu).eq(0));
        },

        _showContextMenu: function () {
            /// <summary>
            ///     Show context menu
            /// </summary>
            this.contextMenu.epiContextMenu("show");
            return false;
        },

        _navigateOnArrowKeys: function (event) {
            /// <summary>
            ///     Method called on keypress of a tab. Used for keyboard navigation.
            /// </summary>
            /// <param name="event" type="Event">
            ///     Event object
            /// </param>
            var keyCode = event.which;
            if (epi.shell.isArrowKey(keyCode) && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                var index = this.selectedTabIndex;
                if (keyCode === epi.shell.keyCode.arrowLeft || keyCode === epi.shell.keyCode.arrowUp) {
                    // Open previous tab (or last if focus is on first tab)
                    index = index === 0 ? this.tabs.length - 1 : index - 1;

                } else if (keyCode === epi.shell.keyCode.arrowRight || keyCode === epi.shell.keyCode.arrowDown) {
                    // Open next tab (or first if focus is on last tab)
                    index = index === this.tabs.length - 1 ? 0 : index + 1;
                }
                this.select(index);
            }
        },

        _navigateOnSpecialKeyCombinations: function (event) {
            /// <summary>
            ///     Method called on keypress of a tab or tab panel.
            ///     Used for keyboard navigation and to delete the tab on alt+ del in tabPanel.
            /// </summary>
            /// <param name="event" type="Event">
            ///     Event object
            /// </param>
            var keyCode = event.which;
            var index = this.selectedTabIndex;
            var tabFocused = event.target === this.tabs.get(index) ? true : false;

            if (event.ctrlKey) {
                if (keyCode === epi.shell.keyCode.arrowUp && !tabFocused) {
                    // Move focus from anywhere inside tabpanel to corresponding tab.
                    this.tabs.eq(index).focus();
                } else if (keyCode === epi.shell.keyCode.pageUp) {
                    // Move focus to previous tab and open (or last if first tab is open)
                    index = index === 0 ? this.tabs.length - 1 : index - 1;
                    this.select(index);
                    return false;
                } else if (keyCode === epi.shell.keyCode.pageDown) {
                    // Move focus to next tab and open (or first if last tab is open)
                    index = index === this.tabs.length - 1 ? 0 : index + 1;
                    this.select(index);
                    return false;
                }

            } else if (event.altKey && !tabFocused) {
                // If tabs are removable and focus is in tabpanel remove selected tab.
                // Is this necessary? See: http://www.w3.org/TR/wai-aria-practices/#tabpanel
                if (this.options.removable && keyCode === epi.shell.keyCode.del) {
                    this.remove(this.selectedTabIndex);
                }
            }
            return true;
        },

        _show: function (index, shouldSetFocusOnTab) {
            /// <summary>
            ///     Show tab panel
            /// </summary>
            /// <param name="index" type="Integer">
            ///     Zero-based index of tab panel to show.
            /// </param>
            /// <param name="shouldSetFocusOnTab" type="Boolean">
            ///     true if the tab should receive focus when tab panel is shown
            /// </param>
            var self = this;

            var o = this.options;

            if ((this._isAddButton(index) && this._trigger("addbeforeshow", null, this._createArgs(index)) === false) ||
                    this._trigger("beforeshow", null, this._createArgs(index)) === false) {
                return false;
            }

            // Reset previously selected tab
            this._reset();

            this.selectedTabIndex = index;

            var li = this.lis.eq(index)
                            .removeClass(o.liClass);

            if (!li.hasClass(o.addButtonLiClass)) {
                li.addClass(o.selectedClass);
                if (this.menuEnabled) {
                    li.addClass(o.tabMenuClass);
                    this.tabMenu.appendTo(li).show();
                    this.tabs.eq(index).bind("contextmenu", function (e) {
                        if (!o.disabled) {
                            return self._showContextMenu();
                        }
                    });
                }
            } else {
                if (this.menuEnabled) {
                    this.tabMenu.appendTo("body").hide();
                }
            }

            var selectedTab = this.tabs.eq(index)
                    .attr("tabindex", 0)
                    .attr("aria-selected", true);

            this.tabPanels.eq(index)
                        .attr("aria-hidden", false)
                        .show();
            this._trigger("visibilitychanged", null, { tab: this._createArgs(index), isVisible: true });

            if (shouldSetFocusOnTab) {
                selectedTab.focus();
            }

            (this._isAddButton(index) && this._trigger("addshow", null, this._createArgs(index)) === false || this._trigger("show", null, this._createArgs(index)) === false);
        },

        _reset: function () {
            /// <summary>
            ///     Resets all settings on selectedTab (indicated by this.selectedTabIndex).
            /// </summary>
            var index = this.selectedTabIndex;
            var o = this.options;

            var liClass = o.liClass;
            if (o.addButton && index === this.tabs.length - 1) {
                liClass = o.addButtonLiClass;
            }

            this.lis.eq(index)
                    .removeClass(o.selectedClass)
                    .removeClass(o.tabMenuClass)
                    .addClass(liClass);

            this.tabs.eq(index)
                    .attr("tabindex", -1)
                    .attr("aria-selected", false)
                    .unbind("contextmenu");

            this.tabPanels.eq(index)
                        .attr("aria-hidden", true)
                        .hide();
            this._trigger("visibilitychanged", null, { tab: this._createArgs(index), isVisible: false });
        },


        _isAddButton: function (index) {
            /// <summary>
            ///     Returns true if the tab indicated by index is addButton tab.
            /// </summary>
            /// <param name="index" type="Integer">
            ///     Zero-based index indicating a tab.
            /// </param>
            return this.options.addButton && index === this.tabs.length - 1;
        },

        // .
        _createArgs: function (index) {
            /// <summary>
            ///     Additional object sent to eventhandlers (beside event object) when triggering events.
            ///     Contains:
            ///     ui.tab - current tab, a jQuery object
            ///     ui.panel - current tabPanel, a jQuery object
            ///     ui.index - zero-based index of current tab
            /// </summary>
            /// <param name="index" type="Integer">
            ///     Zero-based index indicating a tab. Defaults to selectedTabIndex.
            /// </param>
            if (!index) {
                index = this.selectedTabIndex;
            }
            return {
                tab: this.tabs.eq(index),
                panel: this.tabPanels.eq(index),
                index: index
            };
        },

        _getUniqueId: function (item) {
            /// <summary>
            ///     Sets an id on supplied item if the item does not already have an id and returns the id.
            /// </summary>
            /// <param name="item" type="jQuery element">
            ///    Item to set and return id from.
            /// </param>
            var itemId = item.attr("id");

            if (typeof itemId === "undefined" || itemId.length === 0) {
                var generatedId = epi.shell.generateId(this.options.idPrefix);
                item.attr("id", generatedId);
            }
            return item.attr("id") || generatedId;
        },

        _updateRemovable: function () {
            tabLength = this.options.addButton ? this.tabs.length - 1 : this.tabs.length;
            this._setRemovable(tabLength > 1);
        },

        _setRemovable: function (value) {
            this.options.removable = value;

            if (!this.options.removable) {
                this.tabMenu.epiToolbar("getButton", "deleteButton").hide();
                this.contextMenu.epiContextMenu("getMenuItem", "delete").hide();
            } else {
                this.tabMenu.epiToolbar("getButton", "deleteButton").show();
                this.contextMenu.epiContextMenu("getMenuItem", "delete").show();
            }
        }

    });

    $.extend($.ui.epiTabView, {
        version: "1.0",
        eventPrefix: "epitab",
        getter: "length, getTabPanel",
        defaults: {
            idPrefix: "epiTab", // String starting the unique id's created when adding or tabifying existing code without id's.
            addButton: false, // Should the user be able to add new tabs.
            editable: false, // Are the tabs editable.
            removable: false, // Are the tabs removable.
            sortable: false, // Is it possible to change the order of tabs.
            selected: 0, // Zero-based index of the tab to be selected on initialization. To set all tabs to not selected pass -1 as value.
            tabTemplate: '#{label}', // HTML template from which a new tab is created and added. The #{label} will be replaced with tab label passed as argument to the add method. The tabView itself makes sure to wrap the tabTemplate in an "li" and "a" element.
            tabPanelTemplate: '<div></div>', // HTML template from which a new tab panel is created in case of adding a tab with the add method or when creating a panel for a remote tab.
            addButtonTemplate: '<li><a class="epi-iconToolbar-item-link epi-iconToolbar-add" href="#" title="#{addButtonTitle}"><span>#{addButtonText}</span></a></li>', // HTML template from which addButton tab is created.
            addButtonLiClass: "epi-tabView-navigation-item-noStyle", // Applied to li of addButton tab.
            tabViewClass: "epi-tabView", // Applied to the element that is being epiTabbed.
            ulClass: "epi-tabView-navigation", // Applied to ul
            liClass: "epi-tabView-navigation-item", // Applied to tab li's
            selectedClass: "epi-tabView-navigation-item-selected", // Applied to the li surrounding selected tab (instead of navigationItemClass)
            tabMenuClass: "epi-tabView-navigation-item-menuEnabled", // Applied to the li if any menu items are enabled, i.e editable, removable, sortable
            tabClass: "epi-tabView-tab", // Applied to the link (the actual tab)
            tabPanelContainerClass: "epi-tabView-tabPanelContainer", // Applied to div surrounding tabPanel div's
            tabPanelClass: "epi-tabView-tabPanel", // Applied to tabPanel div's
            addButtonText: "Add tab",
            addButtonTitle: "Add tab",
            menuText: "Menu",
            editText: "Edit",
            removeText: "Remove"
        }
    });

})(epiJQuery, epi);
