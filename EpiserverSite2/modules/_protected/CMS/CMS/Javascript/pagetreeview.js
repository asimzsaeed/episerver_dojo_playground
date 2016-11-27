var EPi;
if (!EPi) {
    EPi = {};
}

/***********************************************/
/** EPi TreeView *******************************/
/***********************************************/

EPi.TreeView = function (treeContainerId) {
    //== Public event callbacks ==//
    this.OnNodeSelected = null; // OnNodeSelected(dataPathId)           : Raised when a tree node is selected.
    this.OnContextMenu = null;  // OnContextMenu(e, contextNode)        : Raised when a context menu event occurs on a tree node.
    this.OnNodeMoved = null;    // OnNodeMoved(sourceDataPathId, destinationDataPathId, controlKeyPressed, dropIndex, sourceParentId) : Raised when a node is dropped on another node.
    this.OnNodeOver = null;     // OnNodeOver(displayNode, contextNode) : Raised when the user enters the container span with the mouse.
    this.OnNodePopulated = null;// OnNodePopulated(dataPathId)          : Raised when the children of a node has been populated from the server.
    this.OnNodeMouseDown = null;// OnNodeMouseDown(e, contextNode)      : Raised when a mouse button is pressed on a tree node.
    //============================//

    //== Config - set by server ==//
    this.MultiSelectEnabled = false;
    this.ForgetNodesOnMinimize = true;
    this.ExpandOnSelect = true;
    this.DragAndDropEnabled = true;
    //============================//

    //== CSS class definitions set by server ==//
    //    this._collapseClass = "collapse";
    //    this._expandClass = "expand";
    //    this._showClass = "show";
    //    this._hideClass = "hide";
    //    this._leafNodeClass = "leafnode";
    //    this._parentNodeClass = "parent";
    //    this._loadClass = "load";
    //    this._templateContainerClass = "templatecontainer";
    //    this._iconClass = "icon";
    //    this._selectedClass = "selected";
    //    this._highlightClass = "highlight";
    //    this._separatorContainerClass = "separatorcontainer";
    //=========================================//

    var _initialized = false;

    this._treeContainer = document.getElementById(treeContainerId);

    // private objects
    this._selectedNodes = new EPi.SelectBuffer();
    this._dragViewer = new EPi.TreeView.DragMarker(this._treeContainer);
    this._setSelected = "";

    this._dragSource = null;    // If dragging; this is a reference to the dragged item
    this._dragActive = false;   // Set to true in drag mode.
    this._dragOverElement = null;  // If dragging; the last element the user dragged over. Makes it possible to abort dragging and remove highlight when Escape is pressed.

    // Private drag start offset position
    this._mdX = 0;
    this._mdY = 0;

    // Private offset position of the treeContainer.
    // Used when calculating the position of dragViewer which is appended to treeContainer.
    // EPi.GetOffset returns an array with xOffset, yOffset.
    this._treeContainerOffset = EPi.GetOffset(this._treeContainer);

    // Called once to initialize the TreeView and set up DOM event listeners.
    this._Init = function (initCallback) {
        if (!_initialized) {
            var self = this;

            EPi.AddEventListener(this._treeContainer, "click", function (e) {
                self.NodeClicked(e)
            });
            EPi.AddEventListener(this._treeContainer, "mousedown", function (e) {
                self.MouseDown(e)
            });
            EPi.AddEventListener(this._treeContainer, "mouseover", function (e) {
                self.MouseOver(e)
            });
            EPi.AddEventListener(this._treeContainer, "mouseout", function (e) {
                self.MouseOut(e)
            });
            EPi.AddEventListener(this._treeContainer, "mouseup", function (e) {
                self.MouseUp(e)
            });
            EPi.AddEventListener(this._treeContainer, "contextmenu", function (e) {
                self.ContextMenu(e)
            });
            EPi.AddEventListener(document, "mousemove", function (e) {
                self.MouseMove(e)
            });
            EPi.AddEventListener(document, "keydown", function (e) {
                self.KeyDown(e)
            });
            EPi.AddEventListener(document, "click", this.DocumentClick);


            this._selectedNodes.addCallback = function (item) {
                self.HighLightNode(item)
            };
            this._selectedNodes.deleteCallback = function (item) {
                self.LowLightNode(item)
            };

            if (this._setSelected != null && this._setSelected != "") {
                var selectedNode = this.GetNodeFromDataPath(this._setSelected);
                if (selectedNode) {
                    this.SelectNode(selectedNode, false);
                }
            }

            if (initCallback != null) {
                initCallback(self);
            }

            // Get the first parent DOM node treeContainer which has scrolling enabled
            // or document.documentElement if no node is found.
            // Used when moving DragViewer.
            this._scrollNode = document.documentElement;
            var overflowStyle;
            var node = this._treeContainer;
            while (node.parentNode) {
                overflowStyle = EPi.GetCurrentStyle(node, "overflow");
                if (overflowStyle == "auto" || overflowStyle == "scroll") {
                    this._scrollNode = node;
                    break;
                }

                node = node.parentNode;
            }

            _initialized = true;
        }
    }
}


/******************************/
/*  Public Methods  ***********/
/******************************/
EPi.TreeView.prototype.NavigateToNode = function (itemDataPath, expandSelectedBranch) {
    if (itemDataPath == null) {
        return;
    }

    // By default other parts of the tree are collapsed and child nodes of the selection are expanded for external navigate requests.
    if (expandSelectedBranch == null) {
        expandSelectedBranch = true;
    }

    var listNode = this.GetListNodes(itemDataPath)[0];

    if (listNode) {
        if (expandSelectedBranch) {
            this.CollapseOtherSiblings(listNode);
            this.ExpandNode(listNode);
        }
        this.ExpandParentNodes(listNode);
        this.SelectNode(listNode, false);
    } else {
        //Set the node as selected in the buffer
        this._selectedNodes.Clear();
        this._selectedNodes.Add(itemDataPath);
        //Populate requested node
        this.DoCallback(this._treeContainer, "select", itemDataPath);
    }
}

EPi.TreeView.prototype.RefreshChildren = function (itemDataPath, newSelection, onComplete) {

    if (newSelection != null) {
        //Set the node as selected in the buffer
        this._selectedNodes.Clear();
        this._selectedNodes.Add(newSelection);
    }

    var nodes = this.GetListNodes(itemDataPath);
    if (nodes.length > 0) {
        for (var i in nodes) {
            var node = nodes[i];
            this.PopulateNode(node, onComplete);
        }
    } else {
        this.DoCallback(this._treeContainer, "select", itemDataPath, onComplete);
    }
}

EPi.TreeView.prototype.RefreshNodeData = function (itemDataPath) {
    var node = this.GetNodeFromDataPath(itemDataPath);
    if (node) {
        this.DoCallback(node, "update", EPi.GetProperty(node, "datapath"));
    }
}

EPi.TreeView.prototype.RefreshParent = function (itemDataPath, onComplete) {
    var nodes = this.GetListNodes(itemDataPath);
    if (nodes.length > 0) {
        for (var i in nodes) {
            var node = nodes[i];
            var parentNode = this.ParentNode(node, "LI");
            if (parentNode != null) {
                this.PopulateNode(parentNode, onComplete);
            }
        }
    } else {
        this.DoCallback(this._treeContainer, "select", itemDataPath, onComplete);
    }
}

EPi.TreeView.prototype.RefreshChildrenIfVisible = function (itemDataPath, onComplete) {
    var node = this.GetNodeFromDataPath(itemDataPath);
    // Refresh if the node is already expanded or if the node doesn't know of any childnodes
    if (node && (this.IsExpanded(node) || !this.CanExpand(node))) {
        this.PopulateNode(node, onComplete);
    }
}

EPi.TreeView.prototype.GetNodeFromDataPath = function (itemDataPath) {
    return this.GetListNodes(itemDataPath)[0];
}

EPi.TreeView.prototype.GetSelectedNodes = function () {
    return this._selectedNodes.GetBuffer();
}

EPi.TreeView.prototype.GetTemplateContainer = function (itemDataPath) {
    var listNode = this.GetListNodes(itemDataPath)[0];
    return this.getContainerNode(listNode);
}

EPi.TreeView.prototype.GetPropertyValue = function (itemDataPath, propertyName) {
    var listNode = this.GetListNodes(itemDataPath)[0];
    if (listNode != null) {
        return EPi.GetProperty(listNode, propertyName, null, false);
    }
    return null;
}

/******************************/
/*  Event handlers  ***********/
/******************************/

EPi.TreeView.prototype.DocumentClick = function (e) {
    // Prevent Open in new tab on Ctrl+Click
    if (e.ctrlKey && e.target.tagName == "A" && this.MultiSelectEnabled) {
        e.preventDefault();
        e.stopPropagation();
    }
}

EPi.TreeView.prototype.ContextMenu = function (e) {
    if (this.OnContextMenu != null) {
        // The context menu event is raised for contextmenu clicks inside the container div,
        // but a valid context node is only supplied for a click inside a container span.
        var spanNode = this.ParentNode(e.target, "SPAN");
        var listNode = (spanNode ? this.ParentNode(spanNode, "LI") : null);
        this.OnContextMenu(e, listNode);
    }
}

EPi.TreeView.prototype.KeyDown = function (e) {
    switch (e.keyCode)
    {
        case 27: // Escape
            this.AbortDrag(e);
            break;
        case 37: // Left Arrow
            this.MoveFocusLeft(e);
            break;
        case 38: // Up Arrow
            this.MoveFocusUp(e);
            break;
        case 39: // Right Arrow
            this.MoveFocusRight(e);
            break;
        case 40: // Down Arrow
            this.MoveFocusDown(e);
            break;
        case 13: // Enter
        case 32: // Space
            this.MouseDown(e);
            this.NodeClicked(e);
            break;
        case 46: // Delete
            break;
    }
}

EPi.TreeView.prototype.NodeClicked = function (e) {
    var spanNode = this.ParentNode(e.target, "SPAN");

    if (EPi.CSSUtility.HasClass(spanNode, this._templateContainerClass) && !(this.MultiSelectEnabled && e.ctrlKey)) {
        var listNode = this.ParentNode(spanNode, "LI");
        var selectedNodeId = this.GetDataPath(listNode);
        var selectable = EPi.GetProperty(listNode, "selectable");

        if (this.ExpandOnSelect) {
            this.ExpandNode(listNode);
        }

        if (selectable && this.OnNodeSelected) {
            // This puts us in a somewhat weird position since highlighting is done on mouse down, and navigation is done on click
            this.OnNodeSelected(selectedNodeId);
        }

        e.preventDefault();
    }
}

EPi.TreeView.prototype.MouseUp = function (e) {

    if (this._dragActive) {
        var destinationSpan = this.ParentOrSelf(e.target, "SPAN");
        var destinationNode = this.ParentNode(destinationSpan, "LI");

        if (destinationNode != null && this._dragSource != null) {
            if (this.OnNodeMoved != null) {
                var dropIndex = null;
                if (EPi.CSSUtility.HasClass(destinationSpan, this._separatorContainerClass)) {
                    // If the destination node is a separator between nodes, the drop position must be calculated
                    var iteratorNode = this.PreviousNode(destinationNode, "LI");
                    // The destination node is the moved one step up in the hierarchy
                    destinationNode = this.ParentNode(destinationNode, "LI");

                    // Iterate over all previous list items and increment the drop position
                    dropIndex = 0;
                    while (iteratorNode != null) {
                        iteratorNode = this.PreviousNode(iteratorNode, "LI");
                        if (iteratorNode !== this._dragSource) {
                            //A node moved after itself is no longer a previous sibling and should not update dropIndex.
                            dropIndex++;
                        }
                    }

                    // If the destination drop container was the one at the very end
                    if (this.PreviousNode(destinationSpan, "SPAN", this._templateContainerClass) != null) {
                        dropIndex++;
                    }
                }
                var sourceId = this.GetDataPath(this._dragSource);
                var destinationId = this.GetDataPath(destinationNode);

                var parentNode = this.ParentNode(this.ParentNode(this._dragSource));
                var sourceParentId = this.GetDataPath(parentNode);
                this.OnNodeMoved(sourceId, destinationId, e.ctrlKey, dropIndex, sourceParentId);
            } else {
                var ulNode = this.FirstChild(destinationNode, "UL");
                if (ulNode == null) {
                    ulNode = document.createElement("UL");
                    destinationNode.appendChild(ulNode);
                }

                ulNode.appendChild(this._dragSource);
                this.ExpandNode(destinationNode);
            }
        }
        this.AbortDrag(e);

    }
    this._dragSource = null;
}

EPi.TreeView.prototype.AbortDrag = function (e) {
    if (this._dragActive) {
        this._dragViewer.Hide();

        if (this._dragOverElement) {
            if (EPi.CSSUtility.HasClass(this._dragOverElement, this._separatorContainerClass)) {
                // Remove indication of drop-between marker
                EPi.CSSUtility.SwapClass(this._dragOverElement, this._highlightClass, "");
            } else {
                var dataPath = this.GetDataPath(this.ParentOrSelf(this._dragOverElement, "LI"));

                if (this._selectedNodes.Find(dataPath) == null) {
                    this.LowLightNode(dataPath);
                }
            }
        }

        this._dragOverElement = null;
        this._dragActive = false;

    }
    this._dragSource = null;
}

EPi.TreeView.prototype.MouseMove = function (e) {
    if (this._dragSource) {
        // If drag has not yet started check mouse movement since the mouse down event to decide if we should initiate dragging.
        if (!this._dragActive && (Math.abs(e.clientX - this._mdX) > 5 || Math.abs(e.clientY - this._mdY) > 5)) {
            // Start dragging
            var containerNode = this.getContainerNode(this._dragSource);
            var nodeText = this.getTextContent(containerNode);

            this._dragViewer.SetText(nodeText);

            this._dragViewer.Show();
            this._dragActive = true;
        }
        if (this._dragActive) {
            var node = this._scrollNode;
            if (e.clientY < 30 && node.scrollTop > 0) {
                if (node == document.documentElement) {
                    window.scrollBy(0, -15);
                } else {
                    node.scrollTop = node.scrollTop - 15;
                }
            } else if (e.clientY + 30 > node.offsetHeight && node.scrollTop + node.offsetHeight < node.scrollHeight) {
                if (node == document.documentElement) {
                    window.scrollBy(0, 15);
                } else {
                    node.scrollTop = node.scrollTop + 15;
                }
            }
            this._dragViewer.Move(e.clientX - this._treeContainerOffset[0] + node.scrollLeft + 2, e.clientY - this._treeContainerOffset[1] + node.scrollTop + 2);
        }
        e.preventDefault();
        e.stopPropagation();
    }
}

EPi.TreeView.prototype.MouseOver = function (e) {
    if (this._dragActive) {
        var targetNode = this.ParentOrSelf(e.target, "SPAN");
        if (EPi.CSSUtility.HasClass(targetNode, this._templateContainerClass)) {
            var listNode = this.ParentNode(targetNode, "LI");
            var dataPath = this.GetDataPath(listNode);
            if (this._selectedNodes.Find(dataPath) == null) {
                this.HighLightNode(dataPath);
                this._dragOverElement = targetNode;
            }
        } else if (EPi.CSSUtility.HasClass(targetNode, this._iconClass)) {
            var listNode = this.ParentNode(e.target, "LI");
            this.ExpandNode(listNode);
        } else if (EPi.CSSUtility.HasClass(targetNode, this._separatorContainerClass)) {
            EPi.CSSUtility.AddClass(targetNode, this._highlightClass);
            this._dragOverElement = targetNode;
        }
    } else if (this.OnNodeOver != null) {
        var targetNode = this.ParentOrSelf(e.target, "SPAN");
        if (EPi.CSSUtility.HasClass(targetNode, this._templateContainerClass)) {
            var listNode = this.ParentNode(targetNode, "LI");
            if (listNode != null) {
                this.OnNodeOver(targetNode, listNode);
            }
        }
    }
}
EPi.TreeView.prototype.MouseOut = function (e) {
    if (this._dragActive) {
        var targetNode = this.ParentOrSelf(e.target, "SPAN");
        if (EPi.CSSUtility.HasClass(targetNode, this._templateContainerClass)) {
            var listNode = this.ParentNode(targetNode, "LI");
            var dataPath = this.GetDataPath(listNode)
            if (this._selectedNodes.Find(dataPath) == null) {
                this.LowLightNode(dataPath);
            }
        } else if (EPi.CSSUtility.HasClass(targetNode, this._separatorContainerClass)) {
            EPi.CSSUtility.SwapClass(targetNode, this._highlightClass, "");
        }

    }
}

EPi.TreeView.prototype.MouseDown = function (e) {
    var sourceNode = e.target;
    if (!sourceNode) {
        return;
    }

    var spanNode = this.ParentOrSelf(sourceNode, "SPAN");
    var listNode = this.ParentNode(spanNode, "LI");

    if (EPi.CSSUtility.HasClass(spanNode, this._iconClass)) {
        //Expand /Collapse
        this.ToggleNode(listNode);
    } else if (EPi.CSSUtility.HasClass(spanNode, this._templateContainerClass)) {
        if (this.DragAndDropEnabled && e.button == 0) {
            //Select Node
            this._mdX = e.clientX;
            this._mdY = e.clientY;
            this._dragSource = listNode;
        }

        if (this.OnNodeMouseDown != null) {
            this.OnNodeMouseDown(e, listNode);
        }

        this.SelectNode(listNode, (e.ctrlKey && this.MultiSelectEnabled));


        if (e.button == 0) {
            // Prevent default behaviour for left button only otherwise the contextmenu event in FF3 on Mac will be prevented.
            e.preventDefault();
        }
    }
}


/******************************/
/*  Keyboard navigation  ******/
/******************************/

EPi.TreeView.prototype.MoveFocusLeft = function (e) {
    var listNode = this.ParentNode(e.target, "LI");
    if (listNode) {
        if (this.IsExpanded(listNode)) {
            this.CollapseNode(listNode);
        } else {
            var parentNode = this.ParentNode(listNode, "LI");
            this.FocusFirstAnchor(parentNode);
        }
    }
}

EPi.TreeView.prototype.MoveFocusRight = function (e) {
    var listNode = this.ParentNode(e.target, "LI");
    if (listNode) {
        if (this.CanExpand(listNode)) {
            this.ExpandNode(listNode);
        } else if (this.IsExpanded(listNode)) {
            this.MoveFocusDown(e);
        }
    }
}

EPi.TreeView.prototype.MoveFocusDown = function (e) {
    var listNode = this.ParentNode(e.target, "LI");
    if (listNode) {
        var nextNode = null;
        if (this.IsExpanded(listNode)) {
            nextNode = this.FirstChild(this.FirstChild(listNode, "UL"), "LI");
        } else {
            nextNode = this.NextNode(listNode, "LI");
        }

        if (!nextNode) {
            var parentNode = listNode;
            while (!nextNode && parentNode) {
                parentNode = this.ParentNode(parentNode, "LI");
                nextNode = this.NextNode(parentNode, "LI");
            }
        }

        if (nextNode) {
            this.FocusFirstAnchor(nextNode);
            return true;
        }
    }
    return false;
}

EPi.TreeView.prototype.MoveFocusUp = function (e) {
    var listNode = this.ParentNode(e.target, "LI");
    if (listNode) {
        var previousNode = this.PreviousNode(listNode, "LI");
        if (!previousNode) {
            previousNode = this.ParentNode(listNode, "LI");
        } else if (this.IsExpanded(previousNode)) {
            // If the previous node is expanded; try to find the last leaf of the last expanded node.
            var baseNode = previousNode;
            do {
                previousNode = baseNode;
                baseNode = this.LastChild(this.FirstChild(baseNode, "UL"), "LI")
            }
            while (baseNode);
        }

        if (previousNode) {
            this.FocusFirstAnchor(previousNode);
            return true;
        }
    }
    return false;
}

EPi.TreeView.prototype.FocusFirstAnchor = function (treeNode) {
    if (!treeNode) {
        return;
    }
    var anchors = treeNode.getElementsByTagName("A");
    if (anchors.length) {
        anchors[0].focus();
    }
}

/******************************/
/*  Node handling  ************/
/******************************/

EPi.TreeView.prototype.GetDataPath = function (listNode) {
    if (listNode == null) {
        return null;
    }

    return listNode.id.substr(listNode.id.indexOf("_", this._treeContainer.id.length) + 1);
}

EPi.TreeView.prototype.GetListNodes = function (dataPath) {
    var rootIdx = 0;
    var noOfRoots = this._treeContainer.children[0].children.length;
    var result = Array();
    while (rootIdx < noOfRoots) {
        var elm = document.getElementById(this._treeContainer.id + rootIdx + "_" + dataPath);
        if (elm != null) {
            result.push(elm);
        }
        rootIdx++;
    }
    return result;
}

EPi.TreeView.prototype.IsExpanded = function (listNode) {
    var span = this.getExpanderNode(listNode);
    return EPi.CSSUtility.HasClass(span, this._collapseClass);
}

EPi.TreeView.prototype.CanExpand = function (listNode) {
    var span = this.getExpanderNode(listNode);
    return EPi.CSSUtility.HasClass(span, this._expandClass);
}

EPi.TreeView.prototype.ToggleNode = function (listNode) {
    if (this.IsExpanded(listNode)) {
        this.CollapseNode(listNode);
    } else {
        this.ExpandNode(listNode);
    }
}

EPi.TreeView.prototype.CollapseNode = function (listNode) {
    if (this.IsExpanded(listNode)) {
        var spanNode = this.getExpanderNode(listNode);
        var ulNode = this.FirstChild(listNode, "UL");
        EPi.CSSUtility.SwapOrAddClass(spanNode, this._collapseClass, this._expandClass);
        if (this.ForgetNodesOnMinimize) { //Forget Node
            EPi.SetProperty(listNode, "state", "populate");
            if (ulNode) {
                listNode.removeChild(ulNode);
            }
        } else {
            EPi.CSSUtility.SwapOrAddClass(ulNode, this._showClass, this._hideClass);
        }
    }
}

EPi.TreeView.prototype.CollapseOtherSiblings = function (listNode) {
    var siblings = listNode.parentNode.childNodes;
    var len = siblings.length;
    for (var i = 0; i < len; i++) {
        if (siblings[i].tagName == "LI" && siblings[i] != listNode) {
            this.CollapseNode(siblings[i]);
        }
    }
    var parentListNode = this.ParentNode(listNode, "LI");
    if (parentListNode != null) {
        this.CollapseOtherSiblings(parentListNode);
    }
}

EPi.TreeView.prototype.ExpandParentNodes = function (listNode) {
    var parentNode = this.ParentNode(listNode, "LI");
    if (parentNode != null) {
        this.ExpandNode(parentNode);
        this.ExpandParentNodes(parentNode);
    }
}

EPi.TreeView.prototype.ExpandNode = function (listNode) {
    if (!this.IsExpanded(listNode) && this.CanExpand(listNode)) {
        var nodeState = EPi.GetProperty(listNode, "state");
        switch (nodeState)
        {
            case "populate": //PopulateNode
                this.PopulateNode(listNode);
                break;
            default:
                var ulNode = this.FirstChild(listNode, "UL");
                var spanNode = this.getExpanderNode(listNode);

                EPi.CSSUtility.SwapOrAddClass(spanNode, this._expandClass, this._collapseClass);
                EPi.CSSUtility.SwapOrAddClass(ulNode, this._hideClass, this._showClass);
        }
    }
}

EPi.TreeView.prototype.PopulateNode = function (listNode, onComplete) {
    var dataPath = EPi.GetProperty(listNode, "datapath");
    var spanNode = this.getExpanderNode(listNode);

    EPi.SetProperty(listNode, "state", "loading");
    EPi.CSSUtility.SwapOrAddClass(spanNode, EPi.CSSUtility.ClassCombine(this._expandClass, this._collapseClass, this._leafNodeClass), this._loadClass);

    this.DoCallback(listNode, "populate", dataPath, onComplete);
}


/******************************/
/*  Callback Population  ******/
/******************************/

EPi.TreeView.prototype.DoCallback = function (contextNode, nodeState, dataPath, onComplete) {
    var contextObject = {
        populationNode: contextNode,
        treeViewObject: this,
        onCompleteCallback: onComplete
    };
    var treeObject = this;
    // Using setTimeout to transfer ownership of the request to the current window.
    // Otherwise, if the request originates from another window (iframe) the request
    // will be aborted in Firefox if the window is unloaded (i.e. a post back occurs).
    window.setTimeout(
        function () {
            _PageTreeView_doCallback(treeObject._treeContainer.id, contextObject, nodeState, dataPath, treeObject.PopulateCallback, treeObject.PopulateErrorCallback);
        }, 0);
}

EPi.TreeView.prototype.PopulateCallback = function (result, contextObject) {
    // Always refer to "treeView" instead of "this" in this method since its called "out of context".
    var contextNode = contextObject["populationNode"];
    var treeView = contextObject["treeViewObject"];

    var newDiv = document.createElement("div");
    newDiv.innerHTML = result;

    var containerList = newDiv.getElementsByTagName("div");
    var scriptContainers = newDiv.getElementsByTagName("script");
    var htmlContainer = null;
    var scriptContainer = null;
    var scriptBlock = null;

    for (var i = 0; i < containerList.length; i++) {
        if (containerList[i].id == "htmlData") {
            htmlContainer = containerList[i];
        }
    }

    // We should only have one script element in scriptContainers array
    // but to be sure we loop through all and find the one with id="scriptData".
    for (var j = 0; j < scriptContainers.length; j++) {
        if (scriptContainers[j].id == "scriptData") {
            scriptContainer = scriptContainers[j];
        }
    }

    // If child nodes are populated a <UL> "collection" is returned.
    var childNodes = treeView.FirstChild(htmlContainer, "UL");
    // If a single nodes data is populated then that nodes LI "container" is returned.
    var treeNode = treeView.FirstChild(htmlContainer, "LI");

    if (childNodes || treeNode) {
        var state = "expanded";

        if (treeNode) {
            // Updating a single nodes template container.
            var existingTemplateContainer = treeView.getContainerNode(contextNode);
            var newTemplateContainer = treeView.getContainerNode(treeNode);

            existingTemplateContainer.parentNode.replaceChild(newTemplateContainer, existingTemplateContainer);

            // Store existing state since this is not changed and the state rendered from server in the script block is not in sync with the actual state.
            state = EPi.GetProperty(contextNode, "state");
        } else {
            // Replacing or adding child nodes
            var spanNode = treeView.getExpanderNode(contextNode);
            var existingChildNodes = treeView.FirstChild(contextNode, "UL");

            if (existingChildNodes) {
                contextNode.replaceChild(childNodes, existingChildNodes);
            } else {
                contextNode.appendChild(childNodes);
                EPi.CSSUtility.SwapOrAddClass(contextNode, treeView._leafNodeClass, treeView._parentNodeClass);
            }
            EPi.CSSUtility.SwapOrAddClass(spanNode, treeView._loadClass, treeView._collapseClass);
        }

        // Parse and execute script properties for the new nodes.
        if (scriptContainer) {
            scriptBlock = eval(scriptContainer.innerHTML);
            if (typeof (scriptBlock) == "function") {
                scriptBlock();
            }
        }

        EPi.SetProperty(contextNode, "state", state);

        // Make sure all selected nodes are marked as selected.
        treeView._selectedNodes.EnsureSelected();
        if (treeView.OnNodePopulated) {
            treeView.OnNodePopulated(treeView.GetDataPath(contextNode));
        }
    } else {
        // No nodes returned; assume we tried to load children for a leaf node.
        var spanNode = treeView.getExpanderNode(contextNode);
        EPi.SetProperty(contextNode, "state", "closed");
        EPi.CSSUtility.SwapClass(spanNode, treeView._collapseClass, "");
        EPi.CSSUtility.SwapOrAddClass(spanNode, treeView._loadClass, treeView._leafNodeClass);
        EPi.CSSUtility.SwapOrAddClass(contextNode, treeView._parentNodeClass, treeView._leafNodeClass);

        // If the target node has child nodes they've been deleted
        var childContainer = treeView.FirstChild(contextNode, "UL");
        if (childContainer) {
            contextNode.removeChild(childContainer);
        }
    }
    if (typeof contextObject.onCompleteCallback === "function") {
        contextObject.onCompleteCallback();
    }

}

EPi.TreeView.prototype.PopulateErrorCallback = function (result, context) {
    if (result.indexOf("not found") != -1) {
        // Node not found
        return;
    }
    alert("Error: " + result);
}


/******************************/
/*  Node selection methods   **/
/******************************/

EPi.TreeView.prototype.HighLightNode = function (dataPath) {
    var nodes = this.GetListNodes(dataPath);
    for (var i in nodes) {
        var node = nodes[i];
        var containerSpan = this.getContainerNode(node);
        if (containerSpan) {
            EPi.CSSUtility.AddClass(containerSpan, this._selectedClass);
        }
    }
}

EPi.TreeView.prototype.LowLightNode = function (dataPath) {
    var nodes = this.GetListNodes(dataPath);
    for (var i in nodes) {
        var node = nodes[i];
        var containerSpan = this.getContainerNode(node);
        if (containerSpan) {
            EPi.CSSUtility.SwapClass(containerSpan, this._selectedClass, "");
        }
    }
}

EPi.TreeView.prototype.SelectNode = function (node, multiSelect) {
    if (!this.HasTagName(node, "LI")) {
        node = this.ParentNode(node, "LI");
    }
    if (!multiSelect) {
        // TODO: Unselect if already selected
        this._selectedNodes.Clear();
    }
    if (!EPi.GetProperty(node, "selectable")) {
        return;
    }

    // Set focus to the first anchor of the last selected node
    this.FocusFirstAnchor(node);

    this._selectedNodes.Add(this.GetDataPath(node));
}


/******************************/
/*  Node traversing helpers  **/
/******************************/

EPi.TreeView.prototype.getTextContent = function (node) {
    if (node.nodeType == 3) { // Type text
        return node.nodeValue;
    } else if (node.nodeType == 1) { // Element
        var childCount = node.childNodes.length;
        var text = "";
        for (var i = 0; i < childCount; i++) {
            text += this.getTextContent(node.childNodes[i]);
        }
        return text;
    }
    return "";
}

EPi.TreeView.prototype.getContainerNode = function (listNode) {
    var node = null;
    if (listNode != null && listNode.tagName == "LI") {
        return this.FirstChild(listNode, "SPAN", this._templateContainerClass);
    }
    return null;
}

EPi.TreeView.prototype.getExpanderNode = function (listNode) {
    if (listNode != null && listNode.tagName == "LI") {
        return this.FirstChild(listNode, "SPAN", this._iconClass);
    }
    return null;
}

EPi.TreeView.prototype.PreviousNode = function (node, tagName, className) {
    if (!node) {
        return null;
    }

    do {
        node = node.previousSibling;
    }
    while (node != null && !this.HasTagNameAndClass(node, tagName, className))

    return node;
}

EPi.TreeView.prototype.NextNode = function (node, tagName, className) {
    if (!node) {
        return null;
    }

    do {
        node = node.nextSibling;
    }
    while (node != null && !this.HasTagNameAndClass(node, tagName, className));

    return node;
}

EPi.TreeView.prototype.LastChild = function (node, tagName, className) {
    if (!node || !node.lastChild) {
        return null;
    }
    node = node.lastChild;
    if (this.HasTagNameAndClass(node, tagName, className)) {
        return node;
    }
    return this.PreviousNode(node, tagName, className);
}

EPi.TreeView.prototype.FirstChild = function (node, tagName, className) {
    if (!node || !node.firstChild) {
        return null;
    }

    node = node.firstChild;
    if (this.HasTagNameAndClass(node, tagName, className)) {
        return node;
    }
    return this.NextNode(node, tagName, className);
}

EPi.TreeView.prototype.ParentNode = function (node, tagName) {
    if (!node) {
        return null;
    }

    do {
        if (node == this._treeContainer) {
            return null;
        }
        node = node.parentNode;
    } while (node != null && !this.HasTagName(node, tagName))

    return node;
}

EPi.TreeView.prototype.ParentOrSelf = function (node, tagName) {
    if (!node) {
        return null;
    }
    if (this.HasTagName(node, tagName)) {
        return node;
    }
    return this.ParentNode(node, tagName);
}

EPi.TreeView.prototype.HasTagName = function (node, tagName) {
    if (tagName == null) {
        return node;
    }
    if (node && node.nodeType == 1) { // Element
        return (node.tagName == tagName.toUpperCase());
    }
    return false;
}

EPi.TreeView.prototype.HasTagNameAndClass = function (node, tagName, className) {
    if (!this.HasTagName(node, tagName)) {
        return false;
    }
    if (typeof className == "string" && !EPi.CSSUtility.HasClass(node, className)) {
        return false;
    }
    return true;
}



/***********************************************/
/** Drag Marker ********************************/
/***********************************************/
EPi.TreeView.DragMarker = function (treeContainer) {
    this._marker = null;
    // treeContainer is the DOM node to append the DragMarker DOM representation to.
    this._Init(treeContainer);
}

EPi.TreeView.DragMarker.prototype._Init = function (treeContainer) {
    if (this._marker == null) {
        // Init drag viewer element
        var elem = document.createElement("div");
        elem.style.display = "none";
        elem.style.position = "absolute";
        elem.className = "dragmarker";
        treeContainer.appendChild(elem);
        this._marker = elem;
    }
}

EPi.TreeView.DragMarker.prototype.Show = function () {
    this._marker.style.display = "block";
}

EPi.TreeView.DragMarker.prototype.Hide = function () {
    this._marker.style.display = "none";
}

EPi.TreeView.DragMarker.prototype.Move = function (x, y) {
    var node = this._marker;
    node.style.top = Math.max(0, y) + "px";
    node.style.left = Math.max(0, x) + "px";
}

EPi.TreeView.DragMarker.prototype.SetText = function (text) {
    this._marker.innerHTML = text;
}



/***********************************************/
/** Select Buffer ******************************/
/***********************************************/

EPi.SelectBuffer = function () {
    this._buffer = new Array();
    this.addCallback = null;
    this.deleteCallback = null;
}

EPi.SelectBuffer.prototype.Add = function (item) {
    if (this.Find(item) == null) {
        this._buffer.push(item);
        this._ExecCallback(this.addCallback, item);
    }
}

EPi.SelectBuffer.prototype.EnsureSelected = function () {
    var len = (this._buffer ? this._buffer.length : 0);
    for (var i = 0; i < len; i++) {
        this._ExecCallback(this.addCallback, this._buffer[i]);
    }
}

EPi.SelectBuffer.prototype._ExecCallback = function (callback, param) {
    if (callback && typeof (callback) == "function") {
        callback(param);
    }
}

EPi.SelectBuffer.prototype.Clear = function () {
    var len = this._buffer.length;
    for (var i = 0; i < len; i++) {
        this._ExecCallback(this.deleteCallback, this._buffer[i]);
    }
    this._buffer = new Array();
}

EPi.SelectBuffer.prototype.Remove = function (item) {
    var index = this.Find(item);
    if (index != null) {
        this._ExecCallback(this.deleteCallback, this._buffer[index]);
        this._buffer.splice(index, 1);
    }
}

EPi.SelectBuffer.prototype.Find = function (item) {
    var len = this._buffer.length;
    for (var i = 0; i < len; i++) {
        if (this._buffer[i] == item) {
            return i;
        }
    }
    return null;
}

EPi.SelectBuffer.prototype.GetBuffer = function () {
    return this._buffer;
}

EPi.SelectBuffer.prototype.Count = function () {
    return this._buffer.length;
}

EPi.SelectBuffer.prototype.toString = function () {
    return this._buffer.join(",");
}

/***********************************************/
/** End Select Buffer **************************/
/***********************************************/


/***********************************************/
/**  Css Helper Methods  ***********************/
/***********************************************/

EPi.CSSUtility = {};

EPi.CSSUtility.CanHaveClass = function (element) {
    return (element != null && element.className != null);
}

EPi.CSSUtility.HasAnyClass = function (element) {
    return (EPi.CSSUtility.CanHaveClass(element) && (element.className.length > 0));
}

//Determine whether a css class is set for an element
// param className is a regualar expression
EPi.CSSUtility.HasClass = function (element, expression) {
    return (expression && expression.toString().length > 0 && EPi.CSSUtility.HasAnyClass(element) && (element.className.match(new RegExp(expression,"i")) != null));
}

EPi.CSSUtility.SwapOrAddClass = function (element, oldClass, newClass) {
    if (EPi.CSSUtility.HasClass(element, oldClass)) {
        EPi.CSSUtility.SwapClass(element, oldClass, newClass);
    } else {
        EPi.CSSUtility.AddClass(element, newClass);
    }
}

EPi.CSSUtility.SwapClass = function (element, oldClass, newClass) {
    if (oldClass && oldClass.toString().length > 0 && EPi.CSSUtility.HasAnyClass(element)) {
        element.className = element.className.replace(new RegExp(oldClass, "gi"), newClass);
    }
}

EPi.CSSUtility.AddClass = function (element, classToAdd) {
    if (EPi.CSSUtility.HasAnyClass(element)) {
        if (!EPi.CSSUtility.HasClass(element, classToAdd)) {
            element.className = element.className + " " + classToAdd;
        }
    } else if (EPi.CSSUtility.CanHaveClass(element)) {
        element.className = classToAdd;
    }
}

EPi.CSSUtility.ClassCombine = function () {
    var classNames = "";
    for (var i = 0; i < arguments.length; i++) {
        classNames += "|" + arguments[i];
    }
    return (classNames.length ? classNames.substr(1) : classNames);
}



/***********************************************/
/**  End Css Helper Methods  *******************/
/***********************************************/
