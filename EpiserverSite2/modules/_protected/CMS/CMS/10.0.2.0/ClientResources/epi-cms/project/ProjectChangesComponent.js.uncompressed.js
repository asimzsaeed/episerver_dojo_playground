require({cache:{
'url:epi-cms/project/templates/ProjectChangesComponent.html':"﻿<div>\n    <div data-dojo-type=\"epi-cms/project/ProjectItemList\"\n         data-dojo-attach-point=\"itemList\"\n         data-dojo-props=\"commandSource: this.model, listItemType: 'card-compact', res: this.res\">\n        <section data-epi-section=\"toolbarSection\">\n            <div data-dojo-attach-point=\"toolbarGroupNode\" class=\"epi-floatRight\"></div>\n        </section>\n        <section data-epi-section=\"listContainer\">\n            <div data-dojo-attach-point=\"placeholderNode\" class=\"epi-project-gadget__placeholder dijitHidden\"></div>\n        </section>\n    </div>\n</div>\n"}});
define("epi-cms/project/ProjectChangesComponent", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/on",
    "dojo/when",

// epi
    "epi/shell/command/_WidgetCommandBinderMixin",

// epi-cms
    "./_ProjectView",
    "./viewmodels/ProjectChangesComponentViewModel",

// template
    "dojo/text!./templates/ProjectChangesComponent.html",

// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.components.project.changes",

// Widgets in template
    "dijit/DropDownMenu",
    "dijit/form/Button",
    "dijit/form/DropDownButton",
    "dijit/Toolbar",
    "./ProjectItemList"
],

function (
// dojo
    declare,
    lang,
    aspect,
    domClass,
    domGeometry,
    on,
    when,

// epi
    _WidgetCommandBinderMixin,

// epi-cms
    _ProjectView,
    ProjectChangesComponentViewModel,

// template
    template,

// Resources
    res
) {


    return declare([_ProjectView, _WidgetCommandBinderMixin], {
        // summary:
        //
        // tags:
        //      internal

        modelBindingMap: {
            projectItemQuery: ["projectItemQuery"],
            projectItemSortOrder: ["projectItemSortOrder"],
            dndEnabled: ["dndEnabled"],
            contentLanguage: ["contentLanguage"]
        },

        res: res,

        templateString: template,

        "class": "epi-project-changes-component",

        layout: function () {
            this.inherited(arguments);

            this.itemList.resize(this._contentBox, this._contentBox);
        },

        _createViewModel: function () {
            // summary:
            //    Setting up the view model
            // tags:
            //    protected

            return new ProjectChangesComponentViewModel();
        }
    });
});
