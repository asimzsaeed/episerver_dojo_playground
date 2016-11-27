require({cache:{
'url:epi-cms/contentediting/editors/templates/TinyMCEInlineEditor.html':"﻿<div id=\"widget_${id}\" style=\"position: relative; overflow: visible;\">\r\n    <div data-dojo-attach-point=\"stateNode, tooltipNode\">\r\n        <textarea data-dojo-attach-point=\"editorFrame\" id=\"${id}_editorFrame\" style=\"border: none; visibility: hidden; position: absolute; top:0; left:0; bottom:0; right:0;\"></textarea>\r\n    </div>\r\n    <div data-dojo-attach-point=\"dndOverlay\" style=\"background: rgba(0, 0, 0, 0.01); position: absolute; left: 0; top: 0; right: 0; bottom: 0; display: none\"></div>\r\n</div>\r\n"}});
﻿define("epi-cms/contentediting/editors/TinyMCEInlineEditor", [
// Dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",

    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/dom-style",

    "dojo/aspect",
    "dojo/on",
    "dojo/sniff",
// EPi
    "epi/string",
    "epi-cms/contentediting/_HasFloatingComponent",
    "epi-cms/contentediting/editors/TinyMCEEditor",
// Template
    "dojo/text!./templates/TinyMCEInlineEditor.html"
],

function (
// Dojo
    array,
    declare,
    lang,

    dom,
    domClass,
    domGeometry,
    domStyle,

    aspect,
    on,
    sniff,
// EPi
    epiString,
    _HasFloatingComponent,
    TinyMCEEditor,
// Template
    template
) {

    return declare([_HasFloatingComponent, TinyMCEEditor], {
        // summary:
        //      Widget for the tinyMCE inline editor.
        // description:
        //      This editor widget implemented "epi-cms/contentediting/_HasFloatingComponent",
        //          in order to exposes information about an external component (it's tinymc editor external toolbar in this case).
        //      An editor wrapper that implemented "epi-cms/contentediting/_FloatingComponentEditorWrapperMixin",
        //          will uses this exposed information to position the external component.
        // tags:
        //      internal

        /* global tinyMCE: true */

        // baseClass: [public] String
        //      The widget's base CSS class.
        baseClass: "epiTinyMCEInlineEditor",

        // autoResizable: [public] Boolean
        //      States if the editor can be resized while text is added.
        autoResizable: true,

        // templateString: [protected] String
        //      Template for the widget.
        templateString: template,

        // inlineSettings: [public] object
        //      The inline editor settings.
        inlineSettings: null,

        // supportCustomDnd: [public] Boolean
        //      Indicates that the current editor had custom Dnd handler or not
        supportCustomDnd: true,

        // _lastRng: [private] DOM Range
        //      The last selection to restore after.
        _lastRng: null,

        // _maxCheckRenderedTime: [private] Integer
        //      Maximum times of checking the editor toolbar is fully rendered or not.
        _maxCheckRenderedTime: 10,

        _editorIframe: null,

        // =======================================================================
        // Public events

        onEditorBlur: function () {
            // summary:
            //      Stop editing when click outside editor but inside its viewport
            // tags:
            //      public

            this._stopEditing();
        },

        onEditorResizing: function (/*Object*/resizeInfo) {
            // summary:
            //      Stub to do something when the current editor on resizing progress
            // resizeInfo: [Object]
            //      Object that provides resize information to editor wrapper
            // tags:
            //      public
        },

        onEditorResized: function (/*Function*/callbackFunction) {
            // summary:
            //      Stub to do something when the current editor finished its resizing process
            // tags:
            //      public
        },

        // =======================================================================
        // Public functions

        isEditing: function () {
            // summary:
            //      Check the current editor widget is on editing or not
            // tags:
            //      public

            return this.domNode && domStyle.get(this.domNode, "display").toLowerCase() !== "none";
        },

        // =======================================================================
        // Overrides public functions

        startup: function () {

            this._checkingTime = 0;

            if (this._started) {
                return;
            }

            this.inherited(arguments);

            if (!this.ready) {
                return;
            }

            this.own(
                this.watch("state", lang.hitch(this, function (name, oldValue, newValue) {
                    on.emit(this.domNode, "editorstatechanged", newValue);
                }))
            );
        },

        destroy: function () {

            this._clearLocalDefers();

            this._externalToolbar = this._toolbarSizeBox = this._toolbarRelativeContainer = this._toolbarRefContainer = null;
            this._latestButtonIds = this._editorIframe = this._toolbarFinishRender = null;

            this._lastRng = null;

            this.inherited(arguments);
        },

        focus: function () {
            // summary:
            //      Set focus on the current editor.
            // tags:
            //      public, extension

            this.inherited(arguments);

            var editor = this.getEditor();
            if (!editor) {
                return;
            }

            // REMARK:
            // For some reason setting the range on the selection while focusing triggers a blur + a new focus (recursively) in IE 11
            // so we do not try that in IE 11, see #127901
            if (!sniff("trident")) {
                //Set back the cursor to old position when focused again
                editor.selection.setRng(this._lastRng || editor.selection.getRng());
            }

            this.resizeEditor();
        },

        resizeEditor: function () {
            // summary:
            //      Resizes the editor area.
            // tags:
            //      public, extension

            // Don't do a resize if the editor isn't visible as height will calculate to zero.
            // Instead call onEditorResized to update subscribers and return.
            if (domStyle.get(this.containerNode, "display") === "none") {
                this.onEditorResized();
                return;
            }

            var editor = this.getEditor(),
                style = { height: "auto" },
                editorIframe = this._getEditorIframe();

            domStyle.set(editorIframe, style);

            // Update height
            style.height = editor.getBody().parentNode.scrollHeight + "px";

            this.onEditorResizing({ style: style });

            domStyle.set(editorIframe, style);

            this.onEditorResized(lang.hitch(this, this._floatToolbar));

            this.isResized = true;
        },

        tryToStopEditing: function () {
            // summary:
            //      Runs when the we try to stop the editing
            // tags:
            //      internal

            // When leaving edit-frame in IE(11) something breaks with the focus, causing us to lose the carret... somewhere...
            // so we need to get focus back again

            // When we solve the real problem remove the call to this method in the the RichTextInlineEditorWrapper
            if (sniff("trident")) {
                this._refocus();
            }
        },

        // =======================================================================
        // Protected overrides functions

        _onBlur: function () {
            // summary:
            //      Disable default onblur event
            // tags:
            //      protected, extension
        },

        _updateTinySettings: function () {
            this.inherited(arguments);

            this.settings.width = this.settings.height = "100%";
            this.settings = lang.mixin(this.settings, this.inlineSettings);
        },

        _setupEditorEventHandling: function (manager, editor) {
            // summary:
            //      Hook up to the tinyMCE events.
            // manager: Object
            //      TinyMce editor Manager
            // editor:
            //      Current editor.
            // tags:
            //      private extension

            this.inherited(arguments);

            this._disableSetTopStyle();

            this._appendEditorResizeHandler(editor);
            this._appendEditorFloatToolbarHandler(editor);

            // IE doesn't keep the last selection
            (sniff("ie") || sniff("trident")) && editor.onNodeChange.add(lang.hitch(this, function (activeEditor) {
                this._lastRng = activeEditor.selection.getRng();
            }));
        },

        _clearLocalDefers: function () {
            // summary:
            //      Clear all registered local defers
            // tags:
            //      protected, extension

            this._deferToolbarFullSize && this._deferToolbarFullSize.remove();
            this._deferOnKeyUp && this._deferOnKeyUp.remove();
        },

        // =======================================================================
        // Private functions

        _appendEditorResizeHandler: function (/*Object*/editor) {
            // summary:
            //      Append editor resizing process for appropriate editor events
            // editor: [Object]
            //      Active tinymce editor
            // tags:
            //      private

            var hitchedResize = lang.hitch(this, this.resizeEditor);

            // Add appropriate listeners for resizing content area
            editor.onChange.add(hitchedResize);
            editor.onSetContent.add(hitchedResize);
            editor.onPaste.add(hitchedResize);
            editor.onPostRender.add(hitchedResize);

            editor.onKeyUp.add(lang.hitch(this, function () {
                // Delay a time around onKeyUp fired, mean that we need to wait user finished his/her input text by typed on the keyboard
                this._clearLocalDefers();
                this._deferOnKeyUp = this.defer(hitchedResize, 10);
            }));

            editor.onExecCommand.add(lang.hitch(this, function (ed, cmd) {
                if (cmd === "mceFullScreen" && this._isFullScreen(tinyMCE.activeEditor)) {
                    // Remove body class "epi-inline" if editor mode is full screen
                    domClass.remove(tinyMCE.activeEditor.getBody(), this.settings.body_class);
                }
            }));
        },

        _appendEditorFloatToolbarHandler: function (/*Object*/editor) {
            // summary:
            //      Append editor float toolbar process for appropriate editor events
            // editor: [Object]
            //      Active tinymc editor
            // tags:
            //      private

            // Show external toolbar
            editor.onInit.add(lang.hitch(this, this._showEditorToolbar));

            editor.onActivate.add(lang.hitch(this, this._floatToolbar));
            editor.onMouseUp.add(lang.hitch(this, this._floatToolbar));
        },

        _showEditorToolbar: function (/*tinymce.Editor*/activeEditor) {
            // summary:
            //      Show the editor's external toolbar
            // activeEditor: [Object] tinymce.Editor
            //      Current active TinyMC editor object
            // tags:
            //      private

            if (!activeEditor) {
                return;
            }

            this.focus();
            activeEditor.dom.show(this._getExternalToolbar());
            this._floatToolbar();
        },

        _disableSetTopStyle: function () {
            // summary:
            //      Disable setting top position for the editor external toolbar
            //      By default, when settings external toolbar in TinyMC editor version 3.x,
            //      it always set to top position of the editor content.
            //      So that, in order to make smoothly scrolling the external toolbar belong to viewport scroller,
            //      we need to disable the default settings from editor each time onMouseUp event fired.
            // tags:
            //      private

            this.own(
                aspect.before(this.getEditorDOM(), "setStyle", lang.hitch(this, function (n, na, v) {
                    if (n === this._getExternalToolbar() && na === "top") {
                        return [];
                    }

                    return;
                }))
            );
        },

        _floatToolbar: function () {
            // summary:
            //      Calculate top position of toolbar
            // tags:
            //      private

            this._clearLocalDefers();

            if (!this._getExternalToolbar()) {
                return;
            }

            // Recursive call to get the really full width of the toolbar to position it correctly
            if (!this._isToolbarRendered()) {
                this._deferToolbarFullSize = this.defer(this._floatToolbar, 100);

                return;
            }

            // Call exposed event of the _HasFloatingComponent mixin in order to float the external toolbar
            this.onComponentFloat(this._getComponentFloatInfo());
        },

        _getComponentFloatInfo: function () {
            // summary:
            //      Build component information for floating
            // returns: [Object]
            //      Object's required properties:
            //          componentInfo: [Object]
            //              component: [DOM]
            //                  The external floating component
            //              componentSizeBox: [DOM]
            //                  The target node that provides external floating component size
            //              relativeContainer: [DOM]
            //                  The relative container of the external floating component
            //              refContainer: [DOM]
            //                  The root container for the both external floating component and its relative container
            //          floatingInfo: [Object]
            //              refreshPosition: [Boolean]
            // tags:
            //      private

            return {
                componentInfo: {
                    component: this._getExternalToolbar(),
                    componentSizeBox: lang.hitch(this, function () {
                        return this._toolbarSizeBox || (this._toolbarSizeBox = dom.byId(this.editorFrame.id + "_tblext"));
                    })(),
                    relativeContainer: lang.hitch(this, function () {
                        return this._toolbarRelativeContainer || (this._toolbarRelativeContainer = this._getExternalToolbar().parentNode);
                    })(),
                    refContainer: lang.hitch(this, function () {
                        return this._toolbarRefContainer || (this._toolbarRefContainer = dom.byId(this.editorFrame.id + "_parent"));
                    })()
                },
                floatingInfo: {
                    refreshPosition: false
                }
            };
        },

        _isToolbarRendered: function () {
            // summary:
            //      Check the current editor toolbar is fully rendered or not.
            //      The validation based on checking the position of the latest button on each toolbar row.
            // remarks:
            //      Workaround solution. Need find a better solution later.
            // tags:
            //      private

            if (this._checkingTime > this._maxCheckRenderedTime) {
                return true;
            }

            this._checkingTime++;

            var buttonElement = null,
                buttonWidth = 0;

            return this._toolbarFinishRender || (this._toolbarFinishRender = this._getToolbarLatestButtonIds().every(function (buttonId) {
                buttonElement = dom.byId(this.editorFrame.id + "_" + buttonId);
                buttonWidth = buttonElement && domGeometry.position(buttonElement).w;
                return buttonWidth !== 0;
            }, this));
        },

        _getToolbarLatestButtonIds: function () {
            // summary:
            //      Get latest button on each toolbar row
            // tags:
            //      private

            if (this._latestButtonIds) {
                return this._latestButtonIds;
            }

            this._latestButtonIds = [];

            var latestButtonId = null;
            for (var property in this.settings) {
                if (property.toLowerCase().indexOf("theme_advanced_button") !== -1) {
                    latestButtonId = this.settings[property].split(",").pop();
                    if (!epiString.isNullOrEmpty(latestButtonId)) {
                        this._latestButtonIds.push(latestButtonId);
                    }
                }
            }

            return this._latestButtonIds;
        },

        _getExternalToolbar: function () {
            // summary:
            //      Get the current editor external toolbar
            // returns: [DOM]
            // tags:
            //      private

            return this._externalToolbar || (this._externalToolbar = dom.byId(this.editorFrame.id + "_external"));
        },

        _getEditorIframe: function () {
            // summary:
            //      Get editor iframe DOM node
            // returns: [DOM]
            // tags:
            //      private

            return this._editorIframe || (this._editorIframe = dom.byId(this.editorFrame.id + "_ifr"));
        }

    });

});
