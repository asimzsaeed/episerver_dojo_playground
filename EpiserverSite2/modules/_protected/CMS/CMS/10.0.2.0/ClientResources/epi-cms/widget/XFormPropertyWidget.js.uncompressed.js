define("epi-cms/widget/XFormPropertyWidget", [

// Dojo
    "dojo/_base/declare",
    "dojo/_base/lang",

// EPi Framework
    "epi/epi",
    "epi/routes",

// EPi CMS
    "epi-cms/legacy/LegacyDialogWrapper",
    "epi-cms/core/ContentReference",

// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.widget.xformeditor"

], function (

// Dojo
    declare,
    lang,

// EPi Framework
    epi,
    routes,

// EPi CMS
    LegacyDialogWrapper,
    ContentReference,

// Resources
    res

) {
    return declare([LegacyDialogWrapper], {
        // summary:
        //	   Webform editor for a CMS property.
        //     Extend the epi-cms/legacy/LegacyDialogWrapper to be a value widget, specific for EditProperty dialog
        //
        // tags:
        //      internal

        // title: String
        //      Title of the slect form dialog
        title: res.selectform,

        onChange: function (newValue) {
            // summary:
            //    Triggered when the value is changed
            //
            // newValue: Object
            //    The newly changed value
            //
            // tags:
            //    public callback
        },

        postMixInProperties: function () {
            // summary:
            //	   Initialize epi-cms/legacy/LegacyDialogWrapper's parameters to be specific to XFormProperty dialog.

            this.features = lang.mixin({ width: 800, height: 400 }, this.editorFeatures); // initial size

            this.autoFit = true;

            this.connect(this, "onCallback", "_onCallback");

            this.inherited(arguments);
        },

        startup: function () {
            // summary:
            //      Overridden to set the url based on the current page context

            this.inherited(arguments);

            this.set("url", this._buildIframeUrl());
        },

        onCancel: function () {
            // summary:
            //      Event is raised when user cancel editor
            // tags:
            //      Public callback
        },

        _buildIframeUrl: function () {
            // summary:
            //      Utilities function to build Url for iframe
            // tags:
            //      Private

            var routeParams = {
                moduleArea: "LegacyCMS",
                path: "edit/XFormSelect.aspx",
                epslanguage: this.contentLanguage,
                propertyname: this.fullName
            };

            lang.mixin(routeParams, {
                pageId: new ContentReference(this.contentLink).createVersionUnspecificReference().id,
                form: this.value ? this.value : ""
            });

            return routes.getActionPath(routeParams);
        },

        _onCallback: function (result) {
            // summary:
            //      Handle response event on web form view
            // result: Object
            //      Return data from web form view, it will:
            //          + Null if user chose <no form> action
            //          + Empty if user chose <cancel> action
            // tags:
            //      Private

            var newValue = result ? result.id : null;

            // Fire onchange if user change value only
            if (!epi.areEqual(this.value, newValue) && result !== null) {
                this.value = newValue;
                this.onChange(newValue);
            } else {
                this.onCancel();
            }
        }
    });
});
