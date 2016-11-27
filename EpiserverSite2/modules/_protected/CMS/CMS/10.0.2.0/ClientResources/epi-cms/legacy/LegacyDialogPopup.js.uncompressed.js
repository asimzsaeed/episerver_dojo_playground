define("epi-cms/legacy/LegacyDialogPopup", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",

    "dojo/dom-class",
    "dojo/dom-construct",

    "dojo/Deferred",
    "dojo/DeferredList",
// epi
    "epi",
    "epi/shell/widget/dialog/Dialog"
],

function (
// dojo
    declare,
    lang,

    domClass,
    domConstruct,

    Deferred,
    DeferredList,
// epi
    epi,
    Dialog
) {

    return declare([Dialog], {
        // summary:
        //    For directly open a legacy dialog in a popup dialog.
        //    Act as a thin wrapper of the epi-cms/legacy/LegacyDialogWrapper widget
        //
        // tags:
        //      internal

        // url: [public] String
        //      Legacy dialog's url.
        url: null,

        // dialogArguments: [public] Object
        //      Legacy dialog's arguments.
        dialogArguments: null,

        // callbackArguments: [public] Object
        //      Legacy dialog's callback arguments.
        callbackArguments: null,

        // features: [public] Object
        //      Popup window features. Some (width, height, left, top) will be used to style the iframe. The others will be ignored.
        features: null,

        // autoFit: [public] Boolean
        //      Specify if the dialog should be resized to fit its inner content.
        autoFit: false,

        // showLoadingOverlay: [public] Boolean
        //      Specify if the dialog should show the loading overlay when reload the IFrame.
        showLoadingOverlay: false,

        // legacyDialogObject: [public] Object
        //      Keep the legacy dialog object.
        legacyDialogObject: null,

        // Overridden from Dialog
        defaultActionsVisible: false,

        // legacyButtonQuery: [public] String
        //      Custom query to find all the legacy buttons
        legacyButtonQuery: null,

        // contentClass: [protected] String
        //      Class to apply to the container DOMNode of the dialog so that the
        //      content takes the full width of the dialog.
        contentClass: "epi-dialog-fullWidth",

        dialogClass: "",

        // dialogTitle: [public] String
        //      Title of the dialog
        dialogTitle: null,

        _legacyDialogContainer: null,
        _legacyDialogLoadDeferred: null,
        wrapper: null,

        buildRendering: function () {
            // summary:
            //      Add the epi-legacyDialog class to the domNode during rendering.
            // tags:
            //      protected
            this.inherited(arguments);
            domClass.add(this.domNode, "epi-legacyDialog");
        },

        postCreate: function () {
            // summary:
            //    Load the wrapped legacy dialog widget as the dialog's content.
            //
            // tags:
            //    private

            this.inherited(arguments);

            this._legacyDialogContainer = domConstruct.create("div");
            this.set("content", this._legacyDialogContainer);
        },

        onCallback: function (returnValue, callbackArgs) {
            // summary:
            //    Called when the legacy dialog do a callback
            //
            // returnValue: Object
            //     return value from the wrapped dialog
            //
            // tags:
            //    public callback
        },

        onClose: function () {
            // summary:
            //    Called when the legacy dialog is closed
            //
            // tags:
            //    public
        },

        onLoad: function (wrapper) {
            // summary:
            //    Called when the legacy dialog is loaded
            //
            // tags:
            //    public
        },

        onMapDialogButton: function (/*DOM*/button) {
            // summary:
            //      Called when a button inside a legacy dialog is mapped into the dialog chrome.
            //      Override this method to control whether a button is mapped or not
            // returns:
            //      true to mape the button; otherwise false.
            // tags:
            //      public, callback

            return true;
        },

        onBeforePerformAction: function (action) {
            // summary:
            //    Called before the legacy dialog perform an action.
            //
            // tags:
            //    public
        },

        show: function () {
            // summary:
            //    Show the wrapped legacy dialog in a popup dialog.
            //
            // returns: dojo/Deferred
            //		Deferred object that resolves when the show animation is complete
            //
            // tags:
            //    public

            var defList = new DeferredList([this._loadLegacyDialog(), this.inherited(arguments)]);

            return defList.then(lang.hitch(this, function (result) {
                var showResult = result[1]; //0: loadResult, 1: showResult

                if (this.features && this.features.left && this.features.top) {
                    this.dialog._relativePosition = {
                        x: this.features.left,
                        y: this.features.top
                    };
                }

                return showResult;
            }));
        },

        _loadLegacyDialog: function () {
            // summary:
            //    Load legacy dialog to the dialog content.
            //
            // returns: dojo/Deferred
            //		Deferred object that resolves when the epi-cms/legacy/LegacyDialogWrapper class is loaded, and the legacy dialog starts loading.
            //
            // tags:
            //    private

            if (this._legacyDialogLoadDeferred) {
                return this._legacyDialogLoadDeferred;
            }

            this._legacyDialogLoadDeferred = new Deferred();

            require(["epi-cms/legacy/LegacyDialogWrapper"], lang.hitch(this, function (LegacyDialogWrapper) {
                var wrapper = new LegacyDialogWrapper({
                    url: this.url,
                    dialogArguments: this.dialogArguments,
                    callbackArguments: this.callbackArguments,
                    features: this.features,
                    autoFit: this.autoFit,
                    showLoadingOverlay: this.showLoadingOverlay,
                    dialogTitle: this.dialogTitle,
                    legacyButtonQuery: this.legacyButtonQuery,
                    showCloseButton: this.showCloseButton,
                    opener: this.opener
                }, this._legacyDialogContainer);

                // The very first time a legacy dialog is opened, this line takes a little while to be reached so we miss the dialog startup event and the dialog is not positioned and buttons are not mapped.
                // Therefore, make sure it is always started up before adding to dialog.
                if (this._started && !wrapper._started) {
                    wrapper.startup();
                }

                this.legacyDialogObject = wrapper.getLegacyDialog();

                this.connect(wrapper, "onMapDialogButton", this.onMapDialogButton);

                this.connect(wrapper, "onBeforePerformAction", this.onBeforePerformAction);

                this.connect(wrapper, "onCallback", function (returnValue, callbackArgs) {
                    this.onCallback(returnValue, callbackArgs);
                    // In legacy dialog, callback functions are often called onload event. We have to wait until all the load handlers finish to destroy the dialog.
                    // Refer to EPiServerScriptManager.js, line 528 for more detailed on how are load event handled in legacy dialogs.
                    setTimeout(lang.hitch(this, function () {
                        this.hide();
                    }), 1);
                });

                this.connect(wrapper, "onLoad", function () {
                    this.set("title", wrapper.title);
                    this.onLoad(wrapper);
                });

                this.connect(wrapper, "onCancel", function () {
                    this.hide();
                });

                this.connect(wrapper, "onResize", function () {
                    this.resize();
                });

                this.connect(this, "onHide", function () {
                    this.onClose();
                });

                this.wrapper = wrapper;
                this._legacyDialogLoadDeferred.resolve();
            }));

            return this._legacyDialogLoadDeferred;
        }

    });

});
