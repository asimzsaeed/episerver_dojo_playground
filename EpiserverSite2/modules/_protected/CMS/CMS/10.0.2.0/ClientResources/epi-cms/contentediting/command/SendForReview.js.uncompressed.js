define("epi-cms/contentediting/command/SendForReview", [
    "dojo/_base/declare",
    "dojo/topic",
    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/contentediting/command/_ChangeContentStatus",

//Resources
    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.toolbar.buttons"
],

function (
    declare,
    topic,
    ContentActionSupport,
    _ChangeContentStatus,
    resources
) {

    return declare([_ChangeContentStatus], {
        // summary:
        //      Send for review command.
        //
        // tags:
        //      internal

        name: "sendforreview",
        label: resources.sendforreview.label,
        executingLabel: resources.sendforreview.executinglabel,
        tooltip: resources.sendforreview.title,
        iconClass: "epi-iconCheckmark",

        action: ContentActionSupport.action.CheckIn,

        _execute: function () {
            // summary:
            //    Executes this command. Send the current content for review.
            //
            // tags:
            //		protected

            // Disable Undo & Redo actions.
            topic.publish("/epi/cms/action/disableundoredoactions");

            return this.inherited(arguments);
        },

        _onModelChange: function () {
            // summary:
            //		Updates canExecute after the model has been updated.
            // tags:
            //		protected

            this.inherited(arguments);

            var contentData = this.model.contentData,
                isAvailable = ((contentData.status === ContentActionSupport.versionStatus.CheckedOut) ||
                    (contentData.status === ContentActionSupport.versionStatus.Rejected) ||
                    (contentData.status === ContentActionSupport.versionStatus.Published && contentData.isCommonDraft))
                    && this.model.canChangeContent(this.action),
                canExecute = isAvailable && (contentData.status !== ContentActionSupport.versionStatus.Published);

            this.set("canExecute", canExecute);
            this.set("isAvailable", isAvailable);
        }
    });

});
