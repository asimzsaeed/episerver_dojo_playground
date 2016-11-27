require({cache:{
'url:epi-cms/project/templates/Activity.html':"<div class=\"epi-event epi-activity\">\n    <div class=\"epi-event__title-wrapper\">\n        <span class=\"dijitInline\" data-dojo-attach-point=\"iconNode\"></span>\n        <span class=\"epi-event__title\" data-dojo-attach-point=\"titleNode\"></span>\n    </div>\n    <div class=\"epi-event__status\" data-dojo-attach-point=\"actionNode\">\n        <span class=\"dijitInline epi-event__status__icon\">\n            <span data-dojo-attach-point=\"actionIconNode\"></span>\n        </span><span class=\"epi-event__status__message\" data-dojo-attach-point=\"actionTextNode\"></span>\n    </div><div data-dojo-attach-point=\"messageNode\"></div\n    ><div class=\"epi-activity__comments\" data-dojo-attach-point=\"containerNode\"></div>\n    <div data-dojo-type=\"epi-cms/project/ActivityCommentForm\" data-dojo-attach-point=\"commentForm\"></div>\n</div>\n"}});
define("epi-cms/project/Activity", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-class",
    "epi/datetime",
    "epi/shell/TypeDescriptorManager",
    "epi/username",
    "epi-cms/ApplicationSettings",
    "./ActivityComment",
    "./viewmodels/ActivityViewModel",
    "./viewmodels/ActivityCommentViewModel",
    "./viewmodels/MessageActivityViewModel",
    // Parent class and mixins
    "dijit/layout/_LayoutWidget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "epi/shell/widget/_ModelBindingMixin",
    // Resources
    "dojo/text!./templates/Activity.html",
    "epi/i18n!epi/cms/nls/episerver.cms.activities.activity",
    //Widgets in the template
    "epi-cms/project/ActivityCommentForm"
], function (
    declare,
    lang,
    domClass,
    datetime,
    TypeDescriptorManager,
    username,
    ApplicationSettings,
    ActivityComment,
    ActivityViewModel,
    ActivityCommentViewModel,
    MessageActivityViewModel,
    // Parent class and mixins
    _LayoutWidget,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _ModelBindingMixin,
    // Resources
    template,
    localizations
) {

    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, _ModelBindingMixin], {
        // summary:
        //      A widget used to display an activity.
        // tags:
        //      internal

        // templateString: [protected] String
        //      A string that represents the widget template.
        templateString: template,

        // model: [protected] Object
        //      The view model which is a stateful object.
        model: null,

        // modelBindingMap: [protected] Object
        //      A map contain bindings from the model to properties on this object.
        modelBindingMap: {
            upsertActivityComment: ["upsertActivityComment"]
        },

        buildRendering: function () {
            this.inherited(arguments);

            var activity = this.activity;

            var model = new ActivityViewModel({
                id: activity.id,
                hasMessage: !!activity.message,
                upsertActivityComment: null
            });

            this.commentForm.set("model", model);
            this.set("model", model);

            // Set the title to the name of the activity, e.g. project name or content name.
            var title = activity.name;

            // Append the language identifier to the title if the content language is different from
            // the editing language.
            var language = activity.language;
            if (language && language !== ApplicationSettings.currentContentLanguage) {
                title = lang.replace("{0} ({1})", [title, language]);
            }
            this.titleNode.textContent = title;

            // Set the icon class from the type identifier or default to the project icon.
            var iconClass = TypeDescriptorManager.getValue(activity.typeIdentifier, "iconClass");
            domClass.add(this.iconNode, iconClass || "epi-iconProject");

            // Set the color on the action node and the icon classes.
            var actionIconClass = lang.replace("epi-icon{0} epi-icon--{1}", [activity.actionIcon, activity.actionColor]);
            domClass.add(this.actionIconNode, actionIconClass);
            domClass.add(this.actionNode, "epi-event--" + activity.actionColor);

            // Set the message based on the user and date updated.
            var template = activity.delayPublishUntil ? localizations.delaypublishmessagetemplate : localizations.messagetemplate;
            this.actionTextNode.textContent = lang.replace(template, {
                event: activity.actionText,
                delaypublish: datetime.toUserFriendlyString(activity.delayPublishUntil),
                user: username.toUserFriendlyString(activity.changedBy),
                date: datetime.toUserFriendlyString(activity.created)
            });

            // If the activity has a message property create an ActivityComment widget
            // and render the message
            if (activity.message) {
                domClass.add(this.domNode, "epi-activity__message");
                this.own(this._messageForm = new ActivityComment({ model: new MessageActivityViewModel(activity) }, this.messageNode));
            }

            // Create an ActivityComment widget for each comment
            if (activity.comments) {
                activity.comments.forEach(function (comment) {
                    this.set("upsertActivityComment", comment);
                }, this);
            }
        },

        startup: function () {
            this.inherited(arguments);

            //Start the message comment form if it has been created
            this._messageForm && this._messageForm.startup();
        },

        _getActivityCommentComponent: function (commentId) {
            // summary:
            //      Returns the ActivityComment component and its position if it has been added to the activity
            //      If comment isn't added yet then the position will be -1.
            // tags:
            //      private

            var index = -1;
            var existingComment = null;

            var allActivityComments = this.getChildren() || [];

            for (var i = 0; i < allActivityComments.length; i++) {
                index = i;
                var current = allActivityComments[i];
                if (current.get("model").id === commentId) {
                    existingComment = current;
                    break;
                }
            }

            return { position: (existingComment !== null ? index : -1), activityComment: existingComment };
        },

        _setUpsertActivityCommentAttr: function (comment) {
            // summary:
            //      Adds new or updates an existing ActivityComment to the the current Activity.
            // tags:
            //      private


            if (!comment) {
                return;
            }

            // find the comment and its position
            var foundActivityComment = this._getActivityCommentComponent(comment.id);
            var oldComment = foundActivityComment.activityComment;
            var position = (foundActivityComment.position === -1 ? this.getChildren().length : foundActivityComment.position);

            // if comment already added then remove it since its easy to remove and add again than to update the entire UI state
            if (oldComment) {

                // if the new comment is the same as existing then don't continue
                var oldCommentUpdatedAt = new Date(oldComment.get("model").lastUpdated).getTime();
                var newCommentUpdatedAt = new Date(comment.lastUpdated).getTime();
                if (oldCommentUpdatedAt === newCommentUpdatedAt) {
                    return;
                }

                // remove from activity and then destroy it
                this.removeChild(oldComment);
                oldComment.destroyRecursive();
            }

            // create new ActivityComment component and add it as a child component
            var activityComment = new ActivityComment({ model: new ActivityCommentViewModel(comment) });
            this.addChild(activityComment, position);
        }
    });
});
