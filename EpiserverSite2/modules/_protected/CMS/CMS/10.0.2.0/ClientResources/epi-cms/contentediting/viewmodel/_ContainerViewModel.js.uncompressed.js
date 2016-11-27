define("epi-cms/contentediting/viewmodel/_ContainerViewModel", [
    "dojo/_base/array",
    "dojo/_base/declare",
    "./_ViewModelMixin"
], function (array, declare, _ViewModelMixin) {

    return declare([_ViewModelMixin], {
        // tags:
        //      internal

        constructor: function () {
            this._data = [];
            this._handles = {};
        },

        addChild: function (child, index) {
            // summary:
            //      Adds a child to the view model at the given index or at the end of the collection.
            // child: Object
            //      The child to be added.
            // index: Number?
            //      The index where to the child will be inserted.
            // tags:
            //      public

            child.set("parent", this);
            child.set("readOnly", this.readOnly);

            if (!child.id) {
                // Set the id property to the contentLink or group name so that we have unique children.
                child.id = this._hash(child);
            }

            if (typeof index == "number") {
                this._data.splice(index, 0, child);
            } else {
                this._data.push(child);
            }

            this._emitChildrenChanged();
        },

        getChild: function (item) {
            // summary:
            //      Get the first child whose properties match the properties on the given item.
            // tags:
            //      public
            var children = this._data;

            for (var i = children.length - 1; i >= 0; i--) {
                if (children[i].equals(item)) {
                    return children[i];
                }
            }

            return null;
        },

        getChildById: function (id) {
            //TODO: Consider removing this
            var children = this._data;

            for (var i = children.length - 1; i >= 0; i--) {
                if (children[i].id === id) {
                    return children[i];
                }
            }

            return null;
        },

        getChildByIndex: function (index) {
            // summary:
            //      Return the indexed child.
            // tags:
            //      public
            return this._data[index];
        },

        getChildren: function () {
            // summary:
            //      Get the children of the view model.
            // tags:
            //      public
            return this._data;
        },

        removeChild: function (child, recursive) {
            // summary:
            //      Remove a child from the view model.
            // tags:
            //      public
            var index = this.indexOf(child),
                handles = this._handles[child.id];

            if (index < 0 && recursive) {
                array.forEach(this.getChildren(), function (item) {
                    if (typeof item.removeChild === "function") {
                        item.removeChild(child, recursive);
                    }
                });
                return;
            } else if (index < 0) {
                return;
            }

            if (handles) {
                array.forEach(handles, function (handle) {
                    handle.remove();
                });
                delete this._handles[child.id];
            }

            this._data.splice(index, 1);

            this._emitChildrenChanged();
        },

        move: function (child, index) {
            // summary:
            //      Moves the child to a specific index
            // child: Object
            //      The child to be moved.
            // index: Number
            //      The index where to the child will be moved to.
            // tags:
            //      public
            var sourceIndex = this.indexOf(child);

            // Remove the child
            this._data.splice(sourceIndex, 1);

            // Insert it again at the new index
            this._data.splice(index, 0, child);

            this._emitChildrenChanged();
        },

        indexOf: function (child) {
            // summary:
            //      Returns the index of the child in the list of children
            // child: Object
            //      The child to find the index for
            return this._data.indexOf(child);
        },

        _hash: function (child) {
            // summary:
            //      Creates a hash for the given child.
            // tags:
            //      abstract
        },

        _readOnlySetter: function (readOnly) {
            this.readOnly = readOnly;

            array.forEach(this.getChildren(), function (child) {
                child.set("readOnly", readOnly);
            }, this);
        },

        _emitChildrenChanged: function (sender) {
            // summary:
            //      Emits children changed event
            // sender: Object?
            //      The sender
            // tags:
            //      protected, internal

            var length = this._data.length;
            array.forEach(this._data, function (child, index) {
                child.set("canMoveNext", index < (length - 1));
                child.set("canMovePrevious", index > 0 && index <= (length - 1));
                child.set("hasSiblings", length > 1);
            });

            this.set("count", length || 0);

            this.emit("childrenChanged", sender ? sender : this);
        }
    });
});
