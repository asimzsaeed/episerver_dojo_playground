define("epi-cms/contentediting/command/_ContentCommandBase", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "epi/shell/command/_Command"
],

function (
    declare,
    lang,
    _Command
) {

    return declare([_Command], {
        // summary:
        //      Base class for any content manupulation command, like: Reject, Publish, ...
        //      canExecute is updated to false if the content is changing its status, and restore when done.
        // tags:
        //      internal abstract

        _isChangingContentStatusHandle: null,

        // checkDeleted: [Boolean]
        //      Indicated that need check content is deleted or not before execute command
        // tags:
        //      public
        checkDeleted: true,

        destroy: function () {
            if (this._isChangingContentStatusHandle) {
                this._isChangingContentStatusHandle.unwatch();
            }
            this.inherited(arguments);
        },

        _canExecuteGetter: function () {
            // summary:
            //      Check content is deleted or not
            // tags:
            //      protected

            if (!this.model || !this.model.contentData) {
                return false;
            }

            var contentData = this.model.contentData;
            return this.canExecute && (!this.checkDeleted || (contentData && !contentData.isDeleted));
        },

        _onModelChange: function () {
            this.inherited(arguments);

            if (this._isChangingContentStatusHandle) {
                this._isChangingContentStatusHandle.unwatch();
            }

            var originalValue;

            this._isChangingContentStatusHandle = this.model.watch("isChangingContentStatus", lang.hitch(this, function (name, oldValue, value) {
                if (value) {
                    originalValue = this.canExecute;
                    this.set("canExecute", false);
                } else {
                    this.set("canExecute", originalValue);
                }
            }));
        }
    });
});
