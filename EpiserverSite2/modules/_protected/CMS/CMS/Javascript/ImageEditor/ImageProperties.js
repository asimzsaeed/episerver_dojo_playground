/* Trim() function duplicated from HtmlTextBox2_API.js */
String.prototype.Trim = new Function("return this.replace(/^\\s+|\\s+$/g,'')");

var baseFileManagerBrowserUrl = '';
var editorID;
var fileSizeDisplay;
var widthValue	= new Object();
var heightValue	= new Object();
var proportionRatio = 0;
var cssClass;
var alignment;
var checkWidth;
var width;
var widthUnitPixel;
var widthUnitPercent;
var checkHeight;
var height;
var heightUnitPixel;
var heightUnitPercent;
var border;
var hspace;
var vspace;
var altText;
var imagePath;
var checkProportions;
var labelProportions;
var displaySizeConstrainGraphic;

function InitializeImageProperties(dialogArguments) {
    cssClass = document.getElementById("cssClass");
    alignment = document.getElementById("alignment");
    checkWidth = document.getElementById("checkWidth");
    width = document.getElementById("width");
    widthUnitPixel = document.getElementById("widthUnitPixel");
    widthUnitPercent = document.getElementById("widthUnitPercent");
    checkHeight = document.getElementById("checkHeight");
    height = document.getElementById("height");
    heightUnitPixel = document.getElementById("heightUnitPixel");
    heightUnitPercent = document.getElementById("heightUnitPercent");
    displaySizeConstrainGraphic = document.getElementById("displaySizeConstrainGraphic");

    baseFileManagerBrowserUrl = dialogArguments.imageAttributes.fileManagerBrowserUrl;
    editorID = dialogArguments.imageAttributes.editorID;

    populateCssList(cssClass, dialogArguments.imageAttributes.parentWindow._cssRules);


    widthValue.checkBox		= checkWidth;
    widthValue.valueField	= width;
    widthValue.unitPixel	= widthUnitPixel;
    widthValue.unitPercent	= widthUnitPercent;

    heightValue.checkBox	= checkHeight;
    heightValue.valueField	= height;
    heightValue.unitPixel	= heightUnitPixel;
    heightValue.unitPercent	= heightUnitPercent;

    setDefaultValues(dialogArguments);
}

function ShowAdvancedHtmlSettings(checked) {
    var advancedSettings = document.getElementById("advancedSettings");
    var advancedSettingsFieldset = document.getElementById("advancedSettingsFieldset");

    checked ? advancedSettings.style.display = 'block' : advancedSettings.style.display = 'none';
    checked ? advancedSettingsFieldset.className = "fieldsetvisible" : advancedSettingsFieldset.className = "fieldsethidden";
}

function populateCssList(list, contentArray) {
    var newOption;

    // Create an empty entry at the beginning of the list
    newOption = document.createElement("OPTION");
    list.add(newOption);

    // Find all classes defined for IMG elements from the parentWindow's _cssRules array
    for (i = 0; i < contentArray.length; i++) {
        if (contentArray[i].TagName != 'IMG' || contentArray[i].Id != editorID)
            continue;
        newOption		= document.createElement("OPTION");
        newOption.text	= contentArray[i].MenuName;
        newOption.value	= contentArray[i].ClassName;
        list.add(newOption);
    }
}

function setDefaultValues(dialogArguments) {
    var imageSource = dialogArguments.src;
    var imageAttributes = dialogArguments.imageAttributes;
    border = document.getElementById("border");
    hspace = document.getElementById("hspace");
    vspace = document.getElementById("vspace");
    altText = document.getElementById("altText");
    imagePath = document.getElementById("imagePath");

    checkProportions = document.getElementById("checkProportionsDisplaySize");
    labelProportions = document.getElementById("labelProportions");

    // Show more settings if any value is set.
    var showAdvancedSettings = false;
    if (imageAttributes.align || imageAttributes.border || imageAttributes.hspace
        || imageAttributes.vspace || imageAttributes.width || imageAttributes.height) {
        showAdvancedSettings = true;
    }

    ShowAdvancedHtmlSettings(showAdvancedSettings);
    document.getElementById("advancedlayout").checked = showAdvancedSettings;

    // Preselect values based on current image configuration
    selectListItem(alignment, imageAttributes.align);
    setTextBoxValue(border,	imageAttributes.border);
    setTextBoxValue(hspace,	imageAttributes.hspace);
    setTextBoxValue(vspace,	imageAttributes.vspace);
    selectListItem(cssClass, imageAttributes.className);
    splitValueAndUnit(widthValue, imageAttributes.width);
    splitValueAndUnit(heightValue, imageAttributes.height);
    setTextBoxValue(altText, imageAttributes.alt);

    setTextBoxValue(imagePath, imageSource);

    // Check whether there is height/width information to be displayed, even if the attributes were not set
    if (imageAttributes.width != null) {
        widthValue.valueField.value = parseInt(imageAttributes.width);
    } else if (imageAttributes.width == null && imageSource != null) {
        widthValue.valueField.value	= imageAttributes.realwidth;
    }

    if (imageAttributes.height != null) {
        heightValue.valueField.value = parseInt(imageAttributes.height);
    } else if (imageAttributes.height == null && imageSource != null) {
        heightValue.valueField.value = imageAttributes.realheight;
    }

    // Constrain proportions can only be used if the following criteria are met:
    // - Both height and width have values (to get a ratio)
    // - None of those values are percentages.
    if (widthValue.valueField.value.length == 0 || heightValue.valueField.value.length == 0 ||
       widthValue.unitPercent.checked || heightValue.unitPercent.checked) {
        checkProportions.disabled = true;
        labelProportions.disabled = true;
    } else {
        proportionRatio = widthValue.valueField.value / heightValue.valueField.value;
    }

    // If we have been supplied with _set_ values (as opposed to IE's supplied size values) for both height
    // and with, in pixels only, check "lock aspect ratio" by default.
    if (widthValue.checkBox.checked  && widthValue.unitPixel.checked &&
        heightValue.checkBox.checked && heightValue.unitPixel.checked) {
        checkProportions.checked = true;
    }

    // Finally, enable/disable the correct parts of the UI based on checkboxes etc
    setEnabledState();

    if (imageSource == null) {
        LaunchFileManagerBrowser();
    }
}

function selectListItem(list, itemValue) {
    if (!itemValue) {
        list.selectedIndex = 0;
        return;
    }
    for (i = 0; i < list.length; i++) {
        if (list.options[i].value == itemValue) {
            list.selectedIndex = i;
            return;
        }
    }
    // A value has been set, but was not found in the list. Create a (temporary) list item for the
    // value, to avoid clearing values set in HTML-mode by just opening and closing the dialog.
    var newOption	= document.createElement("OPTION");
    newOption.text	= itemValue;
    newOption.value	= itemValue;
    list.add(newOption);
    list.selectedIndex = list.options.length - 1;
}
function setTextBoxValue(textBox, value) {
    if (!value || value == null || value == "null")
        value = '';
    textBox.value = value;
}

function UpdateImageHtmlSizeData(width, height) {
    if (!widthValue.checkBox.checked) {
        widthValue.valueField.value = width;
        widthValue.unitPixel.checked = true;
    }
    if (!heightValue.checkBox.checked) {
        heightValue.valueField.value = height;
        heightValue.unitPixel.checked = true;
    }
    // Constrain proportions can only be used if the following criteria are met:
    // - Both height and width have values (to get a ratio)
    // - None of those values are percentages.
    if (widthValue.valueField.value.length == 0 || heightValue.valueField.value.length == 0 ||
            widthValue.unitPercent.checked || heightValue.unitPercent.checked) {
        checkProportions.disabled = true;
        labelProportions.disabled = true;
    } else {
        checkProportions.disabled = false;
        labelProportions.disabled = false;
        proportionRatio = widthValue.valueField.value / heightValue.valueField.value;
    }

    // If we have been supplied with _set_ values (as opposed to IE's supplied size values) for both height
    // and with, in pixels only, check "lock aspect ratio" by default.
    if (widthValue.checkBox.checked && widthValue.unitPixel.checked &&
                heightValue.checkBox.checked && heightValue.unitPixel.checked) {
        checkProportions.checked = true;
    }
}

function constrainChecked() {
    // When using "constrain proportions", both heigth and width will be supplied using pixel values
    if (checkProportions.checked) {
        widthValue.checkBox.checked		= true;
        widthValue.unitPixel.checked	= true;

        heightValue.checkBox.checked	= true;
        heightValue.unitPixel.checked	= true;
    }

    setEnabledState();
}
function setEnabledState() {
    widthDisabled = !checkWidth.checked;
    heightDisabled = !checkHeight.checked;

    if (checkProportions.checked) {
        checkProportions.checked = !widthDisabled && !heightDisabled;
    }

    widthValue.valueField.disabled = widthDisabled;
    widthValue.unitPixel.disabled = widthDisabled;
    widthValue.unitPercent.disabled = widthDisabled || checkProportions.checked;

    heightValue.valueField.disabled = heightDisabled;
    heightValue.unitPixel.disabled = heightDisabled;
    heightValue.unitPercent.disabled = heightDisabled || checkProportions.checked;

    if (checkProportions.checked) {
        displaySizeConstrainGraphic.style.borderRight	= "2px solid black";
        displaySizeConstrainGraphic.style.borderTop		= "2px solid black";
        displaySizeConstrainGraphic.style.borderBottom	= "2px solid black";
    } else {
        displaySizeConstrainGraphic.style.borderRight	= "0px solid black";
        displaySizeConstrainGraphic.style.borderTop		= "0px solid black";
        displaySizeConstrainGraphic.style.borderBottom	= "0px solid black";
    }
}
function constrainHeight() {
    if (!checkProportions.checked)
        return;

    heightValue.valueField.value = Math.round(widthValue.valueField.value / proportionRatio);
}
function constrainWidth() {
    if (!checkProportions.checked)
        return;

    widthValue.valueField.value = Math.round(heightValue.valueField.value * proportionRatio);
}

function buildReturnValue() {
    // For all return values - if they are empty/cleared/undefined, pass back null.
    var returnImg = EPi.GetDialog().dialogArguments.imageAttributes;

    if (isHtmlAttributesEnabled) {
        returnImg.align = (alignment.selectedIndex > 0) ? alignment.options[alignment.selectedIndex].value : null;
        returnImg.border = (border.value.length > 0) ? border.value : null;
        returnImg.hspace = (hspace.value.length > 0) ? hspace.value : null;
        returnImg.vspace = (vspace.value.length > 0) ? vspace.value : null;
        returnImg.className = (cssClass.selectedIndex > 0) ? cssClass.options[cssClass.selectedIndex].value : null;
        returnImg.width = (checkWidth.checked) ? mergeValueAndUnit(widthValue) : null;
        returnImg.height = (checkHeight.checked) ? mergeValueAndUnit(heightValue) : null;
        returnImg.alt = (altText.value.length > 0) ? altText.value : null;
        returnImg.src = imagePath.value;
        returnImg.fileSize = fileSizeDisplay;
    } else {
        returnImg = {};
        returnImg.src = imagePath.value;
        returnImg.actualWidth = actualWidth;
        returnImg.actualHeight = actualHeight;
    }
    return returnImg;
}
function mergeValueAndUnit(object) {
    if (!object.checkBox.checked)
        return;
    retVal = object.valueField.value;
    if (object.unitPercent.checked)
        retVal = retVal + '%';
    else // Format the value to be used for the "style" attribute on the receiving end.
        retVal = retVal + 'px';
    return retVal;
}
function splitValueAndUnit(object, value) {
    if (!value || value == null)
        return;

    stringValue = new String(value);
    if (stringValue.indexOf('%', 0) != -1) {
        object.valueField.value = stringValue.substr(0, stringValue.length - 1);
        object.unitPercent.checked = true;
    } else {
        object.valueField.value	= stringValue.toUpperCase().replace('PX', '');
        object.unitPixel.checked = true;
    }
    object.checkBox.checked = true;
}

function LaunchFileManagerBrowser() {
    var dialogUrl = baseFileManagerBrowserUrl + '&hideclearbutton=true&browserselectionmode=image&selectedfile=' + encodeURIComponent(imagePath.value);
    EPi.CreateDialog(dialogUrl, OnFileManagerDialogComplete, null, null, {width: 600});
}

function OnFileManagerDialogComplete(returnValue, onCompleteArguments) {
    var imageUrl = (returnValue && returnValue.items && returnValue.items.length == 1 ? returnValue.items[0].path : null);
    if (imageUrl && imageUrl != imagePath.value) {
        imagePath.value = imageUrl;
        commandQueue.Revert();
        LoadImages(imageUrl);
        altText.focus();
    } else {
        imagePath.focus();
    }
}

function OkClick() {
    var errorMessage = null;
    if (!imagePath) {
        imagePath = document.getElementById("imagePath");
    }
    if (imagePath.value.Trim().length == 0) {	// Don't allow saving without specifying an image
        errorMessage = sErrorMessage;

    }
    if (errorMessage != null) {
        alert(errorMessage);
        return false;
    }

    var returnValue = buildReturnValue();
    EPi.GetDialog().Close(returnValue);
}

function CancelClick() {
    var currentDialog = EPi.GetDialog();
    var dialog = currentDialog._dialog;

    if (dialog && dialog.EPi && dialog.EPi.PageLeaveCheck && dialog.EPi.PageLeaveCheck.enabled &&
        dialog.EPi.PageLeaveCheck.trigger == null && dialog.EPi.PageLeaveCheck.HasPageChanged()) {
        if (dialog.EPiObject && dialog.EPiObject.pageLeaveMessage) {
            message = dialog.EPiObject.pageLeaveMessage;
        } else {
            message = EPi.Translate("/system/editutil/leavepagewarning");
        }
        var confirmClose = dialog.confirm(message);
        if (!confirmClose) {
            // Cancel closing dialog
            return;
        } else {
            // Prevent default pageLeaveCheck confirm dialog from appearing
            dialog.EPi.PageLeaveCheck.enabled = false;
        }
    }

    currentDialog.Close();
}

