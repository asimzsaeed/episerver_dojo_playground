tinyMCEPopup.requireLangPack();var TemplateDialog={preInit:function(){var e=tinyMCEPopup.getParam("template_external_list_url");null!=e&&document.write('<script language="javascript" type="text/javascript" src="'+tinyMCEPopup.editor.documentBaseURI.toAbsolute(e)+'"></sc'+"ript>")},init:function(){var e,t,n,i=tinyMCEPopup.editor;if(e=i.getParam("template_templates",!1),t=document.getElementById("tpath"),!e&&"undefined"!=typeof tinyMCETemplateList)for(n=0,e=[];tinyMCETemplateList.length>n;n++)e.push({title:tinyMCETemplateList[n][0],src:tinyMCETemplateList[n][1],description:tinyMCETemplateList[n][2]});for(n=0;e.length>n;n++)t.options[t.options.length]=new Option(e[n].title,tinyMCEPopup.editor.documentBaseURI.toAbsolute(e[n].src));this.resize(),this.tsrc=e},resize:function(){var e,t,n;self.innerWidth?(e=self.innerWidth-50,t=self.innerHeight-170):(e=document.body.clientWidth-50,t=document.body.clientHeight-160),n=document.getElementById("templatesrc"),n&&(n.style.height=Math.abs(t)+"px",n.style.width=Math.abs(e-5)+"px")},loadCSSFiles:function(e){var t=tinyMCEPopup.editor;tinymce.each(t.getParam("content_css","").split(","),function(n){e.write('<link href="'+t.documentBaseURI.toAbsolute(n)+'" rel="stylesheet" type="text/css" />')})},selectTemplate:function(e,t){var n,i=window.frames.templatesrc.document,o=this.tsrc;if(e)for(i.body.innerHTML=this.templateHTML=this.getFileContents(e),n=0;o.length>n;n++)o[n].title==t&&(document.getElementById("tmpldesc").innerHTML=o[n].description||"")},insert:function(){tinyMCEPopup.execCommand("mceInsertTemplate",!1,{content:this.templateHTML,selection:tinyMCEPopup.editor.selection.getContent()}),tinyMCEPopup.close()},getFileContents:function(e){function t(e){n=0;try{n=new ActiveXObject(e)}catch(e){}return n}var n,i="text/plain";return n=window.ActiveXObject?t("Msxml2.XMLHTTP")||t("Microsoft.XMLHTTP"):new XMLHttpRequest,n.overrideMimeType&&n.overrideMimeType(i),n.open("GET",e,!1),n.send(null),n.responseText}};TemplateDialog.preInit(),tinyMCEPopup.onInit.add(TemplateDialog.init,TemplateDialog);