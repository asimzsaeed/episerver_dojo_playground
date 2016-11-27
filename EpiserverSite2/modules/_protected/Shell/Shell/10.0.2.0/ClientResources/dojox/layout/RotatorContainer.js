//>>built
define("dojox/layout/RotatorContainer",["dojo/_base/declare","dojo/_base/html","dojo/_base/connect","dojo/_base/lang","dojo/_base/array","dojo/_base/fx","dojo/fx","dijit/_base/manager","dijit/layout/StackContainer","dijit/layout/StackController","dijit/_Widget","dijit/_Templated","dijit/_Contained"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){var _e=_1("dojox.layout.RotatorContainer",[_9,_c],{templateString:"<div class=\"dojoxRotatorContainer\"><div dojoAttachPoint=\"tabNode\"></div><div class=\"dojoxRotatorPager\" dojoAttachPoint=\"pagerNode\"></div><div class=\"dojoxRotatorContent\" dojoAttachPoint=\"containerNode\"></div></div>",showTabs:true,transitionDelay:5000,transition:"fade",transitionDuration:1000,autoStart:true,suspendOnHover:false,pauseOnManualChange:null,reverse:false,pagerId:"",cycles:-1,pagerClass:"dojox.layout.RotatorPager",postCreate:function(){this.inherited(arguments);_2.style(this.domNode,"position","relative");if(this.cycles-0==this.cycles&&this.cycles!=-1){this.cycles++;}else{this.cycles=-1;}if(this.pauseOnManualChange===null){this.pauseOnManualChange=!this.suspendOnHover;}var id=this.id||"rotator"+(new Date()).getTime(),sc=new _a({containerId:id},this.tabNode);this.tabNode=sc.domNode;this._stackController=sc;_2.style(this.tabNode,"display",this.showTabs?"":"none");this.connect(sc,"onButtonClick","_manualChange");this._subscriptions=[_3.subscribe(this.id+"-cycle",this,"_cycle"),_3.subscribe(this.id+"-state",this,"_state")];var d=Math.round(this.transitionDelay*0.75);if(d<this.transitionDuration){this.transitionDuration=d;}if(this.suspendOnHover){this.connect(this.domNode,"onmouseover","_onMouseOver");this.connect(this.domNode,"onmouseout","_onMouseOut");}},startup:function(){if(this._started){return;}var c=this.getChildren();for(var i=0,_f=c.length;i<_f;i++){if(c[i].declaredClass==this.pagerClass){this.pagerNode.appendChild(c[i].domNode);break;}}this.inherited(arguments);if(this.autoStart){setTimeout(_4.hitch(this,"_play"),10);}else{this._updatePager();}},destroy:function(){_5.forEach(this._subscriptions,_3.unsubscribe);this.inherited(arguments);},_setShowTabsAttr:function(_10){this.showTabs=_10;_2.style(this.tabNode,"display",_10?"":"none");},_updatePager:function(){var c=this.getChildren();_3.publish(this.id+"-update",[this._playing,_5.indexOf(c,this.selectedChildWidget)+1,c.length]);},_onMouseOver:function(){this._resetTimer();this._over=true;},_onMouseOut:function(){this._over=false;if(this._playing){clearTimeout(this._timer);this._timer=setTimeout(_4.hitch(this,"_play",true),200);}},_resetTimer:function(){clearTimeout(this._timer);this._timer=null;},_cycle:function(_11){if(_11 instanceof Boolean||typeof _11=="boolean"){this._manualChange();}var c=this.getChildren(),len=c.length,i=_5.indexOf(c,this.selectedChildWidget)+(_11===false||(_11!==true&&this.reverse)?-1:1);this.selectChild(c[(i<len?(i<0?len-1:i):0)]);this._updatePager();},_manualChange:function(){if(this.pauseOnManualChange){this._playing=false;}this.cycles=-1;},_play:function(_12){this._playing=true;this._resetTimer();if(_12!==true&&this.cycles>0){this.cycles--;}if(this.cycles==0){this._pause();}else{if((!this.suspendOnHover||!this._over)&&this.transitionDelay){this._timer=setTimeout(_4.hitch(this,"_cycle"),this.selectedChildWidget.domNode.getAttribute("transitionDelay")||this.transitionDelay);}}this._updatePager();},_pause:function(){this._playing=false;this._resetTimer();},_state:function(_13){if(_13){this.cycles=-1;this._play();}else{this._pause();}},_transition:function(_14,_15){this._resetTimer();if(_15&&this.transitionDuration){switch(this.transition){case "fade":this._fade(_14,_15);return;}}this._transitionEnd();this.inherited(arguments);},_transitionEnd:function(){if(this._playing){this._play();}else{this._updatePager();}},_fade:function(_16,_17){this._styleNode(_17.domNode,1,1);this._styleNode(_16.domNode,0,2);this._showChild(_16);if(this.doLayout&&_16.resize){_16.resize(this._containerContentBox||this._contentBox);}var _18={duration:this.transitionDuration},_19=_7.combine([_6["fadeOut"](_4.mixin({node:_17.domNode},_18)),_6["fadeIn"](_4.mixin({node:_16.domNode},_18))]);this.connect(_19,"onEnd",_4.hitch(this,function(){this._hideChild(_17);this._transitionEnd();}));_19.play();},_styleNode:function(_1a,_1b,_1c){_2.style(_1a,"opacity",_1b);_2.style(_1a,"zIndex",_1c);_2.style(_1a,"position","absolute");}});_1("dojox.layout.RotatorPager",[_b,_c,_d],{widgetsInTemplate:true,rotatorId:"",postMixInProperties:function(){this.templateString="<div>"+this.srcNodeRef.innerHTML+"</div>";},postCreate:function(){var p=_8.byId(this.rotatorId)||this.getParent();if(p&&p.declaredClass=="dojox.layout.RotatorContainer"){if(this.previous){_3.connect(this.previous,"onClick",function(){_3.publish(p.id+"-cycle",[false]);});}if(this.next){_3.connect(this.next,"onClick",function(){_3.publish(p.id+"-cycle",[true]);});}if(this.playPause){_3.connect(this.playPause,"onClick",function(){this.set("label",this.checked?"Pause":"Play");_3.publish(p.id+"-state",[this.checked]);});}this._subscriptions=[_3.subscribe(p.id+"-state",this,"_state"),_3.subscribe(p.id+"-update",this,"_update")];}},destroy:function(){_5.forEach(this._subscriptions,_3.unsubscribe);this.inherited(arguments);},_state:function(_1d){if(this.playPause&&this.playPause.checked!=_1d){this.playPause.set("label",_1d?"Pause":"Play");this.playPause.set("checked",_1d);}},_update:function(_1e,_1f,_20){this._state(_1e);if(this.current&&_1f){this.current.innerHTML=_1f;}if(this.total&&_20){this.total.innerHTML=_20;}}});return _e;});