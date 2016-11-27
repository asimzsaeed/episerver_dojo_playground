require({cache:{
'url:epi-cms/contentediting/editors/templates/TinyMCEEditor.html':"﻿<div id=\"widget_${id}\">\r\n    <div style=\"display: inline-block\" data-dojo-attach-point=\"stateNode, tooltipNode\">\r\n        <textarea data-dojo-attach-point=\"editorFrame\" id=\"${id}_editorFrame\" style=\"border: none;\"></textarea>\r\n    </div>\r\n    <div data-dojo-attach-point=\"dndOverlay\" style=\"background: rgba(0, 0, 0, 0.01); position: absolute; left: 0; top: 0; right: 0; bottom: 0; display: none\"></div>\r\n</div>\r\n"}});
define("epi-cms/contentediting/editors/TinyMCEEditor", [
// dojo
    "dojo/_base/config",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/window",

    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-construct",

    "dojo/Deferred",
    "dojo/keys",
    "dojo/on",
    "dojo/when",

    "dojo/sniff",
// dojox
    "dojox/html/entities",
// dijit
    "dijit/_TemplatedMixin",
    "dijit/focus",
// epi
    "epi/routes",

    "epi/shell/conversion/ObjectConverterRegistry",
    "epi/shell/dnd/Target",
    "epi/shell/layout/_LayoutWidget",
    "epi/shell/TypeDescriptorManager",
    "epi/shell/widget/_ValueRequiredMixin",

    "epi-cms/widget/_DndStateMixin",
    "epi-cms/widget/_HasChildDialogMixin",
    "epi-cms/widget/_UserResizable",
    "epi/shell/widget/dialog/Alert",
// templates
    "dojo/text!./templates/TinyMCEEditor.html",
// resources
    "epi/i18n!epi/cms/nls/tinymce",
    "epi/i18n!epi/cms/nls/episerver.tinymce"
],

function (
// dojo
    config,
    declare,
    lang,
    win,

    domStyle,
    domClass,
    domConstruct,

    Deferred,
    keys,
    on,
    when,

    has,
// dojox
    htmlEntities,
// dijit
    _TemplatedMixin,
    focusUtil,
// epi
    epiRoutes,

    ObjectConverterRegistry,
    Target,
    _LayoutWidget,
    TypeDescriptorManager,
    _ValueRequiredMixin,

    _DndStateMixin,
    _HasChildDialogMixin,
    _UserResizable,
    Alert,
// templates
    template,
// resources
    oldResources,
    resources
) {

    /* global tinymce: true */

    return declare([_LayoutWidget, _TemplatedMixin, _HasChildDialogMixin, _UserResizable, _ValueRequiredMixin, _DndStateMixin], {
        // summary:
        //      Widget for the tinyMCE editor.
        // tags:
        //      internal

        // baseClass: [public] String
        //    The widget's base CSS class.
        baseClass: "epiTinyMCEEditor",

        // width: [public] Number
        //    The editor width.
        width: null,

        // height: [public] Number
        //    The editor height.
        height: null,

        // value: [public] String
        //    The editor content.
        value: null,

        // intermediateChanges: Boolean
        //    Fires onChange for each value change or only on demand
        intermediateChanges: true,

        // templateString: [protected] String
        //    Template for the widget.
        templateString: template,

        // settings: [public] object
        //    The editor settings.
        settings: null,

        // dirtyCheckInterval: [public] Integer
        //    How often should the widget check if it is dirty and raise onChange event, in milliseconds. The value is by default set to 2000 ms
        dirtyCheckInterval: 2000,

        // autoResizable: [public] Boolean
        //    States if the editor can be resized while text is added.
        autoResizable: false,

        // isResized: [public] Boolean
        //    Indicates if the widget has been already resized on its initialization.
        isResized: false,

        tinymceRendered: null,

        dropTarget: null,

        // readOnly: [public] Boolean
        //    Denotes that the editor is read only.
        readOnly: false,

        //  _fullScreenEditor: [private] Object
        //    Full screen editor instance
        _fullScreenEditor: null,

        // _dirtyCheckTimeout: [private] timeout
        //    Used for storing the dirty check timeout reference when dirtyCheckInterval is set.
        _dirtyCheckTimeout: null,

        // _editorValue: [private] String
        //    The value set to the editor
        _editorValue: null,

        postMixInProperties: function () {

            this.inherited(arguments);

            if (this.autoResizable) {
                this.height = 0;
            }

            this.tinymceRendered = new Deferred();
        },

        postCreate: function () {

            this.own(this.dropTarget = new Target(this.dndOverlay, {
                accept: this.allowedDndTypes,
                createItemOnDrop: false,
                readOnly: this.readOnly
            }));

            this.connect(this.dropTarget, "onDropData", "onDropData");
            this.connect(this.dndOverlay, "onmousemove", "_onOverlayMouseMove");

            this.inherited(arguments);
        },

        startup: function () {
            // summary:
            //    Loads the tinyMCE dependencies and initialize the editor.
            //
            // tags:
            //    protected

            if (this._started) {
                return;
            }

            this.inherited(arguments);

            if (!window.tinymce) {
                require(["tinymce/tiny_mce_src"], lang.hitch(this, function () {
                    //set the global nls resources
                    var res = lang.mixin({}, oldResources, resources);
                    tinymce.addI18n({ en: res });

                    // Manually load legacy plugins
                    this._loadLegacyPlugins().then(lang.hitch(this, this._initTinyMCE));
                }));
            } else {
                this._initTinyMCE();
            }
        },

        destroy: function () {
            // summary:
            //    Destroy tinymce widget.
            //
            // tags:
            //    protected

            // When leaving edit-frame in IE(11) something breaks with the focus, causing us to lose the carret... somewhere...
            // so we need to get focus back again
            if (has("trident")) {
                this._refocus();
            }

            if (this._destroyed) {
                return;
            }

            this._cancelDirtyCheckInterval();

            var ed = this.getEditor();

            if (ed && ed.getParam("fullscreen_is_enabled")) {
                // Get the editor that opened fullscreen and execute restore state function so that
                // the fullscreen editor is removed properly before tinymce is destroyed.
                var originalEditor = tinymce.get(ed.getParam("fullscreen_editor_id"));
                originalEditor.plugins.fullscreen.saveState(ed);
            }

            ed && ed.remove();

            this.inherited(arguments);
        },

        _loadLegacyPlugins: function () {
            // summary:
            //    Load legacy plugins from Util.
            //
            // tags:
            //    private

            var dfd = new Deferred();

            this.legacyPlugins.forEach(function (plugin) {
                var url = epiRoutes.getActionPath({
                    moduleArea: "Util",
                    path: "Editor/tinymce/plugins/" + plugin + "/" + (config.isDebug ? "editor_plugin_src.js" : "editor_plugin.js")
                });

                // Queue a plugin to load.
                tinymce.PluginManager.load(plugin, url);
            });

            // Load the whole queue.
            tinymce.ScriptLoader.loadQueue(function () {
                // Unfortunately, tinymce would silently fail if something went wrong.
                dfd.resolve();
            });

            return dfd.promise;
        },

        canAccept: function () {
            return !domClass.contains(this.dndOverlay, "dojoDndTargetDisabled");
        },

        _onDndStart: function () {
            domStyle.set(this.dndOverlay, "display", "block");
            this.inherited(arguments);
        },

        _onDndCancel: function () {
            domStyle.set(this.dndOverlay, "display", "none");
            this.inherited(arguments);
        },

        _onDndDrop: function () {
            domStyle.set(this.dndOverlay, "display", "none");
            this.inherited(arguments);
        },

        _onOverlayMouseMove: function (evt) {
            this._dragPosition = { x: evt.pageX, y: evt.pageY };
        },

        onDropData: function (dndData, source, nodes, copy) {
            //summary:
            //    Handle drop data event.
            //
            // dndData:
            //    Dnd data extracted from the dragging items which have the same data type to the current target
            //
            // source:
            //    The dnd source.
            //
            // nodes:
            //    The dragging nodes.
            //
            // copy:
            //    Denote that the drag is copy.
            //
            // tags:
            //    private

            var dropItem = dndData ? (dndData.length ? dndData[0] : dndData) : null;

            if (!dropItem) {
                return;
            }

            // invoke the onDropping required by SideBySideWrapper and other widgets listening on onDropping
            if (this.onDropping) {
                this.onDropping();
            }

            this._dropDataProcessor(dropItem);
        },

        _dropDataProcessor: function (dropItem) {
            when(dropItem.data, lang.hitch(this, function (model) {

                // TODO: move this to tinymce plugins instead. could be one which will be called to execute content
                // and one which knows how to insert the specific content

                // TODO: calculate drop position relative to tiny editor, send this to the plugin so it
                // could handle content depending on where the drop was done

                var self = this,
                    type = dropItem.type,
                    ed = this.getEditor();

                function insertLink(url) {
                    ed.focus();
                    ed.execCommand("CreateLink", false, url);
                }

                function insertHtml(html) {
                    ed.focus();
                    if (ed.execCommand("mceInsertContent", false, html)) {
                        self._onChange(ed.getContent());
                    }
                }

                function createLink(data) {
                    if (!ed.selection.isCollapsed()) {
                        insertLink(data.url);
                    } else {
                        var strTemplate = "<a href=\"{0}\" title=\"{1}\">{1}</a>";
                        insertHtml(lang.replace(strTemplate, [data.url, htmlEntities.encode(data.text)]));
                    }
                }

                function createImage(data) {
                    var strTemplate = "<img alt=\"{alt}\" src=\"{src}\" width=\"{width}\" height=\"{height}\" />";

                    var imgSrc = data.previewUrl || data.url;
                    var imgPreviewNode = domConstruct.create("img", {
                        src: imgSrc,
                        style: { display: "none;" }
                    }, win.body(), "last");

                    // Use a temporary image to get it loaded and obtain the correct geometric attributes
                    // Then use the original url since the browser adds hostname to the src attribute which is not always wanted.
                    on.once(imgPreviewNode, "load", function () {
                        insertHtml(lang.replace(strTemplate, {
                            alt: this.alt,
                            width: this.width,
                            height: this.height,
                            src: imgSrc
                        }));
                        // destroy temporary image preview dom node.
                        domConstruct.destroy(imgPreviewNode);
                    });
                }

                if (type && type.indexOf("link") !== -1) {
                    createLink(model);
                    return;
                } else if (type && type.indexOf("fileurl") !== -1) {
                    createImage(model);
                    return;
                }

                var typeId = model.typeIdentifier;

                var editorDropBehaviour = TypeDescriptorManager.getValue(typeId, "editorDropBehaviour");

                if (editorDropBehaviour) {

                    if (editorDropBehaviour === 1) {
                        //Default: Create a content object
                        var html = "<div data-contentlink=\"" + model.contentLink + "\" data-classid=\"36f4349b-8093-492b-b616-05d8964e4c89\" class=\"mceNonEditable epi-contentfragment\">" + model.name + "</div>";
                        insertHtml(html);
                        return;
                    }

                    var converter, baseTypes = TypeDescriptorManager.getInheritanceChain(typeId);

                    for (var i = 0; i < baseTypes.length; i++) {
                        var basetype = baseTypes[i];
                        converter = ObjectConverterRegistry.getConverter(basetype, basetype + ".link");
                        if (converter) {
                            break;
                        }
                    }

                    if (!converter) {
                        return;
                    }

                    when(converter.convert(typeId, typeId + ".link", model), lang.hitch(this, function (data) {

                        if (!data.url) {
                            //If the page does not have a public url we do nothing.
                            var dialog = new Alert({
                                description: resources.notabletocreatelinkforpage
                            });
                            dialog.show();
                            this.own(dialog);
                        } else {
                            switch (editorDropBehaviour) {
                                case 2://Link
                                    createLink(data);
                                    break;
                                case 3://Image
                                    createImage(data);
                                    break;
                            }
                        }
                    }));
                }
            }));

            domStyle.set(this.dndOverlay, { display: "none" });
        },

        _onFocus: function () {
            // summary:
            //      This is called by the focus manager when focus
            //      goes to this widget.
            // tags:
            //      protected
            this.inherited(arguments);
            this.focus();
        },

        focus: function () {
            // Set focus on the current editor.
            //
            // tags:
            //    public

            var ed = this.getEditor();
            if (ed) {
                when(this.tinymceRendered, lang.hitch(this, function () {
                    // Set the dijit focus to the iframe so the blur event triggers correctly
                    focusUtil.focus(ed.contentWindow.frameElement);

                    //Tell the TinyMCE editor to take the focus
                    ed.focus();
                }));
            }
        },

        getEditor: function () {
            // summary:
            //    Return an editor instance.
            //
            // tags:
            //    public
            //
            // returns:
            //    A instance of the current editor.

            if (typeof tinymce === "undefined" || tinymce === null) {
                return null;
            }
            var ed = this._fullScreenEditor;
            if (ed && ed.id === "mce_fullscreen") {
                return ed;
            }
            return tinymce.get(this.editorFrame.id);
        },

        getEditorDOM: function () {
            // summary:
            //      Get active editor DOM object
            // tags:
            //      public

            return (typeof tinymce !== "undefined" && tinymce !== null) ? tinymce.DOM : null;
        },

        resizeEditor: function () {
            // summary:
            //    Resize the editor area.
            //
            // description:
            //   Resize the editor area when the autoResizable flag is set to true.
            //   This function is executed only one time and it is called on the
            //   timyMCE's onSetContent event.
            //
            // tags:
            //    public

            var ed = this.getEditor(),
                autoresize_min_height = 0,
                autoresize_max_height = (tinymce.isIE ? document.body.clientHeight : window.innerHeight) - 200,
                autoresize_max_width = (tinymce.isIE ? document.body.clientWidth : window.innerWidth) - 200,
                d = ed.getDoc(),
                b = d.body,
                DOM = tinymce.DOM,
                resizeHeight = this.height,
                resizeWidth = this.width,
                myHeight,
                myWidth;

            myHeight = b.scrollHeight;
            myWidth = b.scrollWidth;

            // don't make it smaller than the minimum height
            if (myHeight > autoresize_min_height) {
                resizeHeight = myHeight;
            }

            // Don't make it bigger than the maximum height
            if (myHeight > autoresize_max_height) {
                resizeHeight = autoresize_max_height;
            }

            if (myWidth > autoresize_max_width) {
                resizeWidth = autoresize_max_width;
            }

            // Resize content element
            DOM.setStyle(ed.contentWindow.frameElement, "height", resizeHeight + 80 + "px");
            if (ed.getBody().scrollWidth !== ed.getBody().offsetWidth) {
                var padding = 20;
                if (resizeHeight === autoresize_max_height) {
                    padding = 30;
                }

                DOM.setStyle(ed.contentWindow.frameElement, "width", ed.getBody().scrollWidth + padding + "px");
            }

            this.isResized = true;
        },

        _setValueAttr: function (newValue) {
            //summary:
            //    Value's setter
            //
            // tags:
            //    protected

            var ed = this.getEditor(),
                editableValue = newValue || "";

            this._set("value", newValue);

            // If the editor has started, set the content to it
            // otherwise it will be set from the textarea when tiny inits
            if (ed && ed.initialized) {
                ed.setContent(editableValue);
            } else {
                this.editorFrame.value = editableValue;
            }
        },

        _updateTinySettings: function () {

            this.settings = lang.mixin(this.settings, {
                mode: "exact",
                width: this.width,
                height: this.height,
                relative_urls: false,
                elements: this.editorFrame.id,
                readonly: this.readOnly
            });
        },

        _initTinyMCE: function () {
            // summary:
            //   Initialize the tinyMCE and create a new editor instance.
            //
            // tags:
            //   private

            this._updateTinySettings();

            if (this.legacyPlugins && this.legacyPlugins.length > 0) {
                // Add legacy plugins back to list, so tinymce can initialize them
                this.settings.plugins = this.settings.plugins + "," + this.legacyPlugins.join(",");
            }

            // initialize the editor with the default settings.
            if (typeof tinymce !== "undefined") {
                tinymce.dom.Event.domLoaded = true;
                this._setupHandle = tinymce.onAddEditor.add(lang.hitch(this, this._onAddEditor));
                tinymce.init(this.settings);
            } else {
                console.error("Couldn't initialize the editor");
            }
        },

        _isFullScreen: function (ed) {
            // summary:
            //    Check if editor is full screen.
            // returns:
            //    [boolean]
            // tags:
            //    protected
            return ed.editorId === "mce_fullscreen";
        },

        _onAddEditor: function (manager, ed) {
            // Check if the event was by the correct instance.
            if (this.editorFrame && ed.id === this.editorFrame.id) {
                this._setupEditorEventHandling(manager, ed);
            } else if (this.editorFrame && ed.settings.fullscreen_editor_id === this.editorFrame.id) {
                this._setupEditorEventHandling(manager, ed);
                this._fullScreenEditor = ed;
            }
        },

        _handlePopupWindow: function (ed) {
            // summary:
            //    Keep track of popup window showing/hiding to prevent unexpected blur event on widget's container.
            //
            // ed:
            //    Instance of the current editor.
            //
            // tags:
            //    private

            ed.windowManager.onOpen.add(lang.hitch(this, function () {
                this.isShowingChildDialog = true;
            }));

            var handleOnClose = lang.hitch(this, function () {

                this.focus();

                this.isShowingChildDialog = this._isFullScreen(ed);

                // Attribute changes won't trigger the onChange, so do it explicitly when closing the dialog
                if (!this.isShowingChildDialog) {
                    this._onChange(ed.getContent());
                }
            });

            ed.windowManager.onClose.add(lang.hitch(this, function () {
                //Wait for dialog to be destroyed before focus to the editor
                setTimeout(handleOnClose);
            }));
        },

        _handlePopupMenu: function (ed) {
            // summary:
            //    Keep track of popup menu showing/hiding to prevent unexpected blur event on widget's container.
            //
            // ed:
            //    Instance of the current editor.
            //
            // tags:
            //    private

            var control;
            for (var i in ed.controlManager.controls) {
                //loop through the controls
                control = ed.controlManager.controls[i];

                //check if the control has a popup
                if (control.onRenderMenu) {
                    //hook in onrendermenu event
                    control.onRenderMenu.add(lang.hitch(this, function (parent, menu) {

                        //set isShowingChildDialog on when show menu
                        menu.onShowMenu.add(lang.hitch(this, function () {
                            this.isShowingChildDialog = true;
                        }));

                        //set isShowingChildDialog off when hide menu
                        menu.onHideMenu.add(lang.hitch(this, function () {
                            this.isShowingChildDialog = this._isFullScreen(ed);
                        }));
                    }));
                }
            }
        },

        _setupEditorEventHandling: function (manager, ed) {
            // summary:
            //    Hook up to the tinyMCE events.
            //
            // manager: Object
            //      TinyMce editor Manager
            //
            // ed:
            //    Instance of the current editor.
            //
            // tags:
            //    protected


            ed.onInit.add(lang.hitch(this, function () {

                !this.tinymceRendered.isResolved() && this.tinymceRendered.resolve();

                //register iframe
                this.own(focusUtil.registerIframe(ed.contentWindow.frameElement));

                this._handlePopupMenu(ed);
                this._handlePopupWindow(ed);

                if (this.autoResizable) {
                    setTimeout(lang.hitch(this, this.resizeEditor), 200);
                } else {
                    this.set("isResized", true);
                }

                this._startDirtyCheckInterval();

                // Add event handler on editor selection after its initialized
                if (ed && ed.selection) {
                    ed.selection.onSetContent.add(lang.hitch(this, function (selection, args) {
                        var isSet = args.set;
                        // If new content is set to current selection, raise event to save it!
                        if (isSet) {
                            this._onChange(ed.getContent());
                        }
                    }));
                }
            }));

            ed.onChange.add(lang.hitch(this, function (ed, e) {
                this._onChange(ed.getContent());
            }));

            ed.onSetContent.add(lang.hitch(this, "onSetContent"));

            ed.onRemove.add(lang.hitch(this, "onEditorRemoved"));

            ed.onRedo.add(lang.hitch(this, "onRedo"));

            ed.onUndo.add(lang.hitch(this, "onUndo"));

            ed.onBeforeExecCommand.add(lang.hitch(this, function (ed, cmd, ui, val, a) {
                this._onChange(ed.getContent());
                if (cmd === "mceFullScreen" && ed.id !== "mce_fullscreen") {
                    // About to toggle fullscreen
                    this.isShowingChildDialog = !this._isFullScreen(ed);
                } else if (cmd === "mceFullScreen" && ed.id === "mce_fullscreen") {
                    this._fullScreenEditor = null;
                }
            }));

        },

        // events.

        onSetContent: function (/*Object*/ed, /*Object*/e) {
            // summary:
            //    Raised when the content is set to the editor.
            //
            // ed:
            //    The editor instance.
            //
            // tags:
            //    callback public

            var newValue = ed.getContent(),
                hasChanged = this.get("_editorValue") !== newValue;

            // in init phase; set a value to start with
            e.initial && this.set("_editorValue", newValue);

            if (hasChanged) {
                this.validate();
                this.onLayoutChanged();
            }
        },

        onEditorRemoved: function (/*Object*/ed) {
            // summary:
            //    Raised when a instance of the editor is removed.
            //
            // ed:
            //    The editor instance.
            //
            // tags:
            //    callback public
        },

        _isMetaKey: function (/*Object*/e) {
            // summary:
            //    Check if the key pressed is a metakey.
            //
            // e:
            //    The keyboard event.
            //
            // tags:
            //    private
            //
            // returns:
            //    Return true if the key pressed is a metakey, otherwise return false.

            if (e.keyCode === keys.CTRL || e.keyCode === keys.ALT || e.keyCode === keys.SHIFT || e.keyCode === keys.META) {
                return true; //Boolean
            }

            return false; //Boolean
        },

        _onChange: function (val) {
            // summary:
            //    Raised when the editor's content is changed.
            //
            // val:
            //    The editor's changed value
            //
            // tags:
            //    callback public

            var hasChanged = this.get("_editorValue") !== val;

            if (hasChanged) {
                this._set("value", val);
                this.set("_editorValue", val);

                if (this.validate()) {
                    this.onChange(val);
                }
            }
        },

        onChange: function (val) {
            // summary
        },

        _stopEditing: function () {
            // summary:
            //      Stop editor editing function
            // tags:
            //      protected

            var ed = this.getEditor(),
                val = ed.getContent();

            // This is common way to hide a validation popup in dojo
            this.displayMessage(null);

            if (ed && ed.undoManager && ed.undoManager.typing) {
                ed.undoManager.typing = 0;
                ed.undoManager.add();
            }

            this._onChange(val);
        },

        _onBlur: function () {
            // summary:
            //    Hide validation pop up and set focused flag off.
            //
            // tags:
            //    private

            this._stopEditing();

            this.inherited(arguments);
        },

        _cancelDirtyCheckInterval: function () {
            // summary:
            //      Stop any running dirty checks
            // tags:
            //      private

            if (this._dirtyCheckTimeout) {
                clearTimeout(this._dirtyCheckTimeout);
                this._dirtyCheckTimeout = null;
            }
        },

        _startDirtyCheckInterval: function () {
            // summary:
            //      Calls _dirtyCheck and schedules a new one according to the dirtyCheckInterval flag
            // tags:
            //      private

            if (this._destroyed || !this.intermediateChanges) {
                return;
            }

            this._cancelDirtyCheckInterval();

            this._dirtyCheck();

            this._dirtyCheckTimeout = setTimeout(lang.hitch(this, this._startDirtyCheckInterval), this.dirtyCheckInterval);
        },

        _dirtyCheck: function () {
            // summary:
            //    Check if the editor is dirty and raise onChange event.
            //
            // tags:
            //    private

            var ed = this.getEditor();

            // Calling getContent() while the spell checker is active will abort the spell checking,
            // i.e. remove the highlighting and the possibility to correct spelling errors.
            var spellcheckerActive = lang.getObject("plugins.spellchecker.active", false, ed) || false;
            if (ed && !spellcheckerActive) {
                this._onChange(ed.getContent());
            }
        },

        onRedo: function (/*Object*/ed, level) {
            // summary:
            //    Raised by the redo event.
            //
            // ed:
            //    The editor instance.
            //
            // tags:
            //    callback public
        },

        onUndo: function (/*Object*/ed, level) {
            // summary:
            //    Raised undo event.
            //
            // ed:
            //    The editor instance.
            //
            // tags:
            //    callback public
        },

        _refocus: function () {
            // summary:
            //      Creates an invisible input[text] field in order to fix focus, then go back to original focused item.
            //      This is a hack to solve an IE 11 focus problem, do not call this yourself or override it
            //      TinyMCE bug: http://www.tinymce.com/develop/bugtracker_view.php?id=7309
            // tags:
            //    internal protected

            // store current focus
            var focEl = document.activeElement;

            // create docfragment and input to refocus from and add style to hide it from view
            var input = document.createElement("input");
            input.type = "text";
            input.style.position = "absolute";
            input.style.left = "-9000px";
            input.style.height = "0";
            input.style.width = "0";

            // add created element to dom
            document.getElementsByTagName("body")[0].appendChild(input);

            // focus on new input
            input.focus();

            if (focEl) {
                //refocus on stored element
                focEl.focus();
            } else {
                //if no element was focused blur from temp element
                input.blur();
            }

            //cleanup
            input.parentNode.removeChild(input);
            input = focEl = null;

        }

    });
});
