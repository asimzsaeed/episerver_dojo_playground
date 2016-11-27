// **************************
// ImageOperation object
// **************************
function ImageOperation(command, width, height, top, left, angle) {
    /// <summary>Initilizes a new instance of an image operation</summary>
    /// <param name="command">Name of the image operation to preform.</param>
    /// <param name="width">Width of a clipping rectangle or new image width when resizing.</param>
    /// <param name="height">Height of a clipping rectangle or new image width when resizing.</param>
    /// <param name="top">Top offset of a clipping rectangle.</param>
    /// <param name="left">Left offset of a clipping rectangle</param>
    /// <param name="angle">Angle when rotating. Must be a positive integer. (eg. 90, 180 or 270).</param>
    /// <remarks>
    /// This object is "deserialized" into the struct EPiServer.UI.Edit.ImageEditor.Core.ImageOperation on the server.
    /// </remarks>

    this.command = command;
    this.width = (width ? width : 0);
    this.height = (height ? height : 0);
    this.top = (top ? top : 0);
    this.left = (left ? left : 0);
    this.angle = (angle ? angle : 0);
}

ImageOperation.prototype.Serialize = function () {
    /// <summary>Serializes the image operation to a test representation that can be transfered to the server.</summary>
    /// <returns>A string representing the operation.</returns>

    // Any changes to the serialized format MUST be reflected in the deserialization on the server.
    var returnArray = new Array(this.command, this.width, this.height, this.top, this.left, this.angle);
    return "[" + returnArray.join(",") + "]";
}


// **************************
// CommandQueue object
// **************************
function CommandQueue() {
    /// <summary>Represents queue of image operations to perform on the active image</summary>

    this._commands = new Array();
    this._commandPosition = 0;
}

CommandQueue.prototype.Add = function (imageOperation) {
    /// <summary>
    /// Add a new image operation to the command queue.
    /// When new operations are added the redo state is reset.
    /// </summary>
    /// <param name="imageOperation">The image operation to add to the queue.</param>

    if (this.CanRedo()) {
        this._commands.splice(this._commandPosition, this._commands.length - this._commandPosition);
    }
    this._commands.push(imageOperation);
    this._commandPosition = this._commands.length;
}

CommandQueue.prototype.CanUndo = function () {
    /// <summary>Returns a value indicating whether there are any operations in the buffer.</summary>
    /// <returns>true if there are operations in the queue; otherwise false;</returns>

    return (this._commandPosition > 0);
}

CommandQueue.prototype.Undo = function () {
    /// <summary>Undo the last operation in the operation queue.</summary>
    /// <returns>true if there was any operations to undo; otherwise false.</returns>

    if (this.CanUndo()) {
        this._commandPosition--;

        if (this._commands[this._commandPosition].command == "Grayscale") {
            SetGrayscaleTool(false);
        }
        return true;
    }
    return false;
}

CommandQueue.prototype.CanRedo = function () {
    /// <summary>Returns a value indicating whether there are any undone operations in the buffer.</summary>
    /// <returns>true if there are operations to redo in the queue; otherwise false;</returns>

    return (this._commands.length > this._commandPosition);
}

CommandQueue.prototype.Redo = function () {
    /// <summary>Re-activate the next operation in the operation queue.</summary>
    /// <returns>true if there was any undone operations to redo; otherwise false.</returns>

    if (this.CanRedo()) {
        if (this._commands[this._commandPosition].command == "Grayscale") {
            SetGrayscaleTool(true);
        }
        this._commandPosition++;
        return true;
    }
    return false;
}

CommandQueue.prototype.RemoveByName = function (commandName) {
    if (this.IsEmpty()) {
        return;
    }
    for (var i = 0; i < this._commands.length; i++) {
        if (this._commands[i].command == commandName) {
            this._commands.splice(i, 1);
            if (i < this._commandPosition) {
                this._commandPosition--;
            }
        }
    }
}

CommandQueue.prototype.Revert = function () {
    /// <summary>Clears the operation buffer so the image can be restored to its original state.</summary>

    this._commands = new Array();
    this._commandPosition = 0;
}

CommandQueue.prototype.IsEmpty = function () {
    return this._commandPosition == 0;
}

CommandQueue.prototype.Serialize = function () {
    /// <summary>Serializes the operation queue to a string representation that can be sent to the server for processing.</summary>
    /// <returns>A string representing the operations in the queue.</returns>

    var value = "";
    for (var i = 0; i < this._commandPosition; i++) {
        value += this._commands[i].Serialize();
    }
    return value;
}

CommandQueue.prototype.toString = function () {
    var value = "";
    for (var i = 0; i < this._commands.length; i++) {
        value += (i == this._commandPosition - 1 ? "*" : "") + this._commands[i].Serialize() + "<br/>";
    }
    return value;
}

