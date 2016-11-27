define("vizob-epi-cms/drive/Overview", [
   "dojo/_base/declare",
   "dojo/_base/lang",
   "dojo/dom-geometry",
   "dojo/on",
   "dojo/when",

   "epi/shell/_ContextMixin",
   "./_DriveView",
   "./viewmodels/OverviewViewModel",

// Template
   "dojo/text!./templates/Overview.html",

// Resources
   //"epi/i18n!epi/cms/nls/episerver.cms.components.project",

// Template widgets
   //"dijit/Toolbar",
   //"dijit/form/Button",
   //"dijit/form/DropDownButton",
   //"dijit/layout/TabContainer",
   //"epi-cms/project/ActivityFeed",
   //"epi-cms/project/ProjectItemList",
   //"epi-cms/project/PublishMenu"
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
            //projectItemQuery: ["projectItemQuery"],
            //projectItemSortOrder: ["projectItemSortOrder"],
            //selectedProject: ["selectedProject"],
            //created: ["created"],
            //createdBy: ["createdBy"],
            //dndEnabled: ["dndEnabled"],
            //isActivitiesVisible: ["isActivitiesVisible"],
            //notificationMessage: ["notificationMessage"],
            //projectStatus: ["projectStatus"],
            //contentLanguage: ["contentLanguage"],
            //projectItemCountMessage: ["projectItemCountMessage"],
            //projectName: ["projectName"]
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
