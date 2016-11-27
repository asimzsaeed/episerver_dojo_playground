define("epi-cms/widget/ContentTreeModelConfirmation", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",

    "dojo/aspect",
    "dojo/Deferred",
    "dojo/string",
    "dojo/when",
    "dojo/_base/json",

// dojox
    "dojox/html/entities",

// epi
    "epi/dependency",
    "epi/string",

    "epi/shell/TypeDescriptorManager",
    "epi/shell/widget/dialog/Alert",
    "epi/shell/widget/dialog/Confirmation",

    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/widget/sharedContentDialogHandler",
    // resources
    "epi/i18n!epi/cms/nls/episerver.cms.components.pagetree",
    "epi/i18n!epi/cms/nls/episerver.cms.components.project"
],

function (
// dojo
    declare,
    lang,

    aspect,
    Deferred,
    string,
    when,
    json,

// dojox
    htmlEntities,

// epi
    dependency,
    epistring,

    TypeDescriptorManager,
    Alert,
    Confirmation,

    ContentActionSupport,
    sharedContentDialogHandler,
    res,
    projectResources
) {

    return function (model) {
        // summary:
        //      Attaches confirmation to the pasteItem method of a dijit/tree.model instance.
        //      Looks at the paste parameters to show a confirmation before delting or moving items.
        //
        // tags:
        //      internal xproduct

        // NOTE: This pattern isn't really that nice, since it alters the aspect.around actually alters the underlying store.
        //      It's probably a better idea to use delegation, but that requires us to -implement set() and _set() to get
        //      model property changes updated on the underlying model and not the delegating facade.

        var _isFunction = function (object) {
            return object && typeof object == "function";
        };

        var _showNotification = function (message, callback) {
            // summary:
            //      Uses the alert dialog implementation to notify with the supplied message
            var dialog = new Alert({
                description: epistring.toHTML(message),
                onAction: function () {
                    if (_isFunction(callback)) {
                        callback();
                    }
                }
            });

            dialog.show();
        };

        var _showConfirmation = function (title, confirmationMessage) {
            // summary:
            //      Wrap epi/shell/widget/dialog/Confirmation for short type
            //      and return deferred object
            // confirmQuestion:
            //      String / Deferred : Text to display on dialog
            // tags:
            //		private
            var deferred = new Deferred();

            when(confirmationMessage, function (message) {
                var dialog = new Confirmation({
                    description: epistring.toHTML(message),
                    title: title,
                    onAction: function (confirmed) {
                        confirmed ? deferred.resolve() : deferred.cancel();
                    }
                });
                dialog.show();
            });

            return deferred;
        };

        var onResponse = function (result, callback) {
            // Checks the result of a call to pasteItem and shows error messages if result indicates a failure
            when(result,
                function (serverResponse) {
                    if (serverResponse && (serverResponse.message || serverResponse.statusDescription)) {
                        var message = serverResponse.message || serverResponse.statusDescription;
                        _showNotification(message, callback);
                    } else {
                        if (_isFunction(callback)) {
                            callback();
                        }
                    }
                },
                function (e) {
                    _showNotification(htmlEntities.encode(json.fromJson(e.xhr.responseText)));
                });
            return result;
        };

        aspect.around(model, "pasteItem", function (originalMethod) {
            return function (source, oldParent, newParent, copy, sortIndex) {

                var moveTitle = TypeDescriptorManager.getResourceValue(source.typeIdentifier, "move");
                // Defaulting confirmation to an affirmative response in case we don't need a confirmation
                var confirmation = true;

                if (newParent.isWastebasket) {
                    confirmation = sharedContentDialogHandler({ contentData: source });
                } else if (sortIndex !== undefined && (newParent.properties.pageChildOrderRule !== ContentActionSupport.sortOrder.Index)) {

                    // Page is copied/moved and sorted and the new parent sorting rule must be changed
                    var message = string.substitute(res.changepeerorderconfirmation, [model.getLabel(newParent)]);
                    confirmation = _showConfirmation(moveTitle, message);
                } else if (!copy) {
                    if (!model.canCut(source)) {
                        _showNotification(TypeDescriptorManager.getResourceValue(source.typeIdentifier, "moverequiresdeleteaccess"), function () {
                            return false;
                        });
                        return;
                    }

                    var formatTemplate = "{0}<br/><br/>{1}",
                        description = lang.replace(formatTemplate, [
                            TypeDescriptorManager.getResourceValue(source.typeIdentifier, "moveconfirmation"),
                            TypeDescriptorManager.getResourceValue(source.typeIdentifier, "movedescription")
                        ]);

                    var projectService = dependency.resolve("epi.cms.ProjectService");
                    if (projectService.isProjectModeEnabled) {
                        description = lang.replace(formatTemplate, [description, projectResources.moveconfirmation]);
                    }

                    // Plain move
                    confirmation = _showConfirmation(moveTitle, description);

                } else if (!model.canCopy(source)) {
                    _showNotification(TypeDescriptorManager.getResourceValue(source.typeIdentifier, "copynotsupported"));
                    return;
                }

                var pasteArguments = arguments;
                return when(confirmation, function () {
                    // Call pasteItem of the model
                    return originalMethod.apply(model, pasteArguments);
                }, function () {
                    return false;
                });
            };
        });

        aspect.after(model, "pasteItem", function (result) {
            return result && onResponse(result);
        });

        aspect.after(model, "remove", function (result) {
            return result && onResponse(result);
        });

        return model;
    };

});
