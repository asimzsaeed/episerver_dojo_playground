define("epi-cms/widget/overlay/overlayFactory", [
// Dojo
    "dojo/_base/lang",
    "dojo/_base/Deferred",

    "epi-cms/widget/overlay/Property"
], function (
// Dojo
    lang,
    Deferred
) {
    return {
        // tags:
        //      internal

        defaultType: "epi-cms/widget/overlay/Property",

        create: function (editableNode) {
            var createOverlayDeferred = new Deferred();
            var customType = editableNode.property.metadata.overlaySettings && editableNode.property.metadata.overlaySettings.customType;

            var property = editableNode.property,
                overlayType = customType || this.defaultType,
                allowedTypeAttribute = {},
                metadata = property.metadata && property.metadata.settings || {};
            allowedTypeAttribute.allowedTypes = metadata.allowedTypes || [];
            allowedTypeAttribute.restrictedTypes = metadata.restrictedTypes || [];

            require([overlayType], lang.hitch(this, function (overlayClass) {
                var settings = lang.mixin(
                    {
                        name: property.name,
                        contentModel: property.contentModel,
                        displayName: property.metadata.displayName,
                        disabled: editableNode.disabled,
                        sourceItemNode: editableNode.node
                    },
                    property.overlayParams,
                    allowedTypeAttribute);

                var overlay = new overlayClass(settings);
                createOverlayDeferred.resolve(overlay);
            }));

            return createOverlayDeferred;
        }
    };
});
