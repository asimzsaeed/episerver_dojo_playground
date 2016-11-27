define([
     "dojo/_base/declare",
     "dojo/aspect",
     "dojo/_base/lang",
     "dijit/_WidgetBase",
     "dijit/_OnDijitClickMixin",
     "dijit/_TemplatedMixin",
     "dojo/text!./menu.html",
     "dojo/i18n!../../nls/common",
     "epi/dependency",
     "epi-cms/_ContentContextMixin",
     "epi/shell/component/IFrameContextComponent",
      "../../services/ContentStore",
], function (declare, aspect, lang, _WidgetBase, ondijitclick, _TemplatedMixin, template, nls, dependency, _ContentContextMixin, _IFrameContextComponent, _ContentStore) {
   
    var epiContent;

    return declare("Vizob.MenuWidget", [_WidgetBase, ondijitclick, _TemplatedMixin, _ContentContextMixin, _ContentStore, _IFrameContextComponent], {
        templateString: template,
        postCreate: function () {
            this.inherited(arguments);
            epiContent = this.getCurrentContext();
            //label
            this.homeNode.innerHTML = nls.lblMenuWidget.homeLabel;
            this.studyNode.innerHTML = nls.lblMenuWidget.studyLabel;
           

            this.getCurrentContent().then(function (item) {
                console.info("getCurrentContent>>", item);
                epiContent = item;
                this.currentContentNode.innerHTML = epiContent.name;
            });

            
        },
        
        contentContextChanged: function (epiContent) {
            console.info('contentContextChanged>>');
            this.updateMenuLabels(epiContent);
        },
        updateMenuLabels: function (epiContent) {
            this.currentContentNode.innerHTML = epiContent.name;
        },

        onPreviewMode: function () {
            console.info("onPreviewMode>>");
            this.getContentById(1)
                .then(function (item) {
                    console.info("onPreviewMode>>getContentById>>", item);
                });
        },
        onBuildMode: function () {
            console.info("onBuildMode>>");
            var _iFrameContextComponent = new _IFrameContextComponent();
            _iFrameContextComponent.load('http://localhost:64945/EPiServer/Cms/#viewsetting=viewlanguage:///en&context=epi.cms.contentdata:///5', null, true)
            .then(function (item) {
                console.info("onPreviewMode>>getContentById>>", item);
            })
            .cancel(function (ex) {
                console.info("onPreviewMode>>cancel>>", ex);
            })
           
        },
        onCommentMode: function () {
            console.info("onCommentMode>>", epiContent);
            _iFrameContextComponent.load(epiContent.uri, null, true);
        },
        onStatsMode: function () {
            alert("Awesome!!onStatsMode");
        }
    });
});