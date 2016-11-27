define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojo/query",
    "../widget/menu",
    "dojo/text!./loader.html",
    "dojo/text!./loader.css"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    query,
    MenuWidget,
    template,
    css
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,

        postCreate: function () {
            this.inherited(arguments);
            var menuWidget = new MenuWidget({}, this.menuNode);

            // setting style
            var styleElement = window.document.createElement('style');
            styleElement.setAttribute("type", "text/css");
            query('head')[0].appendChild(styleElement);

            if (styleElement.styleSheet) {
                styleElement.styleSheet.cssText = css; // IE
            } else {
                styleElement.innerHTML = css; // the others
            }
        }
    });
});