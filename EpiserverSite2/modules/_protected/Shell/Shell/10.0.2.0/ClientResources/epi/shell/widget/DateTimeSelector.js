//>>built
require({cache:{"url:epi/shell/widget/templates/DateTimeSelector.html":"<div style=\"position: relative;\" class=\"epi-dateTimeWrapper\">\r\n    <div data-dojo-attach-point=\"calendar\" data-dojo-type=\"dijit/Calendar\"  data-dojo-attach-event=\"onChange: _onChange, onKeyPress:_onCalendarKeyPress\" ></div>\r\n    <div data-dojo-attach-point=\"calendarOverlay\" style=\"position: absolute; left: 0; top: 0;\"></div>\r\n    <div style=\"text-align: center; padding: 5px\" class=\"epi-timePickerWrapper\">\r\n        <div class=\"dijitInline dijitIcon epi-iconClock\"></div><div data-dojo-attach-point=\"timePicker\" data-dojo-type=\"epi/shell/widget/TimeSpinner\" data-dojo-attach-event=\"onKeyPress:_onTimePickerKeyPress, onChange: _onChange\"></div>\r\n    </div>\r\n</div>\r\n"}});define("epi/shell/widget/DateTimeSelector",["dojo/_base/declare","dojo/keys","dojo/aspect","dijit/_Widget","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","dijit/Calendar","epi/shell/widget/TimeSpinner","epi/datetime","dojo/text!./templates/DateTimeSelector.html"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){return _1([_4,_5,_6],{templateString:_a,value:null,postCreate:function(){this.inherited(arguments);_3.after(this.calendar,"handleKey",function(_b){switch(_b.keyCode){case _2.RIGHT_ARROW:case _2.LEFT_ARROW:case _2.DOWN_ARROW:case _2.UP_ARROW:this.set("value",this.currentFocus);return true;default:return true;}},true);},_setValueAttr:function(_c){this.calendar.set("value",_c,false);this.timePicker.set("value",_c,false);},_onCalendarKeyPress:function(e){if(e.keyCode===_2.TAB){this.timePicker.focus();}},_onTimePickerKeyPress:function(e){if(e.keyCode===_2.TAB){this.calendar.focus();}},_getValueAttr:function(){var _d=this.calendar.get("value");var _e=this.timePicker.get("value");if(!_d&&!_e){return null;}if(!_d){this.calendar.goToToday();_d=this.calendar.get("value");}if(!_e){_e=new Date(0,0,0,0,0,0,0);this.timePicker.set("value",_e,false);}return new Date(_d.getFullYear(),_d.getMonth(),_d.getDate(),_e.getHours(),_e.getMinutes(),_e.getSeconds(),_e.getMilliseconds());},_onChange:function(_f){var _10=this.get("value");this.onChange(_10);},onChange:function(_11){},focus:function(){this.calendar.focus();}});});