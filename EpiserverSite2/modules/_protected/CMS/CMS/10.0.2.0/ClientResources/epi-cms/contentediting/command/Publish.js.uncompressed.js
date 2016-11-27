define("epi-cms/contentediting/command/Publish", [
//Dojo
    "dojo/_base/declare",
    "dojo/_base/Deferred",
    "dojo/topic",

//EPi
    "epi/datetime",
    "epi/shell/command/_Command",
    "epi/shell/TypeDescriptorManager",

    "epi-cms/core/ContentReference",
    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/contentediting/command/_ChangeContentStatus",

//Resources
    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.toolbar.buttons"
],

function (
//Dojo
    declare,
    Deferred,
    topic,

//EPi
    epiDate,
    _Command,
    TypeDescriptorManager,

    ContentReference,
    ContentActionSupport,
    _ChangeContentStatus,

//Resources
    resources
) {

    return declare([_ChangeContentStatus], {
        // summary:
        //      Publish content command.
        //
        // tags:
        //      internal

        name: "publish",
        label: resources.publish.label,
        executingLabel: resources.publish.executinglabel,
        tooltip: resources.publish.title,

        action: ContentActionSupport.action.Publish,

        // forceReload: [public] Boolean
        //      When publishing a content, it may affect the preview parts which fetch data from published version meanwhile the context change request might not force the preview to reload if the preview is already reloaded before the action (switch Allproperties/OPE).
        forceReload: true,

        _execute: function () {
            // summary:
            //    Executes this command; publish the current content
            //
            // tags:
            //		protected

            var def = new Deferred();

            // Execute base to change content status
            Deferred.when(this.inherited(arguments), function (result) {
                // Update tree children nodes
                //TODO: Compare if children sort order has changed before triggering on children changed message.
                //TODO: Compare if the sort order property has changed to see if children changed should be triggered on the parent page
                //if this has sorting by sort order.
                var versionAgnosticId = new ContentReference(result.oldId).createVersionUnspecificReference().toString();
                topic.publish("/epi/cms/contentdata/childrenchanged", versionAgnosticId);
                def.resolve();
            }, function () {
                def.reject();
            });

            return def;
        },

        _onModelChange: function () {
            // summary:
            //		Updates canExecute after the model has been updated.
            // tags:
            //		protected

            this.inherited(arguments);

            var contentData = this.model.contentData,
                versionStatus = contentData.status,
                isAvailable = this.model.canChangeContent(ContentActionSupport.action.Publish),
                canExecute = isAvailable && !(versionStatus === ContentActionSupport.versionStatus.Published && !contentData.isCommonDraft),
                res = null;

            switch (versionStatus) {
                case ContentActionSupport.versionStatus.CheckedIn:
                    res = resources.approveandpublish;
                    break;
                case ContentActionSupport.versionStatus.PreviouslyPublished:
                    res = resources.republish;
                    break;
                case ContentActionSupport.versionStatus.CheckedOut:
                    if (contentData.isMasterVersion) {
                        res = resources.publish;
                    } else {
                        res = resources.publishchanges;
                    }
                    break;
                default:
                    res = resources.publishchanges;
            }

            var publishView = TypeDescriptorManager.getValue(contentData.typeIdentifier, "publishView");

            this.set("label", res.label);
            this.set("title", res.title);
            this.set("executingLabel", res.executinglabel);
            this.set("canExecute", canExecute);
            this.set("isAvailable", isAvailable);
            this.set("viewName", publishView);
        }
    });

});
