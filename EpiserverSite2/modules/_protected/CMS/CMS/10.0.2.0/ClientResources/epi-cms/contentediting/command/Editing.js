//>>built
define("epi-cms/contentediting/command/Editing",["dojo/_base/declare","dojo/_base/lang","dojo/Stateful","epi/shell/command/withConfirmation","epi/shell/_StatefulGetterSetterMixin","epi-cms/command/TranslateContent","epi-cms/contentediting/command/RevertToPublished","epi-cms/contentediting/command/Reject","epi-cms/contentediting/command/SendForReview","epi-cms/contentediting/command/Publish","epi-cms/contentediting/command/CreateDraft","epi-cms/contentediting/command/Withdraw","epi-cms/contentediting/command/ManageExpiration","epi/i18n!epi/cms/nls/episerver.cms.contentediting.editactionpanel.publishactionmenu"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e){var _f=_1([_3,_5],{model:null,revertToPublished:null,reject:null,translate:null,createDraft:null,sendForReview:null,publish:null,withdraw:null,manageExpiration:null,constructor:function(_10){_2.mixin(this,_10);this.revertToPublished=_4(new _7(),null,{title:_e.reverttopublishconfirmation.dialogtitle,heading:_e.reverttopublishconfirmation.confirmquestion,description:_e.reverttopublishconfirmation.description});this.reject=new _8();this.translate=new _6();this.createDraft=new _b();this.sendForReview=new _9();this.publish=new _a();this.withdraw=new _c();this.manageExpiration=new _d();},_setModelAttr:function(_11){this._set("model",_11);this.revertToPublished.set("model",_11);this.reject.set("model",_11);this.translate.set("model",_11);this.createDraft.set("model",_11);this.sendForReview.set("model",_11);this.publish.set("model",_11);this.withdraw.set("model",_11);this.manageExpiration.set("model",_11);}});return new _f();});