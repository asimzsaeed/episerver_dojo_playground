/*
 * tooltip.js - JavaScript support routines for EPiServer
 * Copyright (c) 2007 EPiServer AB
*/

var EPi;
if (!EPi) {
    EPi = {};
}

EPi.ToolTip = {};

// Private variables
EPi.ToolTip._tooltipDiv = null;
EPi.ToolTip._showTimeout = null;
EPi.ToolTip._displayNode = null;
EPi.ToolTip._contextNode = null;
EPi.ToolTip._initialized = false;
EPi.ToolTip._maxWidth = 250; //max-width does not work in IE6 or Quirksmode

// Public method to show the a tooltip on mouseover event
EPi.ToolTip.MouseOverHandler = function () {
    EPi.ToolTip.Show(this);
}

// Public method to show the a tooltip
// Initializes the hide handler and sets a timeout to show the tool tip after 500 ms.
EPi.ToolTip.Show = function (displayNode, contextNode) {
    if (!contextNode) {
        contextNode = displayNode;
    }

    EPi.ToolTip._displayNode = displayNode;
    EPi.ToolTip._contextNode = contextNode;

    if (!EPi.ToolTip._initialized) {
        EPi.AddEventListener(document, "mouseout", EPi.ToolTip._MouseOut);
        EPi.ToolTip._initialized = true;
    }
    if (EPi.ToolTip._showTimeout != null) {
        window.clearTimeout(EPi.ToolTip._showTimeout);
    }
    EPi.ToolTip._showTimeout = window.setTimeout(EPi.ToolTip._ShowToolTip, 500);
}

EPi.ToolTip.Hide = function () {
    if (EPi.ToolTip._showTimeout != null) {
        window.clearTimeout(EPi.ToolTip._showTimeout);
        EPi.ToolTip._showTimeout = null;
    }
    if (EPi.ToolTip._tooltipDiv) {
        EPi.ToolTip._tooltipDiv.style.display = "none";
    }
}

// Create a new tool tip div element if none is found in the top window
EPi.ToolTip._CreateTooltipDiv = function () {
    var tooltipDiv = window.top.document.getElementById("toolTipDiv");

    if (!tooltipDiv) {
        tooltipDiv = window.top.document.createElement("div");
        tooltipDiv.id = "toolTipDiv";
        tooltipDiv.style.display = "none";
        tooltipDiv.style.position = "absolute";

        window.top.document.body.appendChild(tooltipDiv);
    }

    return tooltipDiv;
}

// Hide the tool tip div and clear any timeout set to display a tool tip.
EPi.ToolTip._MouseOut = function (e) {
    EPi.ToolTip.Hide();
}

// Set the text of the tool tip div and display it
EPi.ToolTip._ShowToolTip = function () {
    if (!EPi.ToolTip._tooltipDiv) {
        EPi.ToolTip._tooltipDiv = EPi.ToolTip._CreateTooltipDiv();
    }
    EPi.ToolTip._tooltipDiv.innerHTML = EPi.GetProperty(EPi.ToolTip._contextNode, "tooltip");

    var xyCoords = EPi.ToolTip._GetOffset(EPi.ToolTip._displayNode);
    var xyScroll = EPi.ToolTip._GetScrollLeftAndTop(EPi.ToolTip._displayNode);

    var left = Math.max(0, xyCoords[0] - xyScroll[0]) + 10;
    EPi.ToolTip._tooltipDiv.style.left = left + "px";
    EPi.ToolTip._tooltipDiv.style.top = xyCoords[1] + EPi.ToolTip._displayNode.offsetHeight - xyScroll[1] + 10 + "px";
    EPi.ToolTip._tooltipDiv.style.width = "auto";
    EPi.ToolTip._tooltipDiv.style.whiteSpace = "nowrap";
    EPi.ToolTip._tooltipDiv.style.wordWrap = "normal";
    EPi.ToolTip._tooltipDiv.style.display = "block";

    if ((xyCoords[1] + EPi.ToolTip._displayNode.offsetHeight - xyScroll[1] + 10 + EPi.ToolTip._tooltipDiv.offsetHeight) > this.document.body.clientHeight) {
        EPi.ToolTip._tooltipDiv.style.top = (xyCoords[1] - EPi.ToolTip._tooltipDiv.offsetHeight - xyScroll[1]) + "px";
    }

    if (EPi.ToolTip._tooltipDiv.offsetWidth > EPi.ToolTip._maxWidth) {
        EPi.ToolTip._tooltipDiv.style.width = EPi.ToolTip._maxWidth + "px";
        EPi.ToolTip._tooltipDiv.style.whiteSpace = "normal";
        EPi.ToolTip._tooltipDiv.style.wordWrap = "break-word";
    }
    var maxLeft = EPi.ToolTip._tooltipDiv.ownerDocument.body.offsetWidth - EPi.ToolTip._tooltipDiv.offsetWidth - 10;
    if (left > maxLeft) {
        EPi.ToolTip._tooltipDiv.style.left = maxLeft + "px";
    }
}

// Get the nodes Offset from the upper left corner of the top most window.
EPi.ToolTip._GetOffset = function (node) {
    var parentOffset = [0, 0];

    if (node.offsetParent) {
        parentOffset = EPi.ToolTip._GetOffset(node.offsetParent);
    } else if (EPi.GetDocumentWindow(node) && EPi.GetDocumentWindow(node).frameElement) {
        // We are in a frame so we get the frames offset in our parent document.
        parentOffset = EPi.ToolTip._GetOffset(EPi.GetDocumentWindow(node).frameElement);
    }

    if (node.nodeType == 9) { // Document
        // The document element has no .offset[Top|Left|...] so we just return the offset from its parent frame.
        return parentOffset;
    }

    return [parentOffset[0] + node.offsetLeft, parentOffset[1] + node.offsetTop];
}

EPi.ToolTip._GetScrollLeftAndTop = function (startNode) {
    var result = [0, 0];
    while (startNode != null) {
        if (startNode.scrollLeft) {
            result[0] += startNode.scrollLeft;
        }
        if (startNode.scrollTop) {
            result[1] += startNode.scrollTop;
        }
        startNode = startNode.parentNode;
    }
    return result;
}
