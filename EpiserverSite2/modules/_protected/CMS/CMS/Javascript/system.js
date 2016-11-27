/*
 * system.js	- JavaScript support routines for EPiServer
 * Copyright (c) 2010 EPiServer AB
*/

var _refreshPart = null;

function RefreshBodyPart(refreshPart, loadFromUrl, postName, postValue) {
    var frame = document.frames['__epLoaderFrame'];

    if (frame == null) {
        frame = document.createElement("IFRAME");
        frame.id = '__epLoaderFrame';
        frame.name = '__epLoaderFrame';
        frame.attachEvent("onload", RefreshBodyPartOnLoad);
        frame.style.display = 'none';
        document.body.appendChild(frame);
    }
    _refreshPart = refreshPart;

    if (loadFromUrl == null)
        loadFromUrl = document.location.href;

    if (postName != null && postValue != null) {
        if (frame.document.body != null)
            frame.document.body.innerHTML = "";
        else
            frame.document.write('<HTML><BODY></BODY></HTML>');

        var form = document.createElement('<form name="form" method="post" action="' + loadFromUrl + '"></form>');
        var input = document.createElement('<input type="hidden" name="' + postName + '" value="">');
        form.appendChild(input);
        frame.document.body.innerHTML = form.outerHTML;
        if (postValue.value)
            frame.document.form.elements[postName].value = postValue.value;
        else
            frame.document.form.elements[postName].value = postValue;
        frame.document.form.submit();
    } else
        frame.document.location.href = loadFromUrl;
}

function RefreshBodyPartOnLoad() {
    var frame = document.frames['__epLoaderFrame'];
    var source = this.document.all[_refreshPart];
    var target = frame.document.all[_refreshPart];

    if (source != null && target != null) {
        source.insertAdjacentElement('beforeBegin', target);
        source.parentElement.removeChild(source);
    }
}

function DeleteRow(oRow) {
    oRow.parentElement.deleteRow(oRow.rowIndex);
    return false;
}

//Used by membershipbrowser.aspx, moves users/roles between drop downs.
function SecMoveOption(oSelectFrom, oSelectTo) {
    while (oSelectFrom.selectedIndex >= 0) {
        var nIndex = oSelectFrom.selectedIndex;
        var newOption = new Option(oSelectFrom.options[nIndex].text, oSelectFrom.options[nIndex].value);
        //TODO: Find a way to make this firefox/ie friendly.
        try {
            // IE way
            oSelectTo.add(newOption);
        }
        catch (ex) {
            // DOM level 2
            oSelectTo.add(newOption, null);
        }
        oSelectFrom.remove(nIndex);
    }
}

function ShowPopupBlockedInfo() {
    alert(EPi.Translate("/javascript/system/popupsblocked"));
}

//***********************************************************************************************************


function OpenDialogMembershipDeleteUserOrRole(rolerOrUserName, securityEntity, providerName, callbackMethod, callbackMethodArguments, dialogArguments, visitorGroupId) {
    var url = EPi.ResolveUrlFromUI('admin/DeleteMembershipDialog.aspx') + '?NameRoleOrUser=' + encodeURIComponent(rolerOrUserName) + '&SecurityEntity=' + securityEntity + '&ProviderName=' + providerName;

    if (visitorGroupId) {
        url += '&VisitorGroupId=' + visitorGroupId;
    }

    var dialogHeight = 320;
    var dialogWidth = 580;

    try {
        EPi.CreateDialog(url, callbackMethod, callbackMethodArguments, dialogArguments, { width: dialogWidth, height: dialogHeight });
    }
    catch (ex) {
        ShowPopupBlockedInfo();
    }

    return false;
}

//Callback functions for Dialog
function MembershipDeleteCompleted(returnValue, callbackArguments) {
    if (returnValue) {
        reloadPage();
    }
}


//***********************************************************************************************************
function OpenDialogUserAndGroupBrowser(securityType, search, editDir, allowMultiple, callbackMethod, callbackMethodArguments, dialogArguments) {
    var search = (search == '' ? '' : '&search=' + encodeURIComponent(search));
    var url = editDir + '/MembershipBrowser.aspx?type=' + securityType + search + '&AllowMultiple=' + allowMultiple;
    var dialogHeight = 600;
    var dialogWidth = 580;

    try {
        EPi.CreateDialog(url, callbackMethod, callbackMethodArguments, dialogArguments, { width: dialogWidth, height: dialogHeight });
    }
    catch (ex) {
        ShowPopupBlockedInfo();
    }

    return false;
}

//Callback functions for Dialog
function BrowserDialogCompleted(returnValue, callbackArguments) {

    var arrayReturnObjects;
    if (!returnValue) {
        return;
    }
    for (var i = 0; i < returnValue.length; i++) {
        arrayReturnObjects = returnValue[i].split("|||");
        addRows(arrayReturnObjects[0], arrayReturnObjects[1]);
    }
}

//Callback functions for Dialog
function BrowserPermissionDialogCompleted(returnValue, callbackArguments) {
    var arrayReturnObjects;
    if (!returnValue) {
        return;
    }
    for (var i = 0; i < returnValue.length; i++) {
        arrayReturnObjects = returnValue[i].split("|||");
        addPermissionRows(arrayReturnObjects[0], arrayReturnObjects[1]);
    }
}


//***********************************************************************************************************

function ToggleElementsInContainer(container, source) {
    var form = getForm();
    for (var i = 0; i < form.elements.length; i++) {
        if (IsElementInContainer(container, form.elements[i]) && form.elements[i] != source)
            form.elements[i].disabled = !(form.elements[i].disabled);
    }

}

function IsElementInContainer(container, element) {
    var tag = element;
    while (tag = tag.parentElement) {
        if (tag == container)
            return true;
    }

    return false;
}
//***********************************************************************************************************


function SimulateFormField(name, value) {
    var form = getForm();

    if (!form.elements[name]) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.id = name;
        input.value = value;
        form.appendChild(input);
    }
}

function getForm() {
    if (window.event == null)
        return document.forms[0];

    var form = findParentForm(window.event.srcElement);

    if (!form && document.forms.length > 0) {
        form = document.forms[0];
    }

    return form;
}

function findParentForm(obj) {
    var tag = obj;
    while (tag = tag.parentElement) {
        if (tag.tagName.toLowerCase() == 'form')
            return tag;
    }

    return null;
}

var EPi;

if (!EPi) {
    EPi = {};
}

EPi.GetOffset = function (node) {
    var offsetLeft = 0;
    var offsetTop = 0;

    if (node.offsetParent) {
        // In IE6 We have to check if node is body.
        while (node.offsetParent && node.tagName.toLowerCase() != "body") {
            offsetLeft += node.offsetLeft;
            offsetTop += node.offsetTop;
            node = node.offsetParent;
        }
    }
    var returnValue = [offsetLeft, offsetTop];
    return returnValue;
}



// Form managing support used to get a consistent posting behaviour when using different kind of buttons
EPi.Form = {};

EPi.Form._isRegistered = false;

// Sets the onsubmit of the ASP.NET form to our own submit handler EPi.Form_OnSubmit.
// If any onsubmit exists its converted to use DOM Level 2 Events.
EPi.Form.SetOnSubmit = function () {
    EPi.Form._isRegistered = true;
    var formNode = EPi.GetForm();
    if (formNode.onsubmit) {
        EPi.Form.RegisterSubmitHandler(formNode.onsubmit);
    }
    formNode.onsubmit = EPi.Form._OnSubmit;
}

// Our own submit handler
EPi.Form._OnSubmit = function (e) {
    // If IE we have to check for the event in window.event
    if (!e) {
        e = window.event;
    }

    // If we have e it's a native post which automatically will trigger the submit event.
    if (e && e.type == "submit" && !document.addEventListener) {
        return;
    }

    var eventType = "submit";
    if (document.addEventListener) {
        // In EPi.AddEventListener we add the custom episubmit event type if the browser uses addEventListener.
        // Since dispatchEvent of submit in non IE also submits(!) we have to dispatch our own event.
        // Hence we change event type to episubmit.
        eventType = "episubmit";

    }

    // Dispatch a submit event to trigger listeners of submit event
    return EPi.DispatchEvent(EPi.GetForm(), eventType);

}

// Converts eventhandlers added to the onsubmit attribute of the ASP.NET form
// to use DOM Level 2 Event model.
// In event model 1 the eventHandler should return false to prevent the event
// In event model 2 we use preventDefault on the event.
EPi.Form.RegisterSubmitHandler = function (func) {
    var eventHandler = function (e) {
        if (func() == false) {
            e.preventDefault();
        }
    }
    EPi.AddEventListener(EPi.GetForm(), "submit", eventHandler);
}

// DEPRECATED:  Use EPi.AddEventListener(EPi.GetForm(), "submit", eventHandler);
//              Use e.preventDefault(); to prevent submit in eventHandler
// Register your script application to EPiServer's submit-function queue.
// The 'func' argument is a function object that will be called before the page is submitted.
function RegisterSubmitHandler(func) {
    EPi.Form.RegisterSubmitHandler(func);
}


// Used in TabStrip.
EPi.Tab = {};
EPi.Tab.Click = function (oTab, oBody, oInput, oActiveTab) {

    if (oActiveTab) {
        oActiveTab.Close();
    }
    oActiveTab.oTab = oTab.id;
    oActiveTab.oBody = oBody;
    oActiveTab.oInput = oInput;
    oActiveTab.Open();
    //Since there is a bug in IE where the caret in the editor is visible through the tabs we need to fix the focus.
    //If we have an editor in a tab (that has focus) and then switch to the next tab the caret will still be visible.
    //These 2 lines of focus code fixes that.
    window.focus();
    $("a", oTab).focus();
}

EPi.Tab.Control = function (oTab, oBody, oInput) {
    this.oTab = oTab;
    this.oBody = oBody;
    this.oInput = oInput;

    this.Close = function () {
        if (typeof (this.oBody) == 'string' && document.getElementById(this.oBody)) {
            document.getElementById(this.oBody).style.display = "none";
        }
        if (typeof (this.oTab) == 'string' && document.getElementById(this.oTab)) {
            document.getElementById(this.oTab).className = "epi-tabView-navigation-item";
        }
        document.getElementById(this.oInput).value = '';
    }

    this.Open = function () {
        if (typeof (this.oBody) == 'string' && document.getElementById(this.oBody)) {
            document.getElementById(this.oBody).style.display = "block";
        }

        if (typeof (this.oTab) == 'string' && document.getElementById(this.oTab)) {
            document.getElementById(this.oTab).className = "epi-tabView-navigation-item-selected";
        }
        document.getElementById(this.oInput).value = 'TabClicked';
    }
}

// ResizeWindow event. Used by serverside ResizeWindowEvent to resize elements when
// the window containing the elements loads or resizes.
EPi.ResizeWindow = function (e) {
    EPi.RemoveEventListener(window, "load", EPi.ResizeWindow);
    EPi.ResizeWindow._resize(e);
    EPi.AddEventListener(window, "resize", EPi.ResizeWindow._resize);
}

EPi.ResizeWindow.ElementsArray = new Array();

EPi.ResizeWindow.Add = function (id) {
    var resizeArray = EPi.ResizeWindow.ElementsArray;
    var alreadyExists = false;

    for (var i = 0; i < resizeArray.length; i++) {
        if (id == resizeArray[i]) {
            alreadyExists = true;
            break;
        }
    }

    if (!alreadyExists) {
        EPi.ResizeWindow.ElementsArray.push(id);
        EPi.ResizeWindow._resize();
        EPi.AddEventListener(window, "resize", EPi.ResizeWindow._resize);
    }
}

EPi.ResizeWindow._resize = function (e) {
    if (EPi.ResizeWindow.ElementsArray.length == 0) {
        return;
    }

    var i, node;
    var currentDisplayStyle = new Array();
    var len = EPi.ResizeWindow.ElementsArray.length;
    var formNode = EPi.GetForm();

    for (i = 0; i < len; i++) {
        node = document.getElementById(EPi.ResizeWindow.ElementsArray[i]);
        if (node == null) {
            return;
        }
        currentDisplayStyle[i] = EPi.GetCurrentStyle(node, "display");
        node.style.display = "none";
    }

    for (i = 0; i < len; i++) {
        node = document.getElementById(EPi.ResizeWindow.ElementsArray[i]);
        node.style.height = Math.max((document.documentElement.clientHeight - formNode.offsetHeight - 12), 0) + "px";
    }

    for (i = 0; i < len; i++) {
        node = document.getElementById(EPi.ResizeWindow.ElementsArray[i]);
        if (currentDisplayStyle[i] == "none" || currentDisplayStyle[i] == "inline") {
            currentDisplayStyle[i] = "block";
        }
        node.style.display = currentDisplayStyle[i];
    }
}

// Scripts for EPiServerUI.ToolButton
EPi.ToolButton = {};
EPi.ToolButton.SetEnabled = function (button, enable) {
    var buttonNode = EPi._GetDomObject(button);
    if (typeof (buttonNode) != "object" || buttonNode === null) {
        return;
    }
    var parentNode = buttonNode.parentNode;

    if (enable) {
        // Enable
        var className = parentNode.className.replace(/disabled/, "");
        if (parentNode.className != className) { //Prevent flashing buttons in IE
            parentNode.className = className;
        }
        buttonNode.removeAttribute("disabled");
    } else {
        // Disable
        // Check if button already is disabled
        if (!buttonNode.disabled) {
            buttonNode.setAttribute("disabled", "disabled");
            var className = parentNode.className.replace(/disabled/, "");
            parentNode.className += "disabled";
        }
    }
}

EPi.ToolButton.MouseDownHandler = function (node) {
    node.parentNode.className += " epitoolbuttonmousedown";
}

EPi.ToolButton.ResetMouseDownHandler = function (node) {
    var className = node.parentNode.className.replace(/ epitoolbuttonmousedown/, "");
    node.parentNode.className = className;
}

// Open up Report Center
EPi.ReportWindowOpen = function () {
    var _url = EPi.ResolveUrlFromUI("Report/Default.aspx");
    var _availableHeight = window.screen.availHeight;
    var _availableWidth = window.screen.availWidth;
    var _opener = window.top;

    // Links in Report Center should be able to communicate/load pages in EPiServer UI main window why we have to set the name of opening window.
    // This makes it possible to use target attribute on links with the value "EPiServerMainUI".
    _opener.name = "EPiServerMainUI";

    var _width = Math.min(_availableWidth, 1024);
    var _height = Math.min(_availableHeight, 768);

    var _left;
    var _top;

    if (_opener.innerWidth) {
        _left = _opener.screenX + _opener.innerWidth / 2 - _width / 2;
        _top = _opener.screenY + _opener.innerHeight / 2 - _height / 2;
    } else {
        _left = _opener.screenLeft + _opener.document.body.offsetWidth / 2 - _width / 2;
        _top = _opener.screenTop + _opener.document.body.offsetHeight / 2 - _height / 2;
    }

    // Make sure the dialog size isn't larger than screen real estate.
    if (_width == _availableWidth) {
        _width -= 50;
        _left = 20;
    }
    if (_height == _availableHeight) {
        _height -= 50;
        _top = 20;
    }

    var reportCenter = _opener.open(_url, "ReportCenter", "width=" + _width + ", height=" + _height + ", top=" + _top + ", left=" + _left + ", status=no, resizable, scrollbars");
    reportCenter.resizeTo(_width, _height);
    reportCenter.focus();
}

// Returns true if the specified Array contains the specified value, otherwise false is returned.
EPi.ArrayContains = function (array, value) {
    if (array == null || value == null) {
        return false;
    }

    var i;
    var len = array.length;
    for (i = 0; i < len; i++) {
        if (array[i] == value) {
            return true;
        }
    }

    return false;
}

// Searches the string for a word, i.e a substring surrounded with spaces or beginning/end of line.
EPi.StringContainsWord = function (str, word) {
    if (str == null || word == null) {
        return false;
    }
    return (new RegExp("(?:\\s|^)" + word + "(?:\\s|$)")).test(str);
}

// HtmlDecode http://lab.msdn.microsoft.com/annotations/htmldecode.js
//   client side version of the useful Server.HtmlDecode method
//   takes one string (encoded) and returns another (decoded)

EPi.HtmlDecode = function (s) {
    var out = "";
    if (s == null || s == "") return;

    var l = s.length;

    for (var i = 0; i < l; i++) {
        var ch = s.charAt(i);
        if (ch == '&') {
            var semicolonIndex = s.indexOf(';', i + 1);
            if (semicolonIndex > 0) {
                var entity = s.substring(i + 1, semicolonIndex);
                if (entity.length > 1 && entity.charAt(0) == '#') {
                    if (entity.charAt(1) == 'x' || entity.charAt(1) == 'X') {
                        ch = String.fromCharCode(eval('0' + entity.substring(1)));
                    } else {
                        ch = String.fromCharCode(eval(entity.substring(1)));
                    }
                } else {
                    switch (entity) {
                        case 'quot': ch = String.fromCharCode(0x0022); break;
                        case 'amp': ch = String.fromCharCode(0x0026); break;
                        case 'lt': ch = String.fromCharCode(0x003c); break;
                        case 'gt': ch = String.fromCharCode(0x003e); break;
                        case 'nbsp': ch = String.fromCharCode(0x00a0); break;
                        case 'iexcl': ch = String.fromCharCode(0x00a1); break;
                        case 'cent': ch = String.fromCharCode(0x00a2); break;
                        case 'pound': ch = String.fromCharCode(0x00a3); break;
                        case 'curren': ch = String.fromCharCode(0x00a4); break;
                        case 'yen': ch = String.fromCharCode(0x00a5); break;
                        case 'brvbar': ch = String.fromCharCode(0x00a6); break;
                        case 'sect': ch = String.fromCharCode(0x00a7); break;
                        case 'uml': ch = String.fromCharCode(0x00a8); break;
                        case 'copy': ch = String.fromCharCode(0x00a9); break;
                        case 'ordf': ch = String.fromCharCode(0x00aa); break;
                        case 'laquo': ch = String.fromCharCode(0x00ab); break;
                        case 'not': ch = String.fromCharCode(0x00ac); break;
                        case 'shy': ch = String.fromCharCode(0x00ad); break;
                        case 'reg': ch = String.fromCharCode(0x00ae); break;
                        case 'macr': ch = String.fromCharCode(0x00af); break;
                        case 'deg': ch = String.fromCharCode(0x00b0); break;
                        case 'plusmn': ch = String.fromCharCode(0x00b1); break;
                        case 'sup2': ch = String.fromCharCode(0x00b2); break;
                        case 'sup3': ch = String.fromCharCode(0x00b3); break;
                        case 'acute': ch = String.fromCharCode(0x00b4); break;
                        case 'micro': ch = String.fromCharCode(0x00b5); break;
                        case 'para': ch = String.fromCharCode(0x00b6); break;
                        case 'middot': ch = String.fromCharCode(0x00b7); break;
                        case 'cedil': ch = String.fromCharCode(0x00b8); break;
                        case 'sup1': ch = String.fromCharCode(0x00b9); break;
                        case 'ordm': ch = String.fromCharCode(0x00ba); break;
                        case 'raquo': ch = String.fromCharCode(0x00bb); break;
                        case 'frac14': ch = String.fromCharCode(0x00bc); break;
                        case 'frac12': ch = String.fromCharCode(0x00bd); break;
                        case 'frac34': ch = String.fromCharCode(0x00be); break;
                        case 'iquest': ch = String.fromCharCode(0x00bf); break;
                        case 'Agrave': ch = String.fromCharCode(0x00c0); break;
                        case 'Aacute': ch = String.fromCharCode(0x00c1); break;
                        case 'Acirc': ch = String.fromCharCode(0x00c2); break;
                        case 'Atilde': ch = String.fromCharCode(0x00c3); break;
                        case 'Auml': ch = String.fromCharCode(0x00c4); break;
                        case 'Aring': ch = String.fromCharCode(0x00c5); break;
                        case 'AElig': ch = String.fromCharCode(0x00c6); break;
                        case 'Ccedil': ch = String.fromCharCode(0x00c7); break;
                        case 'Egrave': ch = String.fromCharCode(0x00c8); break;
                        case 'Eacute': ch = String.fromCharCode(0x00c9); break;
                        case 'Ecirc': ch = String.fromCharCode(0x00ca); break;
                        case 'Euml': ch = String.fromCharCode(0x00cb); break;
                        case 'Igrave': ch = String.fromCharCode(0x00cc); break;
                        case 'Iacute': ch = String.fromCharCode(0x00cd); break;
                        case 'Icirc': ch = String.fromCharCode(0x00ce); break;
                        case 'Iuml': ch = String.fromCharCode(0x00cf); break;
                        case 'ETH': ch = String.fromCharCode(0x00d0); break;
                        case 'Ntilde': ch = String.fromCharCode(0x00d1); break;
                        case 'Ograve': ch = String.fromCharCode(0x00d2); break;
                        case 'Oacute': ch = String.fromCharCode(0x00d3); break;
                        case 'Ocirc': ch = String.fromCharCode(0x00d4); break;
                        case 'Otilde': ch = String.fromCharCode(0x00d5); break;
                        case 'Ouml': ch = String.fromCharCode(0x00d6); break;
                        case 'times': ch = String.fromCharCode(0x00d7); break;
                        case 'Oslash': ch = String.fromCharCode(0x00d8); break;
                        case 'Ugrave': ch = String.fromCharCode(0x00d9); break;
                        case 'Uacute': ch = String.fromCharCode(0x00da); break;
                        case 'Ucirc': ch = String.fromCharCode(0x00db); break;
                        case 'Uuml': ch = String.fromCharCode(0x00dc); break;
                        case 'Yacute': ch = String.fromCharCode(0x00dd); break;
                        case 'THORN': ch = String.fromCharCode(0x00de); break;
                        case 'szlig': ch = String.fromCharCode(0x00df); break;
                        case 'agrave': ch = String.fromCharCode(0x00e0); break;
                        case 'aacute': ch = String.fromCharCode(0x00e1); break;
                        case 'acirc': ch = String.fromCharCode(0x00e2); break;
                        case 'atilde': ch = String.fromCharCode(0x00e3); break;
                        case 'auml': ch = String.fromCharCode(0x00e4); break;
                        case 'aring': ch = String.fromCharCode(0x00e5); break;
                        case 'aelig': ch = String.fromCharCode(0x00e6); break;
                        case 'ccedil': ch = String.fromCharCode(0x00e7); break;
                        case 'egrave': ch = String.fromCharCode(0x00e8); break;
                        case 'eacute': ch = String.fromCharCode(0x00e9); break;
                        case 'ecirc': ch = String.fromCharCode(0x00ea); break;
                        case 'euml': ch = String.fromCharCode(0x00eb); break;
                        case 'igrave': ch = String.fromCharCode(0x00ec); break;
                        case 'iacute': ch = String.fromCharCode(0x00ed); break;
                        case 'icirc': ch = String.fromCharCode(0x00ee); break;
                        case 'iuml': ch = String.fromCharCode(0x00ef); break;
                        case 'eth': ch = String.fromCharCode(0x00f0); break;
                        case 'ntilde': ch = String.fromCharCode(0x00f1); break;
                        case 'ograve': ch = String.fromCharCode(0x00f2); break;
                        case 'oacute': ch = String.fromCharCode(0x00f3); break;
                        case 'ocirc': ch = String.fromCharCode(0x00f4); break;
                        case 'otilde': ch = String.fromCharCode(0x00f5); break;
                        case 'ouml': ch = String.fromCharCode(0x00f6); break;
                        case 'divide': ch = String.fromCharCode(0x00f7); break;
                        case 'oslash': ch = String.fromCharCode(0x00f8); break;
                        case 'ugrave': ch = String.fromCharCode(0x00f9); break;
                        case 'uacute': ch = String.fromCharCode(0x00fa); break;
                        case 'ucirc': ch = String.fromCharCode(0x00fb); break;
                        case 'uuml': ch = String.fromCharCode(0x00fc); break;
                        case 'yacute': ch = String.fromCharCode(0x00fd); break;
                        case 'thorn': ch = String.fromCharCode(0x00fe); break;
                        case 'yuml': ch = String.fromCharCode(0x00ff); break;
                        case 'OElig': ch = String.fromCharCode(0x0152); break;
                        case 'oelig': ch = String.fromCharCode(0x0153); break;
                        case 'Scaron': ch = String.fromCharCode(0x0160); break;
                        case 'scaron': ch = String.fromCharCode(0x0161); break;
                        case 'Yuml': ch = String.fromCharCode(0x0178); break;
                        case 'fnof': ch = String.fromCharCode(0x0192); break;
                        case 'circ': ch = String.fromCharCode(0x02c6); break;
                        case 'tilde': ch = String.fromCharCode(0x02dc); break;
                        case 'Alpha': ch = String.fromCharCode(0x0391); break;
                        case 'Beta': ch = String.fromCharCode(0x0392); break;
                        case 'Gamma': ch = String.fromCharCode(0x0393); break;
                        case 'Delta': ch = String.fromCharCode(0x0394); break;
                        case 'Epsilon': ch = String.fromCharCode(0x0395); break;
                        case 'Zeta': ch = String.fromCharCode(0x0396); break;
                        case 'Eta': ch = String.fromCharCode(0x0397); break;
                        case 'Theta': ch = String.fromCharCode(0x0398); break;
                        case 'Iota': ch = String.fromCharCode(0x0399); break;
                        case 'Kappa': ch = String.fromCharCode(0x039a); break;
                        case 'Lambda': ch = String.fromCharCode(0x039b); break;
                        case 'Mu': ch = String.fromCharCode(0x039c); break;
                        case 'Nu': ch = String.fromCharCode(0x039d); break;
                        case 'Xi': ch = String.fromCharCode(0x039e); break;
                        case 'Omicron': ch = String.fromCharCode(0x039f); break;
                        case 'Pi': ch = String.fromCharCode(0x03a0); break;
                        case ' Rho ': ch = String.fromCharCode(0x03a1); break;
                        case 'Sigma': ch = String.fromCharCode(0x03a3); break;
                        case 'Tau': ch = String.fromCharCode(0x03a4); break;
                        case 'Upsilon': ch = String.fromCharCode(0x03a5); break;
                        case 'Phi': ch = String.fromCharCode(0x03a6); break;
                        case 'Chi': ch = String.fromCharCode(0x03a7); break;
                        case 'Psi': ch = String.fromCharCode(0x03a8); break;
                        case 'Omega': ch = String.fromCharCode(0x03a9); break;
                        case 'alpha': ch = String.fromCharCode(0x03b1); break;
                        case 'beta': ch = String.fromCharCode(0x03b2); break;
                        case 'gamma': ch = String.fromCharCode(0x03b3); break;
                        case 'delta': ch = String.fromCharCode(0x03b4); break;
                        case 'epsilon': ch = String.fromCharCode(0x03b5); break;
                        case 'zeta': ch = String.fromCharCode(0x03b6); break;
                        case 'eta': ch = String.fromCharCode(0x03b7); break;
                        case 'theta': ch = String.fromCharCode(0x03b8); break;
                        case 'iota': ch = String.fromCharCode(0x03b9); break;
                        case 'kappa': ch = String.fromCharCode(0x03ba); break;
                        case 'lambda': ch = String.fromCharCode(0x03bb); break;
                        case 'mu': ch = String.fromCharCode(0x03bc); break;
                        case 'nu': ch = String.fromCharCode(0x03bd); break;
                        case 'xi': ch = String.fromCharCode(0x03be); break;
                        case 'omicron': ch = String.fromCharCode(0x03bf); break;
                        case 'pi': ch = String.fromCharCode(0x03c0); break;
                        case 'rho': ch = String.fromCharCode(0x03c1); break;
                        case 'sigmaf': ch = String.fromCharCode(0x03c2); break;
                        case 'sigma': ch = String.fromCharCode(0x03c3); break;
                        case 'tau': ch = String.fromCharCode(0x03c4); break;
                        case 'upsilon': ch = String.fromCharCode(0x03c5); break;
                        case 'phi': ch = String.fromCharCode(0x03c6); break;
                        case 'chi': ch = String.fromCharCode(0x03c7); break;
                        case 'psi': ch = String.fromCharCode(0x03c8); break;
                        case 'omega': ch = String.fromCharCode(0x03c9); break;
                        case 'thetasym': ch = String.fromCharCode(0x03d1); break;
                        case 'upsih': ch = String.fromCharCode(0x03d2); break;
                        case 'piv': ch = String.fromCharCode(0x03d6); break;
                        case 'ensp': ch = String.fromCharCode(0x2002); break;
                        case 'emsp': ch = String.fromCharCode(0x2003); break;
                        case 'thinsp': ch = String.fromCharCode(0x2009); break;
                        case 'zwnj': ch = String.fromCharCode(0x200c); break;
                        case 'zwj': ch = String.fromCharCode(0x200d); break;
                        case 'lrm': ch = String.fromCharCode(0x200e); break;
                        case 'rlm': ch = String.fromCharCode(0x200f); break;
                        case 'ndash': ch = String.fromCharCode(0x2013); break;
                        case 'mdash': ch = String.fromCharCode(0x2014); break;
                        case 'lsquo': ch = String.fromCharCode(0x2018); break;
                        case 'rsquo': ch = String.fromCharCode(0x2019); break;
                        case 'sbquo': ch = String.fromCharCode(0x201a); break;
                        case 'ldquo': ch = String.fromCharCode(0x201c); break;
                        case 'rdquo': ch = String.fromCharCode(0x201d); break;
                        case 'bdquo': ch = String.fromCharCode(0x201e); break;
                        case 'dagger': ch = String.fromCharCode(0x2020); break;
                        case 'Dagger': ch = String.fromCharCode(0x2021); break;
                        case 'bull': ch = String.fromCharCode(0x2022); break;
                        case 'hellip': ch = String.fromCharCode(0x2026); break;
                        case 'permil': ch = String.fromCharCode(0x2030); break;
                        case 'prime': ch = String.fromCharCode(0x2032); break;
                        case 'Prime': ch = String.fromCharCode(0x2033); break;
                        case 'lsaquo': ch = String.fromCharCode(0x2039); break;
                        case 'rsaquo': ch = String.fromCharCode(0x203a); break;
                        case 'oline': ch = String.fromCharCode(0x203e); break;
                        case 'frasl': ch = String.fromCharCode(0x2044); break;
                        case 'euro': ch = String.fromCharCode(0x20ac); break;
                        case 'image': ch = String.fromCharCode(0x2111); break;
                        case 'weierp': ch = String.fromCharCode(0x2118); break;
                        case 'real': ch = String.fromCharCode(0x211c); break;
                        case 'trade': ch = String.fromCharCode(0x2122); break;
                        case 'alefsym': ch = String.fromCharCode(0x2135); break;
                        case 'larr': ch = String.fromCharCode(0x2190); break;
                        case 'uarr': ch = String.fromCharCode(0x2191); break;
                        case 'rarr': ch = String.fromCharCode(0x2192); break;
                        case 'darr': ch = String.fromCharCode(0x2193); break;
                        case 'harr': ch = String.fromCharCode(0x2194); break;
                        case 'crarr': ch = String.fromCharCode(0x21b5); break;
                        case 'lArr': ch = String.fromCharCode(0x21d0); break;
                        case 'uArr': ch = String.fromCharCode(0x21d1); break;
                        case 'rArr': ch = String.fromCharCode(0x21d2); break;
                        case 'dArr': ch = String.fromCharCode(0x21d3); break;
                        case 'hArr': ch = String.fromCharCode(0x21d4); break;
                        case 'forall': ch = String.fromCharCode(0x2200); break;
                        case 'part': ch = String.fromCharCode(0x2202); break;
                        case 'exist': ch = String.fromCharCode(0x2203); break;
                        case 'empty': ch = String.fromCharCode(0x2205); break;
                        case 'nabla': ch = String.fromCharCode(0x2207); break;
                        case 'isin': ch = String.fromCharCode(0x2208); break;
                        case 'notin': ch = String.fromCharCode(0x2209); break;
                        case 'ni': ch = String.fromCharCode(0x220b); break;
                        case 'prod': ch = String.fromCharCode(0x220f); break;
                        case 'sum': ch = String.fromCharCode(0x2211); break;
                        case 'minus': ch = String.fromCharCode(0x2212); break;
                        case 'lowast': ch = String.fromCharCode(0x2217); break;
                        case 'radic': ch = String.fromCharCode(0x221a); break;
                        case 'prop': ch = String.fromCharCode(0x221d); break;
                        case 'infin': ch = String.fromCharCode(0x221e); break;
                        case 'ang': ch = String.fromCharCode(0x2220); break;
                        case 'and': ch = String.fromCharCode(0x2227); break;
                        case 'or': ch = String.fromCharCode(0x2228); break;
                        case 'cap': ch = String.fromCharCode(0x2229); break;
                        case 'cup': ch = String.fromCharCode(0x222a); break;
                        case 'int': ch = String.fromCharCode(0x222b); break;
                        case 'there4': ch = String.fromCharCode(0x2234); break;
                        case 'sim': ch = String.fromCharCode(0x223c); break;
                        case 'cong': ch = String.fromCharCode(0x2245); break;
                        case 'asymp': ch = String.fromCharCode(0x2248); break;
                        case 'ne': ch = String.fromCharCode(0x2260); break;
                        case 'equiv': ch = String.fromCharCode(0x2261); break;
                        case 'le': ch = String.fromCharCode(0x2264); break;
                        case 'ge': ch = String.fromCharCode(0x2265); break;
                        case 'sub': ch = String.fromCharCode(0x2282); break;
                        case 'sup': ch = String.fromCharCode(0x2283); break;
                        case 'nsub': ch = String.fromCharCode(0x2284); break;
                        case 'sube': ch = String.fromCharCode(0x2286); break;
                        case 'supe': ch = String.fromCharCode(0x2287); break;
                        case 'oplus': ch = String.fromCharCode(0x2295); break;
                        case 'otimes': ch = String.fromCharCode(0x2297); break;
                        case 'perp': ch = String.fromCharCode(0x22a5); break;
                        case 'sdot': ch = String.fromCharCode(0x22c5); break;
                        case 'lceil': ch = String.fromCharCode(0x2308); break;
                        case 'rceil': ch = String.fromCharCode(0x2309); break;
                        case 'lfloor': ch = String.fromCharCode(0x230a); break;
                        case 'rfloor': ch = String.fromCharCode(0x230b); break;
                        case 'lang': ch = String.fromCharCode(0x2329); break;
                        case 'rang': ch = String.fromCharCode(0x232a); break;
                        case 'loz': ch = String.fromCharCode(0x25ca); break;
                        case 'spades': ch = String.fromCharCode(0x2660); break;
                        case 'clubs': ch = String.fromCharCode(0x2663); break;
                        case 'hearts': ch = String.fromCharCode(0x2665); break;
                        case 'diams': ch = String.fromCharCode(0x2666); break;
                        default: ch = ''; break;
                    }
                }
                i = semicolonIndex;
            }
        }

        out += ch;
    }
    return out;
}

// EPi.FireDefaultButton is used to override the ASP.Net WebForm_FireDefaultButton to make the use of Form.DefaultButton
// work properly across web browsers. Allows enter in textareas in non IE browsers and do not trigger
// default button click when enter click on other buttons and links which has received focus.
EPi.FireDefaultButton = function (e, defaultButtonId) {
    // OkToFire determines if the event target allows defaultbutton click.
    this.OkToFire = function (e, defaultButton) {
        var node = e.srcElement || e.target;

        if (!node && !node.nodeName) {
            return true;
        }
        if (node == defaultButton) {
            return false;
        }
        switch (node.nodeName.toUpperCase()) {
            case "TEXTAREA":
            case "A":
            case "BUTTON":
                return false;
                break;
            case "INPUT":
                switch (node.type.toUpperCase()) {
                    case "BUTTON": case "SUBMIT": case "IMAGE": case "RESET": case "FILE":
                        return false;
                }
                return true;
                break;
            default:
                return true;
        }
    }

    // Check for correct keycode (Enter = 13) and take proper action.
    var defaultButton = document.getElementById(defaultButtonId) || EPi.defaultButton;
    if (e.keyCode == 13) {
        if (this.OkToFire(e, defaultButton)) {
            if (defaultButton && defaultButton.click != "undefined") {
                defaultButton.click();

                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                return false;
            }
        }
    }
    return true;
}

EPi.InvokeFireDefaultButton = function (e) {
    EPi.RemoveEventListener(window, "load", EPi.InvokeFireDefaultButton);

    // Check of ASP.Net WebForm_FireDefaultButton script is registered
    // and if so override it.
    if (typeof (window.WebForm_FireDefaultButton) != "undefined" &&
            typeof (EPi.GetForm().onkeypress) != "undefined" &&
            EPi.GetForm().onkeypress != null &&
            EPi.GetForm().onkeypress.toString().indexOf("WebForm_FireDefaultButton") > 0) {
        window.WebForm_FireDefaultButton = function (e, defaultButtonId) {
            return EPi.FireDefaultButton(e, defaultButtonId);
        }
    }
}

if (typeof (EPi.AddWindowLoadListener) == "function") {
    EPi.AddWindowLoadListener(EPi.InvokeFireDefaultButton);
}

// Used to prevent users from double clicking on a button.
// Will allow the first click, but disable it for any future clicks.
EPi.PreventDoubleClick = function (button) {
    if (typeof (Page_ClientValidate) == 'function') {
        if (Page_ClientValidate() == false) {
            return false;
        }
    }
    if (button.processing) {
        button.disabled = true;
    } else {
        button.processing = true;
    }
}


// Browser information
EPi.browser = {

    isIE: (function () {
        var div = document.createElement('div');
        div.innerHTML = '<!--[if IE]><i></i><![endif]-->';
        return div.getElementsByTagName('i').length > 0;
    })(),

    // IE reports "Trident/x.x;" in user agent string to give information of rendering engine
    // navigator.userAgent will report IE version 7 when pages use X-UA IE=EvaluateIE7
    // this can be used for capabalities switching since Trident remains the same for
    // browsers regardless of document mode
    tridentVersion: (function () {

        var reg = /Trident\/(\d+\.\d+);/;
        var match = reg.exec(navigator.userAgent);
        var version = undefined;

        if (match != null && match.length > 0) {
            version = match[1];
        }

        return version;
    })()
};
