//>>built
require({cache:{"url:epi/shell/widget/templates/_TabController.htm":"<div class=\"dijitTabListContainer-${tabPosition}\" style=\"visibility:hidden\">\r\n    <div data-dojo-type=\"dijit/Toolbar\" class=\"epi-componentToolbar\" data-dojo-attach-point=\"_toolbar\">\r\n        <div data-dojo-type=\"dijit/form/DropDownButton\" id=\"${id}_addBtn\" class=\"epi-componentToolbarButton epi-componentSettingsContainer epi-mediumButton\" iconClass=\"epi-iconSettingsMenu\" data-dojo-attach-point=\"_addBtn\" showLabel=\"false\" title=\"${res.settingsmenutooltip}\">\r\n            <div data-dojo-type=\"dijit/Menu\" data-dojo-attach-point=\"_addMenu\"></div>\r\n        </div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit.layout._ScrollingTabControllerButton\" class=\"tabStripButton-${tabPosition}\" id=\"${id}_menuBtn\" iconClass=\"dijitTabStripMenuIcon\" data-dojo-attach-point=\"_menuBtn\" showLabel=\"false\">&#9660;</div>\r\n    <div data-dojo-type=\"dijit.layout._ScrollingTabControllerButton\" class=\"tabStripButton-${tabPosition}\" id=\"${id}_leftBtn\" iconClass=\"dijitTabStripSlideLeftIcon\" data-dojo-attach-point=\"_leftBtn\" data-dojo-attach-event=\"onClick: doSlideLeft\" showLabel=\"false\">&#9664;</div>\r\n    <div data-dojo-type=\"dijit.layout._ScrollingTabControllerButton\" class=\"tabStripButton-${tabPosition}\" id=\"${id}_rightBtn\" iconClass=\"dijitTabStripSlideRightIcon\" data-dojo-attach-point=\"_rightBtn\" data-dojo-attach-event=\"onClick: doSlideRight\" showLabel=\"false\">&#9654;</div>\r\n    <div class=\"dijitTabListWrapper\" data-dojo-attach-point=\"tablistWrapper\">\r\n        <div wairole=\"tablist\" data-dojo-attach-event=\"onkeypress:onkeypress\" data-dojo-attach-point=\"containerNode\" class=\"nowrapTabStrip\"></div>\r\n    </div>\r\n</div>\r\n"}});define("epi/shell/widget/TabController",["dojo/_base/declare","dojo/_base/lang","dojo/dom-style","dojo/dom-geometry","dojo/_base/array","dojo/query","dojo/sniff","dijit/layout/ScrollingTabController","dijit/layout/StackController","dijit/layout/utils","dijit/form/DropDownButton","dijit/form/TextBox","dijit/CheckedMenuItem","dijit/InlineEditBox","dijit/Menu","dijit/MenuItem","dijit/PopupMenuItem","dijit/MenuSeparator","dijit/registry","epi/shell/widget/_TabButton","dojo/text!./templates/_TabController.htm","epi/i18n!epi/shell/ui/nls/EPiServer.Shell.UI.Resources.GadgetChrome"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15,res){return _1(_8,{buttonWidget:_14,res:res,useAddMenu:true,templateString:_15,onAddChild:function(_16,_17){this.inherited(arguments);this.connect(_16.controlButton,"onClick",_2.hitch(this,"onButtonClick",_16));this.connect(_16.controlButton,"onClickCloseButton",_2.hitch(this,"onCloseButtonClick",_16));this.connect(_16.controlButton,"onCloseMenuItem",_2.hitch(this,"onCloseButtonClick",_16));this.connect(_16.controlButton,"onLayoutClick",_2.hitch(this,"onLayoutChanged",_16));this.connect(_16.controlButton,"onTabTitleChanged",_2.hitch(this,"onTabTitleChanged",_16));if(!this.isLeftToRight()&&_7("ie")&&this._rectifyRtlTabList){this._rectifyRtlTabList();}var _18;if(this.useMenu){var _19=this.containerId;_18=new _10({id:_16.id+"_stcMi",label:_16.title,dir:_16.dir,lang:_16.lang,onClick:_2.hitch(this,function(){var _1a=_13.byId(_19);_1a.selectChild(_16);})});this._menuChildren[_16.id]=_18;this._menu.addChild(_18,_17);}_3.set(this.containerNode,"width",(_3.get(this.containerNode,"width")+200)+"px");var _1b=_16.params.numberOfColumns||1;var _1c=_16.controlButton.menuLayout.getChildren()[_1b-1];_1c&&_1c.set("checked",true);var _1d=this.getChildren().length;for(var _1e in this.pane2button){this.pane2button[_1e].closeTabMenuItem.set("disabled",(_1d===1?true:false));}},_initButtons:function(){this._menuChildren={};this._btnWidth=0;this._buttons=_6("> .tabStripButton",this.domNode).filter(function(btn){if((this.useMenu&&btn===this._menuBtn.domNode)||(this.useAddMenu&&btn===this._addBtn.domNode)||(this.useSlider&&(btn===this._rightBtn.domNode||btn===this._leftBtn.domNode))){this._btnWidth+=_4.getMarginBox(btn).w;return true;}else{_3.set(btn,"display","none");return false;}},this);if(this.useMenu){this._menu=new _f({id:this.id+"_menu",dir:this.dir,lang:this.lang,targetNodeIds:[this._menuBtn.domNode],leftClickToOpen:true,refocus:false});this._supportingWidgets.push(this._menu);}_3.set(this._addBtn.domNode,"display",this.useAddMenu?"":"none");},addAddMenuItem:function(_1f){if(!this.useAddMenu){return;}var _20=null;if(_1f.type&&_1f.type==="checkedmenuitem"){_20=new _d(_1f);}else{_20=new _10(_1f);}if(_20){this._addMenu.addChild(_20);}},resize:function(dim){if(this.domNode.offsetWidth===0){return;}this._dim=dim;this.scrollNode.style.height="auto";this._contentBox=_a.marginBox2contentBox(this.domNode,{h:0,w:dim.w});this._contentBox.h=this.scrollNode.offsetHeight;_4.setContentSize(this.domNode,this._contentBox);var _21=this._enableBtn(this._contentBox.w);this._buttons.style("display",_21?"":"none");this._leftBtn.layoutAlign="left";this._rightBtn.layoutAlign="right";this._menuBtn.layoutAlign=this.isLeftToRight()?"right":"left";this._addBtn.layoutAlign=this.isLeftToRight()?"right":"left";_a.layoutChildren(this.domNode,this._contentBox,[this._addBtn,this._menuBtn,this._leftBtn,this._rightBtn,{domNode:this.scrollNode,layoutAlign:"client"}]);if(this._selectedTab){if(this._anim&&this._anim.status()==="playing"){this._anim.stop();}var w=this.scrollNode,sl=this._convertToScrollLeft(this._getScrollForSelectedTab());w.scrollLeft=sl;}this._setButtonClass(this._getScroll());_3.set(this._toolbar.domNode,"height",_4.position(this.domNode).h+"px");this._postResize=true;},onSelectChild:function(_22){if(!_22){return;}if(this._currentChild){this.pane2button[this._currentChild.id].toggleMenu(false);}this.pane2button[_22.id].toggleMenu(true);_5.some(this._addMenu.getChildren(),function(_23){if(_23.rearrangeGadgets){_23.rearrangeGadgets(_22.containerUnlocked);return;}});this.inherited(arguments);},onLayoutChanged:function(_24,evt){},onTabTitleChanged:function(_25,_26){},onAddGadget:function(evt){}});});