define("epi-cms/contentediting/commandproviders/PublishMenuGlobal", [
    "dojo",
    "dojo/_base/declare",

    "epi/shell/command/withConfirmation",
    "epi/shell/command/_CommandProviderMixin",

    "epi-cms/command/TranslateContent",
    "epi-cms/contentediting/command/ForPublishMenu",
    "epi-cms/contentediting/command/RevertToPublished",
    "epi-cms/contentediting/command/Reject",
    "epi-cms/contentediting/command/SendForReview",
    "epi-cms/contentediting/command/Publish",
    "epi-cms/contentediting/command/CreateDraft",
    "epi-cms/contentediting/command/EditCommonDraft",
    "epi-cms/contentediting/command/Withdraw",
    "epi-cms/contentediting/command/ScheduleForPublish",
    "epi-cms/contentediting/command/CancelAndEdit",

    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.editactionpanel.publishactionmenu"
], function (
    dojo,
    declare,

    withConfirmation,
    _CommandProviderMixin,

    TranslateContentCommand,
    ForPublishMenu,
    RevertToPublishedCommand,
    RejectCommand,
    SendForReviewCommand,
    PublishCommand,
    CreateDraftCommand,
    EditCommonDraft,
    WithdrawCommand,
    ScheduleForPublishCommand,
    CancelAndEditCommand,

    res) {

    return declare([_CommandProviderMixin], {
        // summary:
        //      Builtin Command provider for publish menu.
        //
        // tags:
        //      internal

        constructor: function () {
            // summary:
            //		Ensure that an array of commands has been initialized.
            // tags:
            //		public
            this.inherited(arguments);

            // Adds builtin commands

            // publish
            this.add("commands", ForPublishMenu(new PublishCommand(), {
                resetLabelAfterExecution: true,
                isMain: true,
                priority: 9000,
                mainButtonClass: "epi-success",
                keepMenuOpen: true,
                successStatus: res.successfullypublished
            }));

            // translate
            this.add("commands", ForPublishMenu(new TranslateContentCommand(), {
                isMain: true,
                priority: 10000,
                mainButtonClass: "epi-primary"
            }));

            // schedule for publish
            this.add("commands", ForPublishMenu(new ScheduleForPublishCommand()));

            // cancel and edit
            this.add("commands", ForPublishMenu(new CancelAndEditCommand()));

            this.add("commands", ForPublishMenu(new SendForReviewCommand(), {
                isMain: true,
                priority: 8000,
                mainButtonClass: "epi-success",
                keepMenuOpen: true
            }));

            // reject
            this.add("commands", ForPublishMenu(new RejectCommand(), {
                resetLabelAfterExecution: false,
                keepMenuOpen: true
            }));

            // withdraw
            this.add("commands", ForPublishMenu(new WithdrawCommand(), {
                resetLabelAfterExecution: false,
                keepMenuOpen: true
            }));

            // edit common draft
            this.add("commands", ForPublishMenu(new EditCommonDraft()));

            // create draft
            this.add("commands", ForPublishMenu(new CreateDraftCommand()));

            // revert to publish
            this.add("commands", ForPublishMenu(withConfirmation(
                new RevertToPublishedCommand(), null, {
                    title: res.reverttopublishconfirmation.dialogtitle,
                    heading: res.reverttopublishconfirmation.confirmquestion,
                    description: res.reverttopublishconfirmation.description
                }
            )));
        }
    });
});
