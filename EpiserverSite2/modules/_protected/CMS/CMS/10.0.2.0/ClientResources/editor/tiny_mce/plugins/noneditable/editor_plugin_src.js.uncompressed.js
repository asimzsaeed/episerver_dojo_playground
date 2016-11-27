(function () {
    var TreeWalker = tinymce.dom.TreeWalker;
    var externalName = 'contenteditable', internalName = 'data-mce-' + externalName;
    var VK = tinymce.VK;

    function handleContentEditableSelection(ed) {
        var dom = ed.dom, selection = ed.selection, invisibleChar, caretContainerId = 'mce_noneditablecaret', invisibleChar = '\uFEFF';
        var previousDirection, movedIn;

        // Returns the content editable state of a node "true/false" or null
        function getContentEditable(node) {
            var contentEditable;

            // Ignore non elements
            if (node.nodeType === 1) {
                // Check for fake content editable
                contentEditable = node.getAttribute(internalName);
                if (contentEditable && contentEditable !== "inherit") {
                    return contentEditable;
                }

                // Check for real content editable
                contentEditable = node.contentEditable;
                if (contentEditable !== "inherit") {
                    return contentEditable;
                }
            }

            return null;
        };

        // Returns the noneditable parent or null if there is a editable before it or if it wasn't found
        function getNonEditableParent(node) {
            var state;

            while (node) {
                state = getContentEditable(node);
                if (state) {
                    return state === "false" ? node : null;
                }

                node = node.parentNode;
            }
        };

        // Returns the editable parent or null if there is a editable before it or if it wasn't found
        function getEditableParent(node) {
            var state;

            while (node) {
                state = getContentEditable(node);
                if (state) {
                    return state === "true" ? node : null;
                }

                node = node.parentNode;
            }
        };

        // Get caret container parent for the specified node
        function getParentCaretContainer(node) {
            while (node) {
                if (node.id === caretContainerId) {
                    return node;
                }

                node = node.parentNode;
            }
        };

        // Finds the first text node in the specified node
        function findFirstTextNode(node) {
            var walker;

            if (node) {
                walker = new TreeWalker(node, node);

                for (node = walker.current(); node; node = walker.next()) {
                    if (node.nodeType === 3) {
                        return node;
                    }
                }
            }
        };

        // Insert caret container before/after target or expand selection to include block
        function insertCaretContainerOrExpandToBlock(target, before) {
            var caretContainer, rng;

            // Select block
            if (getContentEditable(target) === "false") {
                if (dom.isBlock(target)) {
                    selection.select(target);
                    return;
                }
            }

            rng = dom.createRng();

            if (getContentEditable(target) === "true") {
                if (!target.firstChild) {
                    target.appendChild(ed.getDoc().createTextNode('\u00a0'));
                }

                target = target.firstChild;
                before = true;
            }

            //caretContainer = dom.create('span', {id: caretContainerId, 'data-mce-bogus': true, style:'border: 1px solid red'}, invisibleChar);
            caretContainer = dom.create('span', { id: caretContainerId, 'data-mce-bogus': true }, invisibleChar);

            if (before) {
                target.parentNode.insertBefore(caretContainer, target);
            } else {
                dom.insertAfter(caretContainer, target);
            }

            rng.setStart(caretContainer.firstChild, 1);
            rng.collapse(true);
            selection.setRng(rng);

            return caretContainer;
        };

        // Removes any caret container except the one we might be in
        function removeCaretContainer(caretContainer) {
            var child, currentCaretContainer, lastContainer;

            if (caretContainer) {
                rng = selection.getRng(true);
                rng.setStartBefore(caretContainer);
                rng.setEndBefore(caretContainer);

                child = findFirstTextNode(caretContainer);
                if (child && child.nodeValue.charAt(0) == invisibleChar) {
                    child = child.deleteData(0, 1);
                }

                dom.remove(caretContainer, true);

                selection.setRng(rng);
            } else {
                currentCaretContainer = getParentCaretContainer(selection.getStart());
                while ((caretContainer = dom.get(caretContainerId)) && caretContainer !== lastContainer) {
                    if (currentCaretContainer !== caretContainer) {
                        child = findFirstTextNode(caretContainer);
                        if (child && child.nodeValue.charAt(0) == invisibleChar) {
                            child = child.deleteData(0, 1);
                        }

                        dom.remove(caretContainer, true);
                    }

                    lastContainer = caretContainer;
                }
            }
        };

        // Modifies the selection to include contentEditable false elements or insert caret containers
        function moveSelection(ed, e) {
            var nonEditableStart, nonEditableEnd, isCollapsed, rng, element;
            var selectionStart, selectionEnd;

            previousDirection = (!e ? false : (e.keyCode == VK.LEFT || e.keyCode == VK.UP));

            // Checks if there is any contents to the left/right side of caret returns the noneditable element or any editable element if it finds one inside
            function hasSideContent(element, left) {
                var container, offset, walker, node, len;

                container = rng.startContainer;
                offset = rng.startOffset;

                // If endpoint is in middle of text node then expand to beginning/end of element
                if (container.nodeType == 3) {
                    len = container.nodeValue.length;
                    if ((offset > 0 && offset < len) || (left ? offset == len : offset == 0)) {
                        return;
                    }
                } else {
                    // Can we resolve the node by index
                    if (offset < container.childNodes.length) {
                        // Browser represents caret position as the offset at the start of an element. When moving right
                        // this is the element we are moving into so we consider our container to be child node at offset-1
                        var pos = !left && offset > 0 ? offset - 1 : offset;
                        container = container.childNodes[pos];
                        if (container.hasChildNodes()) {
                            container = container.firstChild;
                        }
                    } else {
                        // If not then the caret is at the last position in it's container and the caret container should be inserted after the noneditable element
                        return !left ? element : null;
                    }
                }

                // Walk left/right to look for contents
                walker = new TreeWalker(container, element);
                while (node = walker[left ? 'prev' : 'next']()) {
                    if (node.nodeType === 3 && node.nodeValue.length > 0) {
                        return;
                    } else if (getContentEditable(node) === "true") {
                        // Found contentEditable=true element return this one to we can move the caret inside it
                        // return node;
                    }
                }

                return element;
            };

            // Remove any existing caret containers
            removeCaretContainer();

            // Get noneditable start/end elements
            isCollapsed = selection.isCollapsed();

            //------------------------------------------------------------
            // Start EPiServer's enhancements.
            //------------------------------------------------------------

            selectionStart = selection.getStart();
            selectionEnd = selection.getEnd();

            nonEditableStart = getNonEditableParent(selectionStart);
            nonEditableEnd = getNonEditableParent(selectionEnd);

            function tryToPlaceCursorBeforeNonEditable(startNode) {
                // If there are only empty text nodes before a non-editable content, then Chrome will automatically
                // move the cursor to the first found text node, which will be the one inside the non-editable content.

                // Look for the first element or non-empty text node
                var nonEditable, node, walker = new TreeWalker(startNode, startNode);
                for (node = walker.next(); node; node = walker.next()) {
                    if (node.nodeType !== 3 || node.length > 0) {
                        break;
                    }
                }

                // If it's a non-editable node, then place the cursor to the left of it
                nonEditable = getNonEditableParent(node);
                if (nonEditable) {
                    insertCaretContainerOrExpandToBlock(nonEditable, true);
                }
            }

            // When pressing enter just before an inline DC in Chrome, the cursor is positioned before the DC title.
            if (!(nonEditableStart || nonEditableEnd) && e && e.keyCode === VK.ENTER) {
                tryToPlaceCursorBeforeNonEditable(selectionStart);
            }

            //------------------------------------------------------------
            // End EPiServer's enhancements.
            //------------------------------------------------------------


            // Is any fo the range endpoints noneditable
            if (nonEditableStart || nonEditableEnd) {
                rng = selection.getRng(true);

                // If it's a caret selection then look left/right to see if we need to move the caret out side or expand
                if (isCollapsed) {
                    nonEditableStart = nonEditableStart || nonEditableEnd;
                    var start = selection.getStart();
                    if (element = hasSideContent(nonEditableStart, true)) {
                        // We have no contents to the left of the caret then insert a caret container before the noneditable element
                        insertCaretContainerOrExpandToBlock(element, true);
                    } else if (element = hasSideContent(nonEditableStart, false)) {
                        // We have no contents to the right of the caret then insert a caret container after the noneditable element
                        insertCaretContainerOrExpandToBlock(element, false);
                    } else {
                        // We are in the middle of a noneditable so expand to select it
                        selection.select(nonEditableStart);
                    }
                } else {
                    rng = selection.getRng(true);

                    // Expand selection to include start non editable element
                    if (nonEditableStart) {
                        rng.setStartBefore(nonEditableStart);
                    }

                    // Expand selection to include end non editable element
                    if (nonEditableEnd) {
                        rng.setEndAfter(nonEditableEnd);
                    }

                    selection.setRng(rng);
                }
            } else {
                movedIn = ed !== undefined && isCollapsed && (getEditableParent(selection.getStart()) !== ed.getBody());
            }
        };

        function handleKey(ed, e) {
            var keyCode = e.keyCode, nonEditableParent, caretContainer, startElement, endElement;

            function getNonEmptyTextNodeSibling(node, prev) {
                while (node = node[prev ? 'previousSibling' : 'nextSibling']) {
                    if (node.nodeType !== 3 || node.nodeValue.length > 0) {
                        return node;
                    }
                }
            };

            function positionCaretOnElement(element, start) {
                selection.select(element);
                selection.collapse(start);
            }

            function canDelete(backspace) {
                var rng, container, offset, nonEditableParent;

                function removeNodeIfNotParent(node) {
                    var parent = container;

                    while (parent) {
                        if (parent === node) {
                            return;
                        }

                        parent = parent.parentNode;
                    }

                    dom.remove(node);
                    ed.undoManager.add();
                    moveSelection();
                }

                function isNextPrevTreeNodeNonEditable() {
                    var node, walker, nonEmptyElements = ed.schema.getNonEmptyElements();

                    walker = new tinymce.dom.TreeWalker(container, ed.getBody());
                    while (node = (backspace ? walker.prev() : walker.next())) {
                        // Found IMG/INPUT etc
                        if (nonEmptyElements[node.nodeName.toLowerCase()]) {
                            break;
                        }

                        // Found text node with contents
                        if (node.nodeType === 3 && tinymce.trim(node.nodeValue).length > 0) {
                            break;
                        }

                        // Found non editable node
                        if (getContentEditable(node) === "false") {
                            removeNodeIfNotParent(node);
                            return true;
                        }
                    }

                    // Check if the content node is within a non editable parent
                    if (getNonEditableParent(node)) {
                        return true;
                    }

                    return false;
                }

                if (selection.isCollapsed()) {
                    rng = selection.getRng(true);
                    container = rng.startContainer;
                    offset = rng.startOffset;
                    container = getParentCaretContainer(container) || container;

                    // Is in noneditable parent
                    if (nonEditableParent = getNonEditableParent(container)) {
                        removeNodeIfNotParent(nonEditableParent);
                        return false;
                    }

                    // Check if the caret is in the middle of a text node
                    if (container.nodeType == 3 && (backspace ? offset > 0 : offset < container.nodeValue.length)) {
                        return true;
                    }

                    // Resolve container index
                    if (container.nodeType == 1) {
                        container = container.childNodes[offset] || container;
                    }

                    // Check if previous or next tree node is non editable then block the event
                    if (isNextPrevTreeNodeNonEditable()) {
                        return false;
                    }

                    //------------------------------------------------------------
                    // Start EPiServer's enhancements.
                    //------------------------------------------------------------
                    //
                    // If the selection is a complete paragraph, then the previous check fails since it will search
                    // inside the paragraph rather than the text of the following paragraph.
                    // Make a second attempt with the container as the last node of the paragraph.
                    if (container.nodeType != 3) {
                        container = container.lastChild;
                        if (isNextPrevTreeNodeNonEditable()) {
                            return false;
                        }
                    }
                    //------------------------------------------------------------
                    // End EPiServer's enhancements.
                    //------------------------------------------------------------
                }

                return true;
            }

            startElement = selection.getStart()
            endElement = selection.getEnd();

            // Disable all key presses in contentEditable=false except delete or backspace
            nonEditableParent = getNonEditableParent(startElement) || getNonEditableParent(endElement);
            if (nonEditableParent && (keyCode < 112 || keyCode > 124 || keyCode === VK.ENTER)) {
                // Is Ctrl+c, Ctrl+v or Ctrl+x then use default browser behavior
                if ((tinymce.isMac ? e.metaKey : e.ctrlKey) && (keyCode == 67 || keyCode == 88 || keyCode == 86)) {
                    return;
                }

                e.preventDefault();

                // Arrow left/right select the element and collapse left/right
                if (keyCode == VK.LEFT || keyCode == VK.UP || keyCode == VK.RIGHT || keyCode == VK.DOWN) {
                    var left = (keyCode == VK.LEFT) || (keyCode == VK.UP);
                    // If a block element find previous or next element to position the caret
                    if (ed.dom.isBlock(nonEditableParent)) {
                        var movingIn = !movedIn && (previousDirection === left);

                        var targetElement, walker, temp;
                        if (movingIn && nonEditableParent.childNodes.length) {
                            walker = new TreeWalker(nonEditableParent.firstChild, nonEditableParent);
                            while (temp = walker.next()) {
                                if (ed.dom.getAttrib(temp, internalName) === "true") {
                                    targetElement = temp;
                                    break;
                                }
                            }
                        }

                        if (!targetElement) {
                            targetElement = left ? nonEditableParent.previousSibling : nonEditableParent.nextSibling;
                            movedIn = false;
                        } else {
                            movedIn = true;
                        }

                        walker = new TreeWalker(targetElement, targetElement);
                        var caretElement = left ? walker.prev() : walker.next();

                        positionCaretOnElement(caretElement, !left);
                    } else {
                        insertCaretContainerOrExpandToBlock(nonEditableParent, left);
                    }
                } else if (keyCode === VK.DELETE || keyCode === VK.BACKSPACE || keyCode === VK.ENTER) {
                    dom.remove(nonEditableParent);
                }
            } else {
                // Is arrow left/right, backspace or delete
                if (keyCode == VK.LEFT || keyCode == VK.RIGHT || keyCode == VK.BACKSPACE || keyCode == VK.DELETE) {
                    caretContainer = getParentCaretContainer(startElement);
                    if (caretContainer) {
                        // Arrow left or backspace
                        if (keyCode == VK.LEFT || keyCode == VK.BACKSPACE) {
                            nonEditableParent = getNonEmptyTextNodeSibling(caretContainer, true);

                            if (nonEditableParent && getContentEditable(nonEditableParent) === "false") {
                                e.preventDefault();

                                if (keyCode == VK.LEFT) {
                                    positionCaretOnElement(nonEditableParent, true);
                                } else {
                                    dom.remove(nonEditableParent);
                                    return;
                                }
                            } else {
                                //------------------------------------------------------------
                                // Start EPiServer's enhancements.
                                //------------------------------------------------------------
                                if (keyCode == VK.BACKSPACE) {
                                    // When the cursor is positioned immediately before an inline DC which is alone on a line,
                                    // the container span integrity is broken in chrome. Putting a bogus node after solves the problem.
                                    // The bogus node is automatically removed by removeCaretContainer in moveSelection
                                    var cc = dom.create('span', { id: caretContainerId, 'data-mce-bogus': true }, invisibleChar);
                                    dom.insertAfter(cc, caretContainer.nextSibling);
                                }
                                //------------------------------------------------------------
                                // End EPiServer's enhancements.
                                //------------------------------------------------------------

                                removeCaretContainer(caretContainer);
                            }
                        }

                        // Arrow right or delete
                        if (keyCode == VK.RIGHT || keyCode == VK.DELETE) {
                            nonEditableParent = getNonEmptyTextNodeSibling(caretContainer);

                            if (nonEditableParent && getContentEditable(nonEditableParent) === "false") {
                                e.preventDefault();

                                if (keyCode == VK.RIGHT) {
                                    positionCaretOnElement(nonEditableParent, false);
                                } else {
                                    dom.remove(nonEditableParent);
                                    return;
                                }
                            } else {
                                removeCaretContainer(caretContainer);
                            }
                        }
                    }

                    if ((keyCode == VK.BACKSPACE || keyCode == VK.DELETE) && !canDelete(keyCode == VK.BACKSPACE)) {
                        e.preventDefault();
                        return false;
                    }
                }
            }
        };

        ed.onMouseDown.addToTop(function (ed, e) {
            var node = ed.selection.getNode();

            if (getContentEditable(node) === "false" && node == e.target) {
                // Expand selection on mouse down we can't block the default event since it's used for drag/drop
                moveSelection();
            }
        });

        ed.onMouseUp.addToTop(moveSelection);
        ed.onKeyDown.addToTop(handleKey);
        ed.onKeyUp.addToTop(moveSelection);

        //------------------------------------------------------------
        // Start EPiServer's enhancements.
        //------------------------------------------------------------

        // FIX 1: Prevent drop or paste onto noneditable content
        // REASON: Tinymce noneditable does not care about pasting or dragging onto noneditable areas.
        function preventDropAndPaste(e) {
            var target = e.srcElement || e.originalTarget;

            //if target is editor's body
            if (target === ed.getBody()) {
                //drop target can be the caret node
                target = ed.selection.isCollapsed() ? ed.selection.getNode() : target;
            }

            //prevent dropping inside noneditable
            if (getNonEditableParent(target)) {
                ed.dom.events.cancel(e);
                return false;
            }
        };
        ed.dom.bind(ed.getBody(), "drop", preventDropAndPaste);
        ed.dom.bind(ed.getBody(), "paste", preventDropAndPaste);

        // FIX 2: Disable control selection on IE
        // REASON: Our noneditable blocks' structure contain some floating/absolute positioned elements. 
        //         Which would be treated as editable object in IE so it enables control selection on them.
        var doc = ed.getDoc();
        if (doc.attachEvent) {
            doc.attachEvent('oncontrolselect', function (e) {
                if (getNonEditableParent(e.srcElement)) {
                    return false;
                }
            });
        }

        // FIX 3: Ignore selection normalization
        // REASON: When selection change, if the common ancestor was body, tinymce would try to move selection into the nearest text node. 
        //         That would break the integrity of noneditable blocks on copy/paste, deletion, as well as dnd.
        var originalNormalize = ed.selection.normalize;
        ed.selection.normalize = function () {
            var rng = ed.selection.getRng(),
                body = dom.getRoot();

            if (rng.startContainer !== body || rng.endContainer !== body) {
                return originalNormalize.apply(this, arguments);
            }

            var container = rng.startContainer,
                offset = rng.startOffset,
                selectedNode = container.childNodes[Math.min(offset, container.childNodes.length - 1)];

            if (getNonEditableParent(selectedNode)) {
                // Selection are enclosing noneditable block, leave it as it is.
                return;
            }

            return originalNormalize.apply(this, arguments);
        }

        // FIX 4: Prevent insert content programmatically onto non-editable areas.
        ed.onBeforeExecCommand.add(function (ed, cmd, ui, value, args) {

            if (cmd === "mceInsertContent" && ed.selection.isCollapsed()) {
                var target = ed.selection.getNode();
                if (getNonEditableParent(target)) {
                    args.terminate = true;
                }
            }
        });

        //------------------------------------------------------------
        //End EPiServer's enhancement.
        //------------------------------------------------------------
    };

    tinymce.create('tinymce.plugins.NonEditablePlugin', {
        init: function (ed, url) {
            var editClass, nonEditClass, nonEditableRegExps;

            // Converts configured regexps to noneditable span items
            function convertRegExpsToNonEditable(ed, args) {
                var i = nonEditableRegExps.length, content = args.content, cls = tinymce.trim(nonEditClass);

                // Don't replace the variables when raw is used for example on undo/redo
                if (args.format == "raw") {
                    return;
                }

                while (i--) {
                    content = content.replace(nonEditableRegExps[i], function (match) {
                        var args = arguments, index = args[args.length - 2];

                        // Is value inside an attribute then don't replace
                        if (index > 0 && content.charAt(index - 1) == '"') {
                            return match;
                        }

                        return '<span class="' + cls + '" data-mce-content="' + ed.dom.encode(args[0]) + '">' + ed.dom.encode(typeof (args[1]) === "string" ? args[1] : args[0]) + '</span>';
                    });
                }

                args.content = content;
            };

            editClass = " " + tinymce.trim(ed.getParam("noneditable_editable_class", "mceEditable")) + " ";
            nonEditClass = " " + tinymce.trim(ed.getParam("noneditable_noneditable_class", "mceNonEditable")) + " ";

            // Setup noneditable regexps array
            nonEditableRegExps = ed.getParam("noneditable_regexp");
            if (nonEditableRegExps && !nonEditableRegExps.length) {
                nonEditableRegExps = [nonEditableRegExps];
            }

            ed.onPreInit.add(function () {
                handleContentEditableSelection(ed);

                if (nonEditableRegExps) {
                    ed.selection.onBeforeSetContent.add(convertRegExpsToNonEditable);
                    ed.onBeforeSetContent.add(convertRegExpsToNonEditable);
                }

                // Apply contentEditable true/false on elements with the noneditable/editable classes
                ed.parser.addAttributeFilter('class', function (nodes) {
                    var i = nodes.length, className, node;

                    while (i--) {
                        node = nodes[i];
                        className = " " + node.attr("class") + " ";

                        if (className.indexOf(editClass) !== -1) {
                            node.attr(internalName, "true");
                        } else if (className.indexOf(nonEditClass) !== -1) {
                            node.attr(internalName, "false");
                        }
                    }
                });

                // Remove internal name
                ed.serializer.addAttributeFilter(internalName, function (nodes, name) {
                    var i = nodes.length, node;

                    while (i--) {
                        node = nodes[i];

                        if (nonEditableRegExps && node.attr('data-mce-content')) {
                            node.name = "#text";
                            node.type = 3;
                            node.raw = true;
                            node.value = node.attr('data-mce-content');
                        } else {
                            node.attr(externalName, null);
                            node.attr(internalName, null);
                        }
                    }
                });

                // Convert external name into internal name
                ed.parser.addAttributeFilter(externalName, function (nodes, name) {
                    var i = nodes.length, node;

                    while (i--) {
                        node = nodes[i];
                        node.attr(internalName, node.attr(externalName));
                        node.attr(externalName, null);
                    }
                });
            });
        },

        getInfo: function () {
            return {
                longname: 'Non editable elements',
                author: 'Moxiecode Systems AB',
                authorurl: 'http://tinymce.moxiecode.com',
                infourl: 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/noneditable',
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('noneditable', tinymce.plugins.NonEditablePlugin);
})();
