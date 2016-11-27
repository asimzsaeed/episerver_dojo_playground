define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./build.html"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    template
) {
    return declare('Vizob.BuildWidget', [_WidgetBase, _TemplatedMixin], {
        templateString: template,
        constructor: function () {
            this.baseUrl = "https://www.google.co.uk/";
        },
        postCreate: function () {
            this.inherited(arguments);
        }
    });
});