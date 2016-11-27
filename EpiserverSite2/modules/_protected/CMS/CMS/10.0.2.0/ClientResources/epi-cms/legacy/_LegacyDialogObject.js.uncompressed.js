define("epi-cms/legacy/_LegacyDialogObject", ["dojo/_base/declare", "dojo/_base/kernel"], function (declare, kernel) {

    return declare(null, {
        // summary: Simulate the Dialog object from old UI.
        //
        // tags:
        //    internal

        // properties
        _dialog: null,

        // constructor
        constructor: function (params) {
            //TODO: Use dojo.mixin

            this.callbackMethod = params.callbackMethod || null;
            this.callbackArguments = params.callbackArguments || null;
            this.dialogArguments = params.dialogArguments || null;
            this._opener = (params.opener ? params.opener.top : window.top);

            // If another dialog calls code in main window (TinyMCE) we want the _opener reference to be that dialog window.
            while (this._opener.EPiOpenedDialog && this._opener.EPiOpenedDialog._dialog) {
                this._opener = this._opener.EPiOpenedDialog._dialog;
            }
            this._opener.EPiOpenedDialog = this;
        },

        Close: function (returnValue) {
            // summary:
            //    Close the dialog
            //
            // returnValue:
            //    value passed to callback method on return
            //
            // tags:
            //    public

            // When the dialog is closing call the callbackMethod function (if specified) to do whatever it is supposed to with the result of the dialog.
            if (typeof (this.callbackMethod) == "function") {
                (this.callbackMethod).call(this, returnValue, this.callbackArguments);
            }
        },

        ButtonChanged: function (button) {
            // summary:
            //    Notify that there are some button changed
            //
            // button:
            //    The button which changes
            //
            // tags:
            //    public
        },

        Cleanup: function () {
            this._CleanDialog();

            if (this._opener) {
                this._opener.EPiOpenedDialog = null;
            }
            delete this._opener;

            this.callbackMethod = null;
            this.callbackArguments = null;

            delete this.callbackMethod;
            delete this.callbackArguments;

            this._cleaned = true;
        },

        IsCleaned: function () {
            return this._cleaned;
        },

        // Clean up properties of this dialog
        _CleanDialog: function () {
            // summary:
            //    Clean up opened dialog information from global scope.
            //
            // tags:
            //    private

            for (var prop in this) {
                if (prop !== "callbackMethod" && prop !== "callbackArguments" && prop !== "_opener") {
                    this[prop] = null;
                    delete this[prop];
                }
            }
        }
    });

});
