(function(e,t){var n;e.create("tinymce.plugins.epiimageeditor",{init:function(e){e.addCommand("mceEPiImageEditor",function(){if(-1==e.dom.getAttrib(e.selection.getNode(),"class").indexOf("mceItem")){var i,o=EPi.ResolveUrlFromUI("Edit/ImageEditor/ImageEditor.aspx?")+t.param(e.settings.epi_page_context),r=n,a=function(t){if(t){e.getWin().focus(),i&&(e.dom.setAttrib(r,"width",t.actualWidth),e.dom.setAttrib(r,"height",t.actualHeight)),e.dom.getAttrib(r,"src");var n=(new Date).getTime(),o=0>t.src.indexOf("?")?"?":"&";e.dom.setAttrib(r,"src",t.src+o+"epi_image_timestamp="+n),e.undoManager.add()}e.windowManager.onClose.dispatch()},s={width:e.getParam("epiImageEditor_dialogWidth"),height:e.getParam("epiImageEditor_dialogHeight")},l={},d=e.dom.getAttrib(r,"src").replace(/(\?|&)epi_image_timestamp=.*/g,"");l.src=d,i=e.dom.getAttrib(r,"width"),e.windowManager.onOpen.dispatch(),EPi.CreateDialog(o,a,null,l,s)}}),e.addButton("epiimageeditor",{title:"epiimageeditor.epiimageeditor_desc",cmd:"mceEPiImageEditor","class":"mce_epiimageeditor"}),e.onNodeChange.add(function(e,t,i){var o="IMG"===i.nodeName&&-1===e.dom.getAttrib(i,"class").indexOf("mceItem");t.setActive("epiimageeditor",o),t.setDisabled("epiimageeditor",!o),n=o?i:null}),e.onPostProcess.add(function(e,t){t.content=t.content.replace(/(\?|&)epi_image_timestamp=.*"/g,'"')})},createControl:function(){return null},getInfo:function(){return{longname:"EPiServer CMS Image Editor Plug-in",author:"EPiServer AB",authorurl:"http://www.episerver.com",infourl:"http://www.episerver.com",version:"1.0"}}}),e.PluginManager.add("epiimageeditor",e.plugins.epiimageeditor)})(tinymce,epiJQuery);