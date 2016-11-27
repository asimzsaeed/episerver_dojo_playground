//>>built
define("epi/shell/layout/AnimatedCardContainer",["dojo/_base/declare","dojo/_base/lang","dojo/_base/fx","dojo/aspect","dojo/has","dojo/on","dojo/dom-class","dojo/dom-style","dojo/dom-geometry","dojo/Deferred","dojo/query","dojo/when","dijit/_TemplatedMixin","dijit/layout/StackContainer","dgrid/util/has-css3"],function(_1,_2,fx,_3,_4,on,_5,_6,_7,_8,_9,_a,_b,_c,_d){return _1([_c,_b],{doLayout:true,templateString:"<div><div class='dijitContainer' style='position: relative; width: 100%; height: 100%' data-dojo-attach-point='containerNode'></div></div>",cssClasses:{animationNode:"epi-animation-node",child:"epi-cardContainer-child",primary:"epi-cardContainer-child--primary",secondary:"epi-cardContainer-child--secondary",secondaryOut:"epi-cardContainer-child--secondary-out",visible:"dijitVisible",hidden:"dijitHidden"},addChild:function(_e){var r=this.inherited(arguments);_5.add(_e.domNode,this.cssClasses.child);return r;},selectSecondaryChild:function(_f){return this.selectChild(_f,_4("css-transitions"));},_transition:function(_10,_11,_12){var d;if(_12&&_11){d=this._showChild(_10);if(_10.resize){if(this.doLayout){_10.resize(this._containerContentBox||this._contentBox);}else{_10.resize();}}_5.add(_11.domNode,this.cssClasses.primary);_11.onHide&&_11.onHide();_a(this._executeTransition(_10,this.cssClasses.secondary),_2.hitch(this,function(_13){if(this.selectedPreviousChild&&this.selectedPreviousChild!==_10){_5.add(_11.domNode,this.cssClasses.hidden);_5.remove(_11.domNode,this.cssClasses.visible);}}));this.selectedPreviousChild=_11;}else{if(this.selectedPreviousChild===_10){_5.add(this.selectedPreviousChild.domNode,this.cssClasses.visible);_5.remove(this.selectedPreviousChild.domNode,this.cssClasses.hidden);_5.remove(this.selectedPreviousChild.domNode,this.cssClasses.primary);_5.remove(this.selectedChildWidget.domNode,this.cssClasses.secondary);_a(this._executeTransition(this.selectedChildWidget,this.cssClasses.secondaryOut),_2.hitch(this,function(_14){_5.remove(_14.domNode,this.cssClasses.visible);_5.add(_14.domNode,this.cssClasses.hidden);_5.remove(_14.domNode,this.cssClasses.secondaryOut);}),_2.hitch(this,function(_15){_5.remove(_15.domNode,this.cssClasses.visible);_5.add(_15.domNode,this.cssClasses.hidden);}));if(_10!==this.selectedPreviousChild){_5.replace(this.selectedPreviousChild.domNode,this.cssClasses.hidden,this.cssClasses.visible);}this.selectedPreviousChild=null;}else{if(_11){this._hideChild(_11);_5.remove(_11.domNode,this.cssClasses.primary);}}d=this._showChild(_10);_5.add(_10.domNode,this.cssClasses.primary);if(_10.resize){if(this.doLayout){_10.resize(this._containerContentBox||this._contentBox);}else{_10.resize();}}}return d;},_executeTransition:function(_16,_17){var d=new _8();var _18=_16.domNode;var _19=_9("."+this.cssClasses.animationNode,_18);var _1a=_19.length>0?_19[0]:null;if(_1a&&_18&&_4("css-transitions")){_5.add(_18,_17);this.own(this.defer(function(){on.once(_1a,_4("transitionend"),function(){d.resolve(_16);});},1));}else{d.reject(_16);}return d;}});});