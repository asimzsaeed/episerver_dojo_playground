define("vizob-epi-cms/study/_StudyView", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/on",
    "dojo/when",

// dijit
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/_LayoutWidget",

//// epi
//    "epi/shell/command/builder/MenuAssembler",
//    "epi/shell/command/builder/ButtonBuilder",
     "epi/shell/widget/_ModelBindingMixin"
//    "./CreateNewDraftConfirmationDialog",

//// Resources
//    "epi/i18n!epi/cms/nls/episerver.cms.components.project"
],

function (
// dojo
    declare,
    lang,
    aspect,
    domClass,
    domGeometry,
    on,
    when,

// dijit
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _LayoutWidget,

//// epi
//    MenuAssembler,
//    ButtonBuilder,
    _ModelBindingMixin
//    CreateNewDraftConfirmationDialog,

//// Resources
//    res
) {

    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, _ModelBindingMixin], {
        model: null,
        commandProvider: null,
        //res: res,
        _menuAssembler: null,

        postMixInProperties: function () {
            this.inherited(arguments);

            if (!this.model) {
                this.own(
                    this.model = this.commandProvider = this._createViewModel()
                );
            }
        },

        _createViewModel: function () {
         
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        startup: function () {
            if (this._started) {
                return;
            }
            this.inherited(arguments);
            this.model.initialize();
        }
    });
});
