dojo.require("epi-cms.ErrorDialog");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.store.DataStore");

(function () {
    return {
        uiCreated: function (namingContainer, settings) {
            dojo.xhrGet({
                url: '../VisitorGroupMembership/GetIncludableVisitorGroups?visitorGroupId=' + this.visitorGroupId,
                handleAs: 'json',
                preventCache: true,
                error: epi.cms.ErrorDialog.showXmlHttpError,
                load: function (jsonData) {
                    var stateStore = new dojo.data.ItemFileReadStore({
                        data: jsonData
                    });

                    var vgid = dijit.byId(namingContainer + 'VisitorGroupId');
                    vgid.store = new dojo.store.DataStore({ store: stateStore });

                    if (settings && settings.VisitorGroupId) {
                        stateStore.fetchItemByIdentity({
                            identity: settings.VisitorGroupId,
                            onItem: function (group) {
                                if (group) {
                                    vgid.set('value', settings.VisitorGroupId);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
})();
