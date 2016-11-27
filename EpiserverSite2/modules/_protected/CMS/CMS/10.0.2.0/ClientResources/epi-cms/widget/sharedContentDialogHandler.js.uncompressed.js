﻿define("epi-cms/widget/sharedContentDialogHandler", [
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/when",
    "dojox/html/entities",
    "epi",
    "epi/dependency",
    "epi/shell/TypeDescriptorManager",
    "epi/shell/widget/dialog/Dialog",
    "epi/shell/widget/DelayableStandby",
    "epi-cms/widget/ContentReferences",
    // Resources
    "epi/i18n!epi/cms/nls/episerver.cms.widget.contentreferences"
], function (
    lang,
    Deferred,
    when,
    entities,
    epi,
    dependency,
    TypeDescriptorManager,
    Dialog,
    Standby,
    ContentReferences,
    // Resources
    resources
) {

    var handler = function (settings) {
        // tags:
        //      internal

        var deferred = new Deferred(),
            contentLink = settings.contentData.contentLink,
            registry = dependency.resolve("epi.storeregistry"),
            store = registry.get("epi.cms.content.search"),
            standby = new Standby({ target: document.body, zIndex: 999 }).placeAt(document.body);

        // Display a the standby widget in case the content references takes a long time to query the store.
        standby.show(50, 0);

        when(store.get(contentLink), function (contentData) {

            var mode = settings.mode || handler.mode.confirm,
                isConfirm = mode === handler.mode.confirm,
                content = new ContentReferences({
                    model: {
                        contentData: contentData,
                        mode: mode
                    }
                });

            var watch = content.watch("numberOfReferences", function (propertyName, oldValue, newValue) {

                // Remove the watch so we don't leak memory or create additional dialogs on refresh.
                watch.remove();

                var description;

                if (isConfirm) {
                    // The description is determined by whether the content being deleted has children.
                    var key = contentData.hasChildren ? "movetotrashwithsubcontentdescription" : "movetotrashdescription";
                    description = TypeDescriptorManager.getResourceValue(contentData.typeIdentifier, key);
                } else {
                    description = TypeDescriptorManager.getResourceValue(contentData.typeIdentifier, "referencesdescription");
                }

                description = lang.replace(description, [entities.encode(contentData.name)]);

                // If not passed with settings, then the heading is determined by the dialog mode.
                var title = settings.title;
                if (!title) {
                    var translationKey = isConfirm ? "movetotrash" : "references";
                    title = TypeDescriptorManager.getResourceValue(contentData.typeIdentifier, translationKey);
                }

                var dialog = new Dialog({
                    focusActionsOnLoad: true,
                    defaultActionsVisible: isConfirm,
                    dialogClass: "epi-dialog-contentReferences",
                    title: title,
                    description: description,
                    cancelActionText: epi.resources.action.cancel,
                    confirmActionText: newValue === 0 ? resources.buttons.movetotrash : resources.buttons.movetotrashanyway,
                    setFocusOnConfirmButton: newValue === 0
                });

                if (!isConfirm) {
                    dialog.definitionConsumer.add({
                        name: "close",
                        label: epi.resources.action.close,
                        action: dialog.onCancel
                    });
                }

                dialog.connect(dialog, "onExecute", deferred.resolve);
                dialog.connect(dialog, "onCancel", deferred.cancel);

                dialog.set("content", content);

                // Hide the dialog when a reference is viewed.
                var handle = content.on("viewReference", function () {
                    dialog.hide();
                    handle.remove();
                });

                standby.hide();

                dialog.show();
            });

            content.startup();
        });

        return deferred.promise;
    };

    handler.mode = {
        confirm: "confirm",
        show: "show"
    };

    return handler;
});
