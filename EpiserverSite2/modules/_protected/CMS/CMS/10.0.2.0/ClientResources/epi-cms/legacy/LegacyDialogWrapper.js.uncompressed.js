define("epi-cms/legacy/LegacyDialogWrapper", [
// dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/on",
    "dojo/topic",

    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-style",

    "dojo/has",
    "dojo/query",
    "dojo/string",
    "dojo/when",
// dijit
    "dijit/_Contained",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

    "dijit/a11y",
    "dijit/focus",
    "dijit/layout/_LayoutWidget",
// epi
    "epi/Url",

    "epi/shell/widget/_ActionProviderWidget",

    "epi-cms/legacy/_LegacyDialogObject",
    "epi-cms/legacy/LegacyDialogPopup",
    "epi/i18n!epi/cms/nls/episerver.shared.action"
],

function (
// dojo
    array,
    declare,
    lang,
    aspect,
    on,
    topic,

    domAttr,
    domClass,
    domConstruct,
    domGeometry,
    domStyle,

    has,
    query,
    dojoString,
    when,
// dijit
    _Contained,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    a11y,
    focusManager,
    _LayoutWidget,
// epi
    Url,

    _ActionProviderWidget,

    _LegacyDialogObject,
    LegacyDialogPopup,
    resources
) {

    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, _ActionProviderWidget, _Contained], {
        // tags:
        //      internal

        // url: [public] String
        //    Legacy dialog's url.
        _currentUrl: null,

        // dialogArguments: [public] Object
        //    Legacy dialog's arguments.
        dialogArguments: null,

        // callbackArguments: [public] Object
        //    Legacy dialog's callback arguments.
        callbackArguments: null,

        // features: [public] Object
        //    Popup window features. Some (width, height) will be used to style the iframe. The others will be ignored.
        features: null,

        // autoFit: [public] Boolean
        //    Specify if the dialog should be resized to fit its inner content.
        autoFit: false,

        // showCloseButton: [public] Boolean
        //    When set to true, a trailing close button is added when the buttons mapped from the wrapped dialog have been added.
        showCloseButton: false,

        // _isIframeInitialLoad: [private] Boolean
        //    Value keeping track of inital iFrame load.
        _isIframeInitialLoad: true,

        // _iframeFocusRegistration: [private]
        //    For keeping track of sub frame focus registration
        _iframeFocusRegistration: null,

        // _scrollbarWidth: [private]
        //    Backing field for _getScrollbarWidth()
        _scrollbarWidth: null,

        // _iframeHandles: [private]
        //      Handles connected inside the iframe that should be removed when the iframe is unloaded
        _iframeHandles: null,

        // templateString: [protected] String
        //    Template for the widget.
        templateString: "\
        <div style=\"position: relative;\" tabindex=\"0\">\
            <iframe data-dojo-attach-point=\"containerIframe\" tabindex=\"-1\" frameborder=\"0\" style=\"border: none; position: absolute, top:0, left: 0;\" src=\"about:blank\" ></iframe>\
        </div>",

        // _mappedButtons: [private] object
        //      Hash of the buttons mapped from the inner dialog to the outer toolbar
        _mappedButtons: null,

        postMixInProperties: function () {
            // summary:
            //    Ensure neccessary features are properly set.
            //
            // tags:
            //    public

            this.inherited(arguments);

            this._isIframeInitialLoad = true;
            this._iframeHandles = [];
            this.features = lang.mixin({ width: 320, height: 240 }, this.features);
        },

        postCreate: function () {
            // summary:
            //    Do some post create initialization. Show or hide cancel button according to setting
            //
            // tags:
            //    public

            this.inherited(arguments);

            //create a legacy dialog object
            this._legacyDialog = this._createLegacyDialogObject(lang.hitch(this, function () {
                this.onCallback.apply(this, arguments);
            }), this.callbackArguments, this.dialogArguments, this.opener || window);

            // Set width and height of this widget to whatever's specified in this.features
            this._resetIframeContainerSize();

            // When we open an legacy page in dojo legacy wrapper, after saving, on some button (e.g.: SaveButton), we need to close the dialog wrapper.
            // We subscribe to /IsInLegacyWrapper/NeedToBeCloseOnLoad topic, then simulate click on Cancel button to safety close the dialog
            this.own(topic.subscribe("/IsInLegacyWrapper/NeedToBeCloseOnLoad", lang.hitch(this, function (message) {
                this.onCancel();
            })));
        },

        startup: function () {
            // summary:
            //    Start the wrapper widget up.
            //
            // tags:
            //    public

            this.inherited(arguments);

            //inject fake dialog utility methods to iframe onload
            if (this.containerIframe.attachEvent) {
                // Can't use connect when listening to the load event of iframes
                // http://bugs.dojotoolkit.org/ticket/9609
                this.containerIframe.attachEvent("onload", lang.hitch(this, this._onIframeLoad));
            } else {
                this.connect(this.containerIframe, "onload", lang.hitch(this, this._onIframeLoad));
            }
        },

        resize: function () {
            this.inherited(arguments);
            if (this._started) {
                // Propagate the size of our domNode to the iframe when we're resized,
                // the domNode size has already been set by the Dialog
                this._setIframeSizeFromDomNode();
            }
        },

        _setUrlAttr: function (value) {
            var url = value || "about:blank";
            this._currentUrl = url;
            domAttr.set(this.containerIframe, "src", url);
        },

        onCallback: function (returnValue) {
            // summary:
            //    Handler for the legacy dialog's callback.
            //
            // returnValue: Object
            //     return value from the wrapped dialog
            //
            // tags:
            //    public callback
        },

        onLoad: function () {
            // summary:
            //    Triggered when the dialog is successfully loaded.
            //
            // tags:
            //    public callback
        },

        onCancel: function () {
            // summary:
            //    Triggered when the cancel button is clicked.
            //
            // tags:
            //    public callback
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

        getLegacyDialog: function () {
            // summary:
            //    Get legacy dialog object.
            //
            // tags:
            //    public

            return this._legacyDialog;
        },

        _focusIframeContent: function () {
            // summary:
            //      Sets focus to the first focusable element inside the iframe
            // tags:
            //      private

            var frameWin = this.containerIframe.contentWindow,
                doc = frameWin && frameWin.document,
                focusElem = (doc && a11y.getFirstInTabbingOrder(doc)) || this.containerIframe;

            focusManager.focus(focusElem);
        },

        _onIframeLoad: function () {
            // summary:
            //    Load handler for container iframe.
            //
            // tags:
            //    private

            // If not IE, Register the iframe for dijit focus tracking
            // TODO: In some particular situations, focus manager could break focusing by mouse in iframe.
            // Potential reason might be the mousedown hanler which focus manager attached on iframe's body.
            // Not to register iframe would create a few problems, which are considered as KNOWN ISSUES:
            //  1) Can't automatically have focus on the first element inside iframe
            //  2) Don't get onBlur event on LegacyDialogWrapper widget
            //  3) When having focus inside iframe, focus manager reports curNode and activeStack as null.
            if (!has("ie")) {
                this._iframeFocusRegistration = focusManager.registerIframe(this.containerIframe);
            }

            this._focusIframeContent();

            this._overrideLegacyDialogUtilities();

            var iFrameWin = this.containerIframe.contentWindow;

            this._iframeHandles.push(on(iFrameWin, "unload", lang.hitch(this, this._removeIframeHandles)));

            // Aspect the SetEnabled method of the toolbutton support. Since this method is called to enable and disable
            // buttons in the legacy UI, we update the state of our mapped buttons when this method is called
            if (iFrameWin.EPi && iFrameWin.EPi.ToolButton) {
                this._iframeHandles.push(aspect.after(iFrameWin.EPi.ToolButton, "SetEnabled", lang.hitch(this, this._toolButtonChanged), true));
            }

            // Dialogs not using EPi.ToolButton, i.e. tinyMCE dialogs use ButonChanged to notify about button state changes
            this._iframeHandles.push(aspect.after(this._legacyDialog, "ButtonChanged", lang.hitch(this, this._toolButtonChanged), true));

            this._mapDialogButtons();

            this._setTitle();

            // Add more class to overwrite max-width property of epi-ContentContainer class
            var containerNode = query(".epi-contentContainer", this.containerIframe.contentWindow.document)[0];
            if (containerNode) {
                domClass.add(containerNode, "epi-legacyDialog");
            }

            if (this.autoFit) {
                this._calculateAndSetContentSize();
            }

            // Need to call resize twice to get the dialog properly positioned when it's loaded
            // The first resize calculates the correct width and height, but positions the dialog outside of
            // the viewport if the viewport is smaller than the requested size.
            this.onResize();
            this.onResize();

            //trigger load event
            if (this.onLoad) {
                this.onLoad.apply(this, arguments);
            }

            this._isIframeInitialLoad = false;
        },

        _removeIframeHandles: function () {
            // summary:
            //      Called when the iframe unloads to remove any handles connected inside the iframe.

            array.forEach(this._iframeHandles, function (handle) {
                handle.remove();
            });
            this._iframeHandles = [];
            this._mappedButtons = null;
        },

        _setTitle: function () {
            // summary:
            //    Set dialog title.
            //
            // tags:
            //    private

            if (this.dialogTitle) {
                this.title = this.dialogTitle;
                return;
            }

            var title = query("title", this.containerIframe.contentWindow.document)[0];
            if (title) {
                this.title = dojoString.trim(title.innerHTML); // trim to avoid Chrome bug (Chrome take \t \n from innerHTML and make the title ugly)
            }
        },

        _getScrollbarWidth: function () {
            // summary:
            //      Calculates and returns the width of scrollbars in an off-screen div
            // tags:
            //      private

            if (this._scrollbarWidth === null) {
                var d = domConstruct.create("div", {
                    style: "position:absolute; top:-2000; left:-2000; width:100px; height:100px; overflow:scroll"
                }, document.body);
                this._scrollbarWidth = d.offsetWidth - d.clientWidth;
                domConstruct.destroy(d);
            }

            return this._scrollbarWidth;
        },

        _boxToStyle: function (size) {
            // summary:
            //  Convert a dojo bounding width/height to style options

            return {
                width: size.w + "px",
                height: size.h + "px"
            };
        },

        _setIframeSizeFromDomNode: function () {
            // summary:
            //      Copies the width and height of the domNode to the iframe.
            //      If the dialog is too big for the viewport a maximum size is set on our domNode,
            //      and if a requested size has been set on domNode it's restored if we get more space.
            // tags:
            //      private

            domStyle.set(this.containerIframe, this._boxToStyle(domGeometry.getContentBox(this.domNode)));
        },

        _setContentSize: function (size) {
            // summary:
            //      Set size on our domNode and the contained iframe
            // tags:
            //      private

            domStyle.set(this.domNode, this._boxToStyle(size));
            this._setIframeSizeFromDomNode();
        },

        _calculateAndSetContentSize: function (isInitialLoad) {
            // summary:
            //  Get the "best fit" width and height of the content in the iframe and set our size accordingly.

            function getSize(doc, dir) {

                if (doc && doc.body && doc.documentElement) {

                    return Math.max(
                        doc.documentElement["client" + dir],
                        doc.documentElement["scroll" + dir],
                        doc.documentElement["offset" + dir],
                        doc.body["scroll" + dir],
                        doc.body["offset" + dir]
                    );
                }

                return 0;
            }

            var iframeDoc = null;
            try {
                // Can't handle X-site scripting errors
                iframeDoc = this.containerIframe.contentWindow.document;
            } catch (e) {
                return;
            }

            // If we're scaling the dialog according to the size of the contained document
            // we also make an effort to prevent both vertical and horizontal scrollbars.
            // The scroll check will almost always be true the first load, since we've
            // squezed the iframe into the default dialog size, but for subsequent reloads,
            // i.e. post backs, the scroll check will work more according to expectations
            var hasVerticalScroll = (iframeDoc.documentElement.scrollHeight - iframeDoc.documentElement.clientHeight) > 0,
                scrollCompensation = hasVerticalScroll && this.autoFit ? this._getScrollbarWidth() : 0,
                contentBox = {
                    w: getSize(iframeDoc, "Width") + scrollCompensation,
                    h: getSize(iframeDoc, "Height")
                };

            this._setContentSize(contentBox);
        },

        _resetIframeContainerSize: function () {
            this._setContentSize({ w: this.features.width, h: this.features.height });
        },

        _showNode: function (/*DOM*/domNode, /*Boolean*/show) {
            // summary:
            //      Show or hide the given DOM node
            // tags:
            //      private

            if (!domNode) {
                return;
            }

            domStyle.set(domNode, "display", show ? "" : "none");
        },

        _toolButtonChanged: function (/*string|DOMNode*/legacyButton, /*Boolean*/enabled) {
            // summary:
            //      Update the enabled state of mapped buttons when the button state inside the iframe changes
            // legacyButton:
            //      Id of the leagcy button node or the button node itself.
            // enabled:
            //      Whether the button should be set as enadled or not (disabled)

            // In case legacyButton is a string we use the same method as in
            // EPi.ToolButton.SetEnabled() to get hold of the DOM node.
            if (typeof legacyButton === "string") {
                var legacyEPi = lang.getObject("containerIframe.contentWindow.EPi", false, this);
                legacyButton = legacyEPi && legacyEPi._GetDomObject && legacyEPi._GetDomObject(legacyButton);
            }
            if (legacyButton) {
                if (this.hasAction(legacyButton.id)) {
                    this.setActionProperty(legacyButton.id, "disabled", legacyButton.disabled);
                    this.setActionProperty(legacyButton.id, "visible", legacyButton.style.display !== "none");
                    this.setActionProperty(legacyButton.id, "label", legacyButton.value || legacyButton.innerHTML);
                }
                var mappedButton = this._mappedButtons[legacyButton.id];
                if (mappedButton) {
                    this._showNode(mappedButton.containerNode, false);
                }
            }
        },

        _mapDialogButtons: function () {
            // summary:
            //    Map legacy dialog's buttons to dojo buttons.
            //
            // tags:
            //    private

            var dialogButtons = query(this.legacyButtonQuery || "[data-epi-dialog-button]", this.containerIframe.contentWindow.document); // Find all mappable buttons

            // If there are old actions added (post back), they're stale and must be removed
            this.removeActions(this.getActions());

            this._mappedButtons = {};

            array.forEach(dialogButtons, function (containerNode) {
                var mapType = domAttr.get(containerNode, "data-epi-dialog-button"),
                    functionNode = null;

                switch (mapType) {
                    case "functioner":
                        // The actual input element inside a ToolButton, handled when dealing with the container
                        return;
                    case "container":
                        // Found a ToolButton container. Locate the input element inside
                        functionNode = query("[data-epi-dialog-button=\"functioner\"]", containerNode)[0];
                        break;
                    default:
                        // An ordinary input
                        if (containerNode.tagName === "INPUT") {
                            functionNode = containerNode;
                            // But if it's wrapped in a span with the epi-cmsButton class it's a CMS ToolButton
                            if (domClass.contains(functionNode.parentNode, "epi-cmsButton")) {
                                containerNode = functionNode.parentNode;
                            }
                        } else {
                            functionNode = query("INPUT", containerNode)[0];
                        }

                        break;
                }

                this._mappedButtons[functionNode.id] = {
                    containerNode: containerNode,
                    functionNode: functionNode
                };

                this._showNode(containerNode, false);

                when(this.onMapDialogButton(functionNode), lang.hitch(this, function (shouldMapButton) {
                    if (shouldMapButton) {
                        var label = functionNode.tagName === "INPUT" ? functionNode.value : functionNode.innerHTML,
                            title = functionNode.tagName === "INPUT" ? domAttr.get(functionNode, "title") : functionNode.innerHTML,
                            action = {
                                name: functionNode.id,
                                label: label,
                                disabled: functionNode.disabled,
                                title: title,
                                action: lang.hitch(this, function () {
                                    this.onBeforePerformAction(/*Object*/action, /*DOM*/functionNode);
                                    functionNode.click();
                                })
                            };

                        this.addActions(action);
                    }
                }));
            }, this);

            if (this.showCloseButton) {
                this.addActions({
                    name: "close",
                    label: resources.close,
                    action: lang.hitch(this, this.onCancel)
                });
            }
        },

        _overrideLegacyDialogUtilities: function () {
            // summary:
            //    Overrides legacy dialog utility methods to make it fit with iframed dialogs.
            //
            // tags:
            //    private

            var iFrameWin = this.containerIframe.contentWindow;

            if (!iFrameWin.EPi) {
                iFrameWin.EPi = {};
            }

            iFrameWin.EPi.CreateDialog = lang.hitch(this, this._createLegacyDialogFnc);
            iFrameWin.EPi.GetDialog = lang.hitch(this, this._getLegacyDialogFnc);
        },

        _getLegacyDialogFnc: function (win) {
            // Tiny MCE runs in a different window context therefore the win param is supplied
            // to get the dialog from the window hosting the actual dialog
            if (win) {
                return win.EPi.GetDialog();
            }
            return this._legacyDialog;
        },

        _createLegacyDialogFnc: function (url, callbackMethod, callbackArguments, dialogArguments, features, opener) {
            // summary:
            //    Function to replace the old dialog API.
            //
            // url: String
            //    Path to the file to open in a dialog, required.
            //
            // callbackMethod: Function
            //    Method to call when closing the dialog, optional.
            //
            // callbackArguments: Variant
            //    Variant that specifies the arguments to use in the callbackMethod method, when returning/closing the dialog.
            //
            // dialogArguments: Variant
            //    Variant that specifies the arguments to use when displaying the document. Use this parameter to pass a value of any type, including an array of values.
            //    The dialog loaded can extract the values passed by the caller from the dialogArguments property of the EPiDialog object.
            //
            // features: Object
            //    Optional. Object that specifies the dialog position and size.
            //    Example: {width:300, height:200}
            //    The following values are valid by default:width:intWidth|sWidth, height:intHeight|sHeight, left: intLeft|sLeft, top: intTop|sTop
            //    Default is width:510, height:500. Position is centered in opening window.
            //
            // tags:
            //    private

            var dialog = new LegacyDialogPopup({
                url: url,
                dialogArguments: dialogArguments,
                callbackArguments: callbackArguments,
                features: features,
                opener: opener
            });

            dialog.on("Callback", lang.hitch(this, function () {
                if (callbackMethod) {
                    callbackMethod.apply(this, arguments);
                }
            }));

            //show it
            dialog.show();

            return dialog.legacyDialogObject;
        },

        _createLegacyDialogObject: function (callbackMethod, callbackArguments, dialogArguments, opener) {
            // summary:
            //    Create legacy dialog object and register the container iframe as the fake popup window.
            //
            // callbackMethod: Function
            //
            //
            // callbackArguments: Object
            //
            //
            // dialogArguments: Object
            //
            //
            // opener: Window
            //
            //
            // tags:
            //    private

            var obj = new _LegacyDialogObject({
                callbackMethod: callbackMethod,
                callbackArguments: callbackArguments,
                dialogArguments: dialogArguments,
                _opener: opener ? opener : window.top
            });

            // TODO: Need to review and remove _dialog.
            try {
                // Set the window that opened the new dialog as the opener. This is need
                // by TinyMCE in order to correctly determine the active editor in nested
                // scenarios, e.g. dynamic content that has a TinyMCE editor.
                this.containerIframe.contentWindow.opener = opener;
                obj._dialog = this.containerIframe.contentWindow; //Fake the popup window
            } catch (e) {
                obj._dialog = null;
            }

            return obj;
        },

        _reloadUrl: function (isInitialLoad) {
            // summary:
            //    Reload the src on the container iframe.
            //
            // tags:
            //    protected

            this._isIframeInitialLoad = isInitialLoad;
            if (this._isIframeInitialLoad) {
                this._resetIframeContainerSize();
            }

            //Add a random parameter to prevent cache
            var url = new Url(this._currentUrl);
            lang.mixin(url.query, { "epi.preventCache": new Date().valueOf() });

            this.set("url", url.toString());
        },

        cleanup: function () {
            var iFrameWin = this.containerIframe.contentWindow;

            // Break the circular reference: iFrameWin -> EPi -> GetDialog -> this(scope on hitch) -> _legacyDialog -> _dialog === iFrameWin
            iFrameWin.EPi.CreateDialog = null;
            iFrameWin.EPi.GetDialog = null;

            if (this._legacyDialog && !this._legacyDialog.IsCleaned()) {
                this._legacyDialog.Cleanup();
            }
        },

        destroy: function () {
            this.cleanup();

            if (this._iframeFocusRegistration) {
                this._iframeFocusRegistration.remove();
                this._iframeFocusRegistration = null;
            }

            this.inherited(arguments);
        }

    });

});
