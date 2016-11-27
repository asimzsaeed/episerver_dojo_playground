define("epi-cms/contentediting/command/CancelAndEdit", [
    "dojo/_base/declare",
    "dojo/_base/Deferred",
    "dojo/_base/lang",
    "dojo/date",

    "epi/dependency",
    "epi/shell/command/_Command",

    "epi-cms/core/ContentReference",
    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/contentediting/command/_ChangeContentStatus",

//Resources
    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.toolbar.buttons.cancelandedit"
],

function (
    declare,
    Deferred,
    lang,
    dojoDate,

    dependency,
    _Command,

    ContentReference,
    ContentActionSupport,
    _ChangeContentStatus,

    resources
) {

    return declare([_ChangeContentStatus], {
        // summary:
        //      Cancel and edit content command. Available for any delayed published content, and puts the content to rejected when executed.
        //
        // tags:
        //      internal

        name: "cancelAndEdit",
        label: resources.label,
        tooltip: resources.title,
        iconClass: "epi-iconPen",

        action: ContentActionSupport.action.Reject,

        postscript: function () {
            this.inherited(arguments);

            this.projectService = this.projectService || dependency.resolve("epi.cms.ProjectService");
        },

        _execute: function () {
            // summary:
            //    Executes this command; publish the current content
            //
            // tags:
            //		protected

            this.inherited(arguments).then(lang.hitch(this, function () {
                // Reset start publish date: if content hasn't been published yet, use Created date, otherwise use Published date.
                var contentData = this.model.contentData;
                this.model.setProperty("iversionable_startpublish", contentData.isPendingPublish ? contentData.created : contentData.lastPublished);
            }));
        },

        _onModelChange: function () {
            // summary:
            //		Updates state after the model has been updated.
            // tags:
            //		protected

            this.inherited(arguments);

            var self = this,
                contentData = this.model.contentData,
                canExecute =
                    ContentActionSupport.hasAccess(contentData.accessMask, ContentActionSupport.accessLevel.Edit) &&
                    contentData.status === ContentActionSupport.versionStatus.DelayedPublish &&
                    !contentData.isPartOfAnotherProject;

            this.set("canExecute", false);
            this.set("isAvailable", canExecute);

            // Early exit if can execute is false, since there is no
            // need to query the server if we already know that the
            // command can not be executed.
            if (!canExecute) {
                return;
            }

            this.projectService.isPartOfDelayedPublishedProject(contentData.contentLink)
                .then(function (isPartOfScheduledProject) {
                    self.set("canExecute", canExecute && !isPartOfScheduledProject);
                });
        }
    });

});
