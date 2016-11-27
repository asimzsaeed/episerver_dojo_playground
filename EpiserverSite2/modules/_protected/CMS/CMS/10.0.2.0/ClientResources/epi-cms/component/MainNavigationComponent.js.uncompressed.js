define("epi-cms/component/MainNavigationComponent", [
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-geometry",
    "dijit/layout/_LayoutWidget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "epi/dependency",
    "epi-cms/widget/SearchBox"
], function (
    array,
    declare,
    lang,
    domGeometry,
    _LayoutWidget,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    dependency,
    PageNavigationTree,
    ContentSearchBox
) {

    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      Component for displaying the navigation panel with a search area and a pluggable page selection widget.
        //
        // tags:
        //      internal

        // templateString: [protected] String
        //		A string that represents the widget template.
        templateString: "<div>\
                            <div data-dojo-type=\"epi-cms/widget/SearchBox\" data-dojo-attach-point=\"search\" class=\"epi-gadgetInnerToolbar\"></div>\
                            <div data-dojo-attach-point=\"navigation\" style=\"overflow:auto;\">\
                            </div>\
                        </div>",

        contentRepositoryDescriptors: null,

        postCreate: function () {
            this.inherited(arguments);

            this.contentRepositoryDescriptors = this.contentRepositoryDescriptors || dependency.resolve("epi.cms.contentRepositoryDescriptors");
            var settings = this.contentRepositoryDescriptors[this.repositoryKey];

            var roots = this.roots ? this.roots : settings.roots;

            this.search.set("area", settings.searchArea);
            this.search.set("searchRoots", roots);

            var componentType = settings.customNavigationWidget || "epi-cms/component/ContentNavigationTree";

            require([componentType], lang.hitch(this, function (innerComponentClass) {
                var innerComponent = new innerComponentClass(
                    {
                        typeIdentifiers: settings.mainNavigationTypes ? settings.mainNavigationTypes : settings.containedTypes,
                        containedTypes: settings.containedTypes,
                        settings: settings,
                        roots: roots,
                        repositoryKey: this.repositoryKey
                    }
                );
                innerComponent.placeAt(this.navigation);
                this.tree = innerComponent;

                // Resize the tree once it is added to the UI to ensure the indentation
                // is calculated correctly.
                this.tree.resize();

                this.own(this.tree.watch("showAllLanguages", lang.hitch(this, function () {
                    this.search.set("filterOnCulture", !this.tree.get("showAllLanguages"));
                })));
            }));

            //TODO: Fix issue with searches returning deleted content.
        },

        layout: function () {
            // summary:
            //		Resize and layout the search box and page selector widget.
            // tags:
            //		protected

            var cb = this._contentBox, ocb = this._oldContentBox;

            if (!cb) {
                return;
            }

            if (!ocb || cb.w !== ocb.w || cb.h !== ocb.h) {
                this._oldContentBox = cb;

                var sb = domGeometry.getMarginBox(this.search.domNode);

                domGeometry.setMarginBox(this.navigation, {
                    w: cb.w,
                    h: cb.h - sb.h
                });
            }
        }
    });
});
