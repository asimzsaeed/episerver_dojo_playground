function init(){tinyMCEPopup.resizeToInnerSize(),document.getElementById("backgroundimagebrowsercontainer").innerHTML=getBrowserHTML("backgroundimagebrowser","backgroundimage","image","table"),document.getElementById("bgcolor_pickcontainer").innerHTML=getColorPickerHTML("bgcolor_pick","bgcolor");var e=tinyMCEPopup.editor,t=e.dom,n=t.getParent(e.selection.getStart(),"tr"),i=document.forms[0],o=t.parseStyle(t.getAttrib(n,"style")),a=n.parentNode.nodeName.toLowerCase(),l=t.getAttrib(n,"align"),r=t.getAttrib(n,"valign"),s=trimSize(getStyle(n,"height","height")),c=t.getAttrib(n,"class"),d=convertRGBToHex(getStyle(n,"bgcolor","backgroundColor")),u=getStyle(n,"background","backgroundImage").replace(RegExp("url\\(['\"]?([^'\"]*)['\"]?\\)","gi"),"$1"),m=t.getAttrib(n,"id"),g=t.getAttrib(n,"lang"),p=t.getAttrib(n,"dir");selectByValue(i,"rowtype",a),0==t.select("td.mceSelected,th.mceSelected",n).length?(addClassesToList("class",tinyMCEPopup.getParam("style_formats",!1)?{tagCheckHandler:function(e){return"TD"==e.nodeName?e=tinyMCEPopup.editor.dom.getParent(e,"TR"):"TABLE"==e.nodeName&&(e=e.firstChild||e),e},tagCheckCleanUp:function(){}}:"table_row_styles"),TinyMCE_EditableSelects.init(),i.bgcolor.value=d,i.backgroundimage.value=u,i.height.value=s,i.id.value=m,i.lang.value=g,i.style.value=t.serializeStyle(o),selectByValue(i,"align",l),selectByValue(i,"valign",r),selectByValue(i,"class",c,!0,!0),selectByValue(i,"dir",p),isVisible("backgroundimagebrowser")&&(document.getElementById("backgroundimage").style.width="180px"),updateColor("bgcolor_pick","bgcolor")):tinyMCEPopup.dom.hide("action")}function updateAction(){var e,t,n=tinyMCEPopup.editor,i=n.dom,o=document.forms[0],a=getSelectValue(o,"action");if(tinyMCEPopup.restoreSelection(),e=i.getParent(n.selection.getStart(),"tr"),t=i.getParent(n.selection.getStart(),"table"),i.select("td.mceSelected,th.mceSelected",e).length>0)return tinymce.each(t.rows,function(e){var t;for(t=0;e.cells.length>t;t++)if(i.hasClass(e.cells[t],"mceSelected"))return updateRow(e,!0),void 0}),n.addVisual(),n.nodeChanged(),n.execCommand("mceEndUndoLevel"),tinyMCEPopup.close(),void 0;switch(n.execCommand("mceBeginUndoLevel"),a){case"row":updateRow(e);break;case"all":for(var l=t.getElementsByTagName("tr"),r=0;l.length>r;r++)updateRow(l[r],!0);break;case"odd":case"even":for(var l=t.getElementsByTagName("tr"),r=0;l.length>r;r++)(0==r%2&&"odd"==a||0!=r%2&&"even"==a)&&updateRow(l[r],!0,!0)}n.addVisual(),n.nodeChanged(),n.execCommand("mceEndUndoLevel"),tinyMCEPopup.close()}function updateRow(e,t,n){var i=tinyMCEPopup.editor,o=document.forms[0],a=i.dom,l=e.parentNode.nodeName.toLowerCase(),r=getSelectValue(o,"rowtype"),s=i.getDoc();if(t||e.setAttribute("id",o.id.value),e.setAttribute("align",getSelectValue(o,"align")),e.setAttribute("vAlign",getSelectValue(o,"valign")),e.setAttribute("lang",o.lang.value),e.setAttribute("dir",getSelectValue(o,"dir")),e.setAttribute("style",a.serializeStyle(a.parseStyle(o.style.value))),a.setAttrib(e,"class",getSelectValue(o,"class")),e.setAttribute("background",""),e.setAttribute("bgColor",""),e.setAttribute("height",""),e.style.height=getCSSSize(o.height.value),e.style.backgroundColor=o.bgcolor.value,e.style.backgroundImage=""!=o.backgroundimage.value?"url('"+o.backgroundimage.value+"')":"",l!=r&&!n){for(var c=e.cloneNode(1),d=a.getParent(e,"table"),u=r,m=null,g=0;d.childNodes.length>g;g++)d.childNodes[g].nodeName.toLowerCase()==u&&(m=d.childNodes[g]);null==m&&(m=s.createElement(u),"thead"==u?"CAPTION"==d.firstChild.nodeName?i.dom.insertAfter(m,d.firstChild):d.insertBefore(m,d.firstChild):d.appendChild(m)),m.appendChild(c),e.parentNode.removeChild(e),e=c}a.setAttrib(e,"style",a.serializeStyle(a.parseStyle(e.style.cssText)))}function changedBackgroundImage(){var e=document.forms[0],t=tinyMCEPopup.editor.dom,n=t.parseStyle(e.style.value);n["background-image"]="url('"+e.backgroundimage.value+"')",e.style.value=t.serializeStyle(n)}function changedStyle(){var e=document.forms[0],t=tinyMCEPopup.editor.dom,n=t.parseStyle(e.style.value);e.backgroundimage.value=n["background-image"]?n["background-image"].replace(RegExp("url\\('?([^']*)'?\\)","gi"),"$1"):"",n.height&&(e.height.value=trimSize(n.height)),n["background-color"]&&(e.bgcolor.value=n["background-color"],updateColor("bgcolor_pick","bgcolor"))}function changedSize(){var e=document.forms[0],t=tinyMCEPopup.editor.dom,n=t.parseStyle(e.style.value),i=e.height.value;n.height=""!=i?getCSSSize(i):"",e.style.value=t.serializeStyle(n)}function changedColor(){var e=document.forms[0],t=tinyMCEPopup.editor.dom,n=t.parseStyle(e.style.value);n["background-color"]=e.bgcolor.value,e.style.value=t.serializeStyle(n)}tinyMCEPopup.requireLangPack(),tinyMCEPopup.onInit.add(init);