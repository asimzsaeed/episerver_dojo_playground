//>>built
require({cache:{"url:epi/shell/widget/dialog/templates/LightWeight.html":"<div class=\"epi-lfw-dialog epi-lfw-dialog--dark dijitDialog\" role=\"dialog\" aria-labelledby=\"${id}_title\">\r\n    <div data-dojo-attach-point=\"titleBar\" class=\"dijitDialogTitleBar\">\r\n        <span data-dojo-attach-point=\"titleNode\" class=\"dijitDialogTitle\" id=\"${id}_title\"></span>\r\n         <span data-dojo-attach-point=\"closeButtonNode\" class=\"dijitDialogCloseIcon\" data-dojo-attach-event=\"ondijitclick: onButtonClose\" title=\"${buttonCloseText}\" role=\"button\" tabIndex=\"0\">\r\n            <span data-dojo-attach-point=\"closeText\" class=\"closeText\" title=\"${buttonCloseText}\">x</span>\r\n        </span>\r\n    </div>\r\n    <div class=\"dijitDialogPaneContent\">\r\n        <div data-dojo-attach-point=\"containerNode\" class=\"dijitDialogPaneContentArea\" data-dojo-attach-event=\"onclick:_onContainerNodeClick\"></div>\r\n        <div data-dojo-attach-point=\"buttonContainerNode\" class=\"dijitDialogPaneActionBar clearfix\">\r\n            <button data-dojo-attach-point=\"doneButtonNode\" data-dojo-type=\"dijit/form/Button\" type=\"button\">${buttonDoneText}</button>\r\n        </div>\r\n    </div>\r\n</div>\r\n"}});define("epi/shell/widget/dialog/LightWeight",["dojo/_base/declare","dojo/_base/lang","dojo/aspect","dojo/dom-geometry","dojo/dom-style","dojo/has","dijit/focus","dijit/DialogUnderlay","dijit/Dialog","epi/shell/widget/dialog/_DialogMixin","dijit/_WidgetsInTemplateMixin","epi/i18n!epi/nls/episerver.shared","dojo/text!./templates/LightWeight.html"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){return _1([_9,_a,_b],{templateString:_d,buttonCloseText:_c.action.close,buttonDoneText:_c.action.done,buttonLearnMoreText:_c.action.learnmore,useGlassUnderlay:false,_glassUnderlay:null,"class":"epi-lfw-dialog",snapToNode:null,positioner:null,showButtonContainer:true,destroy:function(){this._interval&&clearInterval(this._interval);this.inherited(arguments);},show:function(){return this.inherited(arguments).then(_2.hitch(this,this._onAfterShow));},_size:function(){var _e=this._relativePosition&&this._relativePosition.id;_5.set(this.containerNode,"overflow","visible");this.inherited(arguments);_5.set(this.containerNode,"overflow","auto");if(this.positioner){var _f={snapTo:this.snapToNode,transformIndex:_e};this._relativePosition=this.positioner.findPosition(this.domNode,_f);}},resize:function(){this._size();this._position();},_onAfterShow:function(){function _10(){var _11=_4.position(this.domNode),_12=this._relativePosition;if(_12&&(Math.abs(_12.w-_11.w)>8||Math.abs(_12.h-_11.h)>8)){this.resize();}};if(this.content&&this.content.focus){this.content.focus();}if(this.useGlassUnderlay){this._createUnderlay();}else{if(this._moveable&&!this._attachedMoveEvents){this.connect(this._moveable,"onMoveStart",_2.hitch(this,this._createUnderlay));this.connect(this._moveable,"onMoveStop",_2.hitch(this,this._removeUnderlay));this._attachedMoveEvents=true;}if(this.content&&this.content.onResizeStart&&this.content.onResizeStop&&!this._attachedContentResizeEvents){this.own(_3.after(this.content,"onResizeStart",_2.hitch(this,this._createUnderlay)),_3.after(this.content,"onResizeStop",_2.hitch(this,this._removeUnderlay)));this._attachedContentResizeEvents=true;}}this._interval=setInterval(_2.hitch(this,_10),250);this.onAfterShow();},_createUnderlay:function(){var _13=this.containerNode,_14=_5.get(_13,"width");if(_6("trident")){var _15=_13.offsetWidth-_13.clientWidth;_14+=_4.getPadBorderExtents(_13).w+_15;}_5.set(_13,{width:_14+"px"});if(this._glassUnderlay){this._glassUnderlay.show();}else{this.own(this._glassUnderlay=new _8());this._glassUnderlay.show();var _16=_5.get(this.domNode,"zIndex");_5.set(this._glassUnderlay.domNode,"zIndex",_16-1);_5.set(this._glassUnderlay.domNode,"opacity","0");}},_endDrag:function(){this.inherited(arguments);this._relativePosition.id=this.positioner.userSetTransformId;},_removeUnderlay:function(){this._glassUnderlay.hide();},_onContainerNodeClick:function(e){if(e.target===this.containerNode){this._getFocusItems();this._firstFocusItem&&_7.focus(this._firstFocusItem);}},_setSnapToNodeAttr:function(_17){this.snapToNode=null;this._set("snapToNode",_17);},onButtonClose:function(){},onAfterShow:function(){},onAfterHide:function(){},hide:function(){this._interval&&clearInterval(this._interval);this._interval=null;return this.inherited(arguments).then(_2.hitch(this,this._onAfterHide));},_onAfterHide:function(){if(this.useGlassUnderlay){this._removeUnderlay();}this.onAfterHide();},layout:function(){if(this._glassUnderlay&&_5.get(this._glassUnderlay.domNode,"display")!=="none"){this._glassUnderlay.layout();}var _18=_8._singleton;var _19=_18?_5.get(_18.domNode,"display"):null;this.inherited(arguments);if(_18){_5.set(_18.domNode,"display",_19);}},_setShowButtonContainerAttr:function(_1a){this._set("showButtonContainer",_1a);_5.set(this.buttonContainerNode,"display",_1a?"":"none");},_checkIfSingleChild:function(){this._singleChild=null;}});});