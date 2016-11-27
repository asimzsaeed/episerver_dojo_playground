(function ($) {

    $.widget("ui.epiContextMenu", {
        _init: function () {
            var self = this;
            var o = this.options;

            this.element.addClass(o.controlClass)
                    .hide();

            var lists = $("ul", this.element);

            $("a", lists).each(function (i, item) {
                var firstSpan = $("span:first", item);
                if (firstSpan.length === 0) {
                    firstSpan = $(item).wrapInner("<span></span>").children(":first");
                }

                firstSpan.addClass(o.itemNameClass);
            });

            if (lists.length > 0) {
                lists.eq(0).addClass(o.firstListClass);
            }

            this._hide = function (e) {
                if (!self._isOpening) {
                    self.hide();
                }
                self._isOpening = false;
            };

            this.element.keydown(function (e) {
                self._keyDownHandler(e);
            })
                        .keypress(function (e) {
                            e.stopPropagation();
                        }); // To prevent other eventListeners from stopping click on menu items.
            this._addClickHandlerToMenuItem($("a", this.element), o.preventDefaultMenuItemAction);

            if (o.clickSelector) {
                $(o.clickSelector).click(function (e) {
                    self.show();
                    e.preventDefault();
                });
            }
            if (o.contextMenuSelector) {
                $(o.contextMenuSelector).bind("contextmenu", function (e) {
                    self.show();
                    e.preventDefault();
                });
            }
        },

        _addClickHandlerToMenuItem: function (links, preventDefault) {
            var self = this;
            links.bind("click", this, function (e) {
                if (self.options.attachedTo !== null) {
                    self.options.attachedTo.focus();
                }
                self.hide();
                self.element.trigger("epimenuclick", this);
                if (preventDefault) {
                    e.preventDefault();
                }
            });
        },

        _isOpening: false,

        _setSelected: function (index) {
            // Get all links, we do not want to get the links for sub context menus
            var links = $("a:not(ul>li>div a)", this.element);

            if (links.length > 0) {
                // Reset previously selected link
                links.eq(this.selectedIndex).attr("tabindex", -1);
                // Set selection to new item based on index
                this.selectedIndex = index;
                links.eq(index)
                    .attr("tabindex", 0)
                    .focus();
            }
        },

        _keyDownHandler: function (e) {
            var keyCode = e.which;
            if (epi.shell.isArrowKey(keyCode) && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                // Get all links, we do not want to get the links for sub context menus
                var links = $("a:not(ul>li>div a):visible", this.element);
                var index = this.selectedIndex;
                if (keyCode === epi.shell.keyCode.arrowLeft || keyCode === epi.shell.keyCode.arrowUp) {
                    // Set focus to previous item (or last if focus is on first)
                    index = index === 0 ? links.length - 1 : index - 1;

                } else if (keyCode === epi.shell.keyCode.arrowRight || keyCode === epi.shell.keyCode.arrowDown) {
                    // Set focus to next item (or first if focus is on last)
                    index = index === links.length - 1 ? 0 : index + 1;
                }

                this._setSelected(index);
                e.preventDefault();
            } else if (keyCode === epi.shell.keyCode.tab && !e.ctrlKey && !e.altKey) {
                if (this.options.attachedTo !== null) {
                    this.options.attachedTo.focus();
                }
                this.hide();
            } else if (keyCode === epi.shell.keyCode.escape && !e.ctrlKey && !e.altKey) {
                if (this.options.attachedTo !== null) {
                    if (this.options.attachedTo.is("a")) {
                        this.options.attachedTo.focus();
                    } else {
                        this.options.attachedTo.find("a:first").focus();
                    }
                }
                this.hide();
            }
        },

        show: function (event) {
            /// <summary>
            ///     Show context menu
            /// </summary>
            /// <param name="event" type="Event">
            ///     An event object
            /// </param>
            var o = this.options;
            var self = this;
            this._isOpening = true;

            this.previousSibling = this.element.prev();
            if (!this.previousSibling.length) {
                this.parentElement = this.element.parent();
            }


            this.element.show();
            if (o.appendTo !== null) {
                this.element.appendTo(o.appendTo);
            } else {
                this.element.appendTo($("body"));
            }

            if (o.attachedTo !== null) {
                var offset = o.attachedTo.offset();
                var top = offset.top + o.attachedTo.height();
                var left = offset.left;
                if (o.alignedRight) {
                    left = left - this.element.outerWidth() + o.attachedTo.width();
                } else {
                    var documentWidth = $(document.documentElement).width();

                    var right = left + this.element.outerWidth();
                    if (right > documentWidth) {
                        left = left - (right - documentWidth);
                    }
                }
                if (left < 0) {
                    left = 0;
                }

                this.element.css("top", top)
                        .css("left", left);
            }

            if (o.autohide) {
                epi.shell.events.bindFrameClickHandler(this._hide);
            }

            window.setTimeout(function () {
                self._setSelected(0); self._isOpening = false;
            }, 1);

            this._trigger("show");
        },

        hide: function (event) {
            /// <summary>
            ///     Hide context menu
            /// </summary>
            /// <param name="event" type="Event">
            ///     An event object
            /// </param>

            this.element.css("left", "auto")
                    .css("top", "auto")
                    .hide();

            if (this.parentElement) {
                this.element.appendTo(this.parentElement);
            } else if (this.previousSibling) {
                this.element.insertAfter(this.previousSibling);
            }

            epi.shell.events.unbindFrameClickHandler(this._hide);

            this._trigger("hide");
        },

        add: function (refName, url, label, title, isInsert, listIndex, itemIndex) {
            var o = this.options;

            // Decide which list, and create if necessary, new menu item should be added to.
            // If insertNewList equals true a new list will be created in the position indicated by listIndex (or first if not specified).
            var lists = $("ul", this.element);

            if (!lists.length) {
                lists = $('<ul></ul>').addClass(o.firstListClass)
                                .appendTo(this.element);
                listIndex = 0;
            } else if (typeof listIndex === "undefined") {
                listIndex = lists.length - 1;
            }

            if (isInsert) {
                $("<ul/>").insertBefore(lists.eq(listIndex));
            } else if (isInsert === false && lists.eq(listIndex).children().length > 0) {
                // !isInsert will equal true if isInsert is undefined hence the use of isInsert === false
                // Don't add new list if the previous one is empty.
                $("<ul/>").insertAfter(lists.eq(listIndex));
                listIndex++;
            }

            lists = $("ul", this.element);

            // Make sure firstListClass is only added to first list
            $("." + o.firstListClass, this.element).removeClass(o.firstListClass);
            lists.eq(0).addClass(o.firstListClass);

            // Create menu item
            var item = $(o.itemTemplate.replace(/#\{href\}/g, url).replace(/#\{label\}/g, label));

            if (title && title.length && title.length > 0) {
                item.attr("title", title);
            }
            // Add menu item to list
            var ul = lists.eq(listIndex);
            var items = $("li", ul);
            var itemsLength = items.length;

            if (typeof itemIndex === "undefined" || itemIndex >= itemsLength) {
                item.appendTo(ul);
            } else {
                item.insertBefore(this.items[itemIndex]);
            }

            // Add settings to menu item
            $("span", item).addClass(o.itemNameClass);

            this[refName] = $("a", item);
            this._addClickHandlerToMenuItem(this[refName], o.preventDefaultMenuItemAction);
        },

        getMenuItem: function (name) {
            return this[name];
        }
    });


    $.extend($.ui.epiContextMenu, {
        version: "0.1",
        eventPrefix: "epimenu",
        getter: "getMenuItem",
        defaults: {
            autohide: true,
            controlClass: "epi-contextMenu",
            firstListClass: "first",
            itemNameClass: "epi-contextMenuItemName",
            itemTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>',
            attachedTo: null, // Element this context menu is visually attached to.
            alignedRight: false,
            clickSelector: null, // A jQuery selector for elements that opens the context menu
            contextMenuSelector: null, // A jQuery selector for elements that opens the context menu on right click
            preventDefaultMenuItemAction: true,
            appendTo: null //The element that the context menu should be appended to when opened
        }
    });

})(epiJQuery);
