//>>built
define("epi/shell/widget/_ButtonBadgeMixin",["dojo/_base/declare","dojo/dom-class","dojo/dom-attr"],function(_1,_2,_3){return _1(null,{badgeClass:"epi-badge-node",badgeValue:null,_setBadgeValueAttr:function(_4){this._set("badgeValue",_4);if(_4||_4===0){_2.add(this.iconNode,this.badgeClass);_3.set(this.iconNode,"badge-value",_4);}else{_2.remove(this.iconNode,this.badgeClass);}}});});