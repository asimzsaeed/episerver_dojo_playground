/*
 * dialog.js	- JavaScript support routines for EPiServer
 * Copyright (c) 2010 EPiServer AB
*/

// Method that returns the EPi.Dialog object for an existing dialog.
// win - window object of current dialog. Optional.
EPi.GetDialog = function (win) {
    win = win || window;
    if (win.opener && win.opener.EPiOpenedDialog) {
        return win.opener.EPiOpenedDialog;
    } else if (win.top.EPiOpenedDialog) {
        return win.top.EPiOpenedDialog;
    }
};

// Method opening a popup dialog.
// -- url                   Path to the file to open in a dialog, required.
// -- callbackMethod        Method to call when closing the dialog, optional.
// -- callbackArguments     Variant that specifies the arguments to use in the callbackMethod method, when returning/closing the dialog.
// -- dialogArguments       Variant that specifies the arguments to use when displaying the document. Use this parameter to pass a value of any type, including an array of values.
//                          The dialog loaded can extract the values passed by the caller from the dialogArguments property of the EPiDialog object.
// -- features              Optional. Object that specifies the dialog position and size.
//                          Example: {width:300, height:200}
//                          The following values are valid by default:width:intWidth|sWidth, height:intHeight|sHeight, left: intLeft|sLeft, top: intTop|sTop, scrollbars: "yes"|"no", resizable:"yes"|"no"
//                          Default is width:510, height:500, resizable:"yes", scrollbars:"yes". Position is centered in opening window.
EPi.CreateDialog = function (url, callbackMethod, callbackArguments, dialogArguments, features, opener) {
    var dialog = new EPi.Dialog(callbackMethod, callbackArguments, dialogArguments, opener)
    dialog.Initialize(url, features);

    return dialog;
};

// Creates a new epidialog object for PageBrowser.
EPi.CreatePageBrowserDialog = function (url, id, disableCurrentContentOption, displayWarning, info, value, language, callbackMethod, callbackArguments, requireUrlForSelectedPage) {
    var completeUrl = url +
        '?id=' + id +
        '&disablecurrentcontentoption=' + disableCurrentContentOption +
        '&info=' + info +
        '&value=' + value +
        '&epslanguage=' + language +
        '&displaywarning=' + displayWarning +
        '&requireurlforselectedpage=' + (requireUrlForSelectedPage ? "true" : "false");


    if (!callbackMethod) {
        callbackMethod = function (returnValue) {
            if (returnValue) {
                if (document.getElementById(info).onchange) {
                    theForm.submit();
                } else {
                    EPi.PageLeaveCheck.SetPageChanged(true);
                }
            }
        }
    }
    if (!callbackArguments) {
        callbackArguments = null;
    }
    var dialogArguments = window.document;
    var features = { width: 440, height: 550, scrollbars: "no" };
    return EPi.CreateDialog(completeUrl, callbackMethod, callbackArguments, dialogArguments, features);
}

// Creates a new epidialog object for PageBrowser.
EPi.CreateDateBrowserDialog = function (url, id, callbackMethod, isInLegacyMode) {
    if (!url) {
        url = EPi.ResolveUrlFromUI("edit/DateBrowser.aspx");
    }
    url += "&value=" + document.getElementById(id).value;

    if (!callbackMethod) {
        callbackMethod = function (returnValue, id) {
            if (typeof (returnValue) != "undefined" && returnValue != null) {
                var node = document.getElementById(id);
                node.value = returnValue;
                EPi.DispatchEvent(node, "change");
            }
        }
    }

    var features = isInLegacyMode
                    ? { width: 220, height: 260, scrollbars: "no" }
                    : { width: 300, height: 210, scrollbars: "no" };

    return EPi.CreateDialog(url, callbackMethod, id, null, features);
}



//******************************************************************************************
// EPiDialog class. Used to popup a dialog window which communicates from the opening window.
//******************************************************************************************
// -- url                   Path to the file to open in a dialog, required.
// -- callbackMethod        Method to call when closing the dialog, optional.
// -- callbackArguments     Variant that specifies the arguments to use in the callbackMethod method, when returning/closing the dialog.
// -- dialogArguments       Variant that specifies the arguments to use when displaying the document. Use this parameter to pass a value of any type, including an array of values.
//                          The dialog loaded can extract the values passed by the caller from the dialogArguments property of the EPiDialog object.
// -- features              Optional. Object that specifies the dialog position and size.
//                          Example: {width:300, height:200}
//                          The following values are valid by default:width:intWidth|sWidth, height:intHeight|sHeight, left: intLeft|sLeft, top: intTop|sTop, scrollbars: "yes"|"no", resizable:"yes"|"no"
//                          Default is width:510, height:500, resizable:"yes", scrollbars:"yes". Position is centered in opening window.

EPi.Dialog = function (callbackMethod, callbackArguments, dialogArguments, opener) {
    this.callbackMethod = callbackMethod || null;
    this.callbackArguments = callbackArguments || null;
    this.dialogArguments = dialogArguments || null;
    this._opener = (opener ? opener.top : window.top);

    // If another dialog calls code in main window (TinyMCE) we want the _opener reference to be that dialog window.
    if (this._opener.EPiOpenedDialog && this._opener.EPiOpenedDialog._dialog) {
        this._opener = this._opener.EPiOpenedDialog._dialog;
    }
    this._opener.EPiOpenedDialog = this;
};

// CreateCover is used to create a cover frame in the window opening the dialog if it's not already created.
// The editor creates this cover when initializing the editor to prevent corrupting the MSHTML undo stack (which is courrupted by document.appendChild).
EPi.Dialog.CreateCover = function (opener) {
    var win = (opener ? opener.top : window.top);
    if (!win.epiDialogCover) {
        var coverFrame = win.epiDialogCover = win.document.createElement("iframe");
        // We might get a popup question about non-secure items if using https and the iframes location is not secure.
        coverFrame.src = EPi.ResolveUrlFromUtil("Empty.htm");

        with (coverFrame.style) {
            position = "absolute";
            top = 0;
            left = 0;
            width = "100%";
            height = "100%";
            overflow = "hidden";
            border = 0;
            backgroundColor = "#101010";
            zIndex = 300001;
            display = "none";
            opacity = 0.01;
            filter = "alpha(opacity=1)";
        }

        EPi.AddEventListener(coverFrame, "load", function (e) {
                EPi.AddEventListener(this.contentWindow.document, "click", EPi.Dialog._SetFocusToOpenedDialog);
            });

        win.document.body.appendChild(coverFrame);
    }
    return win.epiDialogCover;
}

EPi.Dialog._SetFocusToOpenedDialog = function () {
    var dialog = EPi.GetDialog();
    if (dialog) {
        dialog._SetFocus();
    }
};

// Use preload for IE9 which uses rendering engine Trident 5
// navigator.userAgent will report IE version 7 when pages use X-UA IE=EvaluateIE7
EPi.Dialog.usePreloadWithAboutBlank = (EPi.browser.isIE && EPi.browser.tridentVersion != undefined && (parseInt(EPi.browser.tridentVersion, 10) == 5));

var _p = EPi.Dialog.prototype;
_p.callbackMethod = null;
_p._dialog = null;
_p._opener = null;

// Close the dialog and call the callbackMethod function.
// The callbackMethod is called with arguments (returnValue, callbackArguments);
_p.Close = function (returnValue) {
    this._CleanUpAndReturn(returnValue);
}

_p.ButtonChanged = function () { };

_p.Initialize = function (url, features) {
    this._SetDialogFeatures(features);

    var opener = this._opener;

    var preloadWithAboutBlank = EPi.Dialog.usePreloadWithAboutBlank;
    var startUrl = url;

    try {
        var params = "menubar=no,location=no,resizable=" + this.resizable + ",scrollbars=" + this.scrollbars + ",status=no, width=" + parseInt(this.width) + ", height=" + parseInt(this.height) + ", top=" + parseInt(this.top) + ", left=" + parseInt(this.left);

        if (preloadWithAboutBlank) {
            startUrl = "about:blank";
        }

        this._dialog = opener.open(startUrl, "", params);
    }
    catch (ex) {
        ShowPopupBlockedInfo();
        this._CleanEvents();
        this._CleanElements();
        this.Close(null);
        return;
    }

    // Create or use an existing dialog cover
    var dialogCover = EPi.Dialog.CreateCover(opener);
    dialogCover.style.display = "block";

    this._AddEvents();

    // change to correct url if we used preload with about blank
    if (preloadWithAboutBlank) {
        this._dialog.document.location = url;
    }
}

_p._SetDialogFeatures = function (features) {
    var opener = this._opener;

    if (typeof (features) == "object") {
        for (var p in features) {
            this[p.toLowerCase()] = features[p];
        }
    }

    if (!this.resizable) {
        this.resizable = "yes"
    };
    if (!this.scrollbars) {
        this.scrollbars = "yes"
    };
    if (!this.width) {
        this.width = 510;
    }
    if (!this.height) {
        this.height = 500;
    }

    // Make sure the dialog size isn't larger than screen real estate.
    if (this.width > window.screen.availWidth - 50) {
        // Don't want to take up the entire width.
        this.width = window.screen.availWidth - 50;
        this.left = 20;
    }

    if (this.height > window.screen.availHeight - 100) {
        //Subtract som height for title bar, address bar and status bar.
        this.height = window.screen.availHeight - 100;
        this.top = 20;
    }

    if (!this.left) {
        if (opener.innerWidth) {
            this.left = opener.screenX + opener.innerWidth / 2 - this.width / 2;
        } else {
            this.left = opener.screenLeft + opener.document.body.offsetWidth / 2 - this.width / 2;
        }
    }

    if (!this.top) {
        if (opener.innerHeight) {
            this.top = opener.screenY + opener.innerHeight / 2 - this.height / 2;
        } else {
            this.top = opener.screenTop + opener.document.body.offsetHeight / 2 - this.height / 2;
        }
        var left = Math.max(0, this.left);
        var top = Math.max(0, this.top);

        this.left = left;
        this.top = top;
    }
}

_p._TimeoutCheck = function () {
    var epiDialog = this.EPiOpenedDialog;
    if (epiDialog && epiDialog._dialog) {
        // Is the dialog window already closed.
        if (epiDialog._dialog.closed) {
            epiDialog._CleanUpAndReturn(null);
        } else {
            epiDialog._AddUnLoadEventListener();
        }
    }
};

_p._DialogUnload = function (e) {
    var dialogWindow = this;
    var epiDialog = dialogWindow.opener.EPiOpenedDialog;

    if (epiDialog) {
        EPi.RemoveEventListener(dialogWindow, "unload", epiDialog._DialogUnload);
        if (typeof epiDialog._TimeoutCheck === "function") { // If not we have a window without system.js which could be the case in some scenarios (for example when opening dynamic content).
            dialogWindow.opener.setTimeout(epiDialog._TimeoutCheck, 10);
        }
    }
}

_p._AddUnLoadEventListener = function () {
    // Trying to keep IE7 from blowing up when timing gets funky
    try {
        EPi.AddEventListener(this._dialog, "unload", this._DialogUnload);
    } catch (ex) { }
}

_p._CleanUpAndReturn = function (returnValue) {
    var message;
    // If we have a _dialog this dialog object has opened a window and we have to clean things up.
    if (this._dialog != null) {
        // We need to override default EPi.PageleaveCheck handling and do the check ourselves.
        // The proper way would be to call _CleanUpAndReturn in unload handler(by this._dialog.close())
        // which would make default PageLeaveCheck handling work but then we will loose returnValue reference in IE6
        // which makes the dialogs useless.
        if (!this._dialog.closed && this._dialog.EPi && this._dialog.EPi.PageLeaveCheck && this._dialog.EPi.PageLeaveCheck.trigger == null && this._dialog.EPi.PageLeaveCheck.HasPageChanged()) {

            if (this._dialog.EPiObject && this._dialog.EPiObject.pageLeaveMessage) {
                message = this._dialog.EPiObject.pageLeaveMessage;
            } else {
                message = EPi.Translate("/system/editutil/leavepagewarning");
            }
            var confirmClose = this._dialog.confirm(message);
            if (!confirmClose) {
                // Cancel closing dialog
                return;
            } else {
                // Prevent default pageLeaveCheck confirm dialog from appearing
                this._dialog.EPi.PageLeaveCheck.enabled = false;
            }
        }

        // If the opened window is still open close it.
        if (!this._dialog.closed) {
            EPi.RemoveEventListener(this._dialog, "unload", this._DialogUnload);
            this._dialog.close();
        }

        // Clean up of this dialog
        this._CleanEvents();
        this._CleanElements();
    }

    this._CleanDialog();

    if (this._opener) {
        this._opener.EPiOpenedDialog = null;
    }
    delete this._opener;

    // When the dialog is closing call the callbackMethod function (if specified) to do whatever it is supposed to with the result of the dialog.
    if (typeof (this.callbackMethod) == "function") {
        this.callbackMethod(returnValue, this.callbackArguments);
    }

    this.callbackMethod = null;
    this.callbackArguments = null;

    delete this.callbackMethod;
    delete this.callbackArguments;
}

_p._AddEvents = function () {
    // Trying to keep IE7 from blowing up when timing gets funky
    try {
        EPi.AddEventListener(this._opener, "unload", this._OnOpenerUnload);
        EPi.AddEventListener(this._opener, "focus", this._SetFocus);
        this._AddUnLoadEventListener();
    } catch (ex) { }
}

// Clean up attached events
_p._CleanEvents = function () {
    // Trying to keep IE7 from blowing up when timing gets funky
    try {
        EPi.RemoveEventListener(this._opener, "unload", this._OnOpenerUnload);
        EPi.RemoveEventListener(this._opener, "focus", this._SetFocus);
    } catch (ex) { }
}

_p._OnOpenerUnload = function () {
    if (this.EPiOpenedDialog) {
        this.EPiOpenedDialog._CleanUpAndReturn(null);
    }
}

_p._SetFocus = function (e) {
    // Event handler called in the context of the clicked window or on the dialog object
    var win;
    if (e) {
        // If we have an event argument we're called from the focus event on a window object
        win = this;
    } else {
        // Otherwise we've been called directly on the EPi.Dilog object
        win = this._opener;
    }

    if (win.EPiOpenedDialog && win.EPiOpenedDialog._dialog) { // If not found the dialog is in closing state.


        if (win.EPiOpenedDialog._dialog.closed) {
            // If the dialog is already closed we clean up.
            win.EPiOpenedDialog._CleanUpAndReturn(null);
        } else {
            // Otherwise we focus the dialog. However this sometimes fails in IE8. _dialog.closed = true but we end up here anyway, hence try catch.
            try {
                win.top.EPiOpenedDialog._dialog.focus();
            } catch (ex) {
                if (win.top.EPiOpenedDialog._dialog.closed) {
                    win.top.EPiOpenedDialog._CleanUpAndReturn(null);
                }
            }
        }
    }
};

// Clean up the DOM elements created by this dialog
_p._CleanElements = function () {
    if (this._opener && this._opener.epiDialogCover) {
        this._opener.epiDialogCover.style.display = "none";
    }
}

// Clean up properties of this dialog
_p._CleanDialog = function () {
    for (var prop in this) {
        if (prop != "callbackMethod" && prop != "callbackArguments" && prop != "_opener") {
            this[prop] = null;
            delete this[prop];
        }
    }
}
