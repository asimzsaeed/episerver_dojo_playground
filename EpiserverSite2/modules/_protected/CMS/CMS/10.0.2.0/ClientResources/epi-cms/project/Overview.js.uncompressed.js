require({cache:{
'url:epi-cms/project/templates/Overview.html':"<div class=\"epi-project-overview\">\n    <div data-dojo-attach-point=\"toolbar\" class=\"epi-project-overview__toolbar epi-viewHeaderContainer epi-editToolbarMedium\">\n        <h2 class=\"dijitInline\">\n            <div class=\"dijitInline epi-iconObjectProject epi-icon--large\"></div>\n            <span data-dojo-attach-point=\"projectNameNode\"></span>\n        </h2>\n        <div class=\"epi-project-overview__toolbar__trailing\">\n            <div data-dojo-type=\"dijit/form/DropDownButton\"\n                 data-dojo-attach-point=\"publishContainer\"\n                 data-dojo-props=\"showLabel: true, label: this.res.overview.publishdropdown.label\"\n                 data-dojo-attach-event=\"onClick:_publishMenuClickHandler\"\n                 class=\"epi-mediumButton epi-button--bold\">\n                <span></span>\n                <div data-dojo-type=\"epi-cms/project/PublishMenu\"\n                     data-dojo-attach-point=\"publishMenu\"\n                     data-dojo-props=\"commandSource: this.model\">\n                    <section data-epi-section=\"primarySection\">\n                        <span data-dojo-attach-point=\"projectStatusMessageNode\"></span>\n                    </section>\n                    <section data-epi-section=\"statusSection\">\n                        <ul>\n                            <li>\n                                ${res.view.createdby} <span data-dojo-attach-point=\"createdByNode\" class=\"epi-username\"></span>,\n                                <span data-dojo-attach-point=\"createdNode\" class=\"epi-timestamp\"></span>\n                            </li>\n                        </ul>\n                    </section>\n                </div>\n            </div>\n            <button data-dojo-type=\"dijit/form/Button\"\n                    data-dojo-attach-point=\"closeButton\"\n                    data-dojo-attach-event=\"onClick:_close\"\n                    data-dojo-props=\"showLabel: true, label: this.res.overview.closebutton.label\"\n                    class=\"epi-mediumButton epi-button--bold\"></button>\n        </div>\n    </div>\n\n    <div data-dojo-attach-point=\"tabs\" data-dojo-type=\"dijit/layout/TabContainer\">\n        <div data-dojo-type=\"epi-cms/project/ProjectItemList\"\n             data-dojo-attach-point=\"itemList\"\n             data-dojo-props=\"title: this.res.overview.title, commandSource: this.model, res: this.res.overview\">\n\n                <section data-epi-section=\"toolbarSection\">\n                    <div data-dojo-attach-point=\"toolbarTextNode\" class=\"epi-project-item-list__item-count-message-node\"></div>\n                    <div data-dojo-attach-point=\"toolbarGroupNode\" class=\"epi-floatRight\"></div>\n                </section>\n                <section data-epi-section=\"activitySection\">\n                    <div data-dojo-type=\"epi-cms/project/ActivityFeed\"\n                         data-dojo-attach-point=\"activityFeed\"\n                         data-dojo-props=\"model: this.model.activityFeedModel\"></div>\n                </section>\n        </div>\n\n        <div data-dojo-type=\"epi-cms/project/ActivityFeed\"\n             data-dojo-attach-point=\"projectComments\"\n             data-dojo-props=\"title: this.res.comments.title, model: this.model.projectCommentFeedModel\"\n             class=\"epi-project-comment-feed\">\n            <div data-dojo-type=\"dijit/Toolbar\"\n                 data-dojo-attach-point=\"projectCommentsToolbar\"\n                 class=\"epi-project-item-list__toolbar epi-flatToolbar\">\n            </div>\n         </div>\n    </div>\n</div>\n"}});
﻿define("epi-cms/project/Overview", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-geometry",
    "dojo/on",
    "dojo/when",

    "epi/shell/_ContextMixin",
    "./_ProjectView",
    "./viewmodels/OverviewViewModel",

// Template
    "dojo/text!./templates/Overview.html",

// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.components.project",

// Template widgets
    "dijit/Toolbar",
    "dijit/form/Button",
    "dijit/form/DropDownButton",
    "dijit/layout/TabContainer",
    "epi-cms/project/ActivityFeed",
    "epi-cms/project/ProjectItemList",
    "epi-cms/project/PublishMenu"
], function (
//dojo
    declare,
    lang,
    domGeometry,
    on,
    when,

//epi
    _ContextMixin,
    _ProjectView,
    OverviewViewModel,

// Template
    template,

// Resources
    res
) {

    return declare([_ProjectView], {

        modelBindingMap: {
            projectItemQuery: ["projectItemQuery"],
            projectItemSortOrder: ["projectItemSortOrder"],
            selectedProject: ["selectedProject"],
            created: ["created"],
            createdBy: ["createdBy"],
            dndEnabled: ["dndEnabled"],
            isActivitiesVisible: ["isActivitiesVisible"],
            notificationMessage: ["notificationMessage"],
            projectStatus: ["projectStatus"],
            contentLanguage: ["contentLanguage"],
            projectItemCountMessage: ["projectItemCountMessage"],
            projectName: ["projectName"]
        },

        res: res,

        templateString: template,

        postCreate: function () {
            // summary:
            //      Processing after the DOM fragment is created. Binds to events that can occur on
            //      child widgets.
            // tags:
            //      protected

            this.inherited(arguments);

            this.own(
                on(this.model, "refresh-activities", this.activityFeed.refresh.bind(this.activityFeed))
            );
        },

        _createViewModel: function () {
            // summary:
            //      Setting up the view model
            // tags:
            //      protected
            return new OverviewViewModel();
        },

        layout: function () {

            // Do not call resize unless we have been started
            if (!this._started) {
                return;
            }

            var toolbarSize = domGeometry.getMarginBox(this.toolbar),
                size = lang.mixin({}, this._contentBox, { h: this._contentBox.h - toolbarSize.h });
            this.tabs.resize(size);
        },

        _onShow: function () {
            // summary:
            //      Sets isProjectOverviewActive false when widgets is visible
            // tags:
            //      private
            this.model.set("isProjectOverviewActive", true);
        },

        onHide: function () {
            // summary:
            //      Sets isProjectOverviewActive true when widgets is hidden
            // tags:
            //      public
            this.model.set("isProjectOverviewActive", false);
        },

        _close: function () {
            // summary:
            //      Closes the overview
            // tags:
            //      private
            this.model.requestPreviousContext();
        },

        _setIsActivitiesVisibleAttr: function (isVisible) {
            // summary:
            //      Toggles whether the activities panel is visible in
            //      the overview.
            // tags:
            //      private
            this.itemList.toggleActivities(isVisible);
        },

        _setProjectNameAttr: { node: "projectNameNode", type: "innerText" },

        _setProjectItemCountMessageAttr: { node: "toolbarTextNode", type: "innerText" }

    });
});
