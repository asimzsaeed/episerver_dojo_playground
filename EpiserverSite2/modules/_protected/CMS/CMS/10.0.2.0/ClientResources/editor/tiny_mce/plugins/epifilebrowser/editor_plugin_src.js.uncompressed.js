(function (tinymce, $) {

    tinymce.create('tinymce.plugins.epifilebrowser', {
        /**
        * Initializes of the file browser plug-in. Sets the file_browser_callback setting which enables the browse button in tinyMCE dialogs.
        *
        * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
        * @param {string} url Absolute URL to where the plugin is located.
        */
        init: function (editor, url) {
            // Early exit if we don't have access to EPi...
            if (typeof EPi === "undefined" || typeof EPi.ResolveUrlFromUI != "function") {
                return;
            }

            var fileBrowserComplete = function (returnValue, onCompleteArguments) {
                // The File manager browser returns a an object with a collection of selected items
                if (returnValue && returnValue.items && returnValue.items.length === 1) {
                    var doc = onCompleteArguments.window.document;
                    var formInput = doc.getElementById(onCompleteArguments.formInputId);

                    var firstFile = returnValue.items[0];

                    if (formInput.value === firstFile.path) {
                        return;
                    }

                    formInput.value = firstFile.path;

                    // The tinyMCE image dialogs has a function call specified in the onchange attribute.
                    // The advanced image dialog expects this.value as its first argument. For now we just mock that behaviour.
                    if (formInput.onchange) {
                        formInput.onchange(formInput.value);
                    }

                    // If we're setting the image src field try finding an alt field and use the image description as alt text automatically.
                    if (onCompleteArguments.formInputId === "src") {
                        var altInput = doc.getElementById("alt");
                        if (altInput != null && typeof (firstFile.description) === "string" && !altInput.value) {
                            altInput.value = firstFile.description;
                        }
                    }
                }

                editor.windowManager.onClose.dispatch();
            };

            var fileBrowserCallback = function (formInputId, value, type, win) {

                // returns the textbox (which holds the image URL) in order to update its value
                var getFormInput = function () {
                    return win.document.getElementById(formInputId);
                };

                var getAllowedTypes = function (type) {
                    switch (type) {
                        case "image":
                            return ["episerver.core.icontentimage"];
                        default:
                            return ["episerver.core.icontentmedia"];
                    }
                };

                require([
                    "dojo/_base/lang",
                    "dojo/on",
                    "dojo/when",
                    "epi/dependency",
                    "epi/UriParser",
                    "epi/shell/widget/dialog/Dialog",
                    "epi-cms/widget/ContentSelectorDialog",
                    "epi/i18n!epi/cms/nls/episerver.cms.widget.contentselector"
                ], function (
                    lang,
                    on,
                    when,
                    dependency,
                    UriParser,
                    Dialog,
                    ContentSelectorDialog,
                    res
                ) {
                    var registry = dependency.resolve("epi.storeregistry"),
                        store = registry.get("epi.cms.content.light"),
                        contextStore = registry.get("epi.shell.context"),
                        contentRepositoryDescriptors = dependency.resolve("epi.cms.contentRepositoryDescriptors"),
                        settings = contentRepositoryDescriptors["media"];

                    var contentSelector = new ContentSelectorDialog({
                        canSelectOwnerContent: false,
                        showButtons: false,
                        roots: settings.roots,
                        multiRootsMode: true,
                        showRoot: true,
                        allowedTypes: getAllowedTypes(type)
                    }),
                        dialog = new Dialog({
                            title: res.title,
                            dialogClass: "epi-dialog-portrait",
                            content: contentSelector
                        });

                    // Set the selected item when editing an existing file.
                    if (value) {
                        var result = contextStore.query({ url: value });
                        when(result, function (context) {
                            var uri = new UriParser(context.versionAgnosticUri);
                            contentSelector.set("value", uri.getId());
                        });
                    }

                    dialog.show();

                    on(dialog, 'execute', function () {
                        var contentLink = contentSelector.get("value");
                        if (!contentLink) {
                            return;
                        }

                        when(store.get(contentLink), lang.hitch(this, function (content) {
                            var formInput = getFormInput();
                            formInput.value = content.previewUrl;
                            if (formInput.onchange) {
                                formInput.onchange(content.publicUrl);
                            }
                        }));
                    });
                });
            };

            editor.settings.file_browser_callback = fileBrowserCallback;
        },

        /**
        * Returns information about the plugin as a name/value array.
        *
        * @return {Object} Name/value array containing information about the plugin.
        */
        getInfo: function () {
            return {
                longname: 'File Browser Plug-In',
                author: 'EPiServer AB',
                authorurl: 'http://www.episerver.com',
                infourl: 'http://www.episerver.com',
                version: 1.0
            };
        }


    });

    // Register plugin
    tinymce.PluginManager.add('epifilebrowser', tinymce.plugins.epifilebrowser);
}(tinymce, epiJQuery));