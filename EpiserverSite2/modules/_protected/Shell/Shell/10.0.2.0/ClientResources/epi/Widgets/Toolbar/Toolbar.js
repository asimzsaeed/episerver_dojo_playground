(function ($) {

    $.widget("ui.epiToolbar", {
        /// <summary>
        ///     epiToolbar widget.
        ///     Depends: ui.core.js, ui.effects.js
        /// </summary>
        _init: function () {
            /// <summary>
            ///     epiToolbar widget initialization
            /// </summary>

            var options = this.options;

            // If supplied element is not an ul create an itemList(ul).
            if (this.element.get(0).tagName !== "UL") {
                this.element.addClass(options.controlsClass);
                this.itemList = $('<ul></ul>').addClass(options.listClass)
                                            .appendTo(this.element);
            } else {
                this.itemList = this.element.addClass(options.listClass);
            }

            this._createButtons(options.buttons);
        },

        _createButtons: function (buttons) {
            var self = this;

            var options = this.options;

            hasButtons = false;

            (typeof buttons === 'object' && buttons !== null &&
			$.each(buttons, function () {
    return !(hasButtons = true);
}));

            if (hasButtons) {
                $.each(buttons, function (name, buttonObject) {
                    var listItem = $('<li></li>')
                        .addClass(options.listItemClass);

                    var tabIndex = typeof buttonObject.tabIndex !== "undefined" ? buttonObject.tabIndex : -1;

                    if (typeof buttonObject.description === "undefined" || buttonObject.description.length === 0) {
                        buttonObject.description = buttonObject.text;
                    } else if (buttonObject.text === "undefined" || buttonObject.text.length === 0) {
                        buttonObject.text = buttonObject.description;
                    }

                    var item = (self[name] = $('<a></a>'))
                        .attr("href", "#")
                        .addClass(options.listItemLinkCass)
                        .addClass(buttonObject.buttonClass)
                        .attr("title", buttonObject.description)
                        .append('<span>' + buttonObject.text + '</span>')
                        .appendTo(listItem)
                        .attr("tabindex", tabIndex);

                    if (typeof buttonObject.click == "function") {
                        item.click(buttonObject.click);
                    }

                    listItem.appendTo(self.itemList);
                });
            }
        },

        getButton: function (name) {
            return this[name];
        }

    });

    $.extend($.ui.epiToolbar, {
        version: "0.1",
        getter: "getButton",
        defaults: {
            controlsClass: "epi-itemList-controls", // Won't be used if supplied element is of type ul.
            listClass: "epi-iconToolbar",
            listItemClass: "epi-iconToolbar-item",
            listItemLinkCass: "epi-iconToolbar-item-link",
            buttons: {
            // <example>
            //  exampleButton: {
            //      text: "text",               // The text inside the link (button).
            //      description: "no-title",          // The title of the link (button).
            //      buttonClass: "no-class",    // The class of the link (button icon).
            //      click: function(e) { },     // The function to run link is clicked
            //      tabIndex: -1                // What tabindex the button should have
            //  }
            // </example>
            }
        }
    });
})(epiJQuery);
