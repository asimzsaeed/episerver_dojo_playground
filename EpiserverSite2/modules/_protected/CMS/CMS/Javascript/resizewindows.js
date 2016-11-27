/*
 * resizewindows.js	- JavaScript support routines for EPiServer
 * Copyright (c) 2007 EPiServer AB
*/

var EPi;
if (!EPi) {
    EPi = {};
}
EPi.Resize = {};

//EPi.Resize._targetNode;
//EPi.Resize._horizontalDifference;
//EPi.Resize._verticalDifference;
//EPi.Resize._leftBoundary;
//EPi.Resize._rightBoundary;
//EPi.Resize._topBoundary;
//EPi.Resize._bottomBoundary;
//EPi.Resize._eventSheet;
//EPi.Resize._oDragField;


//Event handlers for resize events
EPi.Resize.HorizontalDragStart = function (e) {
    EPi.Resize._targetNode = this;
    EPi.Resize._AddEventDiv();

    EPi.AddEventListener(document, "mousemove", EPi.Resize._HorizontalDragGo);
    EPi.AddEventListener(document, "mouseup",   EPi.Resize._HorizontalDragStop);

    EPi.Resize._AddDragDiv("horizontalResizeBar", this.offsetHeight, null, EPi.Resize._GetTotalOffsetTop(this), EPi.Resize._GetTotalOffsetLeft(this));
    EPi.Resize._horizontalDifference = e.clientX - EPi.Resize._GetTotalOffsetLeft(this);

    // Make sure the previous and next siblings are visible.
    if (this.previousSibling.style.display == "none") {
        this.previousSibling.style.width = "1px";
        this.previousSibling.style.display = "block";
    }
    if (this.nextSibling.style.display == "none") {
        this.nextSibling.style.width = "1px";
        this.nextSibling.style.display = "block";
    }

    EPi.Resize._leftBoundary = EPi.Resize._GetTotalOffsetLeft(this.previousSibling);
    EPi.Resize._rightBoundary = EPi.Resize._GetTotalOffsetLeft(this.nextSibling) + this.nextSibling.clientWidth;

    // If the right panel is hidden, _rightBoundary calculation is wrong since its leftOffset value is not updated. We use right boundary of the resize handle instead.
    if (EPi.Resize._rightBoundary <= EPi.Resize._leftBoundary) {
        EPi.Resize._rightBoundary = EPi.Resize._GetTotalOffsetLeft(this) + this.clientWidth;
    }
}
EPi.Resize._HorizontalDragGo = function (e) {
    if (EPi.Resize._oDragField) {
        EPi.Resize._oDragField.style.left = EPi.Resize._GetCalculatedXPosition(e) + 'px';
    }
    e.stopPropagation();
    e.preventDefault();
}
EPi.Resize._HorizontalDragStop = function (e) {
    EPi.RemoveEventListener(document, "mousemove", EPi.Resize._HorizontalDragGo);
    EPi.RemoveEventListener(document, "mouseup",   EPi.Resize._HorizontalDragStop);

    var newXPosition = EPi.Resize._GetCalculatedXPosition(e);
    EPi.Resize.ResizeHorizontalFields(newXPosition);

    EPi.Resize._RemoveDragDiv();
    EPi.Resize._RemoveEventDiv();
}

EPi.Resize.VerticalDragStart = function (e) {
    EPi.Resize._targetNode = this;
    EPi.Resize._AddEventDiv();

    EPi.AddEventListener(document, "mousemove", EPi.Resize._VerticalDragGo);
    EPi.AddEventListener(document, "mouseup",   EPi.Resize._VerticalDragStop);

    EPi.Resize._AddDragDiv("verticalResizeBar", null, this.offsetWidth, EPi.Resize._GetTotalOffsetTop(this), EPi.Resize._GetTotalOffsetLeft(this));
    EPi.Resize._verticalDifference = e.clientY - EPi.Resize._GetTotalOffsetTop(this);

    EPi.Resize._topBoundary		= EPi.Resize._GetTopBoundary();
    EPi.Resize._bottomBoundary	= EPi.Resize._GetBottomBoundary();
}
EPi.Resize._VerticalDragGo = function (e) {
    if (EPi.Resize._oDragField) {
        EPi.Resize._oDragField.style.top = EPi.Resize._GetCalculatedYPosition(e) + 'px';
    }
    e.stopPropagation();
    e.preventDefault();
}
EPi.Resize._VerticalDragStop = function (e) {
    EPi.RemoveEventListener(document, "mousemove", EPi.Resize._VerticalDragGo);
    EPi.RemoveEventListener(document, "mouseup", EPi.Resize._VerticalDragStop);

    var newYPosition = EPi.Resize._GetCalculatedYPosition(e);
    EPi.Resize.ResizeVerticalFields(newYPosition);

    EPi.Resize._RemoveDragDiv();
    EPi.Resize._RemoveEventDiv();
}
EPi.Resize._AddEventDiv = function () {
    if (!EPi.Resize._eventSheet) {
        EPi.Resize._eventSheet = document.createElement("div");
        EPi.Resize._eventSheet.className = "eventsheet";
    }
    document.body.appendChild(EPi.Resize._eventSheet);
}
EPi.Resize._RemoveEventDiv = function () {
    document.body.removeChild(EPi.Resize._eventSheet);
}
EPi.Resize._AddDragDiv = function (className, height, width, top, left) {
    if (!EPi.Resize._oDragField) {
        EPi.Resize._oDragField = document.createElement('div');
    }
    EPi.Resize._oDragField.className		= className;
    EPi.Resize._oDragField.style.height		= height;
    EPi.Resize._oDragField.style.width		= width;
    EPi.Resize._oDragField.style.top        = top + "px";
    EPi.Resize._oDragField.style.left       = left + "px";

    document.body.appendChild(EPi.Resize._oDragField);
}
EPi.Resize._RemoveDragDiv = function () {
    document.body.removeChild(EPi.Resize._oDragField);
}

EPi.Resize._GetTotalOffsetTop = function (currentContainer) {
    var totalOffset = 0;
    while (currentContainer) {
        totalOffset += currentContainer.offsetTop;
        currentContainer = currentContainer.offsetParent;
    }
    return totalOffset;
}
EPi.Resize._GetTotalOffsetLeft = function (currentContainer) {
    var totalOffset = 0;
    while (currentContainer) {
        totalOffset += currentContainer.offsetLeft;
        currentContainer = currentContainer.offsetParent;
    }
    return totalOffset;
}
EPi.Resize._GetCalculatedXPosition = function (e) {
    var calculatedNewPosition = e.clientX - EPi.Resize._horizontalDifference;
    if (EPi.Resize._leftBoundary > calculatedNewPosition) {
        return EPi.Resize._leftBoundary;
    } else if (EPi.Resize._rightBoundary < calculatedNewPosition) {
        return EPi.Resize._rightBoundary;
    } else {
        return calculatedNewPosition;
    }
}
EPi.Resize._GetCalculatedYPosition = function (e) {
    var calculatedNewPosition = e.clientY - EPi.Resize._verticalDifference;
    if (EPi.Resize._topBoundary > calculatedNewPosition) {
        return EPi.Resize._topBoundary;
    } else if (EPi.Resize._bottomBoundary < calculatedNewPosition) {
        return EPi.Resize._bottomBoundary;
    } else {
        return calculatedNewPosition;
    }
}
EPi.Resize.ResizeHorizontalFields = function (newXPosition) {
    var newWidth;
    var targetObject;

    if (EPi.Resize._targetNode.nextSibling && EPi.Resize._targetNode.nextSibling.style.width != '') {
        targetObject = EPi.Resize._targetNode.nextSibling;
        newWidth = EPi.Resize._GetTotalOffsetLeft(EPi.Resize._targetNode) + targetObject.offsetWidth - newXPosition;
    } else {
        targetObject = EPi.Resize._targetNode.previousSibling;
        newWidth = newXPosition - EPi.Resize._GetTotalOffsetLeft(EPi.Resize._targetNode.previousSibling);
    }
    if (!targetObject.getAttribute('DefaultWidth')) {
        var defaultWidth = targetObject.style.width;
        targetObject.setAttribute('DefaultWidth', defaultWidth);
    }
    EPi.Resize.HandleNewWidth(targetObject, newWidth);
}

EPi.Resize._GetTopBoundary = function () {
    EPi.Resize._topBoundary = EPi.Resize._GetTotalOffsetTop(EPi.Resize._targetNode.previousSibling);

    if (EPi.Resize._targetNode.previousSibling.getAttribute('requiredheight') != null) {
        var requiredHeight	= new Number(EPi.Resize._targetNode.previousSibling.getAttribute('requiredheight'));
        EPi.Resize._topBoundary = EPi.Resize._topBoundary + requiredHeight;
    }
    return EPi.Resize._topBoundary;
}
EPi.Resize._GetBottomBoundary = function () {
    EPi.Resize._bottomBoundary = EPi.Resize._GetTotalOffsetTop(EPi.Resize._targetNode) + EPi.Resize._targetNode.nextSibling.clientHeight;

    if (EPi.Resize._targetNode.nextSibling.getAttribute('requiredheight') != null) {
        var requiredHeight	= new Number(EPi.Resize._targetNode.nextSibling.getAttribute('requiredheight'));
        EPi.Resize._bottomBoundary = EPi.Resize._bottomBoundary - requiredHeight;
    }
    return EPi.Resize._bottomBoundary;
}
EPi.Resize.ResizeVerticalFields = function (newYPosition) {
    var newHeight;
    var targetObject;

    if (EPi.Resize._targetNode.nextSibling && EPi.Resize._targetNode.nextSibling.style.height != '') {
        targetObject = EPi.Resize._targetNode.nextSibling;
        newHeight = (EPi.Resize._GetTotalOffsetTop(EPi.Resize._targetNode) + targetObject.offsetHeight) - newYPosition;
    } else {
        targetObject = EPi.Resize._targetNode.previousSibling;
        newHeight = newYPosition - EPi.Resize._GetTotalOffsetTop(EPi.Resize._targetNode.previousSibling);
    }
    if (!targetObject.getAttribute('DefaultHeight')) {
        var defaultHeight = targetObject.style.height;
        targetObject.setAttribute('DefaultHeight', defaultHeight);
    }
    EPi.Resize.HandleNewHeight(targetObject, newHeight + 'px');
}
EPi.Resize.ResetHeight = function (e) {
    var targetObject;

    if (EPi.Resize._targetNode.nextSibling && EPi.Resize._targetNode.nextSibling.style.height != '') {
        targetObject = EPi.Resize._targetNode.nextSibling;
    } else if (EPi.Resize._targetNode.previousSibling) {
        targetObject = EPi.Resize._targetNode.previousSibling;
    }

    var defaultHeight = targetObject.getAttribute('DefaultHeight');
    if (defaultHeight != null) {
        EPi.Resize.HandleNewHeight(targetObject, defaultHeight);
    }
}
EPi.Resize.ResetWidth = function (e) {
    var targetObject;

    if (EPi.Resize._targetNode.nextSibling && EPi.Resize._targetNode.nextSibling.style.width != '') {
        targetObject = EPi.Resize._targetNode.nextSibling;
    } else {
        targetObject = EPi.Resize._targetNode.previousSibling;
    }

    var defaultWidth = targetObject.getAttribute('DefaultWidth');
    if (defaultWidth != null) {
        EPi.Resize.HandleNewWidth(targetObject, defaultWidth);
    }
}
EPi.Resize.MinimizeHeight = function (resizeField) {
    EPi.Resize._targetNode = resizeField;
    var targetObject;

    if (EPi.Resize._targetNode.nextSibling && EPi.Resize._targetNode.nextSibling.style.height != '') {
        targetObject = EPi.Resize._targetNode.nextSibling;
    } else if (EPi.Resize._targetNode.previousSibling) {
        targetObject = EPi.Resize._targetNode.previousSibling;
    }

    targetObject.setAttribute('DefaultHeight', 0);
    EPi.Resize.HandleNewHeight(targetObject, 0);
}
EPi.Resize.GiveHeightToAbove = function (resizeField) {
    EPi.Resize._targetNode = resizeField;

    if (EPi.Resize._targetNode.nextSibling) {
        EPi.Resize._bottomBoundary	= EPi.Resize._GetBottomBoundary();
        resizeVerticalFields(EPi.Resize._bottomBoundary);
    }
}
EPi.Resize.StealHeightFromAbove = function (resizeField) {
    EPi.Resize._targetNode = resizeField;

    if (EPi.Resize._targetNode.previousSibling) {
        EPi.Resize._topBoundary	= EPi.Resize._GetTopBoundary();
        resizeVerticalFields(EPi.Resize._topBoundary);
    }
}
EPi.Resize.HandleNewWidth = function (targetObject, newWidth) {
    if (newWidth <= 10) {
        targetObject.style.width = "1px";
        targetObject.style.display = 'none';
    } else {
        targetObject.style.width = newWidth;
        targetObject.style.display = '';
    }
}
EPi.Resize.HandleNewHeight = function (targetObject, newHeight) {
    if (newHeight <= 10) {
        targetObject.style.height = "1px";
        targetObject.style.display = 'none';
    } else {
        var children = targetObject.getElementsByTagName('td');
        for (var i = 0; i < children.length ; i++) {
            children[i].style.height = newHeight;
        }
        targetObject.style.height = newHeight;
        targetObject.style.display = '';
    }
}
