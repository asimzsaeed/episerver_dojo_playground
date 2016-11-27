(function ($) {

    $.widget("ui.epiFoldOutPanel", {
        /// <summary>
        ///     epiFoldOutPanel widget.
        ///     Depends: ui.core.js, ui.effects.js, Toolbar.js
        /// </summary>
        _init: function () {
            /// <summary>
            ///     epiFoldOutPanel widget initialization
            /// </summary>
            var self = this;

            var options = this.options;

            var panel = (this._panel = this.element)
                .hide()
                .addClass(options.panelClass)
                .wrapInner("<div><div></div></div>");

            var panelBody = (this._panelBody = panel.children().eq(0))
                .addClass(options.panelBodyClass);

            var innerContent = (this._innerContent = panelBody.children().eq(0))
                .show()
                .attr("aria-hidden", "true")
                .attr("role", "group")
                .addClass(options.panelContentClass);

            $('<a/>')
                .addClass(options.panelSplitterClass)
                .attr("href", "#")
                .attr("title", options.collapseButtonDescription)
                .html("<span>" + options.collapseButtonText + "</span>")
                .click(function (e) {
                    self.collapse(e);
                    return false;
                })
                .appendTo(panel);

            var panelHeader = (this.panelHeader = $('<div/>'))
                .addClass(options.panelHeaderClass)
                .append("<h3>" + options.panelHeaderText + "</h3>")
                .prependTo(panel);

            if (options.showClosebutton) {
                $.extend(options.buttons, {
                    closeButton: {
                        text: options.collapseButtonText,
                        description: options.collapseButtonDescription,
                        buttonClass: options.panelCloseButtonClass,
                        click: function (e) {
                            self.collapse(e); return false;
                        },
                        clickable: true,
                        tabIndex: 0
                    }
                });
            }

            $('<div/>').epiToolbar({
                buttons: options.buttons,
                controlsClass: options.panelControlsClass
            })
                .appendTo(panelHeader);

            (options.autoOpen && this.expand());
        },
        expand: function (e) {
            /// <summary>
            ///     Expands the panel with a blind effect
            /// </summary>
            if (!this._trigger("beforeexpand", null)) {
                return;
            };
            var effectOptions = {};
            this._panelBody.hide();
            this._panel.show();
            var self = this;
            var callback = function () {
                self._trigger("expand", null);
            };
            this._innerContent.attr("aria-hidden", "false");
            this._panelBody.show("blind", effectOptions, 120, callback);

        },
        collapse: function (e) {
            /// <summary>
            ///     Collapses the panel with a blind effect
            /// </summary>
            if (!this._trigger("beforecollapse", null)) {
                return;
            }
            var effectOptions = {};
            var self = this;
            var callback = function () {
                self._panel.hide();
                self._panelBody.show();
                self._innerContent.attr("aria-hidden", "true");
                self._trigger("collapse", null);
            };
            this._panelBody.hide("blind", effectOptions, 120, callback);

        }
    });

    $.extend($.ui.epiFoldOutPanel, {
        version: "0.1",
        eventPrefix: "epifoldoutpanel",
        defaults: {
            panelClass: "epi-foldOutPanel",
            panelBodyClass: "epi-foldOutPanel-body",
            panelHeaderClass: "epi-foldOutPanel-header",
            panelSplitterClass: "epi-foldOutPanel-splitter",
            panelControlsClass: "epi-foldOutPanel-controls",
            panelContentClass: "epi-foldOutPanel-content",
            panelCloseButtonClass: "epi-iconToolbar-close",
            panelHeaderText: "",
            autoOpen: false,
            showClosebutton: true,
            collapseButtonText: "Collapse",
            collapseButtonDescription: "Hide this panel.",
            buttons: {
            // <example>
            //  exampleButton: {
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
