//>>built
define("epi-cms/project/command/AddProject",["dojo/_base/declare","./_ProjectCommand","epi-cms/project/ProjectDialogContent","epi-cms/contentediting/command/_CommandWithDialogMixin","epi/i18n!epi/cms/nls/episerver.cms.components.project.command.newproject"],function(_1,_2,_3,_4,_5){return _1([_2,_4],{label:_5.label,title:_5.label,canExecute:true,iconClass:"epi-iconPlus",defaultActionsVisible:true,dialogClass:"epi-dialog-landscape",dialogContentClass:_3,onDialogExecute:function(){this.model.addProject(this.dialogContent.get("value"));},_execute:function(){this.showDialog();}});});