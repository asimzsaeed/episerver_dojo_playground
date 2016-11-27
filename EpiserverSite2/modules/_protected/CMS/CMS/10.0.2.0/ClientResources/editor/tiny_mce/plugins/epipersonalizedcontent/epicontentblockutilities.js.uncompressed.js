(function(tinymce, $) {
    epiContentBlockUtilities = function() {
        //This is a shared property to ensure that a plug-in does not unlock controls after another plug-in has locked them.
        var controlsLockedBy = null;
        var pub =
    {
        /**
        * Gets the closest parent with the given css class.
        *
        * @param {Node} node The current node.
        * @param {string} cssClass The css class of the element that you want to find.
        */
        _getParentNode: function(node, cssClass) {
            if (this.ed.dom.hasClass(node, cssClass)) {
                return node;
            }
            return this.ed.dom.getParent(node, "." + cssClass);
        },

        /**
        * Enables or disables tinymce command handlers (plug-ins).
        *
        * @param {Bool} enable Set to true to enable all commands or to false to disable unsupported commands for the current selection.
        */
        _updateCommandState: function(enable) {
            // Block or unblock
            if (enable && controlsLockedBy !== null && controlsLockedBy != this) {
                //We don't want to unlock controls if another plug-in has locked them.
                this._disabled = false;
                return true;
            }
            if (enable) {
                if (this._disabled) {
                    //Only enable controls if we are in disable state
                    this._setDisabled(false, this._enabledControls);
                    controlsLockedBy = null;
                }
            } else {
                this._setDisabled(true, this._enabledControls);
                controlsLockedBy = this;
                return false; // Always return false to prevent other plugins listening to nodeChange event from enabling tools.
            }
            return true;
        },

        /**
        * Enables or disables controls of the editor instance if user selects or deselects a content block.
        *
        * @param {bool} disable Set to true if we want to disable controls.
        * @param {string} enabledControls Comma separated string of id's indicating controls which should not be disabled.
        */
        _setDisabled: function(disable, enabledControls) {
            var i,
            buttons = enabledControls.split(",");

            enabledControls = "";
            var prefix = "|" + this.ed.id + "_";
            var length = buttons.length;

            for (i = 0; i < length; i++) {
                enabledControls = enabledControls + prefix + tinymce.trim(buttons[i]);
            }
            enabledControls += "|";

            tinymce.each(this.ed.controlManager.controls, function(control) {
                if (enabledControls.indexOf("|" + control.id + "|") < 0) {
                    control.setDisabled(disable);
                    if (disable) {
                        // There's never a reson for a disabled button to be active for the current selection.
                        control.setActive(false);
                    }
                }
            });

            this._disabled = disable;
        },

        /**
        * Returns a comma separated string with all content groups for the current editor.
        */
        _getAllContentGroups: function() {
            var dynamiccontentNodes = this.ed.dom.select('[data-contentgroup!=]');
            var allContentGroups = '';
            for (var i = 0; i < dynamiccontentNodes.length; i++) {
                var value = dynamiccontentNodes[i].getAttribute("data-contentgroup");
                if (value && value !== '') {
                    if ((allContentGroups == value) || (allContentGroups.indexOf(',' + value) >= 0) || (allContentGroups.indexOf(value + ',') >= 0)) {
                        continue;
                    }
                    if (allContentGroups !== '') {
                        allContentGroups += ',' + value;
                    }
                    else {
                        allContentGroups += value;
                    }
                }
            }
            return allContentGroups;
        },

        /**
        * Add an undo level and trigger nodeChanged event. 
        *
        */
        _onContentChanged: function() {
            this.ed.undoManager.add();
            this.ed.nodeChanged();
        }
    };
        return pub;
    } ();
} (tinymce, epiJQuery));
