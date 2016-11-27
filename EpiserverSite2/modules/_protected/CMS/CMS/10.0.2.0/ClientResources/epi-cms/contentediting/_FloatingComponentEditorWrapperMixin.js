//>>built
define("epi-cms/contentediting/_FloatingComponentEditorWrapperMixin",["dojo/_base/declare","dojo/_base/lang","dojo/aspect","dojo/dom-geometry","dojo/dom-style","epi-cms/contentediting/_HasFloatingComponent","epi-cms/contentediting/FloatingComponentHandler"],function(_1,_2,_3,_4,_5,_6,_7){return _1(null,{_component:null,_viewport:null,_viewportIframe:null,_viewportScroller:null,_componentOverlayItem:null,_floatingComponentHandler:null,onComponentFloat:function(_8){this._onComponentFloat(_8);},setupFloatingComponentEditorWrapper:function(_9){this._component=_9.componentInfo.component;this.own(_3.after(this._component,"onComponentFloat",_2.hitch(this,function(){_2.mixin(_9,{floatingInfo:{delayTime:100}});this._onComponentFloat(_9);})));},destroy:function(){this._clearLocalDefers();this._component=null;this._componentOverlayItem=this._viewport=this._viewportScroller=null;this._floatingComponentHandler=null;this.inherited(arguments);},_onComponentFloat:function(_a){this._clearLocalDefers();var _b=_a.floatingInfo.delayTime,_c=_2.hitch(this,function(){var _d=_a.componentInfo;this._component=_d.component;this._componentOverlayItem=_d.componentOverlayItem;this._viewport=_d.viewport;this._viewportIframe=_d.viewportIframe;this._viewportScroller=_d.viewportScroller;this._isValidComponent()&&this._getFloatingComponentHandler().setComponentPosition(this._component.getComponentInfo(),this._getScrollInfo(_2.delegate(this._getViewportScrollInfo(),_a.floatingInfo||{})));});_b==null?_c():this._deferOnComponentFloat=this.defer(_c,_b);},_clearLocalDefers:function(){this._deferOnComponentFloat&&this._deferOnComponentFloat.remove();},_isValidComponent:function(){return this._component&&this._component.isInstanceOf(_6);},_getScrollInfo:function(_e){return {viewportScrollInfo:this._updateViewportScrollInfo(_e),overlayItemScrollInfo:this._getOverlayItemScrollInfo()};},_getViewportScrollInfo:function(){return {refreshPosition:false,scrollTop:this._viewport.scrollTop,scrollLeft:this._viewportScroller.scrollLeft===0?this._viewport.scrollLeft:this._viewportScroller.scrollLeft};},_getOverlayItemScrollInfo:function(){if(!this._componentOverlayItem){return;}var _f=_4.position(this._componentOverlayItem);return {bottom:_f.y+_f.h,height:_f.h,horizontal:_f.y,left:_5.get(this._componentOverlayItem,"left"),right:_f.x+_f.w,top:_5.get(this._componentOverlayItem,"top"),vertical:_f.x,width:_f.w};},_getFloatingComponentHandler:function(){return this._floatingComponentHandler||(this._floatingComponentHandler=new _7());},_updateViewportScrollInfo:function(_10){if(!_10){_10=this._getViewportScrollInfo();}var _11=_4.position(this._viewport),_12=_4.position(this._viewportIframe),_13=Math.max(_12.w,_11.w);_10.bottom=_11.y+_11.h;_10.height=_11.h;_10.horizontal=_11.y;_10.right=_11.x+_13;_10.vertical=_11.x;_10.width=_11.w;return _10;}});});