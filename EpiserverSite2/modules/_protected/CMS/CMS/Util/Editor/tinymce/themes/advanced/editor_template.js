(function(e){var t,n=e.DOM,i=e.dom.Event,o=e.extend,a=e.each,r=e.util.Cookie,l=e.explode;e.ThemeManager.requireLangPack("advanced"),e.create("tinymce.themes.AdvancedTheme",{sizes:[8,10,12,14,18,24,36],controls:{bold:["bold_desc","Bold"],italic:["italic_desc","Italic"],underline:["underline_desc","Underline"],strikethrough:["striketrough_desc","Strikethrough"],justifyleft:["justifyleft_desc","JustifyLeft"],justifycenter:["justifycenter_desc","JustifyCenter"],justifyright:["justifyright_desc","JustifyRight"],justifyfull:["justifyfull_desc","JustifyFull"],bullist:["bullist_desc","InsertUnorderedList"],numlist:["numlist_desc","InsertOrderedList"],outdent:["outdent_desc","Outdent"],indent:["indent_desc","Indent"],cut:["cut_desc","Cut"],copy:["copy_desc","Copy"],paste:["paste_desc","Paste"],undo:["undo_desc","Undo"],redo:["redo_desc","Redo"],link:["link_desc","mceLink"],unlink:["unlink_desc","unlink"],image:["image_desc","mceImage"],cleanup:["cleanup_desc","mceCleanup"],help:["help_desc","mceHelp"],code:["code_desc","mceCodeEditor"],hr:["hr_desc","InsertHorizontalRule"],removeformat:["removeformat_desc","RemoveFormat"],sub:["sub_desc","subscript"],sup:["sup_desc","superscript"],forecolor:["forecolor_desc","ForeColor"],forecolorpicker:["forecolor_desc","mceForeColor"],backcolor:["backcolor_desc","HiliteColor"],backcolorpicker:["backcolor_desc","mceBackColor"],charmap:["charmap_desc","mceCharMap"],visualaid:["visualaid_desc","mceToggleVisualAid"],anchor:["anchor_desc","mceInsertAnchor"],newdocument:["newdocument_desc","mceNewDocument"],blockquote:["blockquote_desc","mceBlockQuote"]},stateControls:["bold","italic","underline","strikethrough","bullist","numlist","justifyleft","justifycenter","justifyright","justifyfull","sub","sup","blockquote"],init:function(t,i){var r,l,s,c=this;c.editor=t,c.url=i,c.onResolveName=new e.util.Dispatcher(this),c.settings=r=o({theme_advanced_path:!0,theme_advanced_toolbar_location:"bottom",theme_advanced_buttons1:"bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect",theme_advanced_buttons2:"bullist,numlist,|,outdent,indent,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code",theme_advanced_buttons3:"hr,removeformat,visualaid,|,sub,sup,|,charmap",theme_advanced_blockformats:"p,address,pre,h1,h2,h3,h4,h5,h6",theme_advanced_toolbar_align:"center",theme_advanced_fonts:"Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats",theme_advanced_more_colors:1,theme_advanced_row_height:23,theme_advanced_resize_horizontal:1,theme_advanced_resizing_use_cookie:1,theme_advanced_font_sizes:"1,2,3,4,5,6,7",readonly:t.settings.readonly},t.settings),r.font_size_style_values||(r.font_size_style_values="8pt,10pt,12pt,14pt,18pt,24pt,36pt"),e.is(r.theme_advanced_font_sizes,"string")&&(r.font_size_style_values=e.explode(r.font_size_style_values),r.font_size_classes=e.explode(r.font_size_classes||""),s={},t.settings.theme_advanced_font_sizes=r.theme_advanced_font_sizes,a(t.getParam("theme_advanced_font_sizes","","hash"),function(e,t){var n;t==e&&e>=1&&7>=e&&(t=e+" ("+c.sizes[e-1]+"pt)",n=r.font_size_classes[e-1],e=r.font_size_style_values[e-1]||c.sizes[e-1]+"pt"),/^\s*\./.test(e)&&(n=e.replace(/\./g,"")),s[t]=n?{"class":n}:{fontSize:e}}),r.theme_advanced_font_sizes=s),(l=r.theme_advanced_path_location)&&"none"!=l&&(r.theme_advanced_statusbar_location=r.theme_advanced_path_location),"none"==r.theme_advanced_statusbar_location&&(r.theme_advanced_statusbar_location=0),t.onInit.add(function(){t.settings.readonly||t.onNodeChange.add(c._nodeChanged,c),t.settings.content_css!==!1&&t.dom.loadCSS(t.baseURI.toAbsolute(i+"/skins/"+t.settings.skin+"/content.css"))}),t.onSetProgressState.add(function(e,t,i){var o,a,r=e.id;t?c.progressTimer=setTimeout(function(){o=e.getContainer(),o=o.insertBefore(n.create("DIV",{style:"position:relative"}),o.firstChild),a=n.get(e.id+"_tbl"),n.add(o,"div",{id:r+"_blocker","class":"mceBlocker",style:{width:a.clientWidth+2,height:a.clientHeight+2}}),n.add(o,"div",{id:r+"_progress","class":"mceProgress",style:{left:a.clientWidth/2,top:a.clientHeight/2}})},i||0):(n.remove(r+"_blocker"),n.remove(r+"_progress"),clearTimeout(c.progressTimer))}),n.loadCSS(r.editor_css?t.documentBaseURI.toAbsolute(r.editor_css):i+"/skins/"+t.settings.skin+"/ui.css"),r.skin_variant&&n.loadCSS(i+"/skins/"+t.settings.skin+"/ui_"+r.skin_variant+".css")},createControl:function(e,t){var n,i;if(i=t.createControl(e))return i;switch(e){case"styleselect":return this._createStyleSelect();case"formatselect":return this._createBlockFormats();case"fontselect":return this._createFontSelect();case"fontsizeselect":return this._createFontSizeSelect();case"forecolor":return this._createForeColorMenu();case"backcolor":return this._createBackColorMenu()}return(n=this.controls[e])?t.createButton(e,{title:"advanced."+n[0],cmd:n[1],ui:n[2],value:n[3]}):void 0},execCommand:function(e,t,n){var i=this["_"+e];return i?(i.call(this,t,n),!0):!1},_importClasses:function(){var e=this.editor,t=e.controlManager.get("styleselect");0==t.getLength()&&a(e.dom.getClasses(),function(n,i){var o="style_"+i;e.formatter.register(o,{inline:"span",attributes:{"class":n["class"]},selector:"*"}),t.add(n["class"],o)})},_createStyleSelect:function(){var e,t=this,n=t.editor,o=n.controlManager;return e=o.createListBox("styleselect",{title:"advanced.style_select",onselect:function(t){var i,o=[];return a(e.items,function(e){o.push(e.value)}),n.focus(),n.undoManager.add(),i=n.formatter.matchAll(o),t&&i[0]!=t?n.formatter.apply(t):n.formatter.remove(i[0]),n.undoManager.add(),n.nodeChanged(),!1}}),n.onInit.add(function(){var i=0,o=n.getParam("style_formats");o?a(o,function(t){var o,r=0;a(t,function(){r++}),r>1?(o=t.name=t.name||"style_"+i++,n.formatter.register(o,t),e.add(t.title,o)):e.add(t.title)}):a(n.getParam("theme_advanced_styles","","hash"),function(o,a){var r;o&&(r="style_"+i++,n.formatter.register(r,{inline:"span",classes:o,selector:"*"}),e.add(t.editor.translate(a),r))})}),0==e.getLength()&&e.onPostRender.add(function(n,o){e.NativeListBox?i.add(o.id,"focus",t._importClasses,t):(i.add(o.id+"_text","focus",t._importClasses,t),i.add(o.id+"_text","mousedown",t._importClasses,t),i.add(o.id+"_open","focus",t._importClasses,t),i.add(o.id+"_open","mousedown",t._importClasses,t))}),e},_createFontSelect:function(){var e,t=this,n=t.editor;return e=n.controlManager.createListBox("fontselect",{title:"advanced.fontdefault",onselect:function(t){var i=e.items[e.selectedIndex];return!t&&i?(n.execCommand("FontName",!1,i.value),void 0):(n.execCommand("FontName",!1,t),e.select(function(e){return t==e}),!1)}}),e&&a(n.getParam("theme_advanced_fonts",t.settings.theme_advanced_fonts,"hash"),function(t,i){e.add(n.translate(i),t,{style:-1==t.indexOf("dings")?"font-family:"+t:""})}),e},_createFontSizeSelect:function(){var e,t=this,n=t.editor,i=0;return e=n.controlManager.createListBox("fontsizeselect",{title:"advanced.font_size",onselect:function(t){var i=e.items[e.selectedIndex];return!t&&i?(i=i.value,i["class"]?(n.formatter.toggle("fontsize_class",{value:i["class"]}),n.undoManager.add(),n.nodeChanged()):n.execCommand("FontSize",!1,i.fontSize),void 0):(t["class"]?(n.focus(),n.undoManager.add(),n.formatter.toggle("fontsize_class",{value:t["class"]}),n.undoManager.add(),n.nodeChanged()):n.execCommand("FontSize",!1,t.fontSize),e.select(function(e){return t==e}),!1)}}),e&&a(t.settings.theme_advanced_font_sizes,function(n,o){var a=n.fontSize;a>=1&&7>=a&&(a=t.sizes[parseInt(a)-1]+"pt"),e.add(o,n,{style:"font-size:"+a,"class":"mceFontSize"+i++ +(" "+(n["class"]||""))})}),e},_createBlockFormats:function(){var e,t={p:"advanced.paragraph",address:"advanced.address",pre:"advanced.pre",h1:"advanced.h1",h2:"advanced.h2",h3:"advanced.h3",h4:"advanced.h4",h5:"advanced.h5",h6:"advanced.h6",div:"advanced.div",blockquote:"advanced.blockquote",code:"advanced.code",dt:"advanced.dt",dd:"advanced.dd",samp:"advanced.samp"},n=this;return e=n.editor.controlManager.createListBox("formatselect",{title:"advanced.block",cmd:"FormatBlock"}),e&&a(n.editor.getParam("theme_advanced_blockformats",n.settings.theme_advanced_blockformats,"hash"),function(i,o){e.add(n.editor.translate(o!=i?o:t[i]),i,{"class":"mce_formatPreview mce_"+i})}),e},_createForeColorMenu:function(){var e,t,n=this,i=n.settings,o={};return i.theme_advanced_more_colors&&(o.more_colors_func=function(){n._mceColorPicker(0,{color:e.value,func:function(t){e.setColor(t)}})}),(t=i.theme_advanced_text_colors)&&(o.colors=t),i.theme_advanced_default_foreground_color&&(o.default_color=i.theme_advanced_default_foreground_color),o.title="advanced.forecolor_desc",o.cmd="ForeColor",o.scope=this,e=n.editor.controlManager.createColorSplitButton("forecolor",o)},_createBackColorMenu:function(){var e,t,n=this,i=n.settings,o={};return i.theme_advanced_more_colors&&(o.more_colors_func=function(){n._mceColorPicker(0,{color:e.value,func:function(t){e.setColor(t)}})}),(t=i.theme_advanced_background_colors)&&(o.colors=t),i.theme_advanced_default_background_color&&(o.default_color=i.theme_advanced_default_background_color),o.title="advanced.backcolor_desc",o.cmd="HiliteColor",o.scope=this,e=n.editor.controlManager.createColorSplitButton("backcolor",o)},renderUI:function(e){var t,o,r,l,s,c,d=this,m=d.editor,u=d.settings;switch(t=s=n.create("span",{id:m.id+"_parent","class":"mceEditor "+m.settings.skin+"Skin"+(u.skin_variant?" "+m.settings.skin+"Skin"+d._ufirst(u.skin_variant):"")}),n.boxModel||(t=n.add(t,"div",{"class":"mceOldBoxModel"})),t=l=n.add(t,"table",{id:m.id+"_tbl","class":"mceLayout",cellSpacing:0,cellPadding:0}),t=r=n.add(t,"tbody"),(u.theme_advanced_layout_manager||"").toLowerCase()){case"rowlayout":o=d._rowLayout(u,r,e);break;case"customlayout":o=m.execCallback("theme_advanced_custom_layout",u,r,e,s);break;default:o=d._simpleLayout(u,r,e,s)}return t=e.targetNode,c=n.stdMode?l.getElementsByTagName("tr"):l.rows,n.addClass(c[0],"mceFirst"),n.addClass(c[c.length-1],"mceLast"),a(n.select("tr",r),function(e){n.addClass(e.firstChild,"mceFirst"),n.addClass(e.childNodes[e.childNodes.length-1],"mceLast")}),n.get(u.theme_advanced_toolbar_container)?n.get(u.theme_advanced_toolbar_container).appendChild(s):n.insertAfter(s,t),i.add(m.id+"_path_row","click",function(e){return e=e.target,"A"==e.nodeName?(d._sel(e.className.replace(/^.*mcePath_([0-9]+).*$/,"$1")),i.cancel(e)):void 0}),m.getParam("accessibility_focus")||i.add(n.add(s,"a",{href:"#"},"<!-- IE -->"),"focus",function(){tinyMCE.get(m.id).focus()}),"external"==u.theme_advanced_toolbar_location&&(e.deltaHeight=0),d.deltaHeight=e.deltaHeight,e.targetNode=null,{iframeContainer:o,editorContainer:m.id+"_parent",sizeContainer:l,deltaHeight:e.deltaHeight}},getInfo:function(){return{longname:"Advanced theme",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",version:e.majorVersion+"."+e.minorVersion}},resizeBy:function(e,t){var i=n.get(this.editor.id+"_tbl");this.resizeTo(i.clientWidth+e,i.clientHeight+t)},resizeTo:function(e,t,i){var o=this.editor,a=this.settings,l=n.get(o.id+"_tbl"),s=n.get(o.id+"_ifr");e=Math.max(a.theme_advanced_resizing_min_width||100,e),t=Math.max(a.theme_advanced_resizing_min_height||100,t),e=Math.min(a.theme_advanced_resizing_max_width||65535,e),t=Math.min(a.theme_advanced_resizing_max_height||65535,t),n.setStyle(l,"height",""),n.setStyle(s,"height",t),a.theme_advanced_resize_horizontal&&(n.setStyle(l,"width",""),n.setStyle(s,"width",e),l.clientWidth>e&&(e=l.clientWidth,n.setStyle(s,"width",l.clientWidth))),i&&a.theme_advanced_resizing_use_cookie&&r.setHash("TinyMCE_"+o.id+"_size",{cw:e,ch:t})},destroy:function(){var e=this.editor.id;i.clear(e+"_resize"),i.clear(e+"_path_row"),i.clear(e+"_external_close")},_simpleLayout:function(e,o,a,r){var l,s,c,d,m=this,u=m.editor,g=e.theme_advanced_toolbar_location,p=e.theme_advanced_statusbar_location;return e.readonly?(l=n.add(o,"tr"),l=s=n.add(l,"td",{"class":"mceIframeContainer"}),s):("top"==g&&m._addToolbars(o,a),"external"==g&&(l=d=n.create("div",{style:"position:relative"}),l=n.add(l,"div",{id:u.id+"_external","class":"mceExternalToolbar"}),n.add(l,"a",{id:u.id+"_external_close",href:"javascript:;","class":"mceExternalClose"}),l=n.add(l,"table",{id:u.id+"_tblext",cellSpacing:0,cellPadding:0}),c=n.add(l,"tbody"),"mceOldBoxModel"==r.firstChild.className?r.firstChild.appendChild(d):r.insertBefore(d,r.firstChild),m._addToolbars(c,a),u.onMouseUp.add(function(){var e=n.get(u.id+"_external");n.show(e),n.hide(t);var o=i.add(u.id+"_external_close","click",function(){n.hide(u.id+"_external"),i.remove(u.id+"_external_close","click",o)});n.show(e),n.setStyle(e,"top",0-n.getRect(u.id+"_tblext").h-1),n.hide(e),n.show(e),e.style.filter="",t=u.id+"_external",e=null})),"top"==p&&m._addStatusBar(o,a),e.theme_advanced_toolbar_container||(l=n.add(o,"tr"),l=s=n.add(l,"td",{"class":"mceIframeContainer"})),"bottom"==g&&m._addToolbars(o,a),"bottom"==p&&m._addStatusBar(o,a),s)},_rowLayout:function(e,t,i){var o,r,s,c,d,m,u=this,g=u.editor,p=g.controlManager;return o=e.theme_advanced_containers_default_class||"",r=e.theme_advanced_containers_default_align||"center",a(l(e.theme_advanced_containers||""),function(a,l){var g=e["theme_advanced_container_"+a]||"";switch(g.toLowerCase()){case"mceeditor":s=n.add(t,"tr"),s=c=n.add(s,"td",{"class":"mceIframeContainer"});break;case"mceelementpath":u._addStatusBar(t,i);break;default:m=(e["theme_advanced_container_"+a+"_align"]||r).toLowerCase(),m="mce"+u._ufirst(m),s=n.add(n.add(t,"tr"),"td",{"class":"mceToolbar "+(e["theme_advanced_container_"+a+"_class"]||o)+" "+m||r}),d=p.createToolbar("toolbar"+l),u._addControls(g,d),n.setHTML(s,d.renderHTML()),i.deltaHeight-=e.theme_advanced_row_height}}),c},_addControls:function(e,t){var n,i=this,o=i.settings,r=i.editor.controlManager;o.theme_advanced_disable&&!i._disabled?(n={},a(l(o.theme_advanced_disable),function(e){n[e]=1}),i._disabled=n):n=i._disabled,a(l(e),function(e){var o;if(!n||!n[e]){if("tablecontrols"==e)return a(["table","|","row_props","cell_props","|","row_before","row_after","delete_row","|","col_before","col_after","delete_col","|","split_cells","merge_cells"],function(e){e=i.createControl(e,r),e&&t.add(e)}),void 0;o=i.createControl(e,r),o&&t.add(o)}})},_addToolbars:function(e,t){var i,o,a,r,l,s=this,c=s.editor,d=s.settings,m=c.controlManager,u=[];for(l=d.theme_advanced_toolbar_align.toLowerCase(),l="mce"+s._ufirst(l),r=n.add(n.add(e,"tr"),"td",{"class":"mceToolbar "+l}),c.getParam("accessibility_focus")||u.push(n.createHTML("a",{href:"#",onfocus:"tinyMCE.get('"+c.id+"').focus();"},"<!-- IE -->")),u.push(n.createHTML("a",{href:"#",accesskey:"q",title:c.getLang("advanced.toolbar_focus")},"<!-- IE -->")),i=1;a=d["theme_advanced_buttons"+i];i++)o=m.createToolbar("toolbar"+i,{"class":"mceToolbarRow"+i}),d["theme_advanced_buttons"+i+"_add"]&&(a+=","+d["theme_advanced_buttons"+i+"_add"]),d["theme_advanced_buttons"+i+"_add_before"]&&(a=d["theme_advanced_buttons"+i+"_add_before"]+","+a),s._addControls(a,o),u.push(o.renderHTML()),t.deltaHeight-=d.theme_advanced_row_height;u.push(n.createHTML("a",{href:"#",accesskey:"z",title:c.getLang("advanced.toolbar_focus"),onfocus:"tinyMCE.getInstanceById('"+c.id+"').focus();"},"<!-- IE -->")),n.setHTML(r,u.join(""))},_addStatusBar:function(e,t){var o,a,l=this,s=l.editor,c=l.settings;o=n.add(e,"tr"),o=a=n.add(o,"td",{"class":"mceStatusbar"}),o=n.add(o,"div",{id:s.id+"_path_row"},c.theme_advanced_path?s.translate("advanced.path")+": ":"&#160;"),n.add(o,"a",{href:"#",accesskey:"x"}),c.theme_advanced_resizing&&(n.add(a,"a",{id:s.id+"_resize",href:"javascript:;",onclick:"return false;","class":"mceResize"}),c.theme_advanced_resizing_use_cookie&&s.onPostRender.add(function(){var e=r.getHash("TinyMCE_"+s.id+"_size");n.get(s.id+"_tbl"),e&&l.resizeTo(e.cw,e.ch)}),s.onPostRender.add(function(){i.add(s.id+"_resize","click",function(e){e.preventDefault()}),i.add(s.id+"_resize","mousedown",function(e){function t(e){e.preventDefault(),h=g+(e.screenX-m),_=p+(e.screenY-u),l.resizeTo(h,_)}function o(e){i.remove(n.doc,"mousemove",a),i.remove(s.getDoc(),"mousemove",r),i.remove(n.doc,"mouseup",c),i.remove(s.getDoc(),"mouseup",d),h=g+(e.screenX-m),_=p+(e.screenY-u),l.resizeTo(h,_,!0)}var a,r,c,d,m,u,g,p,h,_,f;e.preventDefault(),m=e.screenX,u=e.screenY,f=n.get(l.editor.id+"_ifr"),g=h=f.clientWidth,p=_=f.clientHeight,a=i.add(n.doc,"mousemove",t),r=i.add(s.getDoc(),"mousemove",t),c=i.add(n.doc,"mouseup",o),d=i.add(s.getDoc(),"mouseup",o)})})),t.deltaHeight-=21,o=e=null},_nodeChanged:function(t,i,o,r,l){function s(e){var t,n=l.parents,i=e;for("string"==typeof e&&(i=function(t){return t.nodeName==e}),t=0;n.length>t;t++)if(i(n[t]))return n[t]}var c,d,m,u,g,p,h,_,f=this,v=0,y=f.settings;e.each(f.stateControls,function(e){i.setActive(e,t.queryCommandState(f.controls[e][1]))}),i.setActive("visualaid",t.hasVisual),i.setDisabled("undo",!t.undoManager.hasUndo()&&!t.typing),i.setDisabled("redo",!t.undoManager.hasRedo()),i.setDisabled("outdent",!t.queryCommandState("Outdent")),c=s("A"),(m=i.get("link"))&&(c&&c.name||(m.setDisabled(!c&&r),m.setActive(!!c))),(m=i.get("unlink"))&&(m.setDisabled(!c&&r),m.setActive(!!c&&!c.name)),(m=i.get("anchor"))&&m.setActive(!!c&&c.name),c=s("IMG"),(m=i.get("image"))&&m.setActive(!!c&&-1==o.className.indexOf("mceItem")),(m=i.get("styleselect"))&&(f._importClasses(),h=[],a(m.items,function(e){h.push(e.value)}),_=t.formatter.matchAll(h),m.select(_[0])),(m=i.get("formatselect"))&&(c=s(n.isBlock),c&&m.select(c.nodeName.toLowerCase())),s(function(e){return"SPAN"===e.nodeName&&(!u&&e.className&&(u=e.className),!g&&e.style.fontSize&&(g=e.style.fontSize),!p&&e.style.fontFamily&&(p=e.style.fontFamily.replace(/[\"\']+/g,"").replace(/^([^,]+).*/,"$1").toLowerCase())),!1}),(m=i.get("fontselect"))&&m.select(function(e){return e.replace(/^([^,]+).*/,"$1").toLowerCase()==p}),(m=i.get("fontsizeselect"))&&(!y.theme_advanced_runtime_fontsize||g||u||(g=t.dom.getStyle(o,"fontSize",!0)),m.select(function(e){return e.fontSize&&e.fontSize===g?!0:e["class"]&&e["class"]===u?!0:void 0})),y.theme_advanced_path&&y.theme_advanced_statusbar_location&&(c=n.get(t.id+"_path")||n.add(t.id+"_path_row","span",{id:t.id+"_path"}),n.setHTML(c,""),s(function(t){var i,o=t.nodeName.toLowerCase(),a="";if(1==t.nodeType&&"BR"!==t.nodeName&&!n.hasClass(t,"mceItemHidden")&&!n.hasClass(t,"mceItemRemoved")){switch((d=n.getAttrib(t,"mce_name"))&&(o=d),e.isIE&&"HTML"!==t.scopeName&&(o=t.scopeName+":"+o),o=o.replace(/mce\:/g,"")){case"b":o="strong";break;case"i":o="em";break;case"img":(d=n.getAttrib(t,"src"))&&(a+="src: "+d+" ");break;case"a":(d=n.getAttrib(t,"name"))&&(a+="name: "+d+" ",o+="#"+d),(d=n.getAttrib(t,"href"))&&(a+="href: "+d+" ");break;case"font":(d=n.getAttrib(t,"face"))&&(a+="font: "+d+" "),(d=n.getAttrib(t,"size"))&&(a+="size: "+d+" "),(d=n.getAttrib(t,"color"))&&(a+="color: "+d+" ");break;case"span":(d=n.getAttrib(t,"style"))&&(a+="style: "+d+" ")}(d=n.getAttrib(t,"id"))&&(a+="id: "+d+" "),(d=t.className)&&(d=d.replace(/\b\s*(webkit|mce|Apple-)\w+\s*\b/g,""),d&&(a+="class: "+d+" ",(n.isBlock(t)||"img"==o||"span"==o)&&(o+="."+d))),o=o.replace(/(html:)/g,""),o={name:o,node:t,title:a},f.onResolveName.dispatch(f,o),a=o.title,o=o.name,i=n.create("a",{href:"javascript:;",onmousedown:"return false;",title:a,"class":"mcePath_"+v++},o),c.hasChildNodes()?(c.insertBefore(n.doc.createTextNode(" » "),c.firstChild),c.insertBefore(i,c.firstChild)):c.appendChild(i)}},t.getBody()))},_sel:function(e){this.editor.execCommand("mceSelectNodeDepth",!1,e)},_mceInsertAnchor:function(){var e=this.editor;e.windowManager.open({url:this.url+"/anchor.htm",width:320+parseInt(e.getLang("advanced.anchor_delta_width",0)),height:90+parseInt(e.getLang("advanced.anchor_delta_height",0)),inline:!0},{theme_url:this.url})},_mceCharMap:function(){var e=this.editor;e.windowManager.open({url:this.url+"/charmap.htm",width:550+parseInt(e.getLang("advanced.charmap_delta_width",0)),height:250+parseInt(e.getLang("advanced.charmap_delta_height",0)),inline:!0},{theme_url:this.url})},_mceHelp:function(){var e=this.editor;e.windowManager.open({url:this.url+"/about.htm",width:480,height:380,inline:!0},{theme_url:this.url})},_mceColorPicker:function(e,t){var n=this.editor;t=t||{},n.windowManager.open({url:this.url+"/color_picker.htm",width:375+parseInt(n.getLang("advanced.colorpicker_delta_width",0)),height:250+parseInt(n.getLang("advanced.colorpicker_delta_height",0)),close_previous:!1,inline:!0},{input_color:t.color,func:t.func,theme_url:this.url})},_mceCodeEditor:function(){var e=this.editor;e.windowManager.open({url:this.url+"/source_editor.htm",width:parseInt(e.getParam("theme_advanced_source_editor_width",720)),height:parseInt(e.getParam("theme_advanced_source_editor_height",580)),inline:!0,resizable:!0,maximizable:!0},{theme_url:this.url})},_mceImage:function(){var e=this.editor;-1==e.dom.getAttrib(e.selection.getNode(),"class").indexOf("mceItem")&&e.windowManager.open({url:this.url+"/image.htm",width:355+parseInt(e.getLang("advanced.image_delta_width",0)),height:275+parseInt(e.getLang("advanced.image_delta_height",0)),inline:!0},{theme_url:this.url})},_mceLink:function(){var e=this.editor;e.windowManager.open({url:this.url+"/link.htm",width:310+parseInt(e.getLang("advanced.link_delta_width",0)),height:200+parseInt(e.getLang("advanced.link_delta_height",0)),inline:!0},{theme_url:this.url})},_mceNewDocument:function(){var e=this.editor;e.windowManager.confirm("advanced.newdocument",function(t){t&&e.execCommand("mceSetContent",!1,"")})},_mceForeColor:function(){var e=this;this._mceColorPicker(0,{color:e.fgColor,func:function(t){e.fgColor=t,e.editor.execCommand("ForeColor",!1,t)}})},_mceBackColor:function(){var e=this;this._mceColorPicker(0,{color:e.bgColor,func:function(t){e.bgColor=t,e.editor.execCommand("HiliteColor",!1,t)}})},_ufirst:function(e){return e.substring(0,1).toUpperCase()+e.substring(1)}}),e.ThemeManager.add("advanced",e.themes.AdvancedTheme)})(tinymce);