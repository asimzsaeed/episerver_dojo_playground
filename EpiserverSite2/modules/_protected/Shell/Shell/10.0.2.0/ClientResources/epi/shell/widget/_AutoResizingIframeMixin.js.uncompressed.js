define("epi/shell/widget/_AutoResizingIframeMixin", [
// Dojo
    "dojo/_base/declare",
    "dojo/_base/Deferred",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/has",

// EPi
    "epi/shell/postMessage",
    "epi/shell/widget/_ScrollbarMeasurementMixin"
],

function (
// Dojo
	declare,
    Deferred,
    domAttr,
	domStyle,
	has,
    postMessage,
    _ScrollbarMeasurementMixin
) {

    return declare([_ScrollbarMeasurementMixin], {
        // summary:
        //      Adds the behavior to automatically resize the iframe to it's preferred document size when viewed with a specific viewport size.
        //      Usable with the epi/shell/widget/Iframe widget
        //	example:
        //	|	declare([Iframe, _AutoResizingIframeMixin]);
        //
        // tags:
        //    internal

        onAfterResize: function (size) {
            // summary:
            //      Called when the iframe has been resized
            //
            // size: Object
            //    The size {w: value, h: value} that the iframe has resized to
            // tags:
            //      callback
        },

        postCreate: function () {
            var self = this,
                topiceName = "/site/resize" + (this.name ? "/" + this.name : "");

            this.inherited(arguments);
            this.own(
                postMessage.subscribe(topiceName,
                    function (message) {
                        self.contentChange();
                    })
            );
        },

        checkSize: function () {
            postMessage.publish("/site/checksize", {}, this.getWindow());
        },

        onLoad: function () {

            if (this.isInspectable()) {
                this.setOverflow("hidden");
            }

            this.inherited(arguments);
        },

        onUnload: function () {

            this.inherited(arguments);

            if (this._contentBox) {
                domStyle.set(this.iframe, {
                    width: this._contentBox.w + "px",
                    height: this._contentBox.h + "px"
                });
            }
        },

        contentChange: function () {
            // summary:
            //    Will adjust the document size after checking if there has been a change.
            //
            if (this._contentBox) {
                this.resize(this._contentBox, true);
            }
        },

        resize: function (size, force) {
            // summary:
            //    Resize iframe.
            //
            // size: Object
            //    New size {w, h}
            var self = this,

                def = this._resize(size, force);
            def.then(function (docSize) {
                self.onAfterResize(docSize);
            });

            return def;
        },

        _resize: function (size, force) {

            var previousSize = this._contentBox || { h: 0, w: 0 },
                self = this,
                internalDef = new Deferred(),
                externalDef = new Deferred(),
                viewportSize = {
                    h: size.h,
                    w: size.w
                };

            function sizeToViewport(viewPortSize) {

                if (self.resizeThrottle) {
                    clearTimeout(self.resizeThrottle);
                    self.resizeThrottle = null;
                }

                self.resizeThrottle = setTimeout(function () {

                    domStyle.set(self.iframe, {
                        width: (viewPortSize.w) + "px",
                        height: viewPortSize.h + "px"
                    });

                    internalDef.resolve();
                }, 50);

                return internalDef;
            }

            // Only resize if we got an actual change from the previous resize
            if (force || (size && (size.h !== previousSize.h || size.w !== previousSize.w))) {

                this._contentBox = size;
                // To get the correct width when measuring a page with media queries
                if (this.isInspectable()) {
                    viewportSize.w -= this.getScrollbarSize().x;
                }

                sizeToViewport(viewportSize).then(function () {
                    var docSize = { h: 0, w: 0 };
                    if (self.isInspectable()) {
                        docSize = self._setToDocumentSize(viewportSize);
                    }
                    externalDef.resolve(docSize);
                });
            }

            return externalDef.promise;
        },

        _setToDocumentSize: function (viewportSize) {

            this.setOverflow("visible");

            // body.scrollHeight does not decrease(enough) when making the iframe smaller
            var docSize = {
                w: Math.max(this.iframe.contentDocument.body.scrollWidth, viewportSize.w),
                h: Math.max(this.iframe.contentDocument.documentElement.scrollHeight, viewportSize.h)
            };

            //Only change if we could calculate document size to a sane value
            if (docSize.w > 0 && docSize.h > 0) {
                domStyle.set(this.iframe, {
                    width: docSize.w + "px",
                    height: docSize.h + "px"
                });
            }

            this.setOverflow("hidden");

            // Trying to get the mobile safari to get it's head straight
            // on in which direction scrolling should take place
            domAttr.set(this.iframe, "data-epi-ipad-ping", "pong");

            return docSize;
        },

        setOverflow: function (overflowSetting) {
            var doc = this.getDocument();
            if (doc && doc.documentElement && doc.body) {
                domStyle.set(doc.documentElement, { overflow: overflowSetting });
                domStyle.set(doc.body, { overflow: overflowSetting });
            }
        }
    });
});
