//>>built
define("epi-cms/widget/_ContentListBase",["dojo/_base/declare","dojo/_base/lang","dojo/dom-construct","dojo/dom-geometry","dojo/when","./_GridWidgetBase"],function(_1,_2,_3,_4,_5,_6){return _1([_6],{storeKeyName:"epi.cms.content.search",trackActiveItem:false,gridAttachNode:null,_defaultGridNode:null,contextChangeEvent:"dblclick",postMixInProperties:function(){this.inherited(arguments);this.model=this.model||this.createModel();},postCreate:function(){this.inherited(arguments);this.createList();},createModel:function(){},createList:function(){var _7=this.getListSettings();_7=_2.mixin(_7,this.defaultGridMixin);if(!this.gridAttachNode){this._defaultGridNode=_3.create("div",null,this.domNode);}this.grid=new this._gridClass(_7,this.gridAttachNode||this._defaultGridNode);var _8=this.model&&this.model.commands&&this.model.commands.length>0;if(_8){this.grid.contextMenu.addProvider(this.model);}if(this.contextMenu){this.grid.contextMenu=this.contextMenu;}this.own(this.grid);this.setupEvents();},layout:function(){this.inherited(arguments);if(this._defaultGridNode){_4.setMarginBox(this._defaultGridNode,this._contentBox);}},getListSettings:function(){return {};},setupEvents:function(){},onContextChanged:function(){},_onSelect:function(e){_5(this.getCurrentContext(),_2.hitch(this,function(_9){var _a=this.grid;var _b={contextId:_9.id,data:[]};if(this.model){for(var id in _a.selection){if(_a.selection[id]){var _c=_a.row(id);_b.data.push(_c.data);}}this.model.set("model",_b);}}));}});});