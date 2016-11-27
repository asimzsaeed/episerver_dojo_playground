require({cache:{
'url:epi-cms/widget/templates/FilesUploadDropZone.html':"﻿<div class=\"epi-filesUploadDropZone\">\r\n    <div>\r\n        <span data-dojo-attach-point=\"description\">${res.description}</span>\r\n    </div>\r\n</div>"}});
﻿define("epi-cms/widget/FilesUploadDropZone", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",

    "dojo/dom-class",
    "dojo/dom-geometry",
// dijit
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
// resources
    "epi/i18n!epi/cms/nls/episerver.cms.widget.uploadmultiplefiles.dropzone",
// template
    "dojo/text!./templates/FilesUploadDropZone.html"
],
function (
// dojo
    declare,
    lang,

    domClass,
    domGeometry,
// dijit
    _Widget,
    _TemplatedMixin,
// resources
    resources,
// template
    template
) {
    return declare([_Widget, _TemplatedMixin], {
        // summary:
        // tags:
        //      internal

        res: resources, // Language resource for drop zone

        // Template for drop zone
        templateString: template,

        dragStartCssClass: "epi-dragStart", // Default drag start css class for drop zone when dragging over outside dom node
        dragOverCssClass: "epi-dragOver", // Default drag over css class for drop zone

        outsideDomNode: null, // Drop zone's outside dom node

        // Flag to indicate whether this drop zone should be enabled for dropping or not.
        enabled: true,

        postCreate: function () {
            // summary:
            //      Set initial values.
            // tags:
            //      protected

            this.inherited(arguments);

            if (this.outsideDomNode) {
                this.connect(this.outsideDomNode, "dragover", lang.hitch(this, this._onDragOverOutside));
                this.connect(this.outsideDomNode, "dragleave", lang.hitch(this, function (evt) {
                    this._onDragLeave(evt, this.outsideDomNode);
                }));
                this.connect(this.outsideDomNode, "dragend", lang.hitch(this, this._onDragLeave));
                this.connect(this.outsideDomNode, "drop", lang.hitch(this, this._onDragLeave));
            }

            this.connect(this.domNode, "dragover", lang.hitch(this, this._onDragOver));
            this.connect(this.domNode, "dragleave", lang.hitch(this, this._onDragLeave));
            this.connect(this.domNode, "dragend", lang.hitch(this, this._onDragLeave));
            this.connect(this.domNode, "drop", lang.hitch(this, this._onDrop));
        },

        _onDragOverOutside: function (evt) {
            // summary:
            //      Handle when dragging file(s) over outside drop zone
            //
            // tags:
            //      private

            if (!this.enabled) {
                return;
            }

            evt.preventDefault();
            domClass.add(this.domNode, this.dragStartCssClass);
        },

        _isHover: function (evt, domNode) {
            // summary:
            //      Checks if the mouse is hovering the input domNode.
            //
            // tags:
            //      private

            var divPos = domGeometry.position(domNode),
                mouseX = evt.clientX,
                mouseY = evt.clientY;
            return !(mouseX < divPos.x || mouseX > (divPos.x + divPos.w) ||
                mouseY < divPos.y || mouseY > (divPos.y + divPos.h));
        },

        _onDragOver: function (evt) {
            // summary:
            //      Handle when dragging file(s) over drop zone
            //
            // tags:
            //      private

            if (!this.enabled) {
                return;
            }

            evt.preventDefault();
            domClass.remove(this.domNode, this.dragStartCssClass);
            domClass.add(this.domNode, this.dragOverCssClass);
        },

        _onDragLeave: function (evt, domNode) {
            // summary:
            //      Handle when drag leaves file management
            //
            // tags:
            //      private

            if (!this.enabled) {
                return;
            }

            evt.preventDefault();
            if (!this._isHover(evt, domNode || this.domNode)) {
                this._removeAllCssClasses();
            }
        },

        onDrop: function (evt, files) {
            // summary:
            //      Trigger when some files dropped on the target
            // e: Event
            //      event object.
            // files: Array
            //      file list.
            // tags: callback
        },

        _onDrop: function (evt) {
            // summary:
            //      Handle when drop file(s) in drop zone
            //
            // tags:
            //      private

            if (!this.enabled) {
                return;
            }

            evt.preventDefault();
            this._removeAllCssClasses();
            this.onDrop(evt, evt.dataTransfer.files);
        },

        _removeAllCssClasses: function () {
            // summary:
            //      remove all added css classes
            //
            // tags:
            //      private

            domClass.remove(this.domNode, this.dragStartCssClass);
            domClass.remove(this.domNode, this.dragOverCssClass);
        }
    });
});
