/*
 * xformedit.js	- JavaScript support routines for EPiServer
 * Copyright (c) 2007 EPiServer AB
*/

var _browser = new clsBrowser();
var KEYCODE_C = 67;
var KEYCODE_V = 86;
var id_matrix;
var xFormControl;
var id_propertiesdefault;
var id_propertiestextarea;
var id_propertiestext;
var id_propertiesmultiple;
var id_propertiesspan;
var id_propertieshr;
var id_propertiesbutton;
var id_verticallayout;
var id_headingmultiple;
var formContent;
var sFormName;
var sFolderID;
var isSaveAsAction;
var sConfirmDelete;
var sSaveFormUsedInMultiplePages;
var sNotSelctedRowError;
var sformEmptyError;
var sMorethenOneOptionSelectedError;
var sLessThanOptionsError;
var sUpImageURL;
var sDownImageURL;
var sDeleteImageURL;
var sClearImageURL;
var emailRegex;
var multipleEmailRegex;
var oCellDrag = null;
var oNewControlStarted = null;


if (window.attachEvent) {
    window.document.attachEvent('onkeydown', xFormKeyHandler);
    window.document.attachEvent('onload', focusBody);
} else {
    window.addEventListener("keydown", xFormKeyHandler, true);
    window.onload = focusBody;
}

function xFormKeyHandler(evt) {
    var returnValue = true;
    var e = evt;
    if (document.all) {
        e = event;
    }

    if (e.shiftKey && e.ctrlKey) {
        switch (e.keyCode)
        {
            case KEYCODE_C:
                returnValue = false;
                var formContent = xFormControl.innerHTML;
                if (confirm("Copy content to clipboard?\n\n" + formContent)) {
                    if (window.clipboardData) {
                        window.clipboardData.setData("Text", formContent);
                    } else {
                        alert("This feature is not supported in current used browser.");
                    }
                }
                break;
            case KEYCODE_V:
                returnValue = false;
                if (window.clipboardData) {
                    var clipBoardContent = window.clipboardData.getData("Text");
                    if (confirm("Paste content from clipboard?\n\n" + clipBoardContent)) {
                        xFormControl.innerHTML = clipBoardContent;
                        id_matrix = document.getElementById("id_matrix");
                    }
                } else {
                    alert("This feature is not supported in current used browser.");
                }
                break;
        }
    }
    return returnValue;
}

function focusBody() {
    window.document.body.focus();
}

var oDragField = null;
var oStartDragField = null;
var oActiveField = null;
var oActiveCell = null;
var isNewField = false;
var sCellContent;
var sCellEnd;
var sIdPrefix;
var nId;
var nFieldCount;
var nCellCount;

var sRadioProperties	= '';
var sSelectProperties	= '';
var sCheckboxProperties	= '';
var sFieldExistsAlert	= '';
var oPropertyImage;


function fieldAddRow(oTable) {
    var oRow, oCell, nCells;
    var nRows = oTable.rows.length;
    if (nRows === 0) {
        nCells = 1;
    } else {
        nCells = oTable.rows[nRows - 1].cells.length;
    }

    if (nCells === 0) {
        oRow = oTable.rows[nRows - 1];
        nCells = 1;
    } else {
        oRow = oTable.insertRow(nRows);
    }

    while (nCells-- > 0) {
        oCell = oRow.insertCell(0);
        fieldSetCell(oCell);
    }
}

function fieldAddColumn(oTable) {
    var oRow;
    var oCell;
    var nRows;

    nRows = oTable.rows.length;

    if (nRows === 0) {
        fieldAddRow(oTable);
        return;
    }

    while (nRows-- > 0) {
        oCell = oTable.rows[nRows].insertCell(-1);
        fieldSetCell(oCell);
    }
}

function fieldInsertRow(oTable) {
    var oRow, oCell, nCells;

    var selectedRowIndex = fieldRowIndex(oTable, oActiveCell);
    if (selectedRowIndex === -1) {
        selectedRowIndex = 0;
    }
    var oSelectedRow = oTable.rows[selectedRowIndex];

    if (oTable.rows.length === 0) {
        nCells = 1;
    } else {
        nCells = oSelectedRow.cells.length;
    }

    if (nCells === 0) {
        oRow = oTable.rows[selectedRowIndex];
        nCells = 1;
    } else {
        oRow = oTable.insertRow(selectedRowIndex);
    }

    while (nCells-- > 0) {
        oCell = oRow.insertCell(0);

        fieldSetCell(oCell);
    }
}

function fieldInsertColumn(oTable) {
    var oRow, nCol, oCell, nRow, nRows;

    if (oTable.rows.length === 0) {
        fieldInsertRow(oTable);
        return;
    }

    if (oActiveCell === null) {
        oActiveCell = oTable.rows[0].cells[0];
    }

    nRow = fieldRowIndex(oTable, oActiveCell);
    nCol = fieldColumnIndex(oTable, oActiveCell, nRow);
    nRows = oTable.rows.length;

    while (nRows-- > 0) {
        oCell = oTable.rows[nRows].insertCell(nCol);
        fieldSetCell(oCell);
    }
}

function fieldDeleteRow(oTable) {
    var nRow;

    if (oActiveCell === null) {
        return;
    }

    nRow = fieldRowIndex(oTable, oActiveCell);

    if (nRow === -1) { // Abort delete if we don't have a row.
        return;
    }

    oTable.rows[nRow].style.backgroundColor = 'silver';

    if (confirm(deleteRowConfirmMessage)) {
        fieldPropertiesHideAll();
        oTable.deleteRow(nRow);
        oActiveCell = null;
    } else {
        oTable.rows[nRow].style.backgroundColor = '';
    }
}

function fieldDeleteColumn(oTable) {
    var oRow, nCol, oCell, nRow, nRows, fDelete, isSingleColumnTable;

    if (oActiveCell === null) {
        return;
    }

    nRow = fieldRowIndex(oTable, oActiveCell);

    if (nRow === -1) { // if we don't find any row we can't delete column.
        return;
    }

    nCol = fieldColumnIndex(oTable, oActiveCell, nRow);
    nRows = oTable.rows.length;

    while (nRows-- > 0) {
        oTable.rows[nRows].cells[nCol].style.backgroundColor = 'silver';
    }

    if (fDelete = confirm(deleteCellConfirmMessage)) {
        fieldPropertiesHideAll();
    }

    nRows = oTable.rows.length;
    isSingleColumnTable = oTable.rows[nRows - 1].cells.length === 1;

    while (nRows-- > 0) {
        oTable.rows[nRows].cells[nCol].style.backgroundColor = '';

        if (fDelete) {
            if (isSingleColumnTable) {
                oTable.deleteRow(nRows);
            } else {
                oCell = oTable.rows[nRows].deleteCell(nCol);
            }
            oActiveCell = null;
        }
    }
}

function fieldRowIndex(oTable, oCell) {
    var nRow = -1;
    var oRows = oTable.rows;

    if (!oCell) {
        return 0;
    }

    for (nRow = 0; nRow < oRows.length; nRow++) {
        if (oRows[nRow] == oCell.parentNode) {
            return nRow;
        }
    }

    return -1;
}

function fieldColumnIndex(oTable, oCell, nRow) {
    var nCol = -1;
    var oRows = oTable.rows;

    if (!oCell) {
        return 0;
    }

    var oCells = oRows[nRow].cells;

    for (nCol = 0; nCol < oCells.length; nCol++) {
        if (oCells[nCol] == oCell) {
            return nCol;
        }
    }

    return -1;
}

function fieldSetCell(oCell) {
    oCell.innerHTML = sCellContent;
}

function fieldDisplayHTML(oFields) {
    var s;
    var i;
    var oField;

    if (oFields == null) {
        return false;
    }

    oField = fieldSingleInstance(oFields, 0);
    if (!oField.parentNode) {
        return;
    }

    s = oField.parentNode.innerHTML;
    i = s.indexOf(sCellEnd);

}

function fieldCreateTextarea(sName, sValue, sClass, sRows, sCols, bRequired, label, tooltip, type) {
    var s = createLabelField(label, sName);

    s = s + '<textarea name="' + sName + '"';

    if (sClass && sClass.length > 0) {
        s = s + ' class="' + sClass + '"';
    }
    if (sRows && sRows.length > 0) {
        s = s + ' rows="' + sRows + '"';
    }
    if (sCols && sCols.length > 0) {
        s = s + ' cols="' + sCols + '"';
    }
    if (bRequired && bRequired) {
        s = s + ' required="true"';
    }
    if (tooltip && tooltip.length > 0) {
        s = s + ' title="' + attributeEncode(tooltip) + '"';
    }
    if (type && type.length > 0) {
        s = s + ' xsitype="' + type + '"';
    }
    s = s + '>';

    if (sValue && sValue.length > 0) {
        s = s + escape(sValue);
    }
    s = s + '</textarea>';

    return s;
}

function fieldCreateInput(sType, sName, sValue, sClass, sSize, bRequired, label, tooltip, type, horizontalAlign, bChecked) {
    var s = createLabelField(label, sName);

    s = s + '<input ';



    s = s + ' type="' + sType + '"';

    if (sType == "checkbox" || sType == "radio") {
        sValue = ParseOptionValueString(sValue, '"', '&quot;');
    }

    if (sName && sName.length > 0) {
        s = s + ' name="' + sName + '"';
    }
    if (sValue && sValue.length > 0) {
        s = s + " value=\"" + sValue + "\"";
    } else {
        s = s + " value=\"\"";
    }

    if (sClass && sClass.length > 0) {
        s = s + ' class="' + sClass + '"';
    }
    if (sSize && sSize.length > 0) {
        s = s + ' size="' + sSize + '"';
    }
    if (bRequired && bRequired) {
        s = s + ' required="true"';
    }
    if (tooltip && tooltip.length > 0) {
        s = s + ' title="' + attributeEncode(tooltip) + '"';
    }
    if (type && type.length > 0) {
        s = s + ' xsitype="' + type + '"';
    }
    if (horizontalAlign && horizontalAlign.length > 0) {
        s = s + ' horizontalalign="true"';
    }


    if ((sType == "checkbox" || sType == "radio") && bChecked == "true") {
        s = s + '  checked />';
    } else {
        s = s + ' />';
    }

    return s;
}

function createLabelField(label, inputID) {
    if (label && label.length > 0) {
        return '<label for="' + inputID + '">' + htmlEncode(label) + '</label>';
    }

    return '';
}

function createLegendField(label) {
    if (label && label.length > 0) {
        return '<legend>' + htmlEncode(label) + '</legend>';
    }

    return '';
}

function fieldCreateSelect(sName, sValue, sClass, bRequired, label, tooltip, type) {
    var s = createLabelField(label, sName);

    s = s + '<select name="' + sName + '"';

    if (sClass && sClass.length > 0) {
        s = s + ' class="' + sClass + '"';
    }
    if (bRequired) {
        s = s + ' required="true"';
    }
    if (tooltip && tooltip.length > 0) {
        s = s + ' title="' + attributeEncode(tooltip) + '"';
    }
    if (type && type.length > 0) {
        s = s + ' xsitype="' + type + '"';
    }

    s = s + '>';
    s = s + sValue;
    s = s + '</select>';

    return s;
}

function fieldCreateOption(sDisplayValue, sValue, isSelected) {
    var s;

    sValue = ParseOptionValueString(sValue, '"', '&quot;');

    if (isSelected == "true") {
        s = "<option selected value=\"" + sValue + "\">";
    } else if (isSelected == "false") {
        s = "<option value=\"" + sValue + "\">";
    } else {
        return ;
    }

    s = s + sDisplayValue;
    s = s + "</option>";

    return s;
}

function fieldDeleteCell(oCell, sAlert) {
    var fConfirm = true;

    if (sAlert) {
        fConfirm = confirm(sAlert);
    }

    if (fConfirm) {
        var oParent = oCell.parentNode;
        oParent.removeChild(oCell);
    }

    return true;
}


function getParentCell(element) {
    var topCell = element;

    while (element != null && element != xFormControl) {
        if (!element.parentNode) {
            return ;
        }

        element = element.parentNode;
        if (element.tagName == 'TD') {
            topCell = element;
        }
    }

    if (topCell.tagName == "TR") {
        topCell = topCell.cells[0];
    }
    if (topCell.tagName != "TD") {
        return null;
    }

    return topCell;
}

function getInputElements(element) {
    var results = [];
    var list;

    if (element.all) {
        list = element.all;
    } else {
        list =  element.childNodes;

        if (!list[0].tagName) {
            list =  element.childNodes[0].childNodes;
        } else if (list[0].tagName == "FIELDSET") {
            list =  element.childNodes[0].childNodes;
        }
    }

    for (i = 0; i < list.length; i++) {
        if (list[i].tagName.search(/^(input|textarea|select|button|span|hr)$/i) == 0) {
            results.push(list[i]);
        }
    }

    return results;
}

function hasFields(element) {

    var results = getInputElements(element);

    return results.length > 0;
}

function getLabelValue(element) {
    var parentCell = getParentCell(element);
    var list;

    if (!parentCell) {
        return '';
    }

    if (parentCell.all) {
        list = parentCell.all;
    } else {
        list = parentCell.childNodes;
    }

    if (list.length < 1) {
        return '';
    }

    var labelRegEx = /^(LABEL)$/i;

    if (element.type != null && (element.type == 'radio' || element.type == 'checkbox')) {
        // The legend element won't be a child node of parentCell why we get this
        // by using getElementsByTagName instead.
        var legendElms = parentCell.getElementsByTagName("legend");
        if (legendElms.length == 0) {
            return "";
        } else {
            return htmlDecode(parentCell.getElementsByTagName("legend")[0].innerHTML);
        }
    }

    for (i = 0; i < list.length; i++) {
        if (list[i].tagName.search(labelRegEx) == 0) {
            return htmlDecode(list[i].innerHTML);
        }
    }

    return '';
}



function fieldProperties(evt,parentCell) {

    if (!oCellDrag && oDragField == null && oNewControlStarted) {
        oNewControlStarted = null;
    }

    if (oCellDrag && oDragField == null && oNewControlStarted == null) {
        oCellDrag = null;
    }

    fieldClearHighlight();

    if (oCellDrag) {
        if (!oDragField) {
            if (oNewControlStarted) {
                oActiveCell.innerHTML = "&nbsp;"
                oNewControlStarted = null;
                oCellDrag = null;
                fieldPropertiesHideAll();
            }
        }
    }

    var tarObj;

    if (evt.srcElement) {
        tarObj = evt.srcElement;
    } else {
        tarObj = evt.target;
    }

    if (!parentCell) {
        parentCell = getParentCell(tarObj);
    }


    if (oPropertyImage) {
        if (parentCell == oActiveCell) {
            oActiveCell.style.backgroundColor = 'silver';
            return false;
        }
    }

    if (!parentCell) {
        formInactivateCell();
        return false;
    }


    var oFields = getInputElements(parentCell);

    fieldDisplayProperties(parentCell, oFields)
}

function fieldDisplayProperties(oSrc,oFields) {
    var oField;

    if (oSrc.tagName == "TABLE") {
        return false;
    }

    if (oFields.length == 0) {
        formActivateCell(oSrc, oField);
        return false;
    }

    fieldPropertiesHideAll();

    fieldDisplayHTML(oFields);

    oField = fieldSingleInstance(oFields, 0);

    formActivateCell(oSrc, oField);

    if (oField.title) {
        oField.title = attributeDecode(oField.title);
    }

    switch (fieldType(oField))
        {
        case 'textarea':
            oActiveField = oField;
            fieldPropertiesTextarea(oField);
            break;
        case 'select':
            oActiveField = oField;
            fieldPropertiesSelect(oFields);
            break;
        case 'text':
            oActiveField = oField;
            fieldPropertiesText(oField);
            break;
        case 'checkbox':
            oActiveField = oFields;
            fieldPropertiesCheckbox(oFields);
            break;
        case 'radio':
            oActiveField = oFields;
            fieldPropertiesRadio(oFields);
            break;
        case 'span':
            oActiveField = oField;
            fieldPropertiesSpan(oField);
            break;
        case 'hr':
            oActiveField = oField;
            fieldPropertiesHR(oField);
            break;
        case 'submit':
            oActiveField = oField;
            fieldPropertiesSubmit(oField);
            break;
    }

    return true;
}

function fieldClearHighlight() {
    for (var x = 0; x < id_matrix.rows.length; x++) {
        for (var y = 0; y < id_matrix.rows[x].cells.length; y++) {
            id_matrix.rows[x].cells[y].style.backgroundColor = '';
        }
    }

}

function fieldPropertiesHideAll() {

    if (isNewField) {
        //If we have a new field and do not save it we empty the field.
        oActiveCell.innerHTML = sCellContent;
        isNewField = false;
    } else {
        formInactivateCell();
    }

    id_propertiesdefault.style.display = 'block';
    id_propertiestextarea.style.display = 'none';
    id_propertiestext.style.display = 'none';
    id_propertiesmultiple.style.display = 'none';
    id_propertiesspan.style.display = 'none';
    id_propertiesbutton.style.display = 'none';
    id_propertieshr.style.display =  'none'
    id_verticallayout.style.display = '';

    oActiveField = null;

    return false;
}

function fieldPropertiesDelete(sAlert) {

    if (oActiveCell == null) {
        return false;
    }

    if (sAlert) {
        if (!confirm(sConfirmDelete)) {
            return false;
        }
    }

    oActiveCell.innerHTML = sCellContent;

    fieldPropertiesHideAll();

    return false;
}

function fieldPropertiesGetName(oFields) {
    var oField = fieldSingleInstance(oFields, 0);

    if (oField == null || !oField.name) {
        return '';
    }

    return oField.name;
}

function fieldPropertiesTextarea(oField) {
    var icols = 20;
    var irows = 2;

    if (oField.cols > 0) {
        icols = oField.cols;
    }

    if (oField.rows > 0) {
        irows = oField.rows;
    }

    document.getElementById('__textareaname').value = oField.name;
    document.getElementById('__textareaclass').value = oField.className;
    document.getElementById('__textarealabel').value = getLabelValue(oField);
    document.getElementById('__textareawidth').value = icols;
    document.getElementById('__textareaheight').value = irows;

    if (oField.getAttribute("required")) {
        document.getElementById('__textarearequired').checked = true;
    } else {
        document.getElementById('__textarearequired').checked = false;
    }

    if (oField.title) {
        document.getElementById('__textareatooltip').value = oField.title;
    } else {
        document.getElementById('__textareatooltip').value = '';
    }

    var xsiType = oField.getAttribute("xsitype");
    SetSelectedIndex(textareaType, xsiType);

    id_propertiesdefault.style.display = 'none';
    id_propertiestextarea.style.display = 'block';

    setTimeout('focusField("__textareaname")', 10);

    ClearError('___errortextarea');

}

function fieldPropertiesTextareaSave() {
    oActiveField.parentNode.innerHTML = fieldCreateTextarea(document.getElementById('__textareaname').value, '', document.getElementById('__textareaclass').value, document.getElementById('__textareaheight').value, document.getElementById('__textareawidth').value, document.getElementById('__textarearequired').checked, document.getElementById('__textarealabel').value, document.getElementById('__textareatooltip').value, textareaType.value);

    isNewField = false;
    oNewControlStarted = null;
    oCellDrag = null;

    fieldPropertiesHideAll();
}

function fieldPropertiesText(oField) {
    var sSize = 20;

    if (oField.size > 0) {
        sSize = oField.size
    }

    document.getElementById('__textname').value = oField.name;
    document.getElementById('__textsize').value = sSize;
    document.getElementById('__textlabel').value = getLabelValue(oField);
    document.getElementById('__textclass').value = oField.className;

    if (oField.getAttribute("required")) {
        document.getElementById('__textrequired').checked = true;
    } else {
        document.getElementById('__textrequired').checked = false;
    }
    if (oField.title) {
        document.getElementById('__texttooltip').value = oField.title;
    } else {
        document.getElementById('__texttooltip').value = '';
    }

    var xsiType = oField.getAttribute("xsitype");
    SetSelectedIndex(inputType, xsiType);

    id_propertiesdefault.style.display = 'none';
    id_propertiestext.style.display = 'block';

    setTimeout('focusField("__textname")', 10);

    ClearError('___errortext');
}

function focusField(fieldIdToFocus) {
    document.getElementById(fieldIdToFocus).select();
}

function fieldPropertiesTextSave(oField) {
    oActiveField.parentNode.innerHTML = fieldCreateInput(oActiveField.type, document.getElementById('__textname').value, oActiveField.value, document.getElementById('__textclass').value, document.getElementById('__textsize').value, document.getElementById('__textrequired').checked, document.getElementById('__textlabel').value, document.getElementById('__texttooltip').value, inputType.value);
    isNewField = false;
    oNewControlStarted = null;
    oCellDrag = null;
    fieldPropertiesHideAll();
}

function fieldPropertiesSpan(oField) {
    document.getElementById('__spanvalue').value = oField.innerHTML;
    document.getElementById('__spanclass').value = oField.className;
    id_propertiesdefault.style.display = 'none';
    id_propertiesspan.style.display = 'block';

    setTimeout('focusField("__spanvalue")', 10);

    ClearError('___errorspan');
}

function fieldPropertiesHR(oField) {

    document.getElementById('__hrclass').value = oField.className;
    document.getElementById('__hrtooltip').value = oField.title;

    id_propertiesdefault.style.display = 'none';
    id_propertieshr.style.display = 'block';

    setTimeout('focusField("__hrclass")', 10);

    ClearError('___errorhr');
}

function fieldPropertiesSubmit(oField) {

    GetValueString(document.getElementById('__buttonlabel'), oField.value);
    GetValueString(document.getElementById('__buttonclass'), oField.className);
    GetValueString(document.getElementById('__buttontooltip'), oField.title);

    var fullAction;

    for (var x = 0; x < oField.attributes.length; x++) {
        if (oField.attributes[x].nodeName.toLowerCase() == "action") {
            fullAction = oField.attributes[x].nodeValue;
        }
    }
    if (!fullAction || fullAction == "undefined" || fullAction.length <= 0) {
        fullAction = database;
    }

    var action;
    var options;
    var sender = '';
    var receiver = '';
    var subject = '';
    var indexOfQuestionMark = fullAction.indexOf('?');

    if (indexOfQuestionMark > 0) {
        action = fullAction.substr(0, indexOfQuestionMark);
        options = fullAction.substr(indexOfQuestionMark + 4);

        var isMailTo = action.length >= 7 && action.substr(action.length - 7) == 'mailto:';

        if (isMailTo && options && options.length > 0) {
            options = options.replace(/&amp;/i, '&');
            var tmp = options.split(/&from=/i);
            receiver = tmp[0];
            tmp = tmp[1].split(/&subject=/i);
            sender = tmp[0];
            subject = tmp.length > 1 ? tmp[1] : '';
        } else {
            //Custom url including a '?'-character
            action = fullAction;
        }
    } else {
        action = fullAction;
    }

    switch (action)
        {

        case mail:
        case mailAndDatabase:
            document.getElementById('FormEmailSender').value = sender;
            document.getElementById('FormEmailRecipient').value = receiver;
            document.getElementById('FormEmailSubject').value = subject;
            submitAction.value = action;
            break;
        case database:
            submitAction.value = action;
            break;
        default:
            document.getElementById('FormCustomUrl').value = action;
            submitAction.value = customUrl;
            break;
    }

    formActionChange(submitAction);

    id_propertiesdefault.style.display = 'none';
    id_propertiesbutton.style.display = 'block';

    setTimeout('focusField("__buttonlabel")', 10);

    ClearError('___erroremail');
}

function fieldCreateSubmit(cssClass, label, tooltip, action, emailSender, emailRecipient, formCustomUrl, emailSubject) {
    s = '<input type="submit" onclick="return(false)"';

    if (label && label.length > 0) {
        s = s + ' value="' + label + '"';
    }
    if (cssClass && cssClass.length > 0) {
        s = s + ' class="' + cssClass + '"';
    }
    if (tooltip && tooltip.length > 0) {
        s = s + ' title="' + attributeEncode(tooltip) + '"';
    }

    s = s + ' action="' + getActionString(action, emailSender, emailRecipient, formCustomUrl, emailSubject) + '"';

    s = s + '></input>';

    return s;
}

function getActionString(action, emailSender, emailRecipient, formCustomUrl, emailSubject) {
    switch (action)
    {
        case mail:
        case mailAndDatabase:
            return action + '?to=' + emailRecipient + '&from=' + emailSender + '&subject=' + emailSubject;
            break;
        case database:
            return action;
            break;
        default:
            return formCustomUrl;
            break;
    }
}

function GetValueString(destination, value) {
    if (value) {
        destination.value = value;
    } else {
        destination.value = '';
    }
}

function fieldPropertiesSpanSave() {

    oActiveField.parentNode.innerHTML = '<span ' + fieldGetSavedClassString(document.getElementById('__spanclass')) + '>' + document.getElementById('__spanvalue').value + '</span>';
    isNewField = false;
    oNewControlStarted = null;
    oCellDrag = null;

    fieldPropertiesHideAll();

    return false;
}

function fieldPropertiesHrSave() {
    var sHrClass = document.getElementById('__hrclass').value;
    var sHrToolTip = document.getElementById('__hrtooltip').value;
    var sHRInnerHTML = "<hr "

    if (sHrClass.length > 0) {
        sHRInnerHTML =  sHRInnerHTML + " class='" + sHrClass + "'";
    }
    if (sHrToolTip.length > 0) {
        sHRInnerHTML =  sHRInnerHTML + " title='" + sHrToolTip + "'";
    }

    sHRInnerHTML =  sHRInnerHTML + " />";

    oActiveField.parentNode.innerHTML = sHRInnerHTML;
    isNewField = false;
    oNewControlStarted = null;
    oCellDrag = null;

    fieldPropertiesHideAll();

    return false;
}

function fieldPropertiesSubmitSave() {
    var label = document.getElementById('__buttonlabel').value;
    var cssClass = document.getElementById('__buttonclass').value;
    var tooltip = document.getElementById('__buttontooltip').value;
    var emailSender = document.getElementById('FormEmailSender').value;
    var emailRecipient = document.getElementById('FormEmailRecipient').value;
    var customUrl = document.getElementById('FormCustomUrl').value;
    var emailSubject = document.getElementById('FormEmailSubject').value;

    oActiveField.parentNode.innerHTML =  fieldCreateSubmit(cssClass, label, tooltip, submitAction.value, emailSender, emailRecipient, customUrl, emailSubject);
    isNewField = false;
    oNewControlStarted = null;
    oCellDrag = null;
    fieldPropertiesHideAll();
}

function fieldPropertiesSelect(oFields) {
    document.getElementById('id_headingmultiple').innerHTML = sSelectProperties;
    document.getElementById('id_verticallayout').style.display = 'none';

    fieldPropertiesMultiple(oFields);
}

function fieldPropertiesCheckbox(oFields) {
    document.getElementById('id_headingmultiple').innerHTML = sCheckboxProperties;

    fieldPropertiesMultiple(oFields);
}

function fieldPropertiesMultiple(oFields) {
    var i;
    var s;
    var fVertical;
    var oMasterField = fieldSingleInstance(oActiveField, 0);
    var sTagType = oMasterField.tagName.toLowerCase();

    fHorizontal = oMasterField.getAttribute("horizontalalign") != null;

    document.getElementById('__multipleclass').value = oMasterField.className;
    document.getElementById('__multiplelayoutvertical').checked = !fHorizontal;
    document.getElementById('__multiplelayouthorizontal').checked = fHorizontal;
    document.getElementById('__multiplename').value = fieldPropertiesGetName(oFields);
    document.getElementById('__multiplelabel').value = getLabelValue(oMasterField);
    document.getElementById('__multiplerequired').checked = false;

    for (var x = 0; x < oMasterField.attributes.length; x++) {
        var nodeName = oMasterField.attributes[x].nodeName.toLowerCase();
        if (nodeName == "required") {
            document.getElementById('__multiplerequired').checked = oMasterField.attributes[x].nodeValue.toLowerCase();
        }
    }

    if (oMasterField.title) {
        document.getElementById('__multipletooltip').value = oMasterField.title;
    } else {
        document.getElementById('__multipletooltip').value = '';
    }

    if (oFields.length == 1 && oFields[0].tagName.toLowerCase() == "select") {
        oFields = oFields[0];
    }

    s = '';

    if (document.getElementById('tblNameValuePair').rows.length > 2) {
        var table = document.getElementById('tblNameValuePair');
        var rows = table.rows;
        var noofRowsToBeDeleted = parseInt(rows.length) - 2
        for (i = 0 ; i < noofRowsToBeDeleted ; i++) {
            table.deleteRow(-1);
        }
    }


    for (i = 0; i < oFields.length; i++) {
        s = s + fieldPropertiesMultipleSet(oFields[i]);
        if (s.length > 0) {
            addNameValuePair('tblNameValuePair', fieldPropertiesMultipleSetValues(oFields[i]), fieldPropertiesMultipleSet(oFields[i]), fieldPropertiesMultipleWhichSelected(oFields[i]), 1, true);
        }
    }
    resetOptionsControls();

    clearMultipleOptionField();

    id_propertiesdefault.style.display = 'none';
    id_propertiesmultiple.style.display = 'block';

    setTimeout('focusField("__multiplename")', 10);

    ClearError('___errormultiple');
}

function fieldPropertiesMultipleSetValues(oField) {
    var sReturnValue = "";

    if (oField.tagName == "OPTION") {
        sReturnValue = oField.value;
    } else if (oField.tagName == "INPUT") {
        sReturnValue = oField.value;
    }

    return sReturnValue;
}


function fieldPropertiesMultipleWhichSelected(oField) {
    var bWhichSelected = false;

    if (oField.tagName == "OPTION") {
        bWhichSelected = oField.selected;
    } else if (oField.tagName == "INPUT") {
        bWhichSelected = oField.checked;
    }

    return bWhichSelected;
}

function fieldPropertiesMultipleSet(oField) {

    if (oField.tagName == "OPTION") {
        if (oField.text != '') {
            return oField.text + '\n' ;
        } else {
            return oField.value + '\n';
        }
    } else if (oField.tagName == "INPUT") {

        if (oField.nextSibling != null) {
            var iFieldLength = 0;
            if (oField.nextSibling.innerText) {
                iFieldLength = oField.nextSibling.innerText.length
            } else {
                if (oField.nextSibling.textContent) {
                    iFieldLength = oField.nextSibling.textContent.length;
                } else {
                    iFieldLength = 0;
                }
            }

            if (oField.nextSibling != null && oField.nextSibling.nodeName == "LABEL" && iFieldLength > 0) {
                if (oField.nextSibling.innerText) {
                    return oField.nextSibling.innerText + '\n';
                } else {
                    return oField.nextSibling.textContent + '\n';
                }
            } else {

                return oField.value + '\n';
            }
        } else {
            return '';
        }
    } else if (oField.nextSibling == null) {
        return '';
    }

    return oField.nextSibling.innerHTML + '\n';
}



function fieldPropertiesMultipleSave() {
    var sError = '___errormultiple';
    // Validate multiple name input. Option list name and values are validated later.
    if (!validateName('__multiplename', sError)) {
        return false;
    }

    var iMaxCounter = (document.getElementById('tblNameValuePair').rows.length) - 1;
    var iHowManyChecked = 0;

    for (var i = 1; i < iMaxCounter; i++) {
        var objExist = document.getElementById('chkOptionSelected' + i)
        if (objExist != null) {
            if (objExist.checked) {
                iHowManyChecked = iHowManyChecked + 1;
            }
        }
    }

    var sName = document.getElementById('__multiplename').value;
    var oMasterField = fieldSingleInstance(oActiveField, 0);

    if (oMasterField.type.toLowerCase() != "checkbox") {
        if (iHowManyChecked > 1) {
            alert(sMorethenOneOptionSelectedError);
            return false;
        }
    }

    var tbl  = document.getElementById('tblNameValuePair');
    var rows = tbl.getElementsByTagName('tr');
    var OptionNameValue = '\r';

    for (var row = 1; row < rows.length; row++) {
        var cels = rows[row].getElementsByTagName('td')
        if (cels[4].innerHTML.length > 0) {
            OptionNameValue = OptionNameValue + cels[4].innerHTML + '\n' ;
        }
    }


    // Rebuild radio buttons / checkboxes with selected values
    var sTagType = oMasterField.tagName.toLowerCase();
    var s = '';

    if (document.getElementById('__multiplelayouthorizontal').checked) {
        oMasterField.horizontalalign = '1';
    } else {
        oMasterField.horizontalalign = null;
    }

    var label = document.getElementById('__multiplelabel').value;

    if (sTagType != 'select') {
        s = createLegendField(label);
    }

    a = fieldPropertiesMultipleTokenize(OptionNameValue);

    var iNameIndex;
    var iSelectedIndex;
    var iLen;

    var sOptionName;
    var sOptionValue;
    var sOptionSelected;

    for (i = 0; i < a.length; i++) {
        iNameIndex = a[i].indexOf('~+~');
        iSelectedIndex = a[i].lastIndexOf('~~');
        iLen = a[i].length;

        sOptionName = a[i].substr(0, iNameIndex);
        sOptionValue = a[i].substr(iNameIndex + 3, iSelectedIndex - (iNameIndex + 3));
        sOptionSelected = a[i].substr(iSelectedIndex + 2, 5);

        // Validate option inputs.
        if (!validateOptionName(sOptionName) || !validateOptionValue(sOptionValue)) {
            return false;
        }

        if (sTagType == 'select') {
            if (sOptionSelected == "true" || sOptionSelected == "false") {
                s = s + fieldCreateOption(sOptionName, sOptionValue, sOptionSelected);
            }
        } else {
            if (a[i] == '') {
                continue;
            }

            s = s + fieldCreateInput(oMasterField.type, sName, sOptionValue, document.getElementById('__multipleclass').value, '', document.getElementById('__multiplerequired').checked, '', document.getElementById('__multipletooltip').value, '', oMasterField.horizontalalign, sOptionSelected);

            s = s + '<label name="' + sOptionName + '">' + sOptionName + '</label>';

            if (document.getElementById('__multiplelayoutvertical').checked && i < a.length - 1) {
                s = s + '<br />';
            }
        }
    }

    var oErrorTxt = document.getElementById(sError + '_text');
    oError.style.display = 'block';
    if ((oMasterField.type.toLowerCase() == "radio" || oMasterField.type.toLowerCase() == "select-one") && a.length < 2) {
        ShowErrorText(oErrorTxt, sLessThanOptionsError + " 2");

        return false;
    } else if (oMasterField.type.toLowerCase() == "checkbox" && a.length < 1) {
        ShowErrorText(oErrorTxt, sLessThanOptionsError + " 1");

        return false;
    }
    oError.style.display = 'none';

    if (a.length == 0 && sTagType != 'select') {
        s = s + fieldCreateInput(oMasterField.type, sName, '', document.getElementById('__multipleclass').value, '', document.getElementById('__multiplerequired').checked, document.getElementById('__multiplelabel').value, document.getElementById('__multipletooltip').value, '', oMasterField.horizontalalign, false);
    }

    if (sTagType == 'select') {
        oActiveCell.innerHTML = fieldCreateSelect(sName, s, document.getElementById('__multipleclass').value, document.getElementById('__multiplerequired').checked, document.getElementById('__multiplelabel').value, document.getElementById('__multipletooltip').value, '');
    } else {
        oActiveCell.innerHTML = '<fieldset>' + s + '</fieldset>';
    }

    isNewField = false;
    oNewControlStarted = null;
    oCellDrag = null;
    fieldPropertiesHideAll();

    return true;
}

function fieldPropertiesMultipleTokenize(s) {
    var a = new Array;
    var idx = 0;
    var tmp = '';

    for (var i = 0; i < s.length; i++) {
        if (s.substr(i, 1).indexOf('\r') == 0) {
            continue;
        }

        if (s.substr(i, 1).indexOf('\n') < 0) {
            tmp += s.substr(i, 1);
        } else {
            a[idx++] = tmp;
            tmp = '';
        }
    }

    if (tmp.length > 0) {
        a[idx++] = tmp;
    }

    return a;
}

function fieldPropertiesMultipleDelete(nIndex) {
    var oMasterField;

    if (oActiveField.length == null) {
        return;
    }
    if (oActiveField.length < 2 || nIndex >= oActiveField.length) {
        return;
    }

    oMasterField = fieldSingleInstance(oActiveField, 0);

    oMasterField.parentNode.removeChild(oActiveField(nIndex));

    fieldPropertiesMultiple(oActiveField);
}

function fieldPropertiesRadio(oFields) {
    document.getElementById("id_headingmultiple").innerHTML = sRadioProperties;
    document.getElementById('__multiplerequired').checked = oFields.Required;

    fieldPropertiesMultiple(oFields);

    return;
}

function CreateDragField(type) {
    oDragField = document.createElement("IMG");
    oDragField.type = type;
    oDragField.src = EPi.GetProperty(window, "imageurl", type);
    oDragField.style.position = "absolute";
    oDragField.style.cursor = "move";
    oDragField.style.display = "none"
    oDragField.style.zIndex = 100;

    document.body.insertBefore(oDragField, document.body.childNodes[0]);
}

function AddField(oField,evt,oTable) {
    if (oActiveCell == null) {
        alert(sNotSelctedRowError);
        return;
    }

    oCellDrag = null;
    oNewControlStarted = null;

    var oCell;
    var nRow;
    var nCol;
    var sDragFieldType;

    CreateDragField(EPi.GetProperty(oField, "type"));

    evt = getEvent(evt);

    nRow = fieldRowIndex(oTable, oActiveCell);
    nCol = fieldColumnIndex(oTable, oActiveCell, nRow);
    oCell = oTable.rows[nRow].cells[nCol] ;

    if (hasFields(oCell)) {
        alert(sFieldExistsAlert);
        oDragField = null;
        return ;
    } else {
        sDragFieldType = oDragField.type;
        drawnewControl(sDragFieldType, evt, oCell)
    }

    oDragField = null;

    return false;
}

function drawnewControl(sDragFieldType,evt,oCell) {
    formInactivateCell(); // Inactivate cell to get rid of any unsaved existing form field in this cell.

    switch (sDragFieldType)
            {
        case 'textarea':
            oCell.innerHTML = fieldCreateTextarea('', '', '', '', '', false, '', '', '');

            break;
        case 'select':
            oCell.innerHTML = fieldCreateSelect('', false, '', false, '', '', '');

            break;
        case 'span':
            oCell.innerHTML = '<span></span>';

            break;
        case 'radio':
        case 'checkbox':
            oCell.innerHTML = fieldCreateInput(sDragFieldType, '', 'on', '', '', false, '', '', '', false);

            break;
        case 'submit':
            oCell.innerHTML = fieldCreateSubmit('', submitDefaultValue, '', database, '', '', '', '');

            break;
        case 'hr':
            oCell.innerHTML = '<hr />';

            break;
        default:
            oCell.innerHTML = fieldCreateInput(sDragFieldType, '', '', '', '', false, '', '', '', false);

            break;
    }

    oNewControlStarted = true;
    fieldProperties(evt, oCell);
    isNewField = true;
}

function fieldStartDrag(e) {
    oStartDragField = this;
    this.style.cursor = "move";

    if (oCellDrag) {
        if (!oDragField) {
            if (oNewControlStarted) {
                oActiveCell.innerHTML = "&nbsp;"
                oNewControlStarted = null;
                oCellDrag = null;
                fieldPropertiesHideAll();
            }
        }
    }

    CreateDragField(EPi.GetProperty(this, "type"));

    fieldPropertiesHideAll();

    document.body.onmouseup = fieldDrop;
    document.body.onmousemove = fieldMove;
    document.body.onmousedown = function () {
        return false;
    };

    return false;
}

function fieldMouseOut() {
    this.style.cursor = "pointer";
    this.onmouseout = null;
}

function getEvent(evt) {
    if (evt == null) {
        return window.event
    }

    return evt
}

function GetScrollPosition(win) {
    var scrollX = 0;
    var scrollY = 0;
    if (win.document.documentElement.scrollTop != null) {
        scrollX = win.document.documentElement.scrollLeft;
        scrollY = win.document.documentElement.scrollTop;
    } else if (win.pageYOffset != null) {
        scrollX = win.pageXOffset;
        scrollY = win.pageYOffset;
    }

    return [scrollX, scrollY];
}

function fieldMove(evt) {
    var evt = getEvent(evt);

    if (oDragField) {
        var scrollPosition = GetScrollPosition(window);
        oDragField.style.left = scrollPosition[0] + evt.clientX + 10 + "px";
        oDragField.style.top = scrollPosition[1] + evt.clientY + 10 + "px";
        oDragField.style.display = "block";
    }

    return false;
}

function cellStartDrag(evt) {
    var oField;

    if (document.all) {
        oField = window.event.srcElement;
    } else {
        oField = evt.target;
    }

    if (oField == document.getElementById('__imageactive')) {
        for (var x = 0; x < oField.attributes.length; x++) {
            if (oField.attributes[x].nodeName.toLowerCase() == "type") {
                oField.type = oField.attributes[x].nodeValue
            }
        }

        CreateDragField(oField.type);

        document.body.onmouseup = fieldDrop;
        document.body.onmousemove = fieldMove;
        document.body.onmousedown = function () {
            return false;
        };
        oCellDrag = true;
        return false;
    }

}

function fieldIdString() {
    var s = sIdPrefix + nId;

    nId++;
    return s;
}

function fieldGetSavedClassString(textField) {
    var spanClass = textField.value;

    if (spanClass == null || spanClass.length == 0) {
        return '';
    }

    return ' class="' + spanClass + '"';
}

function fieldDrop(evt) {
    document.body.onmouseup = null;
    document.body.onmousemove = null;
    document.body.onmousedown = null;

    if (oDragField == null) {
        return;
    }
    if (oStartDragField != null) {
        oStartDragField.style.cursor = "pointer";
        oStartDragField = null;
    }

    var oCell;
    evt = getEvent(evt);

    var sourceElement = _browser.evt.SrcElement(evt);

    document.body.removeChild(oDragField);
    oCell = fieldGetValidTarget(sourceElement, evt.x, evt.y);

    if (oCell != null) {
        var sDragFieldType = oDragField.type;

        if (hasFields(oCell)) {
            alert(sFieldExistsAlert);
        } else if (oActiveField) {
            formInactivateCell();

            //oActiveCell = getParentCell(oActiveField);

            var sInnerHTML = oActiveCell.innerHTML;

            fieldPropertiesDelete(null);

            fieldPropertiesHideAll();

            oCell.innerHTML = sInnerHTML;

            fieldProperties(evt, oCell);
        } else {
            drawnewControl(sDragFieldType, evt, oCell);
        }
    }

    oDragField = null;

    return false;
}

function fieldType(oField) {
    var sTagName;

    if (oField == null) {
        return null;
    }

    sTagName = oField.tagName.toLowerCase();



    switch (sTagName)
        {
        case 'span':
        case 'hr':
        case 'textarea':
        case 'select':
        case 'option':
        case 'button':
            return sTagName;
        case 'input':
            return oField.type.toLowerCase();
    }

    return null;
}

function fieldValue(oField) {
    var sTagName;

    if (oField == null) {
        return null;
    }

    sTagName = oField.tagName.toLowerCase();

    switch (sTagName)
        {
        case 'span':
            return oField.innerHTML;
        case 'hr':
            return oField.innerHTML;
        case 'textarea':
            return oField.innerText;
        case 'option':
        case 'select':
        case 'input':
            return oField.value;
    }

    return null;
}

function fieldSingleInstance(oFields, nIndex) {
    var oField = null;

    if (oFields == null) {
        return null;
    }

    if (oFields.tagName != null) {
        oField = oFields;
    } else {
        if (oFields.length > nIndex) {
            oField = oFields[nIndex];
        }
    }

    return oField;
}

function fieldGetValidTarget(oObject, x, y) {
    var oElement;
    var oCell;
    var fCellFound = false;

    if (oObject == null) {
        return null;
    }

    oElement = oObject;

    while ((oElement != null) && (oElement.parentNode != oElement)) {
        if (oElement.tagName == 'TD') {
            oCell = oElement;
            fCellFound = true;
        }

        if ((oElement.id == 'id_matrix') && fCellFound) {
            return oCell;
        }

        oElement = oElement.parentNode;
    }
    return null;
}

function formPopulateForSubmit(oForm) {
    fieldPropertiesHideAll();
    var sFormContent = xFormControl.innerHTML;

    sFormContent = ParseOptionValueString(sFormContent, 'type=radio CHECKED', ' CHECKED type=radio ');

    formContent.value = sFormContent;

    return true;
}

function formCreateCell(oForm, oCell, nRow, nCol) {
    var sValue;
    var oPostField;
    var nField;
    var nParentField = 0;

    // Check for fields in this cell
    oFields = getInputElements(oCell);

    if (oFields.tagName != null) {
        oPostField = formCreateField(oFields, nRow, nCol, 0);
        oForm.appendChild(oPostField);
        nParentField = 1;
    }

    if (oFields.length) {
        for (nField = 0; nField < oFields.length; nField++) {
            oPostField = formCreateField(oFields[nField], nRow, nCol, nField + nParentField);
            oForm.appendChild(oPostField);
        }
    }
    // Create field for this cell
    sValue = nRow.toString() + '[&]' + nCol.toString() + '[&]';
    sValue += escape(oCell.hasField) + '[&]';

    if (oCell.className) {
        sValue += escape(oCell.className);
    }

    oPostField = document.createElement('input');
    oPostField.type = 'hidden';
    oPostField.name = '__formcell' + nCellCount++;
    oPostField.value = sValue;
    oForm.appendChild(oPostField);
}

function formCreateField(oField, nRow, nCol, nPos) {
    var sValue;
    var oPostField;
    var sId = oField.id;
    var sName = oField.name;

    // We do not have name/id:s on option-tags, use info from parent (=select tag)
    if (sId.length == 0) {
        sId = oField.parentNode.id;
        sName = oField.parentNode.name;
    }

    sValue = escape(sId) + '[&]' + fieldType(oField) + '[&]' + sName + '[&]' + nPos;
    sValue += '[&]' + fieldValue(oField) + '[&]' + escape(oField.className);

    if (fieldType(oField) == 'text') {
        sValue += '[&]' + oField.size + '[&]';
    } else if (fieldType(oField) == 'textarea') {
        sValue += '[&]' + oField.cols + '[&]' + oField.rows;
    } else {
        sValue += '[&][&]';
    }

    if (oField.getAttribute('Required', 0) == 'true') {
        sValue += '[&]1';
    } else {
        sValue += '[&]0';
    }

    oPostField = document.createElement('input');
    oPostField.type = 'hidden';
    oPostField.name = '__formfield' + nFieldCount++;
    oPostField.value = sValue;

    return oPostField;
}

function formActivateCell(oCell,oField) {
    if (oCell.tagName != "TD") {
        formInactivateCell();
        return;
    }

    if (oField != null) {
        oPropertyImage = new Image();
        oPropertyImage.src = EPi.GetProperty(window, "imageurl", fieldType(oField).toLowerCase());
        oPropertyImage.type = fieldType(oField).toLowerCase();
        oPropertyImage.id = '__imageactive';
        oPropertyImage.style.cursor = 'move';
        oPropertyImage.style.position = 'relative';
        oPropertyImage.style.left = -10;
        oPropertyImage.style.top = 0;

        oPropertyImage.onmousedown = cellStartDrag;

        var firstChild = oCell.childNodes[0];

        oCell.insertBefore(oPropertyImage, firstChild);

    } else {
        fieldPropertiesHideAll();
    }

    oCell.style.backgroundColor = 'silver';
    oActiveCell = oCell;
}

function formInactivateCell() {
    if (oActiveCell) {
        // Remove style attribute since firefox keeps the style attribute
        // which will cause page leave check to trigger even though no changes are done.
        oActiveCell.removeAttribute("style");

        if (oPropertyImage != null) {
            if (oPropertyImage.parentNode == oActiveCell) {
                oActiveCell.removeChild(oPropertyImage);
            }
        }
        //oActiveCell = null;
        oPropertyImage = null;
    }
}

function OpenEditxFormHelp() {
    window.open('EditXForm.htm', '_blank', 'scrollbars=yes, height=500, location=no, menubar=no, resizable=yes, toolbar=no, width=550');
}

function fnSave(elem) {
    if (sFormName.value.trim() == "") {
        alert(sformEmptyError);
        return false;
    }

    if (EPi.PageLeaveCheck.HasPageChanged() && window.EPiObject.formIsUsedOnOtherPages === "true" && !confirm(sSaveFormUsedInMultiplePages)) {
        return false;
    }

    formPopulateForSubmit(elem.form);
}

function saveAs(evt) {
    var encodedFormName = encodeURIComponent(sFormName.value);
    var url = EPi.ResolveUrlFromUI("Edit/XFormSaveAsDialog.aspx");
    EPi.CreateDialog(url + "?FormName=" + encodedFormName + "&FolderID=" + sFolderID.value, OnSaveAsDialogComplete, null, null, { width: 430, height: 160, scrollbars: "yes" });
}

function OnSaveAsDialogComplete(returnValue, onCompleteArguments) {
    if (returnValue != null) {
        var iFirstIndex = returnValue.indexOf(':');
        sFormName.value = returnValue.substr(0, iFirstIndex);
        sFolderID.value = returnValue.substr(iFirstIndex + 1, returnValue.length);
        isSaveAsAction.value = 1;
        fieldPropertiesHideAll();
        formContent.value = xFormControl.innerHTML;
        document.forms[0].submit();
    }
}


function deleteNameValuePair(evt,row) {
    var i = row.parentNode.parentNode.rowIndex;
    document.getElementById('tblNameValuePair').deleteRow(i);

    resetOptionsControls();
}

function setSelectedValues(evt,row) {
    var i = row.parentNode.parentNode.rowIndex;
    var tbl  = document.getElementById('tblNameValuePair');
    var rows = tbl.getElementsByTagName('tr');
    var cels = rows[i].getElementsByTagName('td')
    var sText = cels[4].innerHTML;

    sText = sText.substr(0, sText.indexOf('~~'));

    if (row.checked) {
        cels[4].innerHTML  = sText + "~~" + "true";
    } else {
        cels[4].innerHTML = sText + "~~" + "false";
    }

}

function SetSelectedIndex(selectList, value) {
    selectList.selectedIndex = -1;
    for (var i = 0; i < selectList.options.length; i++) {
        if (selectList.options[i].value == value) {
            selectList.selectedIndex = i;
            break;
        }
    }
}

function onKeyEnter(evt,tblID) {
    var keyCode = null;

    if (evt.which) {
        keyCode = evt.which;
    } else if (evt.keyCode) {
        keyCode = evt.keyCode;
    }

    if (keyCode == 13) {
        addNameValuePair(tblID, document.getElementById('__multipletextValue').value, document.getElementById('__multipletextName').value, false, 0);

        // Prevent propagation of this event since we have a keyevent handler on document level that will cancel the event.
        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
        if (evt.cancelBubble) {
            evt.cancelBubble = true;
        }

        return false;
    }

}

function moveRow(el, x) {
    while (el.parentNode && 'tr' != el.nodeName.toLowerCase()) {
        el = el.parentNode;
    }

    var t = el.parentNode;
    var i = el.rowIndex + x;

    if (i < 0) {
        i += t.rows.length;
    }

    if (i == t.rows.length) {
        i = 0;
    }

    t.removeChild(el);
    var nRow = t.insertRow(i);
    t.replaceChild(el, nRow);

    resetOptionsControls();

}

function resetOptionsControls() {
    var tbl  = document.getElementById('tblNameValuePair');
    var rows = tbl.getElementsByTagName('tr');
    var cels ;
    var iContyrolCounter ;

    for (j = 2; j < tbl.rows.length; j++) {
        cels = rows[j].getElementsByTagName('td')
        iContyrolCounter = j - 1;

        if (tbl.rows.length == 3) {
            sImageURL =  "<img src='" + sDeleteImageURL + "' style='cursor: hand'  ID='delRow" + iContyrolCounter + "' Onclick=deleteNameValuePair(event,this)>";
        } else {
            if (j + 1 == tbl.rows.length) {
                sImageURL =  "<img style='cursor: hand' src='" + sUpImageURL + "'  onclick='moveRow(this, -1);' ><img src='" + sClearImageURL + "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='" + sDeleteImageURL + "' style='cursor: hand' ID='delRow" + iContyrolCounter + "' Onclick=deleteNameValuePair(event,this)> ";
            } else if (j == 2) {
                sImageURL =  "<img src='" + sClearImageURL + "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img style='cursor: hand' src='" + sDownImageURL + "' onclick='moveRow(this, 1);'><img src='" + sDeleteImageURL + "' style='cursor: hand' style='cursor: hand' ID='delRow" + iContyrolCounter + "' Onclick=deleteNameValuePair(event,this)>";
            } else {
                sImageURL =  "<img style='cursor: hand' src='" + sUpImageURL + "'  onclick='moveRow(this, -1);' ><img style='cursor: hand' src='" + sDownImageURL + "' onclick='moveRow(this, 1);'><img src='" + sDeleteImageURL + "' style='cursor: hand' ID='delRow" + iContyrolCounter + "' Onclick=deleteNameValuePair(event,this)>";
            }
        }

        cels[3].innerHTML = sImageURL;

    }
}

function setChangedOptionValues(evt,elemId,iWhichChanged) {
    var i = elemId.parentNode.parentNode.rowIndex;
    var tbl  = document.getElementById('tblNameValuePair');
    var rows = tbl.getElementsByTagName('tr');
    var cels = rows[i].getElementsByTagName('td')
    var iRowNo;

    if (iWhichChanged == 0) {
        if (elemId.id.length == 19) {
            iRowNo = ((elemId.id).substr((elemId.id).length - 1, (elemId.id).length));
        } else if (elemId.id.length == 20) {
            iRowNo = ((elemId.id).substr((elemId.id).length - 2, (elemId.id).length));
        } else if (elemId.id.length == 21) {
            iRowNo = ((elemId.id).substr((elemId.id).length - 3, (elemId.id).length));
        }
    }

    if (iWhichChanged == 1) {
        if (elemId.id.length == 20) {
            iRowNo = ((elemId.id).substr((elemId.id).length - 1, (elemId.id).length));
        } else if (elemId.id.length == 21) {
            iRowNo = ((elemId.id).substr((elemId.id).length - 2, (elemId.id).length));
        } else if (elemId.id.length == 22) {
            iRowNo = ((elemId.id).substr((elemId.id).length - 3, (elemId.id).length));
        }
    }

    var smultipleValueID = "__multipletextValue" + iRowNo;
    var smultipleNameID = "__multipletextName" + iRowNo;
    var sCheckBoxID = "chkOptionSelected" + iRowNo;

    var optionNameNode = document.getElementById(smultipleNameID);
    var optionValueNode = document.getElementById(smultipleValueID);

    // Validate option inputs and take proper action.
    if (!validateOptionName(optionNameNode.value)) {
        optionNameNode.style.backgroundColor = "red";
    } else {
        optionNameNode.style.backgroundColor = "";
    }

    if (!validateOptionValue(optionValueNode.value)) {
        optionValueNode.style.backgroundColor = "red";
    } else {
        optionValueNode.style.backgroundColor = "";
    }

    if (document.getElementById(sCheckBoxID).checked) {
        cels[4].innerHTML = optionNameNode.value.trim() + "~+~" + optionValueNode.value.trim() + "~~true";
    } else {
        cels[4].innerHTML = optionNameNode.value.trim() + "~+~" + optionValueNode.value.trim() + "~~false";
    }
}

function ParseOptionValueString(strOptionvalue,strFind,strReplace) {
    var srchNdx = 0;
    var sOptionReturnValue = '';

    if (strOptionvalue.length > 0) {
        while (strOptionvalue.indexOf(strFind, srchNdx) != -1) {
            sOptionReturnValue += strOptionvalue.substring(srchNdx, strOptionvalue.indexOf(strFind, srchNdx));
            sOptionReturnValue += strReplace;
            srchNdx = (strOptionvalue.indexOf(strFind, srchNdx) + strFind.length);
        }
        sOptionReturnValue += strOptionvalue.substring(srchNdx, strOptionvalue.length);
    }

    return sOptionReturnValue;
}

function addNameValuePair(tblID, sOptionValue, sOptionName, sChecked, iMode, batchMode) {
    if (!sOptionValue && iMode != 1) {
        var sOptionValue = document.getElementById('__multipletextValue').value;
        var sOptionName = document.getElementById('__multipletextName').value;
    }

    // Validate option inputs.
    if (!validateOptionName(sOptionName) || !validateOptionValue(sOptionValue)) {
        return false;
    }

    var irowcount = document.getElementById(tblID).rows.length;

    var tbody = document.getElementById(tblID).getElementsByTagName("TBODY")[0];
    var row = document.createElement("TR");
    var td1 = document.createElement("TD");
    var td2 = document.createElement("TD");
    var td3 = document.createElement("TD");
    var td4 = document.createElement("TD");
    var td5 = document.createElement("TD");

    td1.style.textAlign = "center";
    var sImageURL = "";
    var iContyrolCounter = parseInt(irowcount) - 1;

    if (sOptionValue == "" && iMode != 1) {
        var invalidOptionValueIndicator = "";
        if (!validateOptionValue(sOptionName)) {
            invalidOptionValueIndicator = ' style="background-color: red;"';
        }
        sOptionValue = sOptionName;
    }

    if (sChecked == true) {
        td1.innerHTML = "<input type='checkbox' ID='chkOptionSelected" + iContyrolCounter + "' name='chkOptionSelected" + iContyrolCounter + "' onClick=setSelectedValues(event,this)  checked /> ";
    } else {
        td1.innerHTML = "<input type='checkbox' ID='chkOptionSelected" + iContyrolCounter + "' name='chkOptionSelected" + iContyrolCounter + "' onClick=setSelectedValues(event,this)  /> ";
    }

    sOptionValue = ParseOptionValueString(sOptionValue, '"', '&quot;');
    sOptionName = ParseOptionValueString(sOptionName, '"', '&quot;');

    td2.innerHTML = "<input type='text' class='inputsmalltext' size='5' id='__multipletextName" + iContyrolCounter + "'  value=\"" + sOptionName + "\"   onchange='setChangedOptionValues(event,this,0)' onmousedown='setControlFocus(this);'  />";
    td3.innerHTML = "<input type='text' class='inputsmalltext' size='5' id='__multipletextValue" + iContyrolCounter + "' value=\"" + sOptionValue + "\"" +  invalidOptionValueIndicator + " onchange='setChangedOptionValues(event,this,1)' onmousedown='setControlFocus(this);' />";


    td4.innerHTML = sImageURL;
    if (sChecked == true) {
        td5.innerHTML = sOptionName.trim() + "~+~" + sOptionValue.trim() + "~~true";
    } else {
        td5.innerHTML = sOptionName.trim() + "~+~" + sOptionValue.trim() + "~~false";
    }

    td5.style.display = "none";
    td5.style.width = "0px";

    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);

    tbody.appendChild(row);

    if (iMode != 1) {
        clearMultipleOptionField();
        document.getElementById('__multipletextName').focus();
    }

    if (!batchMode) {
        resetOptionsControls();
    }
}

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}

function clearMultipleOptionField() {
    document.getElementById('__multipletextName').value = "";
    document.getElementById('__multipletextValue').value = "";

}

function clsBrowser() {
    var me = this;
    me.Controls = new Object();
    this.evt = new clsEvt();

    function clsEvt() {
        this.SrcElement = function (evt) {
            if (evt.target == null) {
                return evt.srcElement;
            } else {
                return evt.target;
            }
        }

        this.ReturnValue = function (evt, bValue) {
            if (evt.preventDefault) {
                if (bValue == false) {
                    evt.preventDefault();
                }
            } else {
                evt.returnValue = bValue;
            }

        }
    }

}

//****************** funtions used by XFormFieldProperty **************************************
function attributeEncode(str) {
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function attributeDecode(str) {
    return str.replace(/&amp;/g, "&").replace(/&quot;/g, '"');
}

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

function formActionChange(submitAction) {
    var nValue = submitAction.value;

    switch (nValue)
    {
        case mail:
        case mailAndDatabase:
            emailRecipientRow.style.display = '';
            emailSenderRow.style.display = '';
            emailSubjectRow.style.display = '';
            customUrlRow.style.display = 'none';
            break;
        case database:
            emailRecipientRow.style.display = 'none';
            emailSenderRow.style.display = 'none';
            emailSubjectRow.style.display = 'none';
            customUrlRow.style.display = 'none';
            break;
        default:
            emailRecipientRow.style.display = 'none';
            emailSenderRow.style.display = 'none';
            emailSubjectRow.style.display = 'none';
            customUrlRow.style.display = '';
            break;
    }
}

function validateName(sName, sError) {
    oName = document.getElementById(sName).value;

    oError = document.getElementById(sError);
    oErrorTxt = document.getElementById(sError + '_text');
    oError.style.display = 'block';
    if (((sName == '__textname') || (sName == '__textareaname') || (sName == '__multiplename')) && (oName.toLowerCase() == 'id')) {
        ShowErrorText(oErrorTxt, translatedPredefinedName);
        return false;
    }

    if (oName == '') {
        ShowErrorText(oErrorTxt, translatedNameRequired);

        return false;
    }

    if (oName.match(/\W/) || oName.match(/^\d/)) {
        ShowErrorText(oErrorTxt, translatedNameInvalid);
        return false;
    }

    if (oName.length > maxNameLength) {
        ShowErrorText(oErrorTxt, translatedNameTooLong);
        return false;
    }

    oError.style.display = 'none';
    return true;
}

// Function to validate filled in option names on MultipleInputs (radio, checkbox and select)
function validateOptionName(value) {
    var regExp = /\\u|selected/i;
    return validateOption(value, regExp);
}

// Function to validate filled in option values on MultipleInputs (radio, checkbox and select)
function validateOptionValue(value) {
    var regExp = /\\u|=|,|selected/i;
    return validateOption(value, regExp);
}

function validateOption(value, regExp) {
    if (value.length == 0) {
        return true;
    }

    oError = document.getElementById("___errormultiple");
    oErrorTxt = document.getElementById("___errormultiple_text");

    var matchArray = value.match(regExp);

    if (matchArray != null) {
        // Show error message
        showOptionError(matchArray);
        return false;
    } else {
        oError.style.display = "none";
    }
    return true;
}

function showOptionError(matchArray) {
    var i;
    var strErrors = "";

    for (i = 0; i < matchArray.length; i++) {
        strErrors += matchArray[i];
    }

    if (strErrors.length > 0) {
        strErrors = " (" + strErrors + ").";
    }

    ShowErrorText(oErrorTxt, translatedMultipleValueInvalid + strErrors);
    oError.style.display = "block";
}

function validateSpan(sName, sError) {
    var inputValue = document.getElementById(sName).value;
    oError = document.getElementById(sError);

    if (inputValue == '') {
        oError.style.display = '';
        oErrorTxt = document.getElementById(sError + '_text');
        ShowErrorText(oErrorTxt, translatedHeadingTextRequired);
        return false;
    }

    oError.style.display = 'none';
    return true;
}

function validateEmail(sName, sError, allowMultiple) {
    if (submitAction.value == database || submitAction.value == customUrl) {
        // If we have select only save to the database or send to a custom url, we are not interested in validating the email.
        return true;
    }

    var inputValue = document.getElementById(sName).value;
    oError = document.getElementById(sError);

    var regex = allowMultiple ? multipleEmailRegex : emailRegex;

    var matchArray = inputValue.match(regex);
    if (matchArray == null) {
        oError.style.display = '';
        oErrorTxt = document.getElementById(sError + '_text');
        ShowErrorText(oErrorTxt, translatedInvalidEmail.replace('{0}', inputValue));
        return false;
    }

    oError.style.display = 'none';
    return true;
}

function ShowErrorText(oErrorField,sErrorText) {
    if (document.all) {
        oErrorField.innerText = sErrorText;
    } else {
        oErrorField.textContent = sErrorText;
    }
}

function ClearError(sError) {
    oError = document.getElementById(sError);
    oError.style.display = 'none';
}
