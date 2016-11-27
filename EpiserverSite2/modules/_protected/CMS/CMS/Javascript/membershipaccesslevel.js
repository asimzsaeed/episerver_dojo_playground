var EPiAccessArray = new Array(); //EPi
var highlightedRows = 0;    //EPi


//Before we add to table we check if that user already exists. If exists we dont add user.
function isUserExist(UserOrGroupName) {
    for (var i = 0; i < EPiIdentityCounter; i++) {
        tempHiddeUserOrGroupName = document.getElementById(clientID + "_HiddenUserOrGroupName" + i);
        if (tempHiddeUserOrGroupName != null) {
            if (UserOrGroupName.toLowerCase() == tempHiddeUserOrGroupName.value.toLowerCase()) {
                return true;
            }
        }
    }
    return false;
}

//isUserOrGroup = SecurityEntryType 0 for Group and 1 for Users
//This function is called from callback from ModalWindow.
//Sends in User och role/group name chosen from membershipbrowser.
function addRows(UserOrGroupName, isUserOrGroup) {

    if (isUserExist(UserOrGroupName)) {
        return;
    }

    //Mark that the page has changed when adding a new row. So that you will get a warning if leaving the page without saving.
    EPi.PageLeaveCheck.SetPageChanged(true);

    var EPiClientIdentityCounter = 0;
    EPiClientIdentityCounter = EPiIdentityCounter;

    var table       = document.getElementById(EPiTableAccessRights);
    var oRow        = table.insertRow(table.rows.length);
    var oCell       = oRow.insertCell(0);
    oRow.id         = clientID + '_row_' + EPiClientIdentityCounter;

    oCell.className = "epieditaccessrightuserandgroupicon";

    EPiAccessRightsUserNameCollection[EPiClientIdentityCounter]             = EPiClientIdentityCounter;
    EPiAccessRightsUserNameCollection[EPiClientIdentityCounter].name        = UserOrGroupName;
    EPiAccessRightsUserNameCollection[EPiClientIdentityCounter].EntityType  = isUserOrGroup;


    var frmSpanRow = document.createElement('span');
    frmSpanRow.onclick = function () {
        highlightRow(EPiClientIdentityCounter, false)
    };

    //Stores User or rolename in hidden variable. Is used in LoadPostData method on server side.
    var frmHiddenUserOrGroupName    = document.createElement('input');
    frmHiddenUserOrGroupName.id     = clientID +  "_HiddenUserOrGroupName" + EPiClientIdentityCounter;
    frmHiddenUserOrGroupName.name   = uniqueID +  "HiddenUserOrGroupName" + EPiClientIdentityCounter;
    frmHiddenUserOrGroupName.type   = 'hidden';
    frmHiddenUserOrGroupName.value  = UserOrGroupName;

    //New user or role in table...then we add to counter.
    EPiIdentityCounter++;

    //UserOrGroupIcon
    var frmImg      = document.createElement('img');
    frmImg.id       = clientID + '_icon_' + EPiClientIdentityCounter;
    frmImg.src      = EPiAccessRightsImageArray[isUserOrGroup];
    frmImg.title    = EPiTranslateAdminSecurityNotSelectedInfo;

    //Link on name
    var frmA        = document.createElement('a');
    frmA.id         = clientID + '_name_' + EPiClientIdentityCounter;
    frmA.href       = '#';
    frmA.title      = EPiTranslateAdminSecurityNotSelectedInfo;
    var labelTxt    = document.createTextNode(UserOrGroupName);
    frmA.appendChild(labelTxt);

    frmSpanRow.appendChild(frmHiddenUserOrGroupName);
    frmSpanRow.appendChild(frmImg);
    frmSpanRow.appendChild(frmA);

    oCell.appendChild(frmSpanRow);

    iAccessLevelCount = EPiAccessLevelArray.length;
    for (var i = 0; i <= EPiAccessLevelArray.length; i++) {
        var disabled = isUserOrGroup == 2 && EPiAccessLevelArray[i] != 1;
        insertTableCell(oRow, EPiAccessLevelArray[i], EPiClientIdentityCounter, isUserOrGroup, iAccessLevelCount, disabled);
        iAccessLevelCount--;
    }

    highlightRow(EPiClientIdentityCounter, false);

}


//Insers table cells and checkboxes.
function insertTableCell(oRow, nAccess, EPiClientIdentityCounter,isUserOrGroup, iAccessLevelCount, disabled) {
    var oCell;

    oCell = oRow.insertCell(-1);

    if (iAccessLevelCount > 0) {
        var frmCheckbox         = document.createElement('input');
        frmCheckbox.type        = 'checkbox';
        frmCheckbox.id          = clientID + '_p_' + EPiClientIdentityCounter + '_' + nAccess;
        frmCheckbox.name        = uniqueID + 'p_' + EPiClientIdentityCounter + '_' + nAccess;
        frmCheckbox.value       = nAccess;
        frmCheckbox.onclick     = function () {
            highlightRow(EPiClientIdentityCounter, true);
        };
        frmCheckbox.ondblclick  = function () {
            return SecEnableAccess(clientID + '_p_' + EPiClientIdentityCounter, nAccess, EPiClientIdentityCounter);
        };
        oCell.appendChild(frmCheckbox);
        frmCheckbox.checked = nAccess == EPiAccessLevelArray[0] ? 'checked' : '';

        if (disabled) {
            frmCheckbox.setAttribute('disabled', 'disabled');
            frmCheckbox.setAttribute('data-is-accesslevel-disabled', 'true');
        }
    } else {
        //This is the control that sets if this row is selected. In LoadPostData method we check if this value is true. If true..save it to ACL.
        var frmInputSaveRow = document.createElement('input');
        frmInputSaveRow.type = 'hidden';
        frmInputSaveRow.id = clientID + '_p_' + EPiClientIdentityCounter + '_save';
        frmInputSaveRow.name = uniqueID + 'p_' + EPiClientIdentityCounter + '_save';
        frmInputSaveRow.value = true;

        oRow.appendChild(frmInputSaveRow);

        //Here we save what type this user or role are..
        var frmEntryType = document.createElement('input');
        frmEntryType.type = 'hidden';
        frmEntryType.name = uniqueID + 'SecurityEntryType_' + EPiClientIdentityCounter + '_save';
        frmEntryType.value = isUserOrGroup;
        oCell.appendChild(frmEntryType);
    }

}

//Highlights a row
function highlightRow(epiUserRoleIdentifier, checkboxClicked) {

    var row        = document.getElementById(clientID + '_row_' + epiUserRoleIdentifier);
    var saveInput  = document.getElementById(clientID + '_p_' + epiUserRoleIdentifier + '_save');
    var name       = document.getElementById(clientID + '_name_' + epiUserRoleIdentifier);
    var check      = document.getElementById(clientID + '_check_' + epiUserRoleIdentifier);
    var icon       = document.getElementById(clientID + '_icon_' + epiUserRoleIdentifier);

    if ($(check).hasClass("epi-disabled")) {
        return;
    }

    //Checks if row will be highlighted.
    //Checks against StoreAccess array for changed state.
    if ((checkboxClicked == false && row.className == '') || checkboxClicked) {
        row.className   = EPiSelectedRowCss;
        saveInput.value = 'true';
        name.title      = EPiTranslateAdminSecuritySelectedInfo;
        icon.alt = EPiTranslateAdminSecurityUnmark;
        if (check) {
            check.src = EPiTranslateToolsCheck;
            check.title = EPiTranslateAdminSecuritySelectedInfo;
        }
    } else {
        row.className   = '';
        saveInput.value = '';
        name.title      = EPiTranslateAdminSecurityNotSelectedInfo;
        icon.alt = EPiTranslateAdminSecurityMark;
        if (check) {
            check.src = EPiTranslateToolsCheckOff;
            check.title = EPiTranslateAdminSecurityNotSelectedInfo;
        }
    }
    setButtonsEnableMode();
}

function setButtonsEnableMode() {
    highlightedRows    = 0;
    var table          = document.getElementById(EPiTableAccessRights);

    for (var rowIndex = 1; rowIndex < table.rows.length; rowIndex++) {
        if (table.rows[rowIndex].className == EPiSelectedRowCss) {
            highlightedRows++;
        }
    }

    if (highlightedRows > 0) {
        EnableButtons();
    } else {
        DisableButtons();
    }

    // notify to change button's state when the page MembershipBrowser is open in DOJO DialogWrapper
    _NotifyButtonStateChanged();
}

function DisableButtons() {
    var saveButton = document.getElementById(saveButtonID);
    setToolButtonEnable(saveButton, false);
}

function EnableButtons() {
    var saveButton = document.getElementById(saveButtonID);

    setToolButtonEnable(saveButton, true);

}

function _NotifyButtonStateChanged() {
        // Summary: When this epi-dialog-page's buttons change state, we notify DOJO DialogWrapper

        var saveButton = document.getElementById(saveButtonID);
        var dialog = EPi.GetDialog();  // this will return DOJO LegacyDialog object
        if (dialog) {
            // notify it
            dialog.ButtonChanged(saveButton);
        }
    }

//Highlights all rows in table.
function highlightAll(e) {
    var styleClassName = '';
    var row;

    var check;
    var saveInput;

    for (var name in EPiAccessRightsUserNameCollection) {
        row         = document.getElementById(clientID + '_row_' + name)
        check       = document.getElementById(clientID + '_check_' + name);
        saveInput   = document.getElementById(clientID + '_p_' + name + '_save');

        if (highlightedRows == 1) {
            saveInput.value = 'true'
        } else {
            saveInput.value = ''
        }
        check.src       = tempTranslateToolsCheck;
        check.title     = tempTranslateAdminSecuritySelectedInfo;
        row.className   = tempRowClassName;
    }

    setButtonsEnableMode();
}

function setToolButtonEnable(buttonClientID, enable) {
    EPi.ToolButton.SetEnabled(buttonClientID, enable);
}


//Saves access right state.
//You cannot save if you havent done any changes.
function StoreInitialAccessRights() {
    var table = document.getElementById(EPiTableAccessRights);
    for (var rowIndex = 1; rowIndex < table.rows.length; rowIndex++) {
        EPiAccessArray[rowIndex - 1] = getAccessString(table.rows[rowIndex]);
    }
    setButtonsEnableMode();
}

//Get state to store in array.
function getAccessString(row) {
    var accessString = row.id + ',';
    for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
        var cell = row.cells[cellIndex];
        for (var childIndex = 0; childIndex < cell.childNodes.length; childIndex++) {
            if (cell.childNodes[childIndex].type == 'checkbox') {
                var accessid = cell.childNodes[childIndex].name.split('_')[2];
                if (cell.childNodes[childIndex].checked) {
                    accessString += accessid + '_on,';
                } else {
                    accessString += accessid + '_off,';
                }
            }
        }
    }
    return accessString.substring(0, accessString.length - 1);
}

//When a checkbox is double clicked.
//Sets checkboxes to checked to the given access
function SecEnableAccess(sFieldPrefix, nAccess, epiUserRoleIdentifier) {
    var i;
    var oField;
    for (i = 1; i <= 32; i *= 2) {
        oField = document.getElementById(sFieldPrefix + '_' + i);

        if (oField) {
            oField.checked = (oField.value <= nAccess);
        }
    }

    //This is done because otherwise row will not be selected if state on row is same as onload (StoredSettings)
    highlightRow(epiUserRoleIdentifier, true);

    return false;
}

