require({cache:{
'url:epi/shell/widget/templates/LoginForm.htm':"﻿<div class=\"epi-form\">\r\n    <ul class=\"dijitReset\" data-dojo-attach-point=\"containerNode\">\r\n        <li>${resources.loggedout}</li>\r\n        <li>\r\n            <label>${resources.username}</label>\r\n            <input data-dojo-type=\"dijit/form/ValidationTextBox\" required=\"true\" data-dojo-attach-point=\"usernameNode\" name=\"username\" />\r\n        </li>\r\n        <li>\r\n            <label>${resources.password}</label>\r\n            <input data-dojo-type=\"dijit/form/ValidationTextBox\" required=\"true\" data-dojo-attach-point=\"passwordNode\" name=\"password\" type=\"password\" />\r\n        </li>\r\n    </ul>\r\n</div>\r\n"}});
﻿define("epi/shell/widget/LoginForm", [
    "epi",
    "dojo",
    "dojo/keys",
    "dojo/text!./templates/LoginForm.htm",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/ValidationTextBox", // Needed for the template
    "epi/i18n!epi/shell/ui/nls/EPiServer.Shell.UI.Resources.LoginForm"
], function (epi, dojo, keys, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ValidationTextBox, localization) {

    return dojo.declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      A login form widget
        //
        // tags:
        //      internal

        // templateString: [protected] String
        //		A string that represents the login form template.
        templateString: template,

        postMixInProperties: function () {
            // summary:
            //		Mixin language resources to the class.
            // tags:
            //		protected

            this.inherited(arguments);
            this.resources = dojo.mixin(epi.resources.action, localization);

            this.connect(this.passwordNode, "onkeydown", this._onKeyDown);
        },

        serializeForm: function () {
            // summary:
            //		Gets the username and password as entered by the user.

            return {
                username: this.usernameNode.get("value"),
                password: this.passwordNode.get("value")
            };
        },

        authenticationFailed: function () {
            // summary:
            //		Clears the password box and sets it's validation message to login failed.

            this.passwordNode.set("value", "");
            this.passwordNode.focus();
            this.passwordNode.displayMessage(this.resources.loginfailed);
        },

        _onKeyDown: function (e) {
            if (e.keyCode === keys.ENTER && !(e.ctrlKey || e.altKey || e.metaKey)) {
                this.onSubmit(e);
            }
        },

        onSubmit: function () {
            // summary:
            //		Callback when user submits the form.
            // tags:
            //		callback
        }
    });
});
