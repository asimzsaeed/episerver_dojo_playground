define("epi-cms/legacy/LegacyFormEditor", [
// Dojo
    "dojo/_base/declare",
    "dojo/_base/lang",

// Dijit
    "dijit/focus",
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/Button",

// EPi Framework
    "epi",
    "epi/dependency",
    "epi/shell/widget/dialog/Dialog",

// EPi CMS
    "epi-cms/widget/_HasChildDialogMixin",
    "epi/shell/widget/_ValueRequiredMixin",
    "epi-cms/legacy/EditPropertyWidget",

// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.legacy.legacyformeditor"
], function (
// Dojo
    declare,
    lang,

// Dijit
    focusManager,
    _Widget,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Button,

// EPi Framework
    epi,
    dependency,
    Dialog,

// EPi CMS
    _HasChildDialogMixin,
    _ValueRequiredMixin,
    EditPropertyWidget,

// Resources
    res
) {
    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _HasChildDialogMixin, _ValueRequiredMixin], {
        // tags:
        //      internal

        localization: res,

        // destroyOnHide: Boolean
        //      Flag to indicates that we should destroy when dialog hide or not
        destroyOnHide: false,

        // editorWidgetClass: Object
        //      Injected editor class
        editorWidgetClass: EditPropertyWidget,

        // templateString: [protected] String
        //    Template for the widget.
        templateString: "\
            <div class=\"dijit dijitReset dijitInline dijitLeft epi-legacyFormEditor\">\
                <div data-dojo-type=\"dijit/form/Button\" data-dojo-attach-point=\"openButton\" data-dojo-attach-event=\"onClick: openEditor\" data-dojo-props=\"label:'${localization.helptext}'\"></div>\
            </div>",

        editorWidget: null,
        value: null,
        multiple: false,

        // contentLink: [pubic] String
        //      Content reference of the content being edited.
        //      Either contentLink or contentTypeId need to be set.
        contentLink: null,

        // contentTypeId: [pubic] Number
        //      Content type id of the content being edited.
        //      Either contentLink or contentTypeId need to be set.
        contentTypeId: null,

        // contentLanguage: [pubic] String
        //      The content language.
        contentLanguage: null,

        // propertyName: [pubic] String
        //      The property name.
        propertyName: null,

        _dialog: null,

        onChange: function () {
            // summary:
            //    Triggered when the cancel button is clicked.
            //
            // tags:
            //    public callback
        },

        postCreate: function () {
            this.inherited(arguments);
            lang.mixin(this.params, { contentLink: this.contentLink });
        },

        buildRendering: function () {
            this.inherited(arguments);

            if (this.output) {
                this.output.set("disabled", true);
            }
        },

        destroy: function () {
            if (this._dialog) {
                this._dialog.destroyRecursive();
            }
            this.inherited(arguments);
        },

        _setReadOnlyAttr: function (value) {
            this._set("readOnly", value);

            this.openButton.set("disabled", value);
        },

        _setValueAttr: function (value) {
            this._set("value", value);

            // sync the same value to editor instance if its different
            if (this.editorWidget && !epi.areEqual(value, this.editorWidget.get("value"))) {
                this.editorWidget.set("value", value);
            }

            this.setDisplayValue(value);
        },

        _onChange: function () {
            var value = this.editorWidget.get("value");

            // we need to sync the editor value with the instance's value
            this.set("value", value);

            this.onChange(value);

            if (this._dialog && this._dialog.open) {
                this._dialog.hide();
            }
        },

        _onCancel: function () {
            this._dialog.hide();
        },

        _onDialogHide: function () {
            this.isShowingChildDialog = false;
            if (this.destroyOnHide) {
                this.editorWidget = this._dialog = null;
            }
        },

        openEditor: function () {

            this.isShowingChildDialog = true;

            if (!this._dialog) {
                this._createDialog();
            }

            //Reset the edit property widget, force it reload to match the new value
            this.editorWidget.set("value", this.value);

            this._dialog.show();
        },

        _createDialog: function () {
            // Create editor widget
            var editorClass = this.editorWidgetClass;
            this.editorWidget = new editorClass(this.params);

            // Create dialog and set content
            this._dialog = new Dialog({
                destroyOnHide: this.destroyOnHide,
                content: this.editorWidget,
                title: this.editorWidget.title || this.label,
                defaultActionsVisible: false,
                dialogClass: "",
                contentClass: "epi-dialog-fullWidth"
            });

            // ESC and TAB could cancel and save.  Note that edit widgets do a stopEvent() on ESC key (to
            // prevent Dialog from closing when the user just wants to revert the value in the edit widget),
            // so this is the only way we can see the key press event.
            this.connect(this.editorWidget, "onResize", lang.hitch(this, function () {
                this._dialog.resize();
            }));

            this.connect(this.editorWidget, "onChange", "_onChange");
            this.connect(this.editorWidget, "onCancel", "_onCancel");
            this.connect(this._dialog, "onHide", "_onDialogHide");
        },

        setDisplayValue: function (value) {
            //Override to display something meaningful to user

            if (this.output) {
                this.output.set("value", this.localization.helptext);
            }
        },

        focus: function () {
            // summary:
            //		Put focus on the edit button.
            this.openButton.focus();
        }
    });
});
