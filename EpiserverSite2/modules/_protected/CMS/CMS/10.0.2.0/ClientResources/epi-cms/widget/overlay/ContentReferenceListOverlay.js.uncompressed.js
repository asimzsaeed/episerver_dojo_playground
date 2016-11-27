define("epi-cms/widget/overlay/ContentReferenceListOverlay", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",
// epi-cms
    "./Property"
], function (
// dojo
    declare,
    lang,
// epi-cms
    Property
) {
    return declare([Property], {
        // tags:
        //      internal

        onDrop: function (target, value) {
            // summary:
            //      Adds the dropped items contentLink last in the content reference list value.
            // tags:
            //      internal

            if (!value || !value.contentLink) {
                return;
            }

            var propertyName = this._getRightProperty();
            var propertyValue = lang.clone(this.contentModel["epi-" + propertyName]);
            if (!propertyValue) {
                propertyValue = [];
            }
            propertyValue.push(value.contentLink);

            this.onValueChange({
                propertyName: propertyName,
                value: propertyValue
            });
        }
    });
});
