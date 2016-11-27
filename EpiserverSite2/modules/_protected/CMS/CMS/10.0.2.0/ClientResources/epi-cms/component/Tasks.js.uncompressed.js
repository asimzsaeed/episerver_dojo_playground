require({cache:{
'url:epi-cms/component/templates/Tasks.html':"﻿<div>\r\n    <div class=\"epi-gadgetInnerToolbar\" data-dojo-attach-point=\"toolbar\">\r\n        <div data-dojo-type=\"dijit/form/Button\" data-dojo-attach-point=\"reloadButton\" data-dojo-attach-event=\"onClick: _reloadQuery\"\r\n            class=\"epi-chromelessButton epi-iconReload epi-input-margin--left dijitInline dijitReset\">\r\n        </div>\r\n    </div>\r\n    <div data-dojo-type=\"epi-cms/component/ContentQueryGrid\" data-dojo-attach-point=\"contentQuery\">\r\n    </div>\r\n</div>\r\n"}});
﻿define("epi-cms/component/Tasks", [
// Dojo
    "dojo",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/topic",

// Dijit
    "dijit/form/Select",
    "dijit/_TemplatedMixin",
    "dijit/_Container",
    "dijit/layout/_LayoutWidget",
    "dijit/_WidgetsInTemplateMixin",

// EPi Framework
    "epi",

// EPi CMS
    "epi-cms/component/ContentQueryGrid", // Used in template
    "dojo/text!./templates/Tasks.html",
    "epi/i18n!epi/cms/nls/episerver.cms.components.tasks"
], function (
// Dojo
    dojo,
    declare,
    array,
    lang,
    domConstruct,
    domGeometry,
    topic,

// Dijit
    Select,
    _TemplatedMixin,
    _Container,
    _LayoutWidget,
    _WidgetsInTemplateMixin,

// EPi Framework
    epi,

// EPi CMS
    ContentQueryGrid,
    template,
    resources
) {

    return declare([_Container, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      This component will list the latest changed pages for the web site.
        //
        // tags:
        //      internal

        templateString: template,

        resources: resources,

        querySelection: null,

        _selectionChangedEventHandler: null,

        postCreate: function () {

            this.inherited(arguments);

            var options = array.map(this.queries, function (item) {
                return {
                    label: item.displayName,
                    value: item.name
                };
            }, this);

            this.querySelection = new Select({
                name: "QuerySelection",
                options: options
            });

            domConstruct.place(this.querySelection.domNode, this.reloadButton.domNode, "before");

            this.own(
                this.querySelection.on("change", lang.hitch(this, this._reloadQuery)),
                topic.subscribe("/epi/cms/action/refreshmytasks", lang.hitch(this, this._reloadQuery))
            );
        },

        startup: function () {
            this.inherited(arguments);

            // Set the initial query after the grid has been initialized
            this._reloadQuery();
        },

        resize: function (newSize) {
            // summary:
            //      Customize default resize method
            // newSize: object
            //      The new size of Task component
            // tags:
            //      Public

            this.inherited(arguments);

            this.contentQuery.resize(this._caculateContentQuerySize(newSize));
        },

        _caculateContentQuerySize: function (newSize) {
            // summary:
            //      Calculate the new Size of the Content Query
            // newSize: object
            //      The new size of Task component
            // tags:
            //      Private

            var toolbarSize = domGeometry.getMarginBox(this.toolbar);

            return { w: newSize.w, h: newSize.h - toolbarSize.h };
        },

        _reloadQuery: function () {
            var query = this.querySelection.get("value");
            array.some(this.queries, function (item, index) {
                if (item.name === query) {
                    this.contentQuery.set("ignoreVersionWhenComparingLinks", !item.versionSpecific);
                    return true;
                }
            }, this);
            this.contentQuery.set("queryName", query);
        }
    });
});
