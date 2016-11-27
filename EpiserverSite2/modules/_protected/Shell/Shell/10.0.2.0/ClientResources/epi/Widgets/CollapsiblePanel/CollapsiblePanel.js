(function ($) {

    $.widget("ui.epiCollapsiblePanel", {
        /// <summary>
        ///     epiCollapsiblePanel widget.
        ///     Depends: ui.core.js, ui.effects.js, Toolbar.js
        /// </summary>
        _init: function () {
            /// <summary>
            ///     epiCollapsiblePanel widget initialization
            /// </summary>
            var self = this;

            var options = this.options;

            this._headerPanel = $(options.headerContentSelector, self.element);
            this._contentPanel = $(options.contentSelector, self.element);

            $("a", this._headerPanel).toggle(function (e) {
                self.collapse(e);
            }, function (e) {
                self.expand(e);
            });
        },
        expand: function (e) {
            /// <summary>
            ///     Expands the panel
            /// </summary>
            var options = this.options;
            this._headerPanel.removeClass(options.collapsedClass);
            this._contentPanel.show();
        },
        collapse: function (e) {
            /// <summary>
            ///     Collapses the panel
            /// </summary>
            var options = this.options;
            this._headerPanel.addClass(options.collapsedClass);
            this._contentPanel.hide();
        }
    });

    $.extend($.ui.epiCollapsiblePanel, {
        version: "0.1",
        eventPrefix: "epicollapsiblepanel",
        defaults: {
            collapsedClass: "epi-collapsiblePanel-header-collapsed",
            headerContentSelector: ".epi-collapsiblePanel-header",
            contentSelector: ".epi-collapsiblePanel-content"
        }
    });
})(epiJQuery);
