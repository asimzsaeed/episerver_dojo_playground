define("epi-cms/project/viewmodels/ActivityViewModel", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/Destroyable",
// Parent class and mixins
    "./_ActivityViewModel",
// Resources
    "epi/i18n!epi/cms/nls/episerver.cms.activities.activity.message"
],
function (
    declare,
    lang,
    Destroyable,
// Parent class and mixins
    _ActivityViewModel,
// Resources
    localization
) {

    return declare([_ActivityViewModel, Destroyable], {
        // summary:
        //      The view model for an activity.
        // tags:
        //      internal

        // hasMessage: [public] Boolean
        //      Indicates whether this activity has a message. Used to
        //      determine the edit label.
        hasMessage: false,

        postscript: function () {
            this.inherited(arguments);

            this.own(
                this.activityService.on("activity-comment-updated", lang.hitch(this, this._activityCommentUpdated))
            );
        },

        _editLabelGetter: function () {
            // summary:
            //      Gets the edit label.
            // tags:
            //      private

            return this.hasMessage ? localization.reply.label : localization.comment.label;
        },

        _save: function (message) {
            // summary:
            //      Adds a new comment.
            // tags:
            //      protected

            return this.activityService.addComment(this.id, message);
        },

        _activityCommentUpdated: function (comment) {
            // summary:
            //     Sets the given comment as upserActivityComment only if comment belongs to the current activity
            // tags:
            //      private

            // there could be many instances of activity but it should add/update comment to the relevant activity.
            if (comment && comment.activityId === this.id) {
                this.set("upsertActivityComment", comment);
            }
        }
    });
});
