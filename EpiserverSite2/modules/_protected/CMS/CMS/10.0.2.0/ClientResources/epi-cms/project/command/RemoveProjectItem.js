//>>built
define("epi-cms/project/command/RemoveProjectItem",["dojo/_base/declare","./_ProjectCommand","epi/i18n!epi/cms/nls/episerver.cms.components.project.command.removeprojectitem"],function(_1,_2,_3){return _1([_2],{category:"itemContext",label:_3.label,modelPropertyToWatch:"selectedProjectItems",_execute:function(){return this.model.removeSelectedProjectItems();},_setCanExecute:function(){var _4=this,_5=this.model,_6=_5&&_5.selectedProjectItems&&_5.selectedProjectItems.length,_7=_5.selectedProject;this.set("canExecute",false);this.model.projectService.getCurrentProject().then(function(_8){var _9=_7&&(_7.status==="active"||_7.status==="publishfailed"||_8);_4.set("canExecute",!!(_6&&_9));});}});});