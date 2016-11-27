require({cache:{
'url:epi-cms/widget/templates/_LegacySelectorBase.html':"﻿<div class='dijitReset dijitInputField dijitInputContainer dijitInline epi-resourceInputContainer' id='widget_${id}' data-dojo-attach-point='dropAreaNode'>\r\n    <input type='text' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-event=\"onChange:_onTextboxChange, onBlur:_onTextboxBlur\" data-dojo-attach-point='textbox'/>\r\n    <div data-dojo-type=\"dijit/form/Button\" data-dojo-attach-point=\"button\" data-dojo-attach-event=\"onClick:_showDialog\"></div>\r\n</div>"}});
﻿define("epi-cms/widget/_LegacySelectorBase", [
    // dojo
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-attr",

    // dijit
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/Button",
    "dijit/form/TextBox",

    // epi.shell
    "epi/dependency",

    // epi.cms
    "epi-cms/legacy/LegacyDialogPopup",
    "epi-cms/widget/_HasChildDialogMixin",
    "epi-cms/widget/_Droppable",
    "epi/shell/widget/_ValueRequiredMixin",

    // resources
    "dojo/text!./templates/_LegacySelectorBase.html"
],
function (
// dojo
    declare,
    lang,
    domAttr,

// dijit
    _Widget,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Button,
    TextBox,

// epi.shell
    dependency,

// epi.cms
    LegacyDialogPopup,
    _HasChildDialogMixin,
    _Droppable,
    _ValueRequiredMixin,

// resources
    template) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _HasChildDialogMixin, _ValueRequiredMixin, _Droppable], {
        // summary:
        //    Editor widget for a file selector property.
        // tags:
        //      internal

        // _legacyDialogUrl: [public] String
        //    A string that represents the URL to the file browser dialog.
        _legacyDialogUrl: null,

        // contentLink: [pubic] String
        //      Content reference of the content currently being edited.
        contentLink: "",

        // templateString: [protected] String
        //    A string that represents the default widget template.
        templateString: template,

        value: null,

        postMixInProperties: function () {
            this.inherited(arguments);

            if (!this._legacyDialogUrl) {
                this._legacyDialogUrl = this.getLegacyDialogUrl();
            }
        },

        destroy: function () {

            if (this._dialog) {
                this._dialog.destroyRecursive();
                delete this._dialog;
            }

            this.inherited(arguments);

        },

        postCreate: function () {
            // summary:
            //    Set the value to the textbox after the DOM fragment is created.
            // tags:
            //    protected

            this.inherited(arguments);

            //We need to set the label here
            this.button.set("label", "...");
        },

        _setStateAttr: function (value) {
            this._set("state", value);
            this.textbox.set("state", value);
        },

        onDrop: function () {
            // summary:
            //    Triggered when something has been dropped onto the widget.
            //
            // tags:
            //    public callback

            this.focus();
            this.onChange(this.value);
        },

        onChange: function () { },

        getLegacyDialogUrl: function () {
            return "";
        },

        getLegacyDialogParameters: function () {
            return {};
        },

        getValueFromCallbackResult: function (callbackResult) {
            return null;
        },

        isCancelOnCallback: function (callbackResult) {
            return false;
        },

        _showDialog: function () {
            if (!this._dialog) {
                var params = this.getLegacyDialogParameters();

                this._dialog = new LegacyDialogPopup(lang.mixin(params, {
                    url: this._legacyDialogUrl
                }));

                this.connect(this._dialog, "onCallback", this._onCallback);
                this.connect(this._dialog, "onHide", this._onHide);
            }

            this.isShowingChildDialog = true;

            this._dialog.show();
        },

        _onHide: function () {
            this.isShowingChildDialog = false;

            this._dialog.destroyRecursive();
            delete this._dialog;
        },

        _onCallback: function (value) {
            if (!value || this.isCancelOnCallback(value)) {
                return;
            } else {
                var val = this.getValueFromCallbackResult(value);
                if (this.value !== val) {
                    this.set("value", val);
                    this.onChange(this.value);
                }
            }
        },

        _onTextboxChange: function (value) {

            var hasChanged = value !== this.value;

            if (hasChanged) {
                this._set("value", value);
                this.onChange(this.value);
            }
        },

        _onTextboxBlur: function () {
            // blur event may happen before textbox's onchange event.
            this._set("value", this.textbox.value);
        },

        _setValueAttr: function (value) {
            this._set("value", value);
            this.textbox.set("value", this.value || ""); // Set a textbox's value to null in IE will make it display 'null'
            this._legacyDialogUrl = this.getLegacyDialogUrl();

            this._started && this.validate();
        },

        _setReadOnlyAttr: function (value) {
            this._set("readOnly", value);

            this.button.set("disabled", value);
            this.textbox.set("disabled", value);
        },

        focus: function () {
            this.button.focus();
        }
    });
});
