define("epi-cms/contentediting/command/ScheduleForPublish", [
//Dojo
    "dojo/_base/declare",
    "dojo/topic",

//EPi shell
    "epi/dependency",
    "epi/shell/widget/dialog/Dialog",
//EPi cms
    "epi-cms/contentediting/command/_ChangeContentStatus",
    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/contentediting/ScheduledPublishSelector",
    "epi-cms/contentediting/ScheduledPublishSelectorViewModel",

//Resources
    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.toolbar.buttons",
    "epi/i18n!epi/cms/nls/episerver.cms.widget.scheduledpublishselector"
],

function (
//Dojo
    declare,
    topic,

//EPi
    dependency,
    Dialog,
    _ChangeContentStatus,
    ContentActionSupport,
    ScheduledPublishSelector,
    ScheduledPublishSelectorViewModel,

//Resources
    buttonResources,
    widgetResources
) {

    return declare([_ChangeContentStatus], {
        // summary:
        //      Schedule publish command.
        //
        // tags:
        //      internal

        name: "reject",
        label: buttonResources.scheduleforpublish.label,
        tooltip: buttonResources.scheduleforpublish.title,
        iconClass: "epi-iconClock",

        postscript: function () {
            this.inherited(arguments);

            this.projectService = this.projectService || dependency.resolve("epi.cms.ProjectService");
        },

        _execute: function () {
            // summary:
            //		Executes this command. Reject content sent for review.
            // tags:
            //		protected
            var viewModel = new ScheduledPublishSelectorViewModel();
            viewModel.set("contentData", this.model.contentData);
            var widget = new ScheduledPublishSelector({ model: viewModel });

            var self = this,
                saveAction = ContentActionSupport.saveAction;

            self.set("action", saveAction.CheckIn | saveAction.DelayedPublish | saveAction.ForceCurrentVersion);

            var dateSelectorDialog = new Dialog({ content: widget, title: widgetResources.title, defaultActionsVisible: false });
            dateSelectorDialog.on("execute", function () {
                // Update the "StartPublish" metadata property
                self.model.setProperty("iversionable_startpublish", viewModel.dateValue);

                // We cannot call self.inherited(arguments) here because we're in the ScheduledPublishSelector dialog
                self._changeContentStatus();
            });

            dateSelectorDialog.show(true);

        },

        _onModelChange: function () {
            // summary:
            //		Updates canExecute after the model has been updated.
            // tags:
            //		protected
            this.inherited(arguments);

            var self = this,
                contentData = this.model.contentData,
                isVisible = (contentData.status === ContentActionSupport.versionStatus.CheckedOut) ||
                    (contentData.status === ContentActionSupport.versionStatus.Rejected) ||
                    (contentData.status === ContentActionSupport.versionStatus.Published && contentData.isCommonDraft),
                canExecute = isVisible && this.model.canChangeContent(ContentActionSupport.action.Publish);

            this.set("canExecute", false);
            this.set("isAvailable", isVisible);

            this.projectService.isPartOfDelayedPublishedProject(contentData.contentLink).then(function (isPartOfDelayedPublishProject) {
                self.set("canExecute", canExecute && !isPartOfDelayedPublishProject);
            });
        }
    });
});
