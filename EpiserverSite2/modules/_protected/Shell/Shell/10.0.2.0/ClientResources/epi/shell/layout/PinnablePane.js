//>>built
require({cache:{"url:epi/shell/layout/templates/PinnablePane.html":"<div class=\"epi-pinnableDock\">\r\n    <div class=\"epi-pinnableFacade\">\r\n        <div class=\"epi-pinnablePane\" data-dojo-attach-point=\"pinnableNode\">\r\n            <div data-dojo-attach-point=\"toolbarNode\"></div>\r\n            <div class=\"epi-pinnableContentWrapper\">\r\n                <div class=\"epi-pinnableContent\" data-dojo-attach-point=\"containerNode\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"}});define("epi/shell/layout/PinnablePane",["dojo/_base/array","dojo/_base/declare","dojo/_base/event","dojo/_base/lang","dojo/_base/window","dojo/dom-class","dojo/dom-geometry","dojo/dom-style","dojo/topic","dojo/when","dojo/text!./templates/PinnablePane.html","dijit/_Contained","dijit/_Container","dijit/_TemplatedMixin","dijit/layout/ContentPane","epi/dependency","epi/i18n!epi/shell/ui/nls/episerver.shell.ui.resources","epi/shell/layout/PinnablePaneSplitter","epi/shell/widget/_ActionConsumerWidget","epi/shell/widget/_ActionProvider","epi/shell/widget/ToolbarSet"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15){return _2([_f,_e,_c,_d,_13],{pinned:false,visible:false,templateString:_b,baseClass:"epi-pinnable",postMixInProperties:function(){var _16=_10.resolve("epi.shell.Profile");this.inherited(arguments);_a(_16.get(this.id),_4.hitch(this,function(_17){if(_17){this.pinned=_17.pinned;this.visible=_17.visible;this.size=_17.size;}}));this._profile=_16;},buildRendering:function(){this.inherited(arguments);var _18=new _15({baseClass:"epi-pinnableToolbar"},this.toolbarNode);this.own(_18);this.set("definitionConsumer",_18);_8.set(this.containerNode,"width",(this.size||this.minSize)+"px");if(!this.pinned){this.set("pinned",this.pinned);}if(!this.visible){this.set("visible",this.visible);}},postCreate:function(){var _19="",ltr=this.isLeftToRight(),_1a=function(){if(this.visible){this._dragging=true;}},_1b=function(){this._dragging=false;};this.inherited(arguments);if(this.region){switch(this.region){case "trailing":case "right":_19=ltr?"right":"left";break;case "leading":case "left":_19=ltr?"left":"right";break;case "top":_19="top";break;case "bottom":_19="bottom";break;}_6.add(this.domNode,this.baseClass+"-"+_19);}this.subscribe("/epi/layout/pinnable/"+this.id+"/toggle",function(_1c){if(typeof _1c!=="boolean"){_1c=!this.visible;}this.set("visible",_1c);});this.subscribe("/dnd/start",_1a);this.subscribe("/dnd/drop",_1b);this.subscribe("/dnd/cancel",_1b);},startup:function(){var _1d=this._splitterWidget;if(this._started){return;}_1.forEach(this.getChildren(),function(_1e){if(_1e.isInstanceOf(_14)){this.addProvider(_1e);}},this);this.inherited(arguments);this._container=this.getParent();if(this.splitter&&_1d){_1d=_12(_1d);if(!this.visible){_1d.hide();}this.connect(_1d,"_stopDrag",this.persist);}this._refreshState();},resize:function(_1f){var pos=this.region,_20=this.visible&&this.pinned,_21=_7.getMarginBox(this.domNode),_22=_7.getMarginBox(this.containerNode),_23={},_24={t:_21.t},_25=pos==="left"||pos==="leading",_26=pos==="right"||pos==="trailing";if(!this._toolbarHeight){this._toolbarHeight=_7.getMarginBox(this.definitionConsumer.domNode).h;}_7.setMarginBox(this.domNode,{w:_20?_22.w:0});if(_1f){if(_1f.w){_23.w=_22.w=_1f.w;if(!this.pinned){delete _1f.w;}}if(_1f.h){_21.h=_1f.h;}}var _27=this._computeMaxSize();if(this._visibilityChanged&&_27<_22.w){_23.w=_22.w=_27;}_23.h=_21.h-this._toolbarHeight;_7.setMarginBox(this.containerNode,_23);if(_25){_24.l=_21.l;}else{if(_26){_24.l=_20?0:0-_22.w;}}_7.setMarginBox(this.pinnableNode,_24);if(this._splitterWidget){var _28=_7.getMarginBox(this._splitterWidget.domNode),_29={t:_21.t};if(_25){_29.l=_22.w;}else{if(_26){_29.l=_20?_21.l-_28.w:_21.l-_22.w;}}_7.setMarginBox(this._splitterWidget.domNode,_29);}this.inherited(arguments);},persist:function(){var _2a={pinned:this.pinned,visible:this.visible,size:_8.get(this.containerNode,"width")};this._profile.set(this.id,_2a);},getActions:function(){var _2b=this.inherited(arguments),_2c=/left|leading/.test(this.region),pin={name:"pin",widgetType:"dijit/form/ToggleButton",title:this._getPinTitle(),iconClass:"epi-iconPin",settings:{showLabel:false,"class":"epi-chromelessButton",checked:this.pinned,region:_2c?"trailing":"leading"},action:_4.hitch(this,this._togglePinned)},_2d={name:"settings",title:_11.gadgetchrome.settingsmenutooltip,type:"dropdown",iconClass:"epi-iconSettings",settings:{showLabel:false,"class":"epi-chromelessButton",dropDownPosition:_2c?["below-alt"]:["below"],region:_2c?"trailing":"leading"}};_2b.splice(0,0,_2d);_2b.splice(_2c?_2b.length:0,0,pin);return _2b;},_setPinnedAttr:function(_2e){this._set("pinned",_2e);_6.toggle(this.pinnableNode,this.baseClass+"-pinned",_2e);_6.toggle(this.pinnableNode,this.baseClass+"-unpinned",!_2e);_8.set(this.pinnableNode,"position",_2e?"relative":"absolute");this.definitionConsumer.setItemProperty("pin","title",this._getPinTitle());if(this._started){this._refreshState();}if(!this.pinned){this.set("visible",false);}},_setVisibleAttr:function(_2f){this._set("visible",_2f);_8.set(this.pinnableNode,"display",_2f?"block":"none");if(this._splitterWidget){(_2f)?this._splitterWidget.show():this._splitterWidget.hide();}if(this._started){this._visibilityChanged=true;this._refreshState();this._visibilityChanged=false;}},_togglePinned:function(){this.set("pinned",!this.pinned);},_refreshState:function(){this._disconnectUnpinnedEvents();if(this.visible&&!this.pinned){this._connectUnpinnedEvents();}this._container.layout();this.resize();this.persist();_9.publish("/epi/layout/pinnable/"+this.id+"/visibilitychanged",this.visible);},_connectUnpinnedEvents:function(){this._unpinnedEvents=[this.connect(this.domNode,"onmousedown",function(e){e.stopPropagation();}),this.connect(this._container.domNode,"onmousedown",_4.hitch(this,this.set,"visible",false)),this.connect(_5.global,"onresize",_4.hitch(this,this.set,"visible",false)),this.connect(this.domNode,"onmouseover",_3.stop),this.connect(this._container.domNode,"onmouseover",function(){if(this._dragging){this.set("visible",false);}}),_9.subscribe("/epi/shell/action/changeview",_4.hitch(this,this.set,"visible",false))];},_disconnectUnpinnedEvents:function(){_1.forEach(this._unpinnedEvents,this.disconnect);},_computeMaxSize:function(){var _30=_7.getMarginBox(this.domNode).w,_31=_1.filter(this._container.getChildren(),function(_32){return _32.region==="center";})[0],_33=_7.getMarginBox(_31.domNode).w;return Math.min(this.maxSize,_30+_33);},_getPinTitle:function(){return this.pinned?_11.pinnablepane.unpin:_11.pinnablepane.pin;}});});