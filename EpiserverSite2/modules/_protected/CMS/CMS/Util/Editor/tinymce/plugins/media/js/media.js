function init(){var e,t,n,i="",o="flash";if(ed=tinyMCEPopup.editor,tinyMCEPopup.resizeToInnerSize(),e=document.forms[0],n=ed.selection.getNode(),/mceItem(Flash|ShockWave|WindowsMedia|QuickTime|RealMedia)/.test(ed.dom.getAttrib(n,"class"))){switch(i=n.title,ed.dom.getAttrib(n,"class")){case"mceItemFlash":o="flash";break;case"mceItemFlashVideo":o="flv";break;case"mceItemShockWave":o="shockwave";break;case"mceItemWindowsMedia":o="wmp";break;case"mceItemQuickTime":o="qt";break;case"mceItemRealMedia":o="rmp"}document.forms[0].insert.value=ed.getLang("update","Insert",!0)}document.getElementById("filebrowsercontainer").innerHTML=getBrowserHTML("filebrowser","src","media","media"),document.getElementById("qtsrcfilebrowsercontainer").innerHTML=getBrowserHTML("qtsrcfilebrowser","qt_qtsrc","media","media"),document.getElementById("bgcolor_pickcontainer").innerHTML=getColorPickerHTML("bgcolor_pick","bgcolor");var a=getMediaListHTML("medialist","src","media","media");if(""==a?document.getElementById("linklistrow").style.display="none":document.getElementById("linklistcontainer").innerHTML=a,isVisible("filebrowser")&&(document.getElementById("src").style.width="230px"),""!=i){switch(i=tinyMCEPopup.editor.plugins.media._parse(i),o){case"flash":setBool(i,"flash","play"),setBool(i,"flash","loop"),setBool(i,"flash","menu"),setBool(i,"flash","swliveconnect"),setStr(i,"flash","quality"),setStr(i,"flash","scale"),setStr(i,"flash","salign"),setStr(i,"flash","wmode"),setStr(i,"flash","base"),setStr(i,"flash","flashvars");break;case"qt":setBool(i,"qt","loop"),setBool(i,"qt","autoplay"),setBool(i,"qt","cache"),setBool(i,"qt","controller"),setBool(i,"qt","correction"),setBool(i,"qt","enablejavascript"),setBool(i,"qt","kioskmode"),setBool(i,"qt","autohref"),setBool(i,"qt","playeveryframe"),setBool(i,"qt","tarsetcache"),setStr(i,"qt","scale"),setStr(i,"qt","starttime"),setStr(i,"qt","endtime"),setStr(i,"qt","tarset"),setStr(i,"qt","qtsrcchokespeed"),setStr(i,"qt","volume"),setStr(i,"qt","qtsrc");break;case"shockwave":setBool(i,"shockwave","sound"),setBool(i,"shockwave","progress"),setBool(i,"shockwave","autostart"),setBool(i,"shockwave","swliveconnect"),setStr(i,"shockwave","swvolume"),setStr(i,"shockwave","swstretchstyle"),setStr(i,"shockwave","swstretchhalign"),setStr(i,"shockwave","swstretchvalign");break;case"wmp":setBool(i,"wmp","autostart"),setBool(i,"wmp","enabled"),setBool(i,"wmp","enablecontextmenu"),setBool(i,"wmp","fullscreen"),setBool(i,"wmp","invokeurls"),setBool(i,"wmp","mute"),setBool(i,"wmp","stretchtofit"),setBool(i,"wmp","windowlessvideo"),setStr(i,"wmp","balance"),setStr(i,"wmp","baseurl"),setStr(i,"wmp","captioningid"),setStr(i,"wmp","currentmarker"),setStr(i,"wmp","currentposition"),setStr(i,"wmp","defaultframe"),setStr(i,"wmp","playcount"),setStr(i,"wmp","rate"),setStr(i,"wmp","uimode"),setStr(i,"wmp","volume");break;case"rmp":setBool(i,"rmp","autostart"),setBool(i,"rmp","loop"),setBool(i,"rmp","autogotourl"),setBool(i,"rmp","center"),setBool(i,"rmp","imagestatus"),setBool(i,"rmp","maintainaspect"),setBool(i,"rmp","nojava"),setBool(i,"rmp","prefetch"),setBool(i,"rmp","shuffle"),setStr(i,"rmp","console"),setStr(i,"rmp","controls"),setStr(i,"rmp","numloop"),setStr(i,"rmp","scriptcallbacks")}setStr(i,null,"src"),setStr(i,null,"id"),setStr(i,null,"name"),setStr(i,null,"vspace"),setStr(i,null,"hspace"),setStr(i,null,"bgcolor"),setStr(i,null,"align"),setStr(i,null,"width"),setStr(i,null,"height"),""!=(t=ed.dom.getAttrib(n,"width"))&&(i.width=e.width.value=t),""!=(t=ed.dom.getAttrib(n,"height"))&&(i.height=e.height.value=t),oldWidth=i.width?parseInt(i.width):0,oldHeight=i.height?parseInt(i.height):0}else oldWidth=oldHeight=0;selectByValue(e,"media_type",o),changedType(o),updateColor("bgcolor_pick","bgcolor"),TinyMCE_EditableSelects.init(),generatePreview()}function insertMedia(){var e,t,n=document.forms[0];if(tinyMCEPopup.restoreSelection(),!AutoValidator.validate(n))return tinyMCEPopup.alert(ed.getLang("invalid_data")),!1;if(n.width.value=""==n.width.value?100:n.width.value,n.height.value=""==n.height.value?100:n.height.value,e=ed.selection.getNode(),null!=e&&/mceItem(Flash|ShockWave|WindowsMedia|QuickTime|RealMedia)/.test(ed.dom.getAttrib(e,"class"))){switch(n.media_type.options[n.media_type.selectedIndex].value){case"flash":e.className="mceItemFlash";break;case"flv":e.className="mceItemFlashVideo";break;case"shockwave":e.className="mceItemShockWave";break;case"qt":e.className="mceItemQuickTime";break;case"wmp":e.className="mceItemWindowsMedia";break;case"rmp":e.className="mceItemRealMedia"}(e.width!=n.width.value||e.height!=n.height.value)&&ed.execCommand("mceRepaint"),e.title=serializeParameters(),e.width=n.width.value,e.height=n.height.value,e.style.width=n.width.value+(-1==n.width.value.indexOf("%")?"px":""),e.style.height=n.height.value+(-1==n.height.value.indexOf("%")?"px":""),e.align=n.align.options[n.align.selectedIndex].value}else{switch(t='<img src="'+tinyMCEPopup.getWindowArg("plugin_url")+'/img/trans.gif"',n.media_type.options[n.media_type.selectedIndex].value){case"flash":t+=' class="mceItemFlash"';break;case"flv":t+=' class="mceItemFlashVideo"';break;case"shockwave":t+=' class="mceItemShockWave"';break;case"qt":t+=' class="mceItemQuickTime"';break;case"wmp":t+=' class="mceItemWindowsMedia"';break;case"rmp":t+=' class="mceItemRealMedia"'}t+=' title="'+serializeParameters()+'"',t+=' width="'+n.width.value+'"',t+=' height="'+n.height.value+'"',t+=' align="'+n.align.options[n.align.selectedIndex].value+'"',t+=" />",ed.execCommand("mceInsertContent",!1,t)}tinyMCEPopup.close()}function updatePreview(){var e,t=document.forms[0];t.width.value=t.width.value||"320",t.height.value=t.height.value||"240",e=getType(t.src.value),selectByValue(t,"media_type",e),changedType(e),generatePreview()}function getMediaListHTML(){if("undefined"!=typeof tinyMCEMediaList&&tinyMCEMediaList.length>0){var e="";e+='<select id="linklist" name="linklist" style="width: 250px" onchange="this.form.src.value=this.options[this.selectedIndex].value;updatePreview();">',e+='<option value="">---</option>';for(var t=0;tinyMCEMediaList.length>t;t++)e+='<option value="'+tinyMCEMediaList[t][1]+'">'+tinyMCEMediaList[t][0]+"</option>";return e+="</select>"}return""}function getType(e){var t,n,i,o,a,r=document.forms[0];if(t=ed.getParam("media_types","flash=swf;shockwave=dcr;qt=mov,qt,mpg,mp3,mp4,mpeg;shockwave=dcr;wmp=avi,wmv,wm,asf,asx,wmx,wvx;rmp=rm,ra,ram").split(";"),e.match(/watch\?v=(.+)(.*)/))return r.width.value="425",r.height.value="350",r.src.value="http://www.youtube.com/v/"+e.match(/v=(.*)(.*)/)[0].split("=")[1],"flash";if(0==e.indexOf("http://video.google.com/videoplay?docid="))return r.width.value="425",r.height.value="326",r.src.value="http://video.google.com/googleplayer.swf?docId="+e.substring("http://video.google.com/videoplay?docid=".length)+"&hl=en","flash";for(n=0;t.length>n;n++)for(i=t[n].split("="),o=i[1].split(","),a=0;o.length>a;a++)if(-1!=e.indexOf("."+o[a]))return i[0];return null}function switchType(e){var t=getType(e),n=document,i=n.forms[0];t&&(selectByValue(n.forms[0],"media_type",t),changedType(t),"qt"==t&&-1!=i.src.value.toLowerCase().indexOf("rtsp://")&&(alert(ed.getLang("media_qt_stream_warn")),""==i.qt_qtsrc.value&&(i.qt_qtsrc.value=i.src.value)))}function changedType(e){var t=document;t.getElementById("flash_options").style.display="none",t.getElementById("flv_options").style.display="none",t.getElementById("qt_options").style.display="none",t.getElementById("shockwave_options").style.display="none",t.getElementById("wmp_options").style.display="none",t.getElementById("rmp_options").style.display="none",e&&(t.getElementById(e+"_options").style.display="block")}function serializeParameters(){var e=document,t=e.forms[0],n="";switch(t.media_type.options[t.media_type.selectedIndex].value){case"flash":n+=getBool("flash","play",!0),n+=getBool("flash","loop",!0),n+=getBool("flash","menu",!0),n+=getBool("flash","swliveconnect",!1),n+=getStr("flash","quality"),n+=getStr("flash","scale"),n+=getStr("flash","salign"),n+=getStr("flash","wmode"),n+=getStr("flash","base"),n+=getStr("flash","flashvars");break;case"qt":n+=getBool("qt","loop",!1),n+=getBool("qt","autoplay",!0),n+=getBool("qt","cache",!1),n+=getBool("qt","controller",!0),n+=getBool("qt","correction",!1,"none","full"),n+=getBool("qt","enablejavascript",!1),n+=getBool("qt","kioskmode",!1),n+=getBool("qt","autohref",!1),n+=getBool("qt","playeveryframe",!1),n+=getBool("qt","targetcache",!1),n+=getStr("qt","scale"),n+=getStr("qt","starttime"),n+=getStr("qt","endtime"),n+=getStr("qt","target"),n+=getStr("qt","qtsrcchokespeed"),n+=getStr("qt","volume"),n+=getStr("qt","qtsrc");break;case"shockwave":n+=getBool("shockwave","sound"),n+=getBool("shockwave","progress"),n+=getBool("shockwave","autostart"),n+=getBool("shockwave","swliveconnect"),n+=getStr("shockwave","swvolume"),n+=getStr("shockwave","swstretchstyle"),n+=getStr("shockwave","swstretchhalign"),n+=getStr("shockwave","swstretchvalign");break;case"wmp":n+=getBool("wmp","autostart",!0),n+=getBool("wmp","enabled",!1),n+=getBool("wmp","enablecontextmenu",!0),n+=getBool("wmp","fullscreen",!1),n+=getBool("wmp","invokeurls",!0),n+=getBool("wmp","mute",!1),n+=getBool("wmp","stretchtofit",!1),n+=getBool("wmp","windowlessvideo",!1),n+=getStr("wmp","balance"),n+=getStr("wmp","baseurl"),n+=getStr("wmp","captioningid"),n+=getStr("wmp","currentmarker"),n+=getStr("wmp","currentposition"),n+=getStr("wmp","defaultframe"),n+=getStr("wmp","playcount"),n+=getStr("wmp","rate"),n+=getStr("wmp","uimode"),n+=getStr("wmp","volume");break;case"rmp":n+=getBool("rmp","autostart",!1),n+=getBool("rmp","loop",!1),n+=getBool("rmp","autogotourl",!0),n+=getBool("rmp","center",!1),n+=getBool("rmp","imagestatus",!0),n+=getBool("rmp","maintainaspect",!1),n+=getBool("rmp","nojava",!1),n+=getBool("rmp","prefetch",!1),n+=getBool("rmp","shuffle",!1),n+=getStr("rmp","console"),n+=getStr("rmp","controls"),n+=getStr("rmp","numloop"),n+=getStr("rmp","scriptcallbacks")}return n+=getStr(null,"id"),n+=getStr(null,"name"),n+=getStr(null,"src"),n+=getStr(null,"align"),n+=getStr(null,"bgcolor"),n+=getInt(null,"vspace"),n+=getInt(null,"hspace"),n+=getStr(null,"width"),n+=getStr(null,"height"),n=n.length>0?n.substring(0,n.length-1):n}function setBool(e,t,n){void 0!==e[n]&&(document.forms[0].elements[t+"_"+n].checked="false"!=e[n])}function setStr(e,t,n){var i=document.forms[0],o=i.elements[(null!=t?t+"_":"")+n];void 0!==e[n]&&("text"==o.type?o.value=e[n]:selectByValue(i,(null!=t?t+"_":"")+n,e[n]))}function getBool(e,t,n,i,o){var a=document.forms[0].elements[e+"_"+t].checked;return i=i===void 0?"true":"'"+jsEncode(i)+"'",o=o===void 0?"false":"'"+jsEncode(o)+"'",a==n?"":t+(a?":"+i+",":":'"+o+"',")}function getStr(e,t,n){var i=document.forms[0].elements[(null!=e?e+"_":"")+t],o="text"==i.type?i.value:i.options[i.selectedIndex].value;return"src"==t&&(o=tinyMCEPopup.editor.convertURL(o,"src",null)),t==n||""==o?"":t+":'"+jsEncode(o)+"',"}function getInt(e,t,n){var i=document.forms[0].elements[(null!=e?e+"_":"")+t],o="text"==i.type?i.value:i.options[i.selectedIndex].value;return t==n||""==o?"":t+":"+o.replace(/[^0-9]+/g,"")+","}function jsEncode(e){return e=e.replace(RegExp("\\\\","g"),"\\\\"),e=e.replace(RegExp('"',"g"),'\\"'),e=e.replace(RegExp("'","g"),"\\'")}function generatePreview(e){var t,n,i,o,a,r,s,l,c,d=document.forms[0],u=document.getElementById("prev"),m="";switch(u.innerHTML="<!-- x --->",l=parseInt(d.width.value),c=parseInt(d.height.value),""!=d.width.value&&""!=d.height.value&&d.constrain.checked&&("width"==e&&0!=oldWidth?(r=l/oldWidth,c=Math.round(r*c),d.height.value=c):"height"==e&&0!=oldHeight&&(s=c/oldHeight,l=Math.round(s*l),d.width.value=l)),""!=d.width.value&&(oldWidth=l),""!=d.height.value&&(oldHeight=c),n=serializeParameters(),d.media_type.options[d.media_type.selectedIndex].value){case"flash":t="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",a="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0",o="application/x-shockwave-flash";break;case"shockwave":t="clsid:166B1BCA-3F9C-11CF-8075-444553540000",a="http://download.macromedia.com/pub/shockwave/cabs/director/sw.cab#version=8,5,1,0",o="application/x-director";break;case"qt":t="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",a="http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0",o="video/quicktime";break;case"wmp":t=ed.getParam("media_wmp6_compatible")?"clsid:05589FA1-C356-11CE-BF01-00AA0055595A":"clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6",a="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701",o="application/x-mplayer2";break;case"rmp":t="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA",a="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701",o="audio/x-pn-realaudio-plugin"}if(""==n)return u.innerHTML="",void 0;if(n=tinyMCEPopup.editor.plugins.media._parse(n),!n.src)return u.innerHTML="",void 0;if(n.src=tinyMCEPopup.editor.documentBaseURI.toAbsolute(n.src),n.width=n.width?n.width:100,n.height=n.height?n.height:100,n.id=n.id?n.id:"obj",n.name=n.name?n.name:"eobj",n.align=n.align?n.align:"",!tinymce.isIE||"https:"!=document.location.protocol){m+='<object classid="'+t+'" codebase="'+a+'" width="'+n.width+'" height="'+n.height+'" id="'+n.id+'" name="'+n.name+'" align="'+n.align+'">';for(i in n)m+='<param name="'+i+'" value="'+n[i]+'">',"src"==i&&-1!=n[i].indexOf("://")&&(m+='<param name="url" value="'+n[i]+'" />')}m+='<embed type="'+o+'" ';for(i in n)m+=i+'="'+n[i]+'" ';m+="></embed>",tinymce.isIE&&"https:"==document.location.protocol||(m+="</object>"),u.innerHTML="<!-- x --->"+m}tinyMCEPopup.requireLangPack();var oldWidth,oldHeight,ed,url;(url=tinyMCEPopup.getParam("media_external_list_url"))&&document.write('<script language="javascript" type="text/javascript" src="'+tinyMCEPopup.editor.documentBaseURI.toAbsolute(url)+'"></script>'),tinyMCEPopup.onInit.add(init);