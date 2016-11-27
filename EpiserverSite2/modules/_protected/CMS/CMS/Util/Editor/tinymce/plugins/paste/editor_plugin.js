(function(){function e(e,t){return e.getParam(t,i[t])}var t=tinymce.each,n=null,i={paste_auto_cleanup_on_paste:!0,paste_block_drop:!1,paste_retain_style_properties:"none",paste_strip_class_attributes:"mso",paste_remove_spans:!1,paste_remove_styles:!1,paste_remove_styles_if_webkit:!0,paste_convert_middot_lists:!0,paste_convert_headers_to_strong:!1,paste_dialog_width:"450",paste_dialog_height:"400",paste_text_use_dialog:!1,paste_text_sticky:!1,paste_text_notifyalways:!1,paste_text_linebreaktype:"p",paste_text_replacements:[[/\u2026/g,"..."],[/[\x93\x94\u201c\u201d]/g,'"'],[/[\x60\x91\x92\u2018\u2019]/g,"'"]]};tinymce.create("tinymce.plugins.PastePlugin",{init:function(n,i){function o(t,i){var o=n.dom;r.onPreProcess.dispatch(r,t),t.node=o.create("div",0,t.content),r.onPostProcess.dispatch(r,t),t.content=n.serializer.serialize(t.node,{getInner:1}),!i&&n.pasteAsPlainText?(r._insertPlainText(n,o,t.content),e(n,"paste_text_sticky")||(n.pasteAsPlainText=!1,n.controlManager.setActive("pastetext",!1))):/<(p|h[1-6]|ul|ol)/.test(t.content)?r._insertBlockContent(n,o,t.content):r._insert(t.content)}function a(e){function i(e){e.preventDefault()}var a,r,s,l,c=n.selection,d=n.dom,m=n.getBody();if(n.pasteAsPlainText&&(e.clipboardData||d.doc.dataTransfer))return e.preventDefault(),o({content:(e.clipboardData||d.doc.dataTransfer).getData("Text").replace(/\r?\n/g,"<br />")}),void 0;if(!d.get("_mcePaste"))return a=d.add(m,"div",{id:"_mcePaste","class":"mcePaste"},'﻿<br _mce_bogus="1">'),l=m!=n.getDoc().body?d.getPos(n.selection.getStart(),m).y:m.scrollTop,d.setStyles(a,{position:"absolute",left:-1e4,top:l,width:1,height:1,overflow:"hidden"}),tinymce.isIE?(s=d.doc.body.createTextRange(),s.moveToElementText(a),s.execCommand("Paste"),d.remove(a),"﻿"===a.innerHTML?(n.execCommand("mcePasteWord"),e.preventDefault(),void 0):(o({content:a.innerHTML}),tinymce.dom.Event.cancel(e))):(d.bind(n.getDoc(),"mousedown",i),d.bind(n.getDoc(),"keydown",i),r=n.selection.getRng(),a=a.firstChild,s=n.getDoc().createRange(),s.setStart(a,0),s.setEnd(a,1),c.setRng(s),window.setTimeout(function(){var e="",a=d.select("div.mcePaste");t(a,function(n){var i=n.firstChild;i&&"DIV"==i.nodeName&&i.style.marginTop&&i.style.backgroundColor&&d.remove(i,1),t(d.select("div.mcePaste",n),function(e){d.remove(e,1)}),t(d.select("span.Apple-style-span",n),function(e){d.remove(e,1)}),t(d.select("br[_mce_bogus]",n),function(e){d.remove(e)}),e+=n.innerHTML}),t(a,function(e){d.remove(e)}),r&&c.setRng(r),o({content:e}),d.unbind(n.getDoc(),"mousedown",i),d.unbind(n.getDoc(),"keydown",i)},0),void 0)}var r=this;r.editor=n,r.url=i,r.onPreProcess=new tinymce.util.Dispatcher(r),r.onPostProcess=new tinymce.util.Dispatcher(r),r.onPreProcess.add(r._preProcess),r.onPostProcess.add(r._postProcess),r.onPreProcess.add(function(e,t){n.execCallback("paste_preprocess",e,t)}),r.onPostProcess.add(function(e,t){n.execCallback("paste_postprocess",e,t)}),n.pasteAsPlainText=!1,n.addCommand("mceInsertClipboardContent",function(e,t){o(t,!0)}),e(n,"paste_text_use_dialog")||n.addCommand("mcePasteText",function(){var t=tinymce.util.Cookie;n.pasteAsPlainText=!n.pasteAsPlainText,n.controlManager.setActive("pastetext",n.pasteAsPlainText),n.pasteAsPlainText&&!t.get("tinymcePasteText")&&(e(n,"paste_text_sticky")?n.windowManager.alert(n.translate("paste.plaintext_mode_sticky")):n.windowManager.alert(n.translate("paste.plaintext_mode_sticky")),e(n,"paste_text_notifyalways")||t.set("tinymcePasteText","1",new Date((new Date).getFullYear()+1,12,31)))}),n.addButton("pastetext",{title:"paste.paste_text_desc",cmd:"mcePasteText"}),n.addButton("selectall",{title:"paste.selectall_desc",cmd:"selectall"}),e(n,"paste_auto_cleanup_on_paste")&&(tinymce.isOpera||/Firefox\/2/.test(navigator.userAgent)?n.onKeyDown.add(function(e,t){((tinymce.isMac?t.metaKey:t.ctrlKey)&&86==t.keyCode||t.shiftKey&&45==t.keyCode)&&a(t)}):n.onPaste.addToTop(function(e,t){return a(t)})),e(n,"paste_block_drop")&&n.onInit.add(function(){n.dom.bind(n.getBody(),["dragend","dragover","draggesture","dragdrop","drop","drag"],function(e){return e.preventDefault(),e.stopPropagation(),!1})}),r._legacySupport()},getInfo:function(){return{longname:"Paste text/word",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/paste",version:tinymce.majorVersion+"."+tinymce.minorVersion}},_preProcess:function(n,i){function o(e){t(e,function(e){c=e.constructor==RegExp?c.replace(e,""):c.replace(e[0],e[1])})}function a(e,t){if("all"===s)return"";var n=d(m(t.replace(/^(["'])(.*)\1$/,"$2")," "),function(e){return/^(?!mso)/i.test(e)});return n.length?' class="'+n.join(" ")+'"':""}var r,s,l=this.editor,c=i.content,d=tinymce.grep,m=tinymce.explode,u=tinymce.trim;if(/class="?Mso|style="[^"]*\bmso-|w:WordDocument/i.test(c)||i.wordContent){i.wordContent=!0,o([/^\s*(&nbsp;)+/gi,/(&nbsp;|<br[^>]*>)+\s*$/gi]),e(l,"paste_convert_headers_to_strong")&&(c=c.replace(/<p [^>]*class="?MsoHeading"?[^>]*>(.*?)<\/p>/gi,"<p><strong>$1</strong></p>")),e(l,"paste_convert_middot_lists")&&o([[/<!--\[if !supportLists\]-->/gi,"$&__MCE_ITEM__"],[/(<span[^>]+(?:mso-list:|:\s*symbol)[^>]+>)/gi,"$1__MCE_ITEM__"]]),o([/<!--[\s\S]+?-->/gi,/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi,[/<(\/?)s>/gi,"<$1strike>"],[/&nbsp;/gi," "]]);do r=c.length,c=c.replace(/(<[a-z][^>]*\s)(?:id|name|language|type|on\w+|\w+:\w+)=(?:"[^"]*"|\w+)\s?/gi,"$1");while(r!=c.length);0==e(l,"paste_retain_style_properties").replace(/^none$/i,"").length?c=c.replace(/<\/?span[^>]*>/gi,""):o([[/<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi,function(e,t){return t.length>0?t.replace(/./," ").slice(Math.floor(t.length/2)).split("").join(" "):""}],[/(<[a-z][^>]*)\sstyle="([^"]*)"/gi,function(e,n,i){var o=[],a=0,r=m(u(i).replace(/&quot;/gi,"'"),";");return t(r,function(e){function t(e){return e+("0"!==e&&/\d$/.test(e))?"px":""}var n,i,r=m(e,":");if(2==r.length){switch(n=r[0].toLowerCase(),i=r[1].toLowerCase(),n){case"mso-padding-alt":case"mso-padding-top-alt":case"mso-padding-right-alt":case"mso-padding-bottom-alt":case"mso-padding-left-alt":case"mso-margin-alt":case"mso-margin-top-alt":case"mso-margin-right-alt":case"mso-margin-bottom-alt":case"mso-margin-left-alt":case"mso-table-layout-alt":case"mso-height":case"mso-width":case"mso-vertical-align-alt":return o[a++]=n.replace(/^mso-|-alt$/g,"")+":"+t(i),void 0;case"horiz-align":return o[a++]="text-align:"+i,void 0;case"vert-align":return o[a++]="vertical-align:"+i,void 0;case"font-color":case"mso-foreground":return o[a++]="color:"+i,void 0;case"mso-background":case"mso-highlight":return o[a++]="background:"+i,void 0;case"mso-default-height":return o[a++]="min-height:"+t(i),void 0;case"mso-default-width":return o[a++]="min-width:"+t(i),void 0;case"mso-padding-between-alt":return o[a++]="border-collapse:separate;border-spacing:"+t(i),void 0;case"text-line-through":return("single"==i||"double"==i)&&(o[a++]="text-decoration:line-through"),void 0;case"mso-zero-height":return"yes"==i&&(o[a++]="display:none"),void 0}if(/^(mso|column|font-emph|lang|layout|line-break|list-image|nav|panose|punct|row|ruby|sep|size|src|tab-|table-border|text-(?!align|decor|indent|trans)|top-bar|version|vnd|word-break)/.test(n))return;o[a++]=n+":"+r[1]}}),a>0?n+' style="'+o.join(";")+'"':n}]])}e(l,"paste_convert_headers_to_strong")&&o([[/<h[1-6][^>]*>/gi,"<p><strong>"],[/<\/h[1-6][^>]*>/gi,"</strong></p>"]]),s=e(l,"paste_strip_class_attributes"),"none"!==s&&(c=c.replace(/ class="([^"]+)"/gi,a),c=c.replace(/ class=(\w+)/gi,a)),e(l,"paste_remove_spans")&&(c=c.replace(/<\/?span[^>]*>/gi,"")),i.content=c},_postProcess:function(n,i){var o,a=this,r=a.editor,s=r.dom;i.wordContent&&(t(s.select("a",i.node),function(e){e.href&&-1==e.href.indexOf("#_Toc")||s.remove(e,1)}),e(r,"paste_convert_middot_lists")&&a._convertLists(n,i),o=e(r,"paste_retain_style_properties"),tinymce.is(o,"string")&&"all"!==o&&"*"!==o&&(o=tinymce.explode(o.replace(/^none$/i,"")),t(s.select("*",i.node),function(e){var t,n,i,a={},r=0;if(o)for(t=0;o.length>t;t++)n=o[t],i=s.getStyle(e,n),i&&(a[n]=i,r++);s.setAttrib(e,"style",""),o&&r>0?s.setStyles(e,a):"SPAN"!=e.nodeName||e.className||s.remove(e,!0)}))),e(r,"paste_remove_styles")||e(r,"paste_remove_styles_if_webkit")&&tinymce.isWebKit?t(s.select("*[style]",i.node),function(e){e.removeAttribute("style"),e.removeAttribute("_mce_style")}):tinymce.isWebKit&&t(s.select("*",i.node),function(e){e.removeAttribute("_mce_style")})},_convertLists:function(e,n){var i,o,a,r,s,l=e.editor.dom,c=-1,d=[];t(l.select("p",n.node),function(e){var n,s,m,u,g,p="";for(n=e.firstChild;n&&3==n.nodeType;n=n.nextSibling)p+=n.nodeValue;p=e.innerHTML.replace(/<\/?\w+[^>]*>/gi,"").replace(/&nbsp;/g," "),/^(__MCE_ITEM__)+[\u2022\u00b7\u00a7\u00d8o]\s*\u00a0*/.test(p)&&(s="ul"),/^__MCE_ITEM__\s*\w+\.\s*\u00a0{2,}/.test(p)&&(s="ol"),s?(a=parseFloat(e.style.marginLeft||0),a>c&&d.push(a),i&&s==r?a>c?i=o.appendChild(l.create(s)):c>a&&(u=tinymce.inArray(d,a),g=l.getParents(i.parentNode,s),i=g[g.length-1-u]||i):(i=l.create(s),l.insertAfter(i,e)),t(l.select("span",e),function(e){var t=e.innerHTML.replace(/<\/?\w+[^>]*>/gi,"");"ul"==s&&/^[\u2022\u00b7\u00a7\u00d8o]/.test(t)?l.remove(e):/^[\s\S]*\w+\.(&nbsp;|\u00a0)*\s*/.test(t)&&l.remove(e)}),m=e.innerHTML,m="ul"==s?e.innerHTML.replace(/__MCE_ITEM__/g,"").replace(/^[\u2022\u00b7\u00a7\u00d8o]\s*(&nbsp;|\u00a0)+\s*/,""):e.innerHTML.replace(/__MCE_ITEM__/g,"").replace(/^\s*\w+\.(&nbsp;|\u00a0)+\s*/,""),o=i.appendChild(l.create("li",0,m)),l.remove(e),c=a,r=s):i=c=0}),s=n.node.innerHTML,-1!=s.indexOf("__MCE_ITEM__")&&(n.node.innerHTML=s.replace(/__MCE_ITEM__/g,""))},_insertBlockContent:function(e,n,i){function o(t){var n;tinymce.isIE?(n=e.getDoc().body.createTextRange(),n.moveToElementText(t),n.collapse(!1),n.select()):(u.select(t,1),u.collapse(!1))}var a,r,s,l,c,d,m,u=e.selection,g="mce_marker";for(this._insert('<span id="'+g+'"></span>',1),r=n.get(g),a=n.getParent(r,"p,h1,h2,h3,h4,h5,h6,ul,ol,th,td"),a&&!/TD|TH/.test(a.nodeName)?(r=n.split(a,r),t(n.create("div",0,i).childNodes,function(e){s=r.parentNode.insertBefore(e.cloneNode(!0),r)}),o(s)):(n.setOuterHTML(r,i),u.select(e.getBody(),1),u.collapse(0));l=n.get(g);)n.remove(l);l=u.getStart(),c=n.getViewPort(e.getWin()),d=e.dom.getPos(l).y,m=l.clientHeight,(c.y>d||d+m>c.y+c.h)&&(e.getDoc().body.scrollTop=c.y>d?d:d-c.h+25)},_insert:function(e,t){var n=this.editor,i=n.selection.getRng();n.selection.isCollapsed()||i.startContainer==i.endContainer||n.getDoc().execCommand("Delete",!1,null),n.execCommand(tinymce.isGecko?"insertHTML":"mceInsertContent",!1,e,{skip_undo:t})},_insertPlainText:function(i,o,a){function r(e){t(e,function(e){a=e.constructor==RegExp?a.replace(e,""):a.replace(e[0],e[1])})}var s,l,c,d,m,u,g,p,h=i.getWin(),f=i.getDoc(),v=i.selection,y=tinymce.is,_=tinymce.inArray,b=e(i,"paste_text_linebreaktype"),w=e(i,"paste_text_replacements");if("string"==typeof a&&a.length>0){if(n||(n=("34,quot,38,amp,39,apos,60,lt,62,gt,"+i.serializer.settings.entities).split(",")),/<(?:p|br|h[1-6]|ul|ol|dl|table|t[rdh]|div|blockquote|fieldset|pre|address|center)[^>]*>/i.test(a)?r([/[\n\r]+/g]):r([/\r+/g]),r([[/<\/(?:p|h[1-6]|ul|ol|dl|table|div|blockquote|fieldset|pre|address|center)>/gi,"\n\n"],[/<br[^>]*>|<\/tr>/gi,"\n"],[/<\/t[dh]>\s*<t[dh][^>]*>/gi,"	"],/<[a-z!\/?][^>]*>/gi,[/&nbsp;/gi," "],[/&(#\d+|[a-z0-9]{1,10});/gi,function(e,t){return"#"===t.charAt(0)?String.fromCharCode(t.slice(1)):(e=_(n,t))>0?String.fromCharCode(n[e-1]):" "}],[/(?:(?!\n)\s)*(\n+)(?:(?!\n)\s)*/gi,"$1"],[/\n{3,}/g,"\n\n"],/^\s+|\s+$/g]),a=o.encode(a),v.isCollapsed()||f.execCommand("Delete",!1,null),y(w,"array")||y(w,"array")?r(w):y(w,"string")&&r(RegExp(w,"gi")),"none"==b?r([[/\n+/g," "]]):"br"==b?r([[/\n/g,"<br />"]]):r([/^\s+|\s+$/g,[/\n\n/g,"</p><p>"],[/\n/g,"<br />"]]),-1!=(c=a.indexOf("</p><p>"))){d=a.lastIndexOf("</p><p>"),m=v.getNode(),u=[];do if(1==m.nodeType){if("TD"==m.nodeName||"BODY"==m.nodeName)break;u[u.length]=m}while(m=m.parentNode);if(u.length>0){for(g=a.substring(0,c),p="",s=0,l=u.length;l>s;s++)g+="</"+u[s].nodeName.toLowerCase()+">",p+="<"+u[u.length-s-1].nodeName.toLowerCase()+">";a=c==d?g+p+a.substring(c+7):g+a.substring(c+4,d+4)+p+a.substring(d+7)}}i.execCommand("mceInsertRawHTML",!1,a+'<span id="_plain_text_marker">&nbsp;</span>'),window.setTimeout(function(){var e,t,n,i,a=o.get("_plain_text_marker");v.select(a,!1),f.execCommand("Delete",!1,null),a=null,e=v.getStart(),t=o.getViewPort(h),n=o.getPos(e).y,i=e.clientHeight,(t.y>n||n+i>t.y+t.h)&&(f.body.scrollTop=t.y>n?n:n-t.h+25)},0)}},_legacySupport:function(){var t=this,n=t.editor;n.addCommand("mcePasteWord",function(){n.windowManager.open({file:t.url+"/pasteword.htm",width:parseInt(e(n,"paste_dialog_width")),height:parseInt(e(n,"paste_dialog_height")),inline:1})}),e(n,"paste_text_use_dialog")&&n.addCommand("mcePasteText",function(){n.windowManager.open({file:t.url+"/pastetext.htm",width:parseInt(e(n,"paste_dialog_width")),height:parseInt(e(n,"paste_dialog_height")),inline:1})}),n.addButton("pasteword",{title:"paste.paste_word_desc",cmd:"mcePasteWord"})}}),tinymce.PluginManager.add("paste",tinymce.plugins.PastePlugin)})();