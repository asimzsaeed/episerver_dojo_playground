(function ($) {
    $.widget("ui.epiToolTip", {
        _init: function () {
            this.element.attr("aria-hidden", true);
            var opener = this._selectOpener();
            opener.data("opensToolTip", this.element[0])
                .hover(this._onMouseOver, this._onMouseOut)
                .focus(this._onMouseOver)
                .blur(this._onMouseOut);
        },
        _onMouseOver: function () {
            var tt = $(this).data("opensToolTip");
            var offset = $(this).offset();
            var top = offset.top + $(this).height();
            var left = offset.left;

            $(tt).show()
                 .attr("aria-hidden", false)
                 .css("top", top)
                 .css("left", left);
            if (tt.parentElement !== document.body) {
                $(tt).appendTo(document.body);
            }
        },
        _onMouseOut: function () {
            var tt = $(this).data("opensToolTip");
            $(tt).hide().attr("aria-hidden", true);
        },
        _selectOpener: function () {
            if (this.options.openerSelector) {
                return $(this.options.openerSelector);
            }
            return this.element.prev("*");
        },
        destroy: function () {
            this.element.unbind('focus', this._onMouseOver);
            this.element.unbind('blur', this._onMouseOut);
            this.element.unbind('mouseenter', this._onMouseOver);
            this.element.unbind('mouseleave', this._onMouseOut);
            this.element.removeAttr('aria-hidden');
            this.element.css('top', '');
            this.element.css('left', '');
        }
    });
    $.extend($.ui.epiToolTip, {
        version: "0.1",
        defaults: {
            openerSelector: null
        }
    });
})(epiJQuery);
