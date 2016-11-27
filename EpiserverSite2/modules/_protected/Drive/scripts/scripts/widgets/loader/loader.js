define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/query",
    "../menu/menu",
    "dojo/text!./loader.html"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    query,
    MenuWidget,
    template
) {
    return declare('Vizob.LoaderWidget', [_WidgetBase, _TemplatedMixin], {
        templateString: template,

        postCreate: function () {
            this.inherited(arguments);
            var menuWidget = new MenuWidget({}, this.menuNode);
        }
    });
});