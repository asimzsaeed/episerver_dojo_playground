//>>built
define("epi/shell/widget/DateTimeSelectorDropDown",["dojo/_base/declare","dojo/_base/lang","dojo/keys","dijit/form/_DateTimeTextBox","epi/shell/widget/DateTimeSelector"],function(_1,_2,_3,_4,_5){return _1([_4],{baseClass:"dijitTextBox dijitComboBox dijitDateTextBox",popupClass:_5,forceWidth:false,_isSelecting:false,_canceled:false,_isDropDownShowing:false,constructor:function(){this.constraints={formatLength:"short",fullYear:"true"};},toggleDropDown:function(){this._isSelecting=!this._isSelecting;this.inherited(arguments);},openDropDown:function(){this.inherited(arguments);this.dropDown.onChange=function(){};this.connect(this.dropDown.domNode,"onkeypress",_2.hitch(this,function(e){this._canceled=e.keyCode===_3.ESCAPE;if(e.keyCode===_3.ESCAPE||e.keyCode===_3.ENTER){this._isSelecting=false;this.closeDropDown(true);}}));this._isSelecting=true;this._canceled=false;this._dropDownShowing=true;},_setValueAttr:function(_6){if(_6){if(!(_6 instanceof Date)){_6=new Date(_6);}_6=new Date(_6.getFullYear(),_6.getMonth(),_6.getDate(),_6.getHours(),_6.getMinutes());this.inherited(arguments,[_6]);}else{this.inherited(arguments);}},closeDropDown:function(_7){if(!this._isSelecting&&this._dropDownShowing){if(!this._canceled&&this.dropDown){this.set("value",this.dropDown.get("value"));}this.inherited(arguments);this._dropDownShowing=false;}},_onBlur:function(){this._isSelecting=false;if(this._dropDownShowing){this.closeDropDown();}this.inherited(arguments);}});});