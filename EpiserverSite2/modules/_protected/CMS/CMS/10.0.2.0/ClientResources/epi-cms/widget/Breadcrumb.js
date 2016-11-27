//>>built
define("epi-cms/widget/Breadcrumb",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/aspect","dojo/Deferred","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/on","dojo/when","dojo/query","dojo/NodeList-manipulate","dojo/topic","dijit/_Widget","dijit/layout/_LayoutWidget","epi/dependency","epi-cms/core/ContentReference","epi-cms/contentediting/_ContextualContentContextMixin","epi-cms/widget/_HierarchicalModelMixin"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,on,_a,_b,_c,_d,_e,_f,_10,_11,_12,_13){return _2([_f,_13,_12],{contentLink:null,store:null,showCurrentNode:true,showLastBracket:false,displayAsText:true,minimumItemCount:null,baseClass:"epi-breadCrumbs",_resizeListener:null,_visibleItems:[],_currentContent:null,_ancestors:null,postMixInProperties:function(){var _14=_10.resolve("epi.storeregistry");this.store=this.store||_14.get("epi.cms.content.light");this.minimumItemCount=this.minimumItemCount||2;},buildRendering:function(){this.domNode=this.ownerDocument.createElement("ul");this.inherited(arguments);},startup:function(){this._addResizeListener();},destroy:function(){if(this._resizeListener){this._resizeListener.remove();}this.destroyDescendants();this.inherited(arguments);},_addResizeListener:function(){if(this._resizeListener){return;}var _15=this.getParent(),_16=_15;while(_16&&!_16.isLayoutContainer&&_16.getParent()){_16=_16.getParent();}if(_16&&_16!==_15){this._resizeListener=_4.after(_16,"resize",_3.hitch(this,function(){var _17=_8.getMarginBox(this.domNode);this.resize(_17);}));}},resize:function(_18){if(!_18&&this._resizeListener){return;}else{this.layout();}},layout:function(){this._visibleItems=[];_a(this._buildPath(),_3.hitch(this,function(){var _19=_8.getContentBox(this.domNode).w;if(_19>this._availableWidth){var _1a=this._leadingItem?_8.getMarginBox(this._leadingItem.domNode).w:0;var _1b=this._availableWidth-_1a;this._ellipsisize(0,_1b);}}));},_setContentLinkAttr:function(_1c){this._set("contentLink",_1c);this._currentContent=null;this._ancestors=null;this.layout();},_buildPath:function(){var _1d=this.get("contentLink"),def=new _5(),_1e="";if(this._currentContent&&this._ancestors){this._createAllItems();def.resolve(_1e);}else{if(_1d){var _1f=new _11(_1d);var _20=_1f.createVersionUnspecificReference().toString();_a(this.getCurrentContext(),_3.hitch(this,function(ctx){_a(this.store.get(_20),_3.hitch(this,function(_21){this.getAncestors(_20,_3.hitch(this,function(_22){this._currentContent=_21;this._ancestors=_22;this._createAllItems();def.resolve(_1e);}));}));}));}else{def.resolve(_1e);}}return def.promise;},_createAllItems:function(){this._cleanUp();if(!this.isTypeOfRoot(this._currentContent)){var _23=[],_24=null;for(var i=this._ancestors.length-1;i>=0;i--){_24=this._ancestors[i];if(!_24.parentLink){continue;}_23.push(_24);if(this.isTypeOfRoot(_24)){break;}}_23.reverse();var _25=_8.getContentBox(this.domNode).w;this._availableWidth=_25>=0?_25:0;_1.forEach(_23,_3.hitch(this,function(_26){this._createItem(_26,true);}));}if(this.showCurrentNode){this._createItem(this._currentContent,this.showLastBracket);}},_cleanUp:function(){this.destroyDescendants();this._leadingItem=null;this._visibleItems=[];},_createItem:function(_27,_28){var _29,_2a=_7.create("li"),_2b=this.displayAsText||!_27.hasTemplate;if(_2b){_29=_7.create("span",null,_2a);}else{_29=_7.create("a",{href:"#"},_2a);this.own(on(_29,"click",_3.hitch(this,function(e){this.onNodeClick(e,_27);})));}_29.textContent=this.isContextualContent(_27)?this.getContextualRootName(_27):_27.name;if(_28){_7.create("span",{innerHTML:"&gt;","class":"epi-breadCrumbsSeparator"},_2a);}this._addAndLayout(_2a);},onNodeClick:function(e,_2c){e.preventDefault();_d.publish("/epi/shell/context/request",{uri:_2c.uri},{sender:this});},_addAndLayout:function(_2d){var _2e=new _e({},_2d);this._visibleItems.push(_2e);this.addChild(_2e);var _2f=this._getTotalVisibleItemsSize();if(_2f>this._availableWidth){this._ensureLeadingItem();while(_2f>this._availableWidth&&this._visibleItems.length>this.minimumItemCount){var _30=this._visibleItems.splice(0,1)[0];_9.set(_30.domNode,"display","none");_2f=this._getTotalVisibleItemsSize();}}},_getTotalVisibleItemsSize:function(){var _31=0;if(this._leadingItem){_31+=_8.getMarginBox(this._leadingItem.domNode).w;}_1.forEach(this._visibleItems,function(_32){_31+=_8.getMarginBox(_32.domNode).w;});return _31;},_ensureLeadingItem:function(){if(this._leadingItem){return;}var _33=_7.create("li"),_34=_7.create("span",{innerHTML:"..."}),_35=_7.create("span",{innerHTML:" &gt; ","class":"epi-breadCrumbsSeparator"});_7.place(_34,_33,"last");_7.place(_35,_33,"last");this._leadingItem=new _e({},_33);this.addChild(this._leadingItem,0);},_ellipsisize:function(_36,_37){if(_36>=this._visibleItems.length){return;}var _38=this._visibleItems.length-_36,_39=Math.floor(_37/_38),_3a=this._visibleItems[_36],_3b=_8.getMarginBox(_3a.domNode).w;if(_3b<=_39){this._ellipsisize(_36+1,_37-_3b);}else{var _3c=_b(this.displayAsText?"span":"a",_3a.domNode)[0],_3d=_b("span.epi-breadCrumbsSeparator",_3a.domNode)[0],_3e=_39-_8.getMarginBox(_3d).w;if(_3e<0){_3e=0;}_9.set(_3c,"width",_3e+"px");_6.add(_3c,"dojoxEllipsis");this._ellipsisize(_36+1,_37-_39);}}});});