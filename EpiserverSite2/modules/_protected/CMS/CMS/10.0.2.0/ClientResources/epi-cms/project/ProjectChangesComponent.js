//>>built
require({cache:{"url:epi-cms/project/templates/ProjectChangesComponent.html":"<div>\n    <div data-dojo-type=\"epi-cms/project/ProjectItemList\"\n         data-dojo-attach-point=\"itemList\"\n         data-dojo-props=\"commandSource: this.model, listItemType: 'card-compact', res: this.res\">\n        <section data-epi-section=\"toolbarSection\">\n            <div data-dojo-attach-point=\"toolbarGroupNode\" class=\"epi-floatRight\"></div>\n        </section>\n        <section data-epi-section=\"listContainer\">\n            <div data-dojo-attach-point=\"placeholderNode\" class=\"epi-project-gadget__placeholder dijitHidden\"></div>\n        </section>\n    </div>\n</div>\n"}});define("epi-cms/project/ProjectChangesComponent",["dojo/_base/declare","dojo/_base/lang","dojo/aspect","dojo/dom-class","dojo/dom-geometry","dojo/on","dojo/when","epi/shell/command/_WidgetCommandBinderMixin","./_ProjectView","./viewmodels/ProjectChangesComponentViewModel","dojo/text!./templates/ProjectChangesComponent.html","epi/i18n!epi/cms/nls/episerver.cms.components.project.changes","dijit/DropDownMenu","dijit/form/Button","dijit/form/DropDownButton","dijit/Toolbar","./ProjectItemList"],function(_1,_2,_3,_4,_5,on,_6,_7,_8,_9,_a,_b){return _1([_8,_7],{modelBindingMap:{projectItemQuery:["projectItemQuery"],projectItemSortOrder:["projectItemSortOrder"],dndEnabled:["dndEnabled"],contentLanguage:["contentLanguage"]},res:_b,templateString:_a,"class":"epi-project-changes-component",layout:function(){this.inherited(arguments);this.itemList.resize(this._contentBox,this._contentBox);},_createViewModel:function(){return new _9();}});});