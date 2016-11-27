define("epi/shell/command/builder/MenuWithSeparatorBuilder", [
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",

    "dijit/MenuSeparator",
    "./MenuBuilder"
], function (array, declare, lang, on, MenuSeparator, MenuBuilder) {

    return declare([MenuBuilder], {
        // summary:
        //      Builds a context menu with separator.
        //
        // tags:
        //      internal

        _addToContainer: function (widget, container) {
            // summary:
            //		Adds the widget to the container.
            // tags:
            //		protected

            this.inherited(arguments, [widget, container]);

            // Add the separator
            var separator = new MenuSeparator({ _command: { order: widget._command.order } });
            this.inherited(arguments, [separator, container]);
        }
    });
});
