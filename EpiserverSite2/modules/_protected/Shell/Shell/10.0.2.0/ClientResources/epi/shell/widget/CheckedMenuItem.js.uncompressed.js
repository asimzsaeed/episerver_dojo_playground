require({cache:{
'url:epi/shell/widget/templates/CheckedMenuItem.html':"﻿<tr class=\"dijitReset dijitMenuItem\" data-dojo-attach-point=\"focusNode\" role=\"menuitemcheckbox\" tabIndex=\"-1\">\r\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\r\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuItemIcon dijitCheckedMenuItemIcon\"/>\r\n\t\t<img src=\"${_blankGif}\" data-dojo-attach-point=\"iconNode\"/>\r\n\t\t<span class=\"dijitCheckedMenuItemIconChar\">&#10003;</span>\r\n\t</td>\r\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" data-dojo-attach-point=\"containerNode,labelNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" data-dojo-attach-point=\"accelKeyNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">&#160;</td>\r\n</tr>\r\n"}});
﻿define("epi/shell/widget/CheckedMenuItem", [
    "dojo/_base/declare",
    "dijit/CheckedMenuItem",
    "dojo/text!./templates/CheckedMenuItem.html"
], function (declare, CheckedMenuItem, template) {

    return declare(CheckedMenuItem, {
        // summary:
        //		A checkbox-like menu item for toggling on and off
        //
        // tags:
        //      internal xproduct

        // templateString: String
        //      The widget template string.
        templateString: template
    });
});
