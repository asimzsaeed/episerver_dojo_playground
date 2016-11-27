require({cache:{
'url:epi-cms/contentediting/templates/AllowedTypesList.html':"﻿<div>\n    <div>\n        <strong>${resources.allowedtypes}</strong>\n        <p data-dojo-attach-point=\"allowedTypesList\"></p>\n    </div>\n    <div data-dojo-attach-point=\"restrictedTypesWrapper\">\n        <strong>${resources.restrictedtypes}</strong>\n        <p data-dojo-attach-point=\"restrictedTypesList\"></p>\n    </div>\n</div>"}});
﻿define("epi-cms/contentediting/AllowedTypesList", [
// dojo
    "dojo/_base/declare",
    "dojo/dom-class",

// dijit
    "dijit/_TemplatedMixin",
    "dijit/_WidgetBase",

// epi
    "epi/shell/TypeDescriptorManager",

// resources
    "dojo/text!./templates/AllowedTypesList.html",
    "epi/i18n!epi/cms/nls/episerver.cms.widget.contentreferencelisteditor"
], function (
// dojo
    declare,
    domClass,

// dijit
    _TemplatedMixin,
    _WidgetBase,

// epi
    TypeDescriptorManager,

// resources
    templateString,
    resources) {

    return declare([_WidgetBase, _TemplatedMixin], {

        templateString: templateString,

        postMixInProperties: function () {
            this.inherited(arguments);
            this.resources = resources;
        },

        _setAllowedTypesAttr: function (allowedTypes) {
            if (!allowedTypes || allowedTypes.length === 0) {
                return;
            } else if (allowedTypes.length === 1 &&
                (allowedTypes[0] === "episerver.core.icontentdata" || allowedTypes[0] === "episerver.core.icontent")) {
                this.allowedTypesList.innerHTML = resources.all;
            } else {
                this.allowedTypesList.innerHTML = this._convertToUserFriendlyNames(allowedTypes).join(", ");
            }
        },

        _setRestrictedTypesAttr: function (restrictedTypes) {
            if (!restrictedTypes || restrictedTypes.length === 0) {
                domClass.add(this.restrictedTypesWrapper, "dijitHidden");
            } else {
                domClass.remove(this.restrictedTypesWrapper, "dijitHidden");
                this.restrictedTypesList.innerHTML = this._convertToUserFriendlyNames(restrictedTypes).join(", ");
            }
        },

        _convertToUserFriendlyNames: function (types) {
            return types.map(function (typeIdentifier) {
                return TypeDescriptorManager.getResourceValue(typeIdentifier, "name") || typeIdentifier;
            });
        }
    });
});
