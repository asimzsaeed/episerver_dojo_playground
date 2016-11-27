define("epi-cms/compare/views/CompareView", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    // Parent class
    "epi-cms/contentediting/PageDataController",
    // Toolbar
    "epi-cms/compare/CompareToolbar",
    "epi-cms/compare/viewmodels/CompareViewModel"
], function (
    declare,
    lang,
    topic,
    // Parent class
    PageDataController,
    // Toolbar
    CompareToolbar,
    CompareViewModel
) {

    return declare([PageDataController], {

        buildRendering: function () {
            this.inherited(arguments);

            var model = new CompareViewModel(),
                container = this.mainLayoutContainer,
                toolbar = new CompareToolbar({
                    region: "top",
                    splitter: false,
                    model: model.compareToolbarViewModel
                });

            container.addChild(toolbar);

            this.set("compareModel", model);

            this.own(
                model,
                model.watch("leftVersionUri", lang.hitch(this, function (name, oldUri, uri) {
                    this._changeContext(uri);
                })),
                toolbar,
                toolbar.on("versionInformationUpdated", function () {
                    container.layout();
                })
            );
        },

        setView: function (viewName, viewParams) {
            viewParams = lang.mixin({ model: this.compareModel }, viewParams);

            return this.inherited(arguments, [viewName, viewParams]);
        },

        _changeContext: function (uri) {
            // tags:
            //      private

            if (uri && this._currentViewModel && uri !== this._currentViewModel.contentData.uri) {
                // Request a context change
                topic.publish("/epi/shell/context/request", { uri: uri }, { sender: this });
            }
        },

        _refreshModel: function (contentData, context) {
            this.inherited(arguments);
            this.compareModel.set({
                contentLink: contentData.contentLink,
                typeIdentifier: contentData.typeIdentifier,
                languages: contentData.existingLanguageBranches
            });
        },

        _switchEditMode: function () {
            // If this is the active component when a switch edit mode event
            // occurs, then switch to form editing.
            if (this.isActive) {
                topic.publish("/epi/shell/action/changeview", "formedit");
            }
        }
    });
});
