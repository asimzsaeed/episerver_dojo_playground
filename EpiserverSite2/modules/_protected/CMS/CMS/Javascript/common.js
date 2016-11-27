/*
 * common.js - JavaScript support routines for EPiServer
 * Copyright (c) 2007 EPiServer AB
 */

if (!window.EditorScriptVersions) {
    window.EditorScriptVersions = new Array();
}
window.EditorScriptVersions.push("Common 5.1");

// Call list of onbeforeUnload functions, if any. Used by webcontrols that must do their
// changes-detection during the onbeforeunload-event (and not before).
// NOTE: This function is only called if it has been set as the onbeforeunload event function.
// If it is called it means that there are no changes detected in webcontrols that would have set the
// leavePage as the onbeforeunload function. It also means that we do not know, at the entry point
// in the function, whether there are changes or not. That question will be resolved when the callback
// function(s) are executed.
function leavePageCallback() {
    var changesDetected = false;

    var index;
    var onbeforeUnloadFunction;

    for (index = 0; index < window.onbeforeUnloadFunctions.length && !changesDetected; index++) {
        onbeforeUnloadFunction = window.onbeforeUnloadFunctions[index];

        if (onbeforeUnloadFunction) {
            changesDetected = onbeforeUnloadFunction();
        }
    }

    if (changesDetected && window.leavePage) {
        window.leavePage();
    }
}

// Open the linktool dialog. Use this function to open the dialog from your own code.
function OpenLinkToolDialog(dialogURL, dialogArguments) {
    dialogURL += (dialogURL.indexOf('?') >= 0 ? '&' : '?') + 'caller=dhtmleditor';

    return OpenDialog(dialogURL, dialogArguments);
}

function OpenDialog(dialogURL, dialogArguments, width, height) {
    width = (!width) ? 560 : parseInt(width);
    height = (!height) ? 465 : parseInt(height);

    var dialogParameters = 'dialogWidth:' + width + 'px;dialogHeight:' + height + 'px;help=no;resizable:no;scroll:no;status:no;';

    return OpenDialogWithParameters(dialogURL, dialogArguments, dialogParameters);
}

function OpenDialogWithParameters(dialogURL, dialogArguments, dialogParameters) {
    var returnedObject;
    var ex;

    // The following flag is used by the editor to track if focus is lost because of a dialog is being opened.
    // When the flag is true, the caret position is not lost in the editor when the focusout event is triggered.
    window.OpeningDialog = true;

    try {
        returnedObject = window.showModalDialog(dialogURL, dialogArguments, dialogParameters);
    }
    catch (ex) {
        ShowMsg("Popups are blocked for this site, you need to enable popups to access this function.");
        returnedObject = "";
    }

    window.OpeningDialog = false;

    return returnedObject;
}

// Show a message in an alert, but only if Gui interaction is allowed (otherwise an exception with the message is thrown)
function ShowMsg(msg) {
    if (window.NoGuiInteraction) {
        throw new msg;
    } else {
        alert(msg);
    }
}

// A list class to store key-value pairs, optionally categorized.
function List() {
    this.Clear();
}

List.prototype.Clear = function () {
    this.list = [];
}

// Get index of key, -1 if key does not exist
List.prototype.IndexOf = function (keyarg) {
    if (isNaN(keyarg)) {
        var index = this.list.length;

        while (--index >= 0)
            if (this.list[index].key == keyarg) {
                return index;
            }
        return -1;
    } else {
        return keyarg;
    }
}

// Get value by key name
List.prototype.GetValue = function (keyarg) {
    var index = this.IndexOf(keyarg);
    if (index == -1) {
        throw 'Key ' + keyarg + ' not found in list';
    }

    return this.list[index].value;
}

// Get key name by index
List.prototype.GetKey = function (index) {
    return this.list[index].key;
}

// Set new value on existing object. Category is optional.
List.prototype.SetValue = function (keyarg, valuearg, categoryarg) {
    var index = this.IndexOf(keyarg);

    if (index == -1) {
        this.list.push({key: keyarg, value: valuearg, category: categoryarg ? categoryarg : ''});
    } else {
        this.list[index].value = valuearg;
        if (categoryarg) {
            this.list[index].category = categoryarg;
        }
    }
}

List.prototype.IterateValuesByCategory = function (category, callbackFunc) {
    var index = this.list.length;

    while (--index >= 0) {
        if (this.list[index].category == category) {
            callbackFunc(this.list[index]);
        }
    }
}
