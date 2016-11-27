//>>built
require({cache:{"url:epi-cms/contentediting/editors/templates/ItemCollectionEditor.html":"<div class=\"dijitInline\" tabindex=\"-1\" role=\"presentation\">\r\n    <!-- To reuse styling of content area we wrap into a div that include content area class -->\r\n    <div class=\"epi-content-area-editor\" data-dojo-attach-point=\"container\">\r\n        <div data-dojo-attach-point=\"itemsContainer\"></div>\r\n        <div data-dojo-attach-point=\"actionsContainer\" class=\"epi-content-area-actionscontainer\"></div>\r\n    </div>\r\n</div>\r\n"}});define("epi-cms/contentediting/editors/ItemCollectionEditor",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/_base/event","dojo/aspect","dojo/dom-class","dojo/dom-construct","dojo/dom-style","dojo/dom-geometry","dojo/keys","dojo/mouse","dojo/on","dojo/query","dojo/topic","dojo/when","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","dijit/layout/_LayoutWidget","epi/shell/dgrid/Formatter","epi/shell/dnd/Target","epi/shell/widget/_ValueRequiredMixin","epi/shell/widget/ContextMenu","epi/shell/TypeDescriptorManager","dgrid/Keyboard","dgrid/OnDemandList","dgrid/Selection","epi-cms/dgrid/formatters","epi-cms/dgrid/DnD","epi-cms/extension/events","epi-cms/contentediting/command/NewItem","epi-cms/contentediting/viewmodel/ItemCollectionViewModel","epi-cms/contentediting/command/ItemCollectionCommands","epi-cms/widget/_HasChildDialogMixin","./_TextWithActionLinksMixin","dojo/text!./templates/ItemCollectionEditor.html","epi/i18n!epi/cms/nls/episerver.cms.contentediting.editors.itemcollection"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,on,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15,_16,_17,_18,_19,_1a,DnD,_1b,_1c,_1d,_1e,_1f,_20,_21,_22){return _2([_11,_f,_10,_14,_1f,_20],{baseClass:"epi-item-collection-editor",multiple:true,res:_22,actionsResource:_22,templateString:_21,value:null,model:null,contextMenu:null,grid:null,commandProviderClass:_1e,_newItemCommand:null,_gridClass:_2([_18,_12,_19,DnD,_17]),_mouseOverClass:"epi-dgrid-mouseover",actionsVisible:true,customTypeIdentifier:null,onChange:function(_23){},postMixInProperties:function(){this.inherited(arguments);this.setupAllowedTypes();},postCreate:function(){this.inherited(arguments);this.set("model",new _1d(this.value,{itemModelType:this.itemModelType,readOnly:this.readOnly}));this.setupCommands();this.setupList();this.setupActionContainer();this.setupEvents();},startup:function(){this.inherited(arguments);this.contextMenu.startup();},setupActionContainer:function(){this.own(this._dndTarget=new _13(this.actionsContainer,{accept:this.get("allowedDndTypes"),isSource:false,alwaysCopy:false,insertNodes:function(){}}));this.setupActionLinks(this.actionsContainer);this._displayActionsContainer();},setupCommands:function(){this.contextMenu=this.contextMenu||new _15();this.commandProvider=this.commandProvider||new this.commandProviderClass({model:this.model,commandOptions:this.commandOptions});this.contextMenu.addProvider(this.commandProvider);this.own(this.contextMenu,this.commandProvider,this._newItemCommand=new _1c({model:this.model,dialogContentParams:this.commandOptions?this.commandOptions.dialogContentParams:{}}));},setupList:function(){var _24={hasMenu:!!this.contextMenu,settings:{title:this.res?this.res.menutooltip:""}},_25=function(_26,_27,row){return "<div class='epi-rowIcon'><span class='dijitInline dijitIcon epi-iconLink epi-objectIcon'></span></div>"+_26;},_28={selectionMode:"single",selectionEvents:"click,dgrid-cellfocusin",formatters:[_1a.contentItemFactory("text","title","typeIdentifier",_24),_25],dndParams:{copyOnly:true,accept:this.get("allowedDndTypes"),creator:_3.hitch(this,this._dndNodeCreator),isSource:!this.readOnly},dndSourceTypes:this.customTypeIdentifier?[this.customTypeIdentifier]:[],consumer:this},_29=function(_2a){var _2b=_16.getAndConcatenateValues(this.dndSourceTypes,"dndTypes");if(_2b.length===0){_2b=this.dndSourceTypes;}return _2b;};if(this.customTypeIdentifier){_28._getDndType=_29;}this.own(this.grid=new this._gridClass(_28,this.itemsContainer));this.grid.set("showHeader",false);this.grid.renderArray(this.model.get("data"));this.grid.startup();},setupEvents:function(){var _2c=this,_2d=on.selector;this.own(_2c.model.on("selectedItem",_3.hitch(this,this.focus)),_2c.model.on("initCompleted",_3.hitch(this,this._renderUI)),_2c.grid.on(_2d(".dgrid-row",_b.enter),function(e){_6.add(_2c,_2c._mouseOverClass);}),_2c.grid.on(_2d(".dgrid-row",_b.leave),function(e){_6.remove(_2c,_2c._mouseOverClass);}),_2c.grid.on("dgrid-select",function(e){_2c.model.set("selectedItem",e.rows[0].data);_2c.commandProvider.set("model",_2c.model);}),_2c.grid.on(_2d(".dgrid-row",_1b.keys.del),function(e){_2c.model.remove();}),_2c.grid.on(_2d(".dgrid-row",_1b.keys.shiftf10),function(e){_2c._showContextMenu(e);}),_2c.grid.on(_2d(".dgrid-row",_1b.contextmenu),function(e){var _2e=_2c.grid.row(e).data;_2c.model.set("selectedItem",_2e);_2c.select(_2e);_2c._showContextMenu(e);}),_2c.grid.on(".epi-iconContextMenu:click",function(e){_2c.contextMenu.scheduleOpen(_2c,null,{x:e.pageX,y:e.pageY});}),_5.around(_2c.grid.dndSource,"checkAcceptance",function(_2f){return function(_30,_31){return !_2c.readOnly&&_2f.apply(_2c.grid.dndSource,arguments);};}),_5.after(_2c.grid.dndSource,"onDropData",function(_32,_33,_34,_35){var i;if(_2c.grid.dndSource===_33){for(i=0;i<_34.length;i++){_2c.model.moveTo(_2c.grid.dndSource.getItem(_34[i].id).data,_2c.grid.dndSource.current!=null?_2c.grid.dndSource.getItem(_2c.grid.dndSource.current.id).data:null,_2c.grid.dndSource.before);}}else{var _36;for(i=0;i<_32.length;i++){_e(_32[i].data,_3.hitch(this,function(_37){_2c.model.addTo(_37,_2c.grid.dndSource.current!=null?this.grid.dndSource.getItem(_2c.grid.dndSource.current.id).data:null,_2c.grid.dndSource.before);if(_33&&_33.grid&&_33.grid.consumer&&_33.grid.consumer!==_2c){_33.grid.consumer.model.set("selectedItem",_37);_33.grid.consumer.model.remove();}}));}}},true),_5.around(_2c.grid,"insertRow",_3.hitch(_2c,_2c._aroundInsertRow)),this.model.on("changed",_3.hitch(this,function(){this.onChange(this.value=this.model.get("value")||[]);this._renderUI();this.focus();})),_5.after(this.grid.dndSource,"onDndStart",_3.hitch(this,function(_38,_39,_3a){var _3b=this.grid.dndSource,_3c=_3b.accept&&_3b.checkAcceptance(_38,_39);_6[_3c?"remove":"add"](this.container,"dojoDndTargetDisabled");}),true),_5.after(this._dndTarget,"onDropData",_3.hitch(this,function(_3d,_3e,_3f,_40){var _41;for(var i=0;i<_3d.length;i++){_e(_3d[i].data,_3.hitch(this,function(_42){this.model.addTo(_42,null,false);if(_3e&&_3e.grid&&_3e.grid.consumer&&_3e.grid.consumer!==this){_3e.grid.consumer.model.set("selectedItem",_42);_3e.grid.consumer.model.remove();}}));}this.focus();}),true));var _43=this.commandProvider.commands.concat(this._newItemCommand);_43.forEach(function(_44){this.own(_5.after(_44,"onDialogOpen",function(){_2c.set("isShowingChildDialog",true);_2c.validate();}),_5.after(_44,"onDialogHideComplete",function(){_2c.set("isShowingChildDialog",false);_2c.focus();}));},this);},executeAction:function(_45){if(_45==="createnewitem"){if(this._newItemCommand){this._newItemCommand.execute();}}},setupAllowedTypes:function(){var _46=this.itemConverterKey;this.allowedDndTypes=this.allowedDndTypes||[];if(_46){this.allowedDndTypes=this.allowedDndTypes.map(function(_47){return _47+"."+_46;});}if(this.customTypeIdentifier){this.allowedDndTypes.unshift(this.customTypeIdentifier);}},focus:function(){if(this.grid&&this.value&&this.value.length>0){this.grid.focus();if(this.model){var _48=this.model.get("selectedItem"),_49=this.model.getItemIndex(_48);if(_48){this.grid.focus(this.grid.row(_49).element);}}}else{this.textWithLinks.focus();}},select:function(_4a){this.grid.clearSelection();if(_4a){this.grid.select(this.model.getItemIndex(_4a));}},isValid:function(){return (!this.required||(this.model&&this.model.get("value").length>0));},_onBlur:function(){if(this.contextMenu&&this.contextMenu.isShowingNow){return;}this.inherited(arguments);},_getValueAttr:function(){return this.model.get("value");},_setValueAttr:function(val){this._set("value",val);if(!val||!(val instanceof Array)){this._set("value",[]);}if(this._started){this.model?this.model.set("data",this.value):(this.model=new _1d(this.value,{readOnly:this.readOnly}));this._renderUI();}},_setReadOnlyAttr:function(_4b){this._set("readOnly",_4b);this._displayActionsContainer();if(this.model){this.model.set("readOnly",_4b);}},_dndNodeCreator:function(_4c,_4d){var _4e=this.allowedDndTypes,_4f=_7.create("div").appendChild(document.createTextNode(_4c.text));if(_4c.typeIdentifier){_4e=_16.getAndConcatenateValues(_4c.typeIdentifier,"dndTypes");}return {node:_4f,type:_4e,data:_4c};},_aroundInsertRow:function(_50){return _3.hitch(this,function(_51,_52,_53,i,_54){var row=_50.apply(this.grid,arguments);var _55=this.model.get("selectedItem");if(_55&&_55.id===_51.id){this.select(_55);}return row;});},_renderUI:function(){this.grid.refresh();this.grid.renderArray(this.model.get("data"));},_showContextMenu:function(e){if(this.readOnly){return;}var _56=this.model.get("selectedItem"),_57=this.model.getItemIndex(_56);if(_56){_4.stop(e);this.contextMenu.scheduleOpen(this,null,_9.position(_c(".epi-iconContextMenu",this.grid.row(_57).element)[0],true));}},_displayActionsContainer:function(){_8.set(this.actionsContainer,"display",this.readOnly||!this.actionsVisible?"none":"");}});});