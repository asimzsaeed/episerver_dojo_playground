define("epi/shell/command/_SelectionCommandMixin", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang"
],

function (
// dojo
    declare,
    lang
) {

    return declare(null, {
        // summary:
        //      Stub to handle selection content for an instance of "epi/shell/command/_Command" object
        // tags:
        //      internal xproduct, mixin

        // selection: [public] Object
        //      Hold information about selected content
        selection: null,

        // =======================================================================
        // Public overrided functions

        postscript: function () {
            // summary:
            //      Register a watch hanlder when the command change its model
            //      Watch model and initialize model dependent properties.
            // tags:
            //      public, overrides

            this.inherited(arguments);

            this.watchSelectionChange();
        },

        // =======================================================================
        // Public functions

        onRefreshSelection: function () {
            // summary:
            //      Stub to do somethings when selection refreshed
            // tags:
            //      public, callback
        },

        watchSelectionChange: function () {
            // summary:
            //      Register a watch hanlder when the command change its model
            // tags:
            //      public

            this._selectionChangeWatcher = this.selection.watch("data", lang.hitch(this, this._onModelChange));
        },

        unwatchSelectionChange: function () {
            // summary:
            //      Clear the registered watch handler for command model change
            // tags:
            //      public

            this._selectionChangeWatcher && this._selectionChangeWatcher.unwatch();
        },

        // =======================================================================
        // Protected functions

        _selectionDataGetter: function () {
            // summary:
            //      Return selection content item data
            // tags:
            //      protected

            var selectionData = this._getSelectionData();
            return selectionData && selectionData.type === "epi.cms.contentdata" ? selectionData.data : null;
        },

        _selectionTypeGetter: function () {
            // summary:
            //      Return selection type
            // tags:
            //      protected

            return this._getSelectionData().type;
        },

        // =======================================================================
        // Private functions

        _getSelectionData: function () {
            // summary:
            //      Return selection data
            // tags:
            //      private

            if (!this.selection || !(this.selection.data instanceof Array)) {
                return null;
            }

            return this.selection.data[0];
        }

    });

});
