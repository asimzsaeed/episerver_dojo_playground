define("epi-cms/widget/XFormEditor", [

// Dojo
    "dojo/_base/declare",
    "dojo/_base/event",
    "dojo/_base/lang",
    "dojo/when",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/html",

// Dijit
    "dijit/focus",
    "dijit/form/Button",

// EPi Framework
    "epi/shell/widget/dialog/Dialog",
    "epi/dependency",

// EPi CMS
    "epi-cms/legacy/LegacyFormEditor",
    "epi-cms/_ContentContextMixin",
    "epi-cms/legacy/LegacyDialogPopup",
    "epi/routes",
    "epi-cms/widget/XFormPropertyWidget",

// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.legacy.legacyformeditor",
    "epi/i18n!epi/cms/nls/episerver.cms.widget.xformeditor"

], function (

// Dojo
    declare,
    event,
    lang,
    when,
    domClass,
    domStyle,
    domConstruct,
    query,
    html,

// Dijit
    focusManager,
    Button,

// EPi Framework
    Dialog,
    dependency,

// EPi CMS
    LegacyFormEditor,
    _ContentContextMixin,
    LegacyDialogPopup,
    routes,
    XFormPropertyWidget,

// Resources
    res,
    xformRes

) {
    return declare([LegacyFormEditor, _ContentContextMixin], {
        // tags:
        //      internal

        // localization: Object
        //      Mixin resource for LegacyFormEditor and XFormEditor
        localization: lang.mixin(res, xformRes),

        // destroyOnHide: Boolean
        //      Inherited doc
        destroyOnHide: true,

        // editorWidgetClass: Object
        //      Injected editor class
        editorWidgetClass: XFormPropertyWidget,

        // store: [Object]
        //      Represents the REST store to get data.
        store: null,

        // templateString: [protected] String
        //    Template for the widget.
        templateString: "\
            <div class=\"dijit dijitReset dijitInline dijitLeft dijitInputContainer epi-xFormEditor\">\
                <div data-dojo-attach-point=\"output\" data-dojo-type=\"dijit/form/TextBox\" value=\"${localization.helptext}\"></div>\
                <div data-dojo-type=\"dijit/form/Button\" data-dojo-attach-point=\"openButton\" data-dojo-attach-event=\"onClick: openEditor\" data-dojo-props=\"label:'${localization.buttonlabel}'\"></div>\
                <a href=\"#\" data-dojo-attach-point=\"viewDataLink\" data-dojo-attach-event=\"click: _openViewDataDialog\" title=\"${localization.viewdata.tooltip}\" class=\"disabled\">${localization.viewdata.text}</a>\
            </div>",

        postMixInProperties: function () {
            this.inherited(arguments);

            var registry = dependency.resolve("epi.storeregistry");
            this.store = this.store || registry.get("epi.cms.xform");
        },

        destroy: function () {
            this.inherited(arguments);

            if (this._updateDisplayPromise) {
                this._updateDisplayPromise.cancel();
                this._updateDisplayPromise = null;
            }
        },

        openEditor: function () {
            // summary:
            //      Overwrite base method to start editing
            // tags:
            //      public

            this.inherited(arguments);

            this.onFocus();
        },

        _createDialog: function () {
            // summary:
            //      Create editor dialog on first init
            // tags:
            //      Private

            if (this.contentLink) {
                lang.mixin(this.params, { contentLink: this.contentLink });
            } else {
                when(this.getCurrentContext(), lang.hitch(this, function (context) {
                    lang.mixin(this.params, { contentLink: context.id });
                }));
            }

            this.inherited(arguments);
        },

        _openViewDataDialog: function (evt) {
            // summary:
            //      Handle click event on view data link
            // evt: Object event
            //      On click event
            // tags:
            //      Private

            event.stop(evt);

            if (domClass.contains(this.viewDataLink, "disabled")) {
                return;
            }

            this._showFormDataDialog("Edit/XFormViewData.aspx", this.contentLink, this.value);
        },

        _onCancel: function () {
            // summary:
            //      Overwrite event when dialog close
            // tags:
            //      private
            this.inherited(arguments);

            // Always check form existed or not
            this.setDisplayValue(this.value);
        },

        _onDialogCancel: function () {
            // summary
            //      Overwrite event when dialog close
            // tags:
            //      private
            this.inherited(arguments);

            // Always check form existed or not
            this.setDisplayValue(this.value);
        },

        _showFormDataDialog: function (path, contentLink, formId) {
            // summary:
            //      Create new instance legacy dialog
            // tags:
            //      private
            var route = routes.getActionPath({
                    id: contentLink,
                    path: path,
                    moduleArea: "LegacyCMS",
                    IsInLegacyWrapper: true,
                    formid: formId
                }),
                dialog = new LegacyDialogPopup({
                    url: route,
                    dialogArguments: window.document,
                    showCancelButton: true,
                    features: { width: 750, height: 300 },
                    autoFit: true,
                    showLoadingOverlay: false
                });

            this.connect(dialog, "onLoad", function (loadedDocument) {

                if (!loadedDocument) {
                    return;
                }

                // The forms title indicator
                var h1 = query("h1[class=\"EP-prefix\"]", loadedDocument.containerIframe.contentDocument.body);
                domConstruct.create("span", { innerHTML: this.localization.viewdata.forms + " >" }, h1.parent()[0], "first");

                // Hide drop down control, the select form
                var selectForm = query("select[id$=\"SelectForm\"]", loadedDocument.containerIframe.contentDocument.body);
                if (selectForm) {
                    domStyle.set(selectForm.parent()[0], "display", "none");
                }

                // Hide checkbox control, show from all pages
                var showAllPages = query("input[type=\"checkbox\"][id$=\"ShowResultFromAllPages\"]", loadedDocument.containerIframe.contentDocument.body);
                if (showAllPages) {
                    domStyle.set(showAllPages.parent()[0], "display", "none");
                }
            });
            dialog.show();
        },

        _setDisplayTextAndValue: function (value) {
            // summary:
            //      sets the value and title for the textbox
            // tags:
            //      protected

            this.output.set("value", value);
            this.output.set("title", value);
        },

        setDisplayValue: function (value) {
            // summary:
            //  Update UI, include:
            //      + Set input value
            //      + Update view data link (display/hidden)
            // value: String
            //      New form id (GUID) or empty string
            // tags:
            //      Public


            // Set value to input box
            if (!value) {
                this._setDisplayTextAndValue(this.localization.helptext);

                // Hide view data link
                domClass.add(this.viewDataLink, "disabled");
                return;
            }

            this._updateDisplayPromise = when(this.store.query({ id: value }), lang.hitch(this, function (formData) {

                // Clear the pointer to the promise since it is resolved.
                this._updateDisplayPromise = null;

                if (formData && formData.name) {
                    this._setDisplayTextAndValue(formData.name);

                    // Show view data link
                    this.contentLink && domClass.remove(this.viewDataLink, "disabled");
                } else {
                    this.set("value", null);
                }

            }));
        }
    });
});
