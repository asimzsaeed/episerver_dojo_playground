//>>built
define("epi/shell/command/_CommandModelBindingMixin",["dojo/_base/declare","dojo/dom-style","dojo/dom-class","../widget/_ModelBindingMixin"],function(_1,_2,_3,_4){return _1(_4,{modelBindingMap:{label:["label"],tooltip:["tooltip"],iconClass:["iconClass"],canExecute:["canExecute"],isExecuting:["isExecuting"],isAvailable:["isAvailable"],active:["checked","isExpand"]},_setCanExecuteAttr:function(_5){this.set("disabled",!_5);},_setIsAvailableAttr:function(_6){if(this.domNode){_2.set(this.domNode,"display",_6?"":"none");}},_setIsExecutingAttr:function(_7){this.isExecutingClass&&_3.toggle(this.domNode,this.isExecutingClass,_7);},onClick:function(){this.inherited(arguments);this.model&&this.model.execute.apply(this.model,arguments);}});});