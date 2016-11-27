//>>built
require({cache:{"url:epi-cms/widget/templates/TooltipDialog.html":"<div class=\"epi-dijitTooltipDialog\" role=\"presentation\" tabindex=\"-1\">\r\n    <div class=\"dijitTooltipContainer epi-dijitTooltipContainer\" role=\"presentation\">\r\n        <div class=\"dijitTooltipContents dijitTooltipFocusNode epi-dijitTooltipContents\" data-dojo-attach-point=\"containerNode\" role=\"dialog\"></div>\r\n    </div>\r\n    <div class=\"dijitTooltipConnector epi-dijitTooltipConnector\" data-dojo-attach-point=\"connectorNode\" role=\"presentation\"></div>\r\n</div>"}});define("epi-cms/widget/TooltipDialog",["dojo","dojo/number","dijit","dijit/TooltipDialog","dijit/_Widget","dijit/_TemplatedMixin","dojo/text!./templates/TooltipDialog.html"],function(_1,_2,_3,_4,_5,_6,_7){return _1.declare([_4],{templateString:_7,connectorMargin:25,_defaultConnectorMargin:25,hideOnBlur:false,_isFirstShow:false,_beforeCssClass:"epi-dijitTooltipBefore",_afterCssClass:"epi-dijitTooltipAfter",_pos:0,_defaultConnectorRight:0,_defaultConnectorLeft:0,_wrapperPosX:0,_availableSpace:0,_right:0,_left:0,onBlur:function(){this.inherited(arguments);if(this.hideOnBlur){this.hideTooltipDialog();}},postCreate:function(){this.inherited(arguments);if(!this.connectorMargin||!_2.parse(this.connectorMargin)||this.connectorMargin===""||this.connectorMargin<this._defaultConnectorMargin){this.connectorMargin=this._defaultConnectorMargin;}},showTooltipDialog:function(_8,_9){_3.popup.open({popup:this,around:_8,orient:_9});if(this.hideOnBlur){this.focus();}},hideTooltipDialog:function(){_3.popup.close(this);},onOpen:function(_a){this._pos=_a;this.inherited(arguments);},_onShow:function(){this._setDefaultValues();this._updatePositions();this.inherited(arguments);},_setDefaultValues:function(){if(!this._isFirstShow){this._defaultConnectorRight=this._getConnectorSpace("right")||this._defaultConnectorMargin;this._defaultConnectorLeft=this._getConnectorSpace("left")||this._defaultConnectorMargin;this._isFirstShow=true;}this._wrapperPosX=_2.parse(this._pos.x);this._availableSpace=_1.body().clientWidth;if(this._pos.aroundCorner==="MR"||this._pos.aroundCorner==="ML"){var _b=_2.round((this._pos.h-this.connectorNode.clientHeight)/2);_1.style(this.connectorNode,"top",this._getNumberInPx(_b));}},_updatePositions:function(){switch(this._pos.aroundCorner){case "TR":case "BR":this._calculateConnectorMarginRight();this._calculateAvailableSpaceLeft();this._updateAlignedRightPositions();break;case "TL":case "BL":this._calculateConnectorMarginLeft();this._calculateAvailableSpaceRight();this._updateAlignedLeftPositions();break;case "MR":_1.addClass(this.domNode,this._afterCssClass);break;case "ML":_1.addClass(this.domNode,this._beforeCssClass);break;default:break;}},_updateAlignedRightPositions:function(){if(this._availableSpace>=this.connectorMargin){_1.style(this.connectorNode,"right",this._getNumberInPx(this.connectorMargin));_1.style(this._popupWrapper,"left",this._getNumberInPx(this._wrapperPosX+(this.connectorMargin-this._right)));}else{_1.style(this.connectorNode,"right",this._getNumberInPx(this._defaultConnectorRight));_1.style(this._popupWrapper,"left",this._getNumberInPx(this._wrapperPosX-(this._right-this._defaultConnectorRight)));}},_updateAlignedLeftPositions:function(){if(this._availableSpace>=this.connectorMargin){_1.style(this.connectorNode,"left",this._getNumberInPx(this.connectorMargin));_1.style(this._popupWrapper,"left",this._getNumberInPx(this._wrapperPosX+(this.connectorMargin-this._left)));}else{_1.style(this.connectorNode,"left",this._getNumberInPx(this._defaultConnectorLeft));_1.style(this._popupWrapper,"left",this._getNumberInPx(this._wrapperPosX-(this._left-this._defaultConnectorLeft)));}},_calculateAvailableSpaceRight:function(){this._wrapperPosX-=this._left+this._getCenterHorizontalAroundNode();this._availableSpace-=(this._wrapperPosX+this._pos.w);},_calculateAvailableSpaceLeft:function(){this._wrapperPosX+=this._right+this._getCenterHorizontalAroundNode();this._availableSpace-=(this._wrapperPosX+this._pos.w);},_calculateConnectorMarginRight:function(){this._right=this._getConnectorSpace("right");if(this._right<this.connectorMargin){this._right=this.connectorMargin;}},_calculateConnectorMarginLeft:function(){this._left=this._getConnectorSpace("left");if(this._left<this.connectorMargin){this._left=this.connectorMargin;}},_getConnectorSpace:function(_c){if(!_c){return 0;}if(_c==="right"||_c==="left"){var _d=_1.style(this.connectorNode,_c);if(!_d){return 0;}var _e=/(px|em|%)/ig;return _2.parse(_d)||_2.parse(_d.replace(_e,""));}return 0;},_getNumberInPx:function(_f){return _f+"px";},_getCenterHorizontalAroundNode:function(){return _2.round((_2.parse(this.connectorNode.clientWidth)-_2.parse(this._pos.aroundNodePos.w))/2);}});});