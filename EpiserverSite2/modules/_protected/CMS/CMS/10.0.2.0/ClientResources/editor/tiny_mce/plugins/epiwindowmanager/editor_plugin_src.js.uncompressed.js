(function (tinymce, $) {
    /**
    * EPiServer Window Manager, extends default WindowManager to use EPi.Dialog functionality.
    */
    tinymce.create('tinymce.plugins.epiWindowManager', {
        init: function (ed, url) {
            // Replace default window manager with our own.
            ed.onBeforeRenderUI.add(function () {
                ed.windowManager = new tinymce.epiWindowManager(ed);
            });
        },

        getInfo: function () {
            return {
                longname: 'EPiServer Window Manager',
                author: 'EPiServer AB',
                authorurl: 'http://www.episerver.com',
                infourl: 'http://www.episerver.com',
                version: "1.0"
            };
        }
    });

    tinymce.create('tinymce.epiWindowManager:tinymce.WindowManager', {
        epiWindowManager: function (ed) {
            this.parent(ed);
            this.isIE = tinymce.isIE;
        },

        /**
        * Opens a new window.
        *
        * @method open
        * @param {Object} f Optional name/value settings collection contains things like width/height/url etc.
        * @param {Object} p Optional parameters/arguments collection can be used by the dialogs to retrive custom parameters.
        */
        open: function (f, p) {
            var t = this, ed = t.editor, u;
            f = f || {};
            p = p || {};

            // Only store selection if the type is a normal window
            if (!f.type && t.isIE) {
                t.bookmark = ed.selection.getBookmark(1);
            }

            f.width = parseInt(f.width || 320) + (t.isIE ? 18 : 0);
            f.height = parseInt(f.height || 240) + (t.isIE ? 8 : 0);

            p.mce_inline = true; // Necessary to avoid loosing selection in editor.
            p.mce_auto_focus = f.auto_focus; // Auto focus field in dialog

            u = f.url || f.file;
            t.features = f;
            t.params = p;

            var restoreSelection = function () {
                if (!f.type && t.isIE) {
                    ed.selection.moveToBookmark(t.bookmark);
                }
            };

            var onCallback = function (returnValue, callbackArgs) {
                if (f.onCallback) {
                    f.onCallback(returnValue, callbackArgs);
                }
            };

            var onHide = function () {
                t.onClose.dispatch(this);
                ed.windowManager.onClose.dispatch();
            };

            require(["epi-cms/legacy/LegacyDialogPopup"], function (LegacyDialogPopup) {

                f.dialogArguments = f.dialogArguments || {};
                f.callbackArguments = f.callbackArguments || {};

                if (t.features.height) {
                    t.features.height += 60;
                }

                var _dialog = new LegacyDialogPopup({
                    url: u,
                    onCallback: onCallback,
                    onHide: onHide,
                    onBeforePerformAction: restoreSelection,
                    callbackArguments: f.callbackArguments,
                    dialogArguments: f.dialogArguments,
                    showCancelButton: true,
                    features: t.features,
                    autoFit: !t.features.height,
                    showLoadingOverlay: false
                });

                t.onOpen.dispatch(t, f, p);
                _dialog.show().then(function () {
                    if (f.onReady) {
                        f.onReady(_dialog);
                    }
                });
            });
        },

        /**
        * Closes the specified window and corresponding dialog. This will also dispatch out an onClose event.
        *
        * @method close
        * @param {Window} win Native window object to close.
        */
        close: function (win) {
            // Pass in dialog window object to get hold of correct EPi.Dialog object
            // and call Close to clean up and close dialog.

            // Use EPi dialogs API from the dialog window which is modified by the LegacyDialogWrapper to get the correct legacy dialog object reference.
            win.EPi.GetDialog(win).Close();
        },

        /*
        * Overridden to prevent the built-in default resize method from trying to resize the iframe.
        * Resizing the iframe won't work and trying throws exceptions in IE9
        */
        resizeBy: function() { },

        setTitle: function (w, ti) {
            // Not implemented but necessary to make TinyMCE Popup script work,
            // since we set mce_inline to true to keep selection in editor.
        },

        focus: function (w) {
            // Not implemented but necessary to make TinyMCE Popup script work,
            // since we set mce_inline to true to keep selection in editor.
        }
    });

    // Register plugin
    tinymce.PluginManager.add('epiwindowmanager', tinymce.plugins.epiWindowManager);
} (tinymce, epiJQuery));
