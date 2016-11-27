define("epi-cms/command/ViewSettingsCommandProvider", [
    "dojo/_base/declare",

    "epi/dependency",

    "epi-cms/command/TogglePreviewMode",
    "epi-cms/command/ToggleViewSettings",
    "epi-cms/visitorgroups/command/VisitorGroupViewSettingsCommand",

    "epi-cms/project/ProjectPreviewButton",

    "epi-cms/contentediting/command/LanguageSelection",
    "epi-cms/contentediting/viewmodel/LanguageSettingsModel",
    "./DeviceSelection",

    "epi-cms/component/command/_GlobalToolbarCommandProvider",
    // Resources
    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.toolbar.buttons.togglepreviewmode"
], function (
    declare,

    dependency,

    TogglePreviewMode,
    ToggleViewSettings,
    VisitorGroupViewSettingsCommand,

    ProjectPreviewButton,

    LanguageSelection,
    LanguageSettingsModel,
    DeviceSelection,

    _GlobalToolbarCommandProvider,

    resources
    ) {

    return declare([_GlobalToolbarCommandProvider], {
        // summary:
        //      Provides view settings commands to the global toolbar
        // tags:
        //      internal


        postscript: function () {
            // summary:
            //      Instantiates and add the view commands.
            // tags:
            //      public

            this.inherited(arguments);

            // Needed since the global toolbar looks at the category both on the commands and on a settings object on the commands
            var settings = {category: "view"};

            this.projectService = this.projectService || dependency.resolve("epi.cms.ProjectService");

            var model = new LanguageSettingsModel();

            this.add("commands", new ToggleViewSettings({
                settings: settings,
                category: settings.category
            }));

            this.add("commands", new LanguageSelection({
                category: settings.category,
                showLabel: true,
                settings: settings,
                optionsProperty: "availableLanguages",
                property: "selectedLanguage",
                model: model
            }));

            this.add("commands", new VisitorGroupViewSettingsCommand({
                category: settings.category,
                settings: settings
            }));

            this.add("commands", new DeviceSelection({
                settings: settings,
                category: settings.category
            }));

            // Add the Project Preview button if Project Mode is disabled
            if (!this.projectService.isProjectModeEnabled) {
                this.add("commands", {
                    settings: settings,
                    category: settings.category,
                    widget: new ProjectPreviewButton({showLabel: false})
                });
            }

            this.add("commands", new TogglePreviewMode({
                settings: settings,
                category: settings.category,
                innerText: resources.message
            }));
        }

    });
});
