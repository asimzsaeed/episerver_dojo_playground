//>>built
define("epi-cms/contentediting/command/CreateDraft",["dojo/_base/declare","epi-cms/contentediting/command/_ContentCommandBase","epi-cms/contentediting/ContentActionSupport","epi/i18n!epi/cms/nls/episerver.cms.contentediting.toolbar.buttons"],function(_1,_2,_3,_4){return _1([_2],{name:"createdraft",label:_4.createdraft.label,tooltip:_4.createdraft.title,iconClass:"epi-iconPage",ignoreContentStatus:false,_execute:function(){this.model.createDraft();},_onModelChange:function(){var _5=this.model.contentData,_6=_5.status,_7=_3.versionStatus,_8,_9;this.inherited(arguments);_8=_3.hasAccessToAction(_5,_3.action.Edit,_3.providerCapabilities.Edit);_9=this.ignoreContentStatus||_6===_7.DelayedPublish||(_6===_7.Published||_6===_7.PreviouslyPublished)&&!_5.isCommonDraft;this.set({canExecute:_8&&_9,isAvailable:_8&&_9});}});});