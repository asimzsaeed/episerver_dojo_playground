//>>built
define("epi/patch/dijit/_HasDropDown",["dojo/_base/array","dojo/_base/lang","dijit/_HasDropDown"],function(_1,_2,_3){_2.mixin(_3.prototype,{_onBlur:function(){this.closeDropDown(false);this.inherited(arguments);},destroy:function(){if(this._opened){this.closeDropDown(true);}if(this.dropDown){if(!this.dropDown._destroyed){this.dropDown.destroyRecursive();}delete this.dropDown;}this.inherited(arguments);}});_3.prototype._onBlur.nom="_onBlur";_3.prototype.destroy.nom="destroy";});