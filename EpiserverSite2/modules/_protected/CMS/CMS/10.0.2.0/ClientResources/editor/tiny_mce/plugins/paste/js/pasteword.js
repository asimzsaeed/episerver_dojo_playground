tinyMCEPopup.requireLangPack();var PasteWordDialog={init:function(){var e,t,n,i=tinyMCEPopup.editor,o=document.getElementById("iframecontainer"),a="";o.innerHTML='<iframe id="iframe" src="javascript:\'\';" frameBorder="0" style="border: 1px solid gray"></iframe>',e=document.getElementById("iframe"),t=e.contentWindow.document,n=[i.baseURI.toAbsolute("themes/"+i.settings.theme+"/skins/"+i.settings.skin+"/content.css")],n=n.concat(tinymce.explode(i.settings.content_css)||[]),tinymce.each(n,function(e){a+='<link href="'+i.documentBaseURI.toAbsolute(""+e)+'" rel="stylesheet" type="text/css" />'}),t.open(),t.write("<html><head>"+a+'</head><body class="mceContentBody" spellcheck="false"></body></html>'),t.close(),t.designMode="on",this.resize(),window.setTimeout(function(){e.contentWindow.focus()},10)},insert:function(){var e=document.getElementById("iframe").contentWindow.document.body.innerHTML;return tinyMCEPopup.editor.execCommand("mceInsertClipboardContent",!1,{content:e,wordContent:!0}),tinyMCEPopup.close(),!1},resize:function(){var e,t=tinyMCEPopup.dom.getViewPort(window);e=document.getElementById("iframe"),e&&(e.style.width=t.w-20+"px",e.style.height=t.h-90+"px")}};tinyMCEPopup.onInit.add(PasteWordDialog.init,PasteWordDialog);