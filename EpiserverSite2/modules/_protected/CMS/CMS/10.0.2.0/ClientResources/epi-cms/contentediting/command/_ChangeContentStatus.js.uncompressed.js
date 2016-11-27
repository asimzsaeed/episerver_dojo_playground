define("epi-cms/contentediting/command/_ChangeContentStatus", [
//Dojo
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/Deferred",
    "dojo/topic",

//EPi
    "epi-cms/core/ContentReference",
    "epi-cms/contentediting/command/_ContentCommandBase"
],

function (
//Dojo
    declare,
    lang,
    Deferred,
    topic,

//EPi
    ContentReference,
    _ContentCommandBase
) {

    return declare([_ContentCommandBase], {
        // summary:
        //      Base class for any Change content status commands, like: Reject, Publish, ...
        // tags: private, abstract

        // action: [public] String
        //      Action to perform when changing content status. For example: publish, checkin, checkout, ...
        action: null,

        // forceReload: [public] Boolean
        //      Indicate whether the command should demand a reload together with the context change request.
        forceReload: false,

        // viewName: [public] String
        //      Represents the view that will be display after changing content status. It might be null or empty.
        viewName: null,

        _execute: function () {
            // summary:
            //    Executes this command
            //
            // tags:
            //		protected

            return this._changeContentStatus();
        },

        _changeContentStatus: function () {
            // summary:
            //    Ask the model to change content status then request a context change.
            //
            // tags:
            //		protected

            var def = new Deferred(),
                onSuccess = lang.hitch(this, function (result) {
                    this._requestContextChange(result.id, true);
                    def.resolve(result);
                }),

                onError = function () {
                    def.cancel();
                };

            Deferred.when(this.model.changeContentStatus(this.action), onSuccess, onError);

            return def;
        },

        _requestContextChange: function (id, forceContextChange) {
            // id: String
            //      The published version.
            // forceContextChange: Boolean
            //      The flags to force context change or not.
            // tags:
            //      protected virtual.

            var contextParameters = { uri: "epi.cms.contentdata:///" +  id};
            var callerData = {
                sender: this,
                trigger: "internal",
                forceContextChange: forceContextChange,
                forceReload: this.forceReload
            };
            if (this.viewName) {
                lang.mixin(callerData, { viewName: this.viewName });
            }

            topic.publish("/epi/shell/context/request", contextParameters, callerData);
        }
    });

});
