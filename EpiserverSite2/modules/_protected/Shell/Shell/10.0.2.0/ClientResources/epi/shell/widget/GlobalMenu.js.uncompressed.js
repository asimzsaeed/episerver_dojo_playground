require({cache:{
'url:epi/shell/widget/templates/GlobalMenu.html':"﻿<div>\r\n    <div data-dojo-attach-point=\"accordionNode\" class=\"epi-navigation-accordioncontainer\">\r\n        <div data-dojo-attach-point=\"containerNode\" class=\"${hiddenClass}\" style=\"position:absolute; bottom:0; left:0; width:100%\"></div>\r\n    </div>\r\n    <div data-dojo-attach-point=\"expandCollapseContainer\" class=\"epi-navigation-expandcollapseContainer\">\r\n        <a data-dojo-attach-point=\"expandCollapseButton\" href=\"javascript:void(0)\" class=\"epi-navigation-expandcollapseBtn\"\r\n            tabindex=\"0\"><span class=\"epi-navigation-expandcollapseIcon\"></span></a>\r\n    </div>\r\n</div>\r\n"}});
﻿define("epi/shell/widget/GlobalMenu", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/event",
    "dojo/NodeList-traverse",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/query",
    "dojo/topic",
    "dojo/text!./templates/GlobalMenu.html",
    "dijit/focus",
    "dijit/_Container",
    "dijit/_TemplatedMixin",
    "dijit/_Widget",
    "epi/Url",
    "epi/i18n!epi/shell/ui/nls/EPiServer.Shell.UI.Resources.GlobalMenu",
    "dojo/has",
    "dgrid/util/has-css3"],

function (
    declare,
    lang,
    event,
    traverse,
    domAttr,
    domStyle,
    domClass,
    domGeometry,
    query,
    topic,
    template,
    focusManager,
    _Container,
    _TemplatedMixin,
    _Widget,
    Url,
    resources,
    has) {

    return declare([_Widget, _TemplatedMixin, _Container], {
        // tags:
        //    internal

        res: resources,
        templateString: template,

        _focusNode: null,
        _siteUrl: null,

        openClass: "epi-globalNavigation--open",
        hoverClass: "epi-globalNavigation--hover",
        shadowClass: "epi-globalNavigation--shadow",
        hiddenClass: "dijitHidden",

        postCreate: function () {
            // summary:
            //      Bind global menu events.
            // tags:
            //      public

            this.inherited(arguments);

            // The node we're focusing when the menu is shown
            this._focusNode = query(".epi-navigation-selected > a", this.containerNode)[0];

            // Hide as soon as this widget looses focus
            this.connect(this, "onBlur", function () {
                this._toggleGlobalSearch(false);
                this._hideMenu();
            });

            // Show more of global navigation button when user hovers
            this.connect(this.domNode, "onmouseenter", this._toggleHintOn);
            this.connect(this.domNode, "onmouseleave", this._toggleHintOff);
            // Handle toggle when clicking on expand-collapse icon.
            this.connect(this.accordionNode, "onclick", this._showMenu);
            this.connect(this.expandCollapseContainer, "onclick", this._toggleMenu);

            // Hide the menu
            this._hideMenu();

            topic.subscribe("/epi/shell/context/changed", lang.hitch(this, "_onContextChanged"));

            //Check if the browser supports css transitions before using it
            if (has("css-transitions")) {
                this.connect(this.accordionNode, has("transitionend"), lang.hitch(this, function () {
                    if (this._isOpen()) {
                        focusManager.focus(this._focusNode);
                        return;
                    }

                    if (domClass.contains(this.accordionNode, this.hoverClass)) {
                        return;
                    }

                    domClass.add(this.containerNode, this.hiddenClass);
                }));
            }
        },

        _getContentHeight: function () {
            // summary:
            //  Returns the height of the contained content

            return domGeometry.getContentBox(this.containerNode).h;
        },

        _toggleMenu: function (e) {
            // summary:
            //      Toggle display state of global menu.
            // tags:
            //      private

            if (this._isOpen()) {
                this._hideMenu();
            } else {
                this._showMenu();
            }
            event.stop(e);
        },

        _toggleHintOn: function () {

            if (this._isOpen()) {
                return;
            }
            domClass.add(this.accordionNode, this.hoverClass);
        },

        _toggleHintOff: function () {
            if (this._isOpen()) {
                return;
            }
            domClass.remove(this.accordionNode, this.hoverClass);
        },

        _showMenu: function () {
            // summary:
            //      Show global menu.
            // tags:
            //      private

            domClass.remove(this.accordionNode, this.hoverClass);
            domClass.add(this.accordionNode, this.openClass);

            domClass.remove(this.containerNode, this.hiddenClass);
            domStyle.set(this.accordionNode, "height", this._getContentHeight() + "px");
            domClass.add(this.domNode, this.shadowClass);

        },

        _hideMenu: function () {
            // summary:
            //      Hide global menu.
            // tags:
            //      private

            domClass.remove(this.accordionNode, this.hoverClass);
            domClass.remove(this.accordionNode, this.openClass);

            domClass.remove(this.domNode, this.shadowClass);
            domStyle.set(this.accordionNode, "height", "0px");
        },

        _isOpen: function () {
            return domClass.contains(this.accordionNode, this.openClass);
        },

        _getToViewModeElement: function () {
            // Summary:
            //      Get to view mode element
            //
            // Tag:
            //      Private

            var utilItemsContainer = query(".epi-navigation-container-utils", this.element)[0];
            return query(".epi-navigation-global_sites.epi-navigation-currentSite.epi-navigation-iconic", utilItemsContainer)[0];
        },

        _onContextChanged: function (ctx, callerData) {
            // Summary:
            //      Update direct URL (navigator current sites for instance)
            // ctx: Object
            //      Current page context
            // Tag:
            //      Private

            var toViewModeElement = this._getToViewModeElement();
            //Only change the URL if we have one site
            if (!toViewModeElement) {
                return;
            }

            var url = this._buildPublicUrl(ctx, toViewModeElement);
            var title = lang.replace(this.res.toviewmode, [url.toString()]);

            domAttr.set(toViewModeElement, { href: url.path, title: title });
        },

        _buildPublicUrl: function (ctx, viewModeElement) {
            // Summary:
            //      Build the public URL by current context

            //Copy the site URL form the element before we replace it
            if (this._siteUrl === null) {
                this._siteUrl = viewModeElement.href;
            }

            var siteUrl = new Url(ctx.publicUrl || this._siteUrl);
            var location = window.location;
            var params = {
                scheme: location.protocol,
                authority: location.host,
                path: siteUrl.path
            };
            var url = new Url(null, params, true);

            return url;
        },

        _toggleGlobalSearch: function (/* Boolean */visible) {
            // Summary:
            //      Show or hide the current global search box
            // Remarks:
            //      Currently global search is written using jQuery, so we have to access search box by ID

            var searchBox = query("#epi-searchContainer")[0];
            if (searchBox) {
                domStyle.set(searchBox, "display", visible ? "block" : "none");
            }
        }
    });
});
