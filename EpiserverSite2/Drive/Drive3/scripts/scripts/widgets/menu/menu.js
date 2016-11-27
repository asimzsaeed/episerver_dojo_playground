define([
    "dojo/_base/declare",
    "mijit/_WidgetBase",
    "mijit/_TemplatedMixin",
    "dojo/text!./menu.html",
    "dojo/i18n!../nls/menu"
], function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    template,
    nls
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,

        postCreate: function () {
            this.inherited(arguments);
            this.homeNode.innerHTML = nls.homeLabel;
            this.studyNode.innerHTML = nls.studyLabel;
            this.currentContentNode.innerHTML = nls.currentContentLabel;
        }
    });
});