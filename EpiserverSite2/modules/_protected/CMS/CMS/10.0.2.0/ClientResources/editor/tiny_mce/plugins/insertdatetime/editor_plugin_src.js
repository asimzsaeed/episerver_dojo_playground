(function(){tinymce.create("tinymce.plugins.InsertDateTime",{init:function(e){var t=this;t.editor=e,e.addCommand("mceInsertDate",function(){var n=t._getDateTime(new Date,e.getParam("plugin_insertdate_dateFormat",e.getLang("insertdatetime.date_fmt")));e.execCommand("mceInsertContent",!1,n)}),e.addCommand("mceInsertTime",function(){var n=t._getDateTime(new Date,e.getParam("plugin_insertdate_timeFormat",e.getLang("insertdatetime.time_fmt")));e.execCommand("mceInsertContent",!1,n)}),e.addButton("insertdate",{title:"insertdatetime.insertdate_desc",cmd:"mceInsertDate"}),e.addButton("inserttime",{title:"insertdatetime.inserttime_desc",cmd:"mceInsertTime"})},getInfo:function(){return{longname:"Insert date/time",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/insertdatetime",version:tinymce.majorVersion+"."+tinymce.minorVersion}},_getDateTime:function(e,t){function n(e,t){if(e=""+e,t>e.length)for(var n=0;t-e.length>n;n++)e="0"+e;return e}var i=this.editor;return t=t.replace("%D","%m/%d/%y"),t=t.replace("%r","%I:%M:%S %p"),t=t.replace("%Y",""+e.getFullYear()),t=t.replace("%y",""+e.getYear()),t=t.replace("%m",n(e.getMonth()+1,2)),t=t.replace("%d",n(e.getDate(),2)),t=t.replace("%H",""+n(e.getHours(),2)),t=t.replace("%M",""+n(e.getMinutes(),2)),t=t.replace("%S",""+n(e.getSeconds(),2)),t=t.replace("%I",""+((e.getHours()+11)%12+1)),t=t.replace("%p",""+(12>e.getHours()?"AM":"PM")),t=t.replace("%B",""+i.getLang("insertdatetime.months_long").split(",")[e.getMonth()]),t=t.replace("%b",""+i.getLang("insertdatetime.months_short").split(",")[e.getMonth()]),t=t.replace("%A",""+i.getLang("insertdatetime.day_long").split(",")[e.getDay()]),t=t.replace("%a",""+i.getLang("insertdatetime.day_short").split(",")[e.getDay()]),t=t.replace("%%","%")}}),tinymce.PluginManager.add("insertdatetime",tinymce.plugins.InsertDateTime)})();