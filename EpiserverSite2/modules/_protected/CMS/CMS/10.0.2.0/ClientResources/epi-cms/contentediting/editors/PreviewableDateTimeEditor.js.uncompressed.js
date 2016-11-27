define("epi-cms/contentediting/editors/PreviewableDateTimeEditor", [
    "dojo/_base/declare",

    "epi/datetime",
    "epi/shell/widget/DateTimeSelectorDropDown",
    "epi-cms/contentediting/editors/_PreviewableEditor"

], function (
    declare,

    epiDate,
    DateTimeSelectorDropDown,
    _PreviewableEditor
) {
    return declare([_PreviewableEditor], {
        // tags:
        //      internal

        required: false,

        // controlParams: Array
        //      Properties to copy from this widget into the wrapped control
        controlParams: ["required"],

        buildRendering: function () {
            this.control = new DateTimeSelectorDropDown({ datePackage: null });
            this.inherited(arguments);
        },

        _setLabelValueAttr: function (value) {
            // summary:
            //      Overridden to format the displayed date in a user friendly way

            this.inherited(arguments, [epiDate.toUserFriendlyHtml(value)]);
        }
    });
});
