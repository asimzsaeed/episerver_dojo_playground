require({cache:{
'url:epi/shell/widget/templates/RadioMenuItem.htm':"﻿<tr class=\"dijitReset dijitMenuItem\" data-dojo-attach-point=\"focusNode\" role=\"menuitemradio\" tabIndex=\"-1\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuItemIcon dijitCheckedMenuItemIcon\" data-dojo-attach-point=\"iconNode\"/>\n\t\t<span class=\"dijitCheckedMenuItemIconChar\">&#10003;</span>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\"><span class=\"dijitInline dijitReset dijitIcon\" data-dojo-attach-point=\"labelIconNode\"></span> <span data-dojo-attach-point=\"containerNode, labelNode\"></span></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" data-dojo-attach-point=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">&#160;</td>\n</tr>"}});
﻿define("epi/shell/widget/RadioMenuItem", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/dom-class",
    "dijit/CheckedMenuItem",
    "dojo/text!./templates/RadioMenuItem.htm"],
function (declare, array, domClass, CheckedMenuItem, template) {
    return declare([CheckedMenuItem], {
        // summary:
        //		Override CheckedMenuItem type to RadioButton type.
        // tags:
        //		Public

        // baseClass: [protected] String
        //    The root className to be placed on this widget's domNode.
        baseClass: "dijitMenuItem epi-radioMenuItem",
        iconClass: null,

        templateString: template,

        _onClick: function (/*Event*/e) {
            // summary:
            //		Clicking this item, clear all state, toggles its state
            // tags:
            //		private

            this._resetState();
            this.inherited(arguments);
        },

        _resetState: function () {
            // summary:
            //		Clicking this item, clear all state, toggles its state
            // tags:
            //		private

            // reset children state to false

            array.forEach(this._getChildren(), function (child, index) {
                child.set("checked", false);
            });
        },

        _getChildren: function () {
            // summary:
            //		Get all menu items.
            // tags:
            //		private

            return this.getParent().getChildren();
        },

        _setIconClassAttr: function (iconClass) {
            this._set("iconClass", iconClass);
            domClass.add(this.labelIconNode, iconClass);
        }
    });
});
