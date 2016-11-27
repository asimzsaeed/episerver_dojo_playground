require({cache:{
'url:epi/shell/widget/templates/MenuHeaderSeparator.html':"<tr class=\"dijitMenuSeparator epi-invertedTooltip\" role=\"separator\">\n    <td colspan=\"4\">\n        <div class=\"epi-tooltipDialogTop\">\n            <span data-dojo-attach-point=\"labelNode\"></span>\n            <div class=\"dijitTooltipConnector\"></div>\n        </div>\n    </td>\n</tr>\n"}});
define("epi/shell/widget/MenuHeaderSeparator", [
    "dojo/_base/declare",
    "dijit/MenuSeparator",
    "dojo/text!./templates/MenuHeaderSeparator.html"
],
function (declare, MenuSeparator, template) {

    return declare([MenuSeparator], {
        // summary:
        //      Drop down menu header. A fancy menu separator with a title.
        // tags:
        //      internal

        templateString: template,

        // label: [public] String
        //      Sets the label text in the header
        _setLabelAttr: {node: "labelNode", type: "innerHTML" }
    });
});
