(function (tinymce) {
    tinymce.create('tinymce.plugins.epiimageresize', {
        init: function (ed, url) {

            ed.onInit.add(function (ed) {

                var _imageOriginalSize = null,
                    _imageLastSize = {},
                    dom = ed.dom;

                var imageSizeHasChanged = function (ed, el) {
                    // summary:
                    //    Verify is the image has been resized. It is called when the
                    //    Mouse up event occurs.
                    // ed:
                    //    The current tinyMCE editor.
                    // el:
                    //    The target element.
                    var elId = _getImageId(el),
                        previousSize = (_imageLastSize !== null ? _imageLastSize[elId] : null);

                    if (!previousSize) {
                        return;
                    }
                    if (previousSize.height !== el.height ||
                        previousSize.width !== el.width) {
                        ed.undoManager.add();
                    }
                }

                var _getImageId = function (el) {
                    var elId = dom.getAttrib(el, 'mce_epiimageresize_id');
                    if (!elId) {
                        elId = ed.id + "_" + ed.dom.uniqueId();
                        dom.setAttrib(el, 'mce_epiimageresize_id', elId);
                    }
                    return elId;
                }

                var saveImageSize = function (el) {
                    // summary:
                    //    Execute when the mouse down even occurs and the target
                    //    element is a image.
                    // el:
                    //    The target element.

                    // try getting the element id
                    var elId = _getImageId(el),
                        size = { height: el.height, width: el.width };
                    // store the latest image dimensions.
                    _imageLastSize[elId] = size;
                }

                ed.onMouseDown.add(function (ed, e) {
                    var el = ed.selection.getNode();
                    if (el != null && el.nodeName == 'IMG') {
                        // add a initial state to the undo manager.
                        // TODO: This is a known tinyMCE issue and it should be removed when
                        //       this is fixed in a newer version.
                        if (!ed.undoManager.hasUndo()) {
                            ed.undoManager.add();
                        }
                        saveImageSize(el);
                    }
                    return true;
                });

                ed.onMouseUp.add(function (ed, e) {
                    var el = ed.selection.getNode();
                    if (el != null && el.nodeName == 'IMG') {
                        setTimeout(function () {
                            imageSizeHasChanged(ed, el);
                        }, 100);
                    }
                    return true;
                });
            });
        },

        getInfo: function () {
            return {
                longname: 'image resizing plugin',
                author: 'EPiServer AB',
                authorurl: 'http://www.episerver.com',
                infourl: 'http://www.episerver.com',
                version: 1.0
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('epiimageresize', tinymce.plugins.epiimageresize);

} (tinymce));