define("epi-cms/legacy/EditPropertyWidget", [
    "epi",
    "dojo",
    "dijit",
    "dojo/i18n",
    "dojo/string",
    "dojox/html/entities",
    "epi-cms/contentediting/RenderManager",
    "epi-cms/legacy/LegacyDialogWrapper",
    "epi/routes"],

function (epi, dojo, dijit, i18n, dojoString, dojoxEntities, RenderManager, LegacyDialogWrapper, routes) {

    return dojo.declare([LegacyDialogWrapper], {
        // summary:
        //	   Webform editor for a CMS property.
        //     Extend the epi-cms/legacy/LegacyDialogWrapper to be a value widget, specific for EditProperty dialog
        //
        // tags:
        //      internal

        editorFeatures: null,

        value: "",

        // contentLink: [public] String
        //      Content reference of the content being edited.
        //      Either contentLink or contentTypeId need to be set.
        contentLink: null,

        // contentTypeId: [public] Number
        //      Content type id of the content being edited.
        //      Either contentLink or contentTypeId need to be set.
        contentTypeId: null,

        // contentLanguage: [public] String
        //      The content language.
        contentLanguage: null,

        // propertyName: [public] String
        //      The property name.
        propertyName: null,

        // fullName: [public] String
        //      Fully qualified property name. E.g. MainTeaser.MyBlock.Name
        fullName: null,

        _reloadOnNextEdit: false,

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
            //	   Initialize epi-cms/legacy/LegacyDialogWrapper's parameters to be specific to EditProperty dialog.

            this.features = dojo.mixin({ width: 400, height: 30 }, this.editorFeatures); // initial size

            this.autoFit = true;

            this.connect(this, "onCallback", "_onCallback");

            this.inherited(arguments);
        },

        startup: function () {
            // summary:
            //      Overridden to set the url based on the current page context
            this.inherited(arguments);

            var routeParams = {
                moduleArea: "LegacyCMS",
                path: "edit/EditProperty.aspx",
                epslanguage: this.contentLanguage,
                propertyname: this.fullName
            };

            dojo.mixin(routeParams, this.contentLink ? {
                id: this.contentLink
            } : {
                contentTypeId: this.contentTypeId,
                parentLink: this.parentLink
            });

            this.set("url", routes.getActionPath(routeParams));
        },

        _setUrlAttr: function (url) {
            // If we rely on saved property value, the editor will not display updated value until the sync service has done its job.
            // Therefore, we need to POST the current value to server. (GET is not suitable since url length is limited to 2048 characters)
            // Override Url setter to be able to load the edit property dialog using POST.

            //set current Url
            this._currentUrl = url;

            //using dojox.html.entities to html encode the value
            var value = dojoxEntities.encode(dojo.toJson(this.value));
            //Create a post form
            var postForm = dojoString.substitute("<html><body><form method=\"post\" action=\"${0}\" ><input type=\"hidden\" name=\"value\" value=\"${1}\" /></form></body></html>", [url, value]);
            this.containerIframe.contentDocument.write(postForm);

            //Submit
            this.containerIframe.contentDocument.forms[0].submit();
        },

        _onCallback: function (result) {

            // deserialize value
            var newStringValue = result.value;
            var newValue = dojo.fromJson(newStringValue);

            if (this._oldStringValue === undefined) {
                this._oldStringValue = dojo.toJson(this.value);
            }

            if (newStringValue !== this._oldStringValue) {
                this._oldStringValue = dojo.toJson(newValue);
                this.value = newValue;
                this.onChange(newValue);
            } else {
                this.onCancel();
            }
        },

        resize: function () {
            this.inherited(arguments);
            if (this._reloadOnNextEdit) {
                this._reloadOnNextEdit = false;
                this._reloadUrl(true);
            }
        },

        _setValueAttr: function (value) {
            //summary:
            //    Value's setter. Reload the src in the container iframe if value is not equal.
            //
            // value: String
            //    Value to be set.
            //
            // tags:
            //    private

            this._set("value", value);
            if (this._started) {
                this._reloadOnNextEdit = true;
            }
        }
    });

});
