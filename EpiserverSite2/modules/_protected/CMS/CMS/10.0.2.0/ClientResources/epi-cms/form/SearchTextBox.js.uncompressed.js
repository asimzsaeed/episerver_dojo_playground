require({cache:{
'url:epi-cms/form/templates/SearchTextBox.html':"﻿<div class=\"dijit dijitReset dijitInline dijitLeft\" id=\"widget_${id}\" waiRole=\"presentation\">\n    <div class=\"dijitReset dijitInputField dijitInputContainer\">\n        <div style=\"float: left;width:100%;\">\n            <div style=\"float: left; padding-right: 16px;\">\n                <input class=\"dijitReset dijitInputInner\" dojoAttachPoint=\"textbox,focusNode\" dojoAttachEvent=\"onkeyup: _valueChanged\" autocomplete=\"off\" ${!nameAttrSetting} type=\"${type}\" />\n            </div>\n        </div>\n        <span class=\"epiDeleteIcon\" dojoAttachPoint=\"clearButton\" style=\"width:16px; height: 16px; float: left; margin-left: -16px\" alt=\"\"></span>\n        <div style=\"clear: both; width: 0; height: 0; border: 0; padding: 0; margin: 0;\"></div>\n    </div>\n</div>"}});
﻿define("epi-cms/form/SearchTextBox", [
    "epi",
    "dojo/_base/declare",
    "dijit/form/TextBox",
    "dojo/text!./templates/SearchTextBox.html"],

function (epi, declare, TextBox, template) {

    return declare([TextBox], {
        // tags:
        //      internal

        templateString: template,

        postCreate: function () {
            this.inherited(arguments);
            this.connect(this.clearButton, "onclick", function () {
                this.set("value", "");
                this._valueChanged();
            }.bind(this));
        },

        _valueChanged: function () {
            if (this.onTextChange) {
                this.onTextChange();
            }
        }
    });
});
