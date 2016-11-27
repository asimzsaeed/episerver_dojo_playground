(function (tinymce, $) {
    tinymce.create('tinymce.plugins.epilink', {
        /**
        * Initializes the plugin.
        *
        * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
        * @param {string} url Absolute URL to where the plugin is located.
        */
        init: function (ed, url) {
            // Early exit if we don't have access to EPi
            if (typeof EPi === "undefined" || typeof EPi.ResolveUrlFromUI !== "function") {
                return;
            }

            // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceEPiLink');
            ed.addCommand('mceEPiLink', function () {
                var href = "",
                    s = ed.selection,
                    dom = ed.dom,
                    linkObject = {},
                    r = s.getRng(),
                    anchors = [{ text: "", value: "" }];

                // When link is at the beginning of a paragraph, then IE (and FF?) returns the paragraph from getNode,
                // the getStart() and getEnd() however returns the anchor.
                var node =  s.getStart() === s.getEnd() ? s.getStart() : s.getNode(),
                selectedLink = dom.getParent(node, "A");

                // No selection and not in link
                if (s.isCollapsed() && !selectedLink) {
                    return;
                }

                if (selectedLink) {
                    href = dom.getAttrib(selectedLink, "href");
                }

                if (href.length) {
                    linkObject.href = href;
                    linkObject.targetName = dom.getAttrib(selectedLink, "target");
                    linkObject.title = dom.getAttrib(selectedLink, "title");
                }

                //Find all Anchors in the document and add them to the Anchor list
                var allLinks = $("a[id],a[name]", ed.getDoc());

                allLinks.each(function (i, anchor) {
                    var value = anchor.id || anchor.name;

                    if (value !== "" && anchor.href === "") {
                        anchors.push({
                            text: value,
                            value: "#" + value
                        });
                    }
                });

                anchors = anchors.sort(function (a, b) {
                    return a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1;
                });

                var callbackMethod = function (value) {
                    var html, elementArray;
                    if (value && value.href) {
                        //If we press delete in the dialog we get "-1" (as a string) in result and remove the link
                        if (value == "-1" && selectedLink) {
                            html = selectedLink.innerHTML;
                            dom.setOuterHTML(selectedLink, html);

                            //Wrap all changes as one undo level
                            ed.undoManager.add();
                        }
                            //if we close the dialog with cancel we get 0. So if we dont get 0 or -1 we get an object as value that we can use to create the link.
                        else if (value !== 0) {

                            var linkAttributes = {
                                href: value.href,
                                title: value.title,
                                target: value.target ? value.target : null
                            };

                            if (selectedLink) {
                                dom.setAttribs(selectedLink, linkAttributes);

                                //Wrap all changes as one undo level
                                ed.undoManager.add();
                            } else {
                                // When opening the link properties dialog in OPE mode an inline iframe is used rather than a popup window.
                                // When using IE clicking in this iframe causes the selection to collapse in the tinymce iframe which
                                // breaks the link creation immediately below. The workaround is to store the selection range before
                                // opening, and restoring it before creating the link.
                                s.setRng(r);
                                //To make sure we dont get nested links and have the same behavior as the default tiny
                                // link dialog we unlink any links in the selection before we create the new link.
                                ed.getDoc().execCommand('unlink', false, null);
                                ed.execCommand("mceInsertLink", false, "#mce_temp_url#", { skip_undo: 1 });

                                elementArray = tinymce.grep(dom.select("a"), function (n) { return dom.getAttrib(n, 'href') == '#mce_temp_url#'; });
                                for (var i = 0; i < elementArray.length; i++) {
                                    dom.setAttribs(elementArray[i], linkAttributes);
                                }

                                //move selection into the link content to be able to recognize it when looking at selection
                                if (elementArray.length > 0) {
                                    var range = ed.dom.createRng();
                                    range.selectNodeContents(elementArray[0]);
                                    ed.selection.setRng(range);
                                }

                                //Wrap all changes as one undo level
                                ed.undoManager.add();
                            }
                        }
                    } else if (selectedLink) {
                        // pressed delete?
                        html = selectedLink.innerHTML;
                        dom.setOuterHTML(selectedLink, html);

                        //Wrap all changes as one undo level
                        ed.undoManager.add();
                    }
                };

                require([
                    "dojo/_base/lang",
                    "dojo/_base/array",
                    "dojo/on",
                    "dojo/when",
                    "dojo/dom-style",
                    "epi/dependency",
                    "epi/Url",
                    "epi/shell/widget/dialog/Dialog",

                    "epi-cms/ApplicationSettings",
                    "epi-cms/widget/LinkEditor",

                    // Resources
                    "epi/i18n!epi/cms/nls/episerver.cms.widget.editlink"
                ], function (
                    lang,
                    array,
                    on,
                    when,
                    domStyle,
                    dependency,
                    Url,
                    Dialog,

                    ApplicationSettings,
                    LinkEditor,

                    // Resources
                    resource
                ) {
                    var registry = dependency.resolve("epi.storeregistry"),
                        store = registry.get("epi.cms.content.light"),
                        frames = ApplicationSettings.frames;

                    var findFrameName = function (frames, frameId) {
                        var filteredFrames = array.filter(frames, function (frame) { return frame.id == frameId });
                        if (filteredFrames && filteredFrames.length > 0)
                            return filteredFrames[0].name;

                        return "";
                    };

                    var findFrameId = function (frames, frameName) {
                        var filteredIds = array.filter(frames, function (frame) { return frame.name == frameName });
                        if (filteredIds && filteredIds.length > 0)
                            return filteredIds[0].id;

                        return "";
                    };

                    linkObject.target = findFrameId(frames, linkObject.targetName);

                    var linkEditor = new LinkEditor({
                        baseClass: "epi-link-item",
                        modelType: ed.getParam('epilinkmodel_type'),
                        hiddenFields: ["text"] // hide text field from UI
                    });

                    var getAnchorWidget = function (widgetList) {
                        return array.filter(widgetList, function (wrapper) { return wrapper.name == "Anchor" });
                    };

                    linkEditor.on("fieldCreated", function (fieldname, widget) {
                        if (fieldname === "href") {
                            // in this case, widget is HyperLinkSelector
                            var hyperLinkSelector = widget;
                            var anchor = null;
                            var anchorWidget = getAnchorWidget(hyperLinkSelector.get("wrappers"));

                            if (anchorWidget && anchorWidget.length > 0) {
                                anchor = anchorWidget[0];
                            }

                            if (anchor && anchor.inputWidget) {
                                anchor.inputWidget.set("selections", anchors);
                            }
                            else {
                                widget.on("selectorsCreated", function (hyperLinkSelector) { // when all selector have been created
                                    var anchorWidget = getAnchorWidget(hyperLinkSelector.get("wrappers"));

                                    if (anchorWidget && anchorWidget.length > 0 && anchorWidget[0].inputWidget) {
                                        anchorWidget[0].inputWidget.set("selections", anchors);
                                        domStyle.set(anchorWidget[0].domNode, { display: "block" });
                                    }
                                });
                            }

                            if (anchor) {
                                domStyle.set(anchor.domNode, { display: "block" });
                            }
                        };
                    });

                    var dialogTitle = lang.replace(selectedLink ? resource.title.template.edit : resource.title.template.create, resource.title.action);

                    var dialog = new Dialog({
                        title: dialogTitle,
                        dialogClass: "epi-dialog-portrait",
                        content: linkEditor,
                        defaultActionsVisible: false
                    });
                    dialog.startup();

                    //Set the value when the provider/consumer has been initialized
                    linkEditor.set("value", linkObject);

                    dialog.show();
                    ed.windowManager.onOpen.dispatch();

                    dialog.on("execute", function () {

                        var value = linkEditor.get("value");
                        var linkObject = lang.clone(value);

                        if (linkObject && linkObject.target) {
                            // get target frame name, instead of integer value
                            linkObject.target = findFrameName(frames, linkObject.target);
                        }

                        //Destroy the editor when the dialog closes
                        linkEditor.destroy();
                        linkEditor = null;

                        callbackMethod(linkObject);
                    });

                    dialog.on("hide", function() {
                        //Dispatch the onClose event when the dialog hides
                        ed.windowManager.onClose.dispatch();
                    });
                });
            });

            // Register buttons
            ed.addButton('epilink', {
                title: 'epilink.desc',
                cmd: 'mceEPiLink',
                "class": "mce_epilink"
            });

            ed.addShortcut("ctrl+k", "epilink.desc", "mceEPiLink");

            ed.onNodeChange.add(function (ed, cm, n, co) {
                //Since we can have other inline elements nested within the link we want to try get the closest link parent.
                var a = ed.dom.getParent(n, 'a', ed.getBody()) || (n.tagName === 'A' ? n : null);

                //select the a tag if all the inner text selected
                if (a && (a.innerHTML === ed.selection.getContent())) {
                    ed.selection.select(a);
                }

                cm.setDisabled('epilink', co && (a === null));
                cm.setActive('epilink', (a !== null) && !a.name);
            });
        },

        /**
        * Returns information about the plugin as a name/value array.
        *
        * @return {Object} Name/value array containing information about the plugin.
        */
        getInfo: function () {
            return {
                longname: 'Link plugin',
                author: 'EPiServer AB',
                authorurl: 'http://www.episerver.com',
                infourl: 'http://www.episerver.com',
                version: "1.0"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('epilink', tinymce.plugins.epilink);
}(tinymce, epiJQuery));
