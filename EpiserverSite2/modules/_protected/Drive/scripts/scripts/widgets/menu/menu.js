define([
     "dojo/_base/declare",
     "dojo/aspect",
     "dojo/_base/lang",
     "dojo/dom-attr",
     "dijit/_WidgetBase",
     "dijit/_OnDijitClickMixin",
     "dijit/_TemplatedMixin",
     "epi-cms/_ContentContextMixin",

     "dojo/text!./menu.html",
     "dojo/i18n!../../nls/common",
    
      "../../services/ContentStore",
       "../../util/layout",
], function (
    declare,
    aspect,
    lang,
    domAttr,
    _WidgetBase,
    ondijitclick,
    _TemplatedMixin,
    _ContentContextMixin,

    template,
    nls,

    _ContentStore,
    _VizLayout
    ) {
    return declare("Vizob.MenuWidget", [_WidgetBase, ondijitclick, _TemplatedMixin, _ContentContextMixin, _ContentStore], {
        templateString: template,
        baseUrl: null,
        vizLayout:null,
        epiCurrentContent: null,
        constructor: function() {
            this.baseUrl = "https://www.google.co.uk/";
            this.vizLayout = new _VizLayout();
        },
        postCreate: function () {
            this.inherited(arguments);
            this.epiCurrentContent = this.getCurrentContext();
            //label
            this.homeNode.innerHTML = nls.lblMenuWidget.homeLabel;
            this.studyNode.innerHTML = nls.lblMenuWidget.studyLabel;
            this.currentContentNode.innerHTML = this.epiCurrentContent.name;
            domAttr.set(this.currentContentNode, "href", this.epiCurrentContent.editablePreviewUrl);
        },
        contentContextChanged: function (epiContent) {
            console.info('contentContextChanged>>');
            this.epiCurrentContent = epiContent;
            //this.updateMenuLabels(epiContent);
        },
        //updateMenuLabels: function (epiContent) {
           
        //    this.currentContentNode.innerHTML = this.epiCurrentContent.name;
        //},
        onServiceCall: function () {
            console.info("onServiceCall>>");
            this.getContentById(1)
                .then(function (item) {
                    console.info("onPreviewMode>>getContentById>>", item);
                });
        },
        onPreviewMode: function () {
            console.info("onPreviewMode>>", this.epiCurrentContent);
            this.vizLayout.loadContentByUrl('/EPiServer/CMS/Content/about-us,,16/?epieditmode=True&epiprojects=1')
        },
        onBuildMode: function () {
            console.info("onBuildMode>>");
            var _vizLayout = new _VizLayout();
            this.vizLayout.loadBuild();
        },
        onCommentMode: function () {
            alert("Awesome!!onCommentMode");
        },
        onStatsMode: function () {
            alert("Awesome!!onStatsMode");
        }
    });
});

