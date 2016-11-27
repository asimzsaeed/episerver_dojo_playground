(function(){function e(e){return document.getElementById(e)}function t(e){var n,i,o,a;if(null==e||"object"!=typeof e)return e;if("length"in e){for(o=[],n=0,i=e.length;i>n;++n)o[n]=t(e[n]);return o}o={};for(a in e)e.hasOwnProperty(a)&&(o[a]=t(e[a]));return o}function n(t){var n=e(t);return"SELECT"==n.nodeName?n.options[n.selectedIndex].value:"checkbox"==n.type?n.checked:n.value}function i(e){var t=/^([a-z]+):\/\//.exec(e);return t&&t[1]||"http"}function o(t,n,i){if(n!==void 0&&null!=n){var o=e(t);"SELECT"==o.nodeName?selectByValue(document.forms[0],t,n):"checkbox"==o.type?("string"==typeof n&&(n=n.toLowerCase(),n=!i&&"true"===n||i&&n===i.toLowerCase()),o.checked=!!n):o.value=n}}var a;(a=tinyMCEPopup.getParam("media_external_list_url"))&&document.write('<script language="javascript" type="text/javascript" src="'+tinyMCEPopup.editor.documentBaseURI.toAbsolute(a)+'"></script>'),window.Media={init:function(){var n,i,o=this;o.editor=i=tinyMCEPopup.editor,e("filebrowsercontainer").innerHTML=getBrowserHTML("filebrowser","src","media","media"),e("qtsrcfilebrowsercontainer").innerHTML=getBrowserHTML("qtsrcfilebrowser","quicktime_qtsrc","media","media"),e("bgcolor_pickcontainer").innerHTML=getColorPickerHTML("bgcolor_pick","bgcolor"),e("video_altsource1_filebrowser").innerHTML=getBrowserHTML("video_filebrowser_altsource1","video_altsource1","media","media"),e("video_altsource2_filebrowser").innerHTML=getBrowserHTML("video_filebrowser_altsource2","video_altsource2","media","media"),e("audio_altsource1_filebrowser").innerHTML=getBrowserHTML("audio_filebrowser_altsource1","audio_altsource1","media","media"),e("audio_altsource2_filebrowser").innerHTML=getBrowserHTML("audio_filebrowser_altsource2","audio_altsource2","media","media"),e("video_poster_filebrowser").innerHTML=getBrowserHTML("filebrowser_poster","video_poster","image","media"),n=o.getMediaListHTML("medialist","src","media","media"),""==n?e("linklistrow").style.display="none":e("linklistcontainer").innerHTML=n,isVisible("filebrowser")&&(e("src").style.width="230px"),isVisible("video_filebrowser_altsource1")&&(e("video_altsource1").style.width="220px"),isVisible("video_filebrowser_altsource2")&&(e("video_altsource2").style.width="220px"),isVisible("audio_filebrowser_altsource1")&&(e("audio_altsource1").style.width="220px"),isVisible("audio_filebrowser_altsource2")&&(e("audio_altsource2").style.width="220px"),isVisible("filebrowser_poster")&&(e("video_poster").style.width="220px"),i.dom.setOuterHTML(e("media_type"),o.getMediaTypeHTML(i)),o.setDefaultDialogSettings(i),o.data=t(tinyMCEPopup.getWindowArg("data")),o.dataToForm(),o.preview(),updateColor("bgcolor_pick","bgcolor")},insert:function(){var e=tinyMCEPopup.editor;this.formToData(),e.execCommand("mceRepaint"),tinyMCEPopup.restoreSelection(),e.selection.setNode(e.plugins.media.dataToImg(this.data)),tinyMCEPopup.close()},preview:function(){e("prev").innerHTML=this.editor.plugins.media.dataToHtml(this.data,!0)},moveStates:function(t,a){function r(e){var t={};return e&&tinymce.each(e.split("&"),function(e){var n=e.split("=");t[unescape(n[0])]=unescape(n[1])}),t}function s(e,i){var a,r,s,l,d;if(e==m.type||"global"==e)for(i=tinymce.explode(i),a=0;i.length>a;a++)r=i[a],s="global"==e?r:e+"_"+r,"global"==e?d=m:"video"==e||"audio"==e?(d=m.video.attrs,d||t||(m.video.attrs=d={})):d=m.params,d&&(t?o(s,d[r],"video"==e||"audio"==e?r:""):(delete d[r],l=n(s),"video"!=e&&"audio"!=e||l!==!0||(l=r),u[s]?l!==u[s]&&(l=""+l,d[r]=l):l&&(l=""+l,d[r]=l)))}var l,d,c,u,d,m=this.data,p=this.editor,g=p.plugins.media;if(u={quicktime_autoplay:!0,quicktime_controller:!0,flash_play:!0,flash_loop:!0,flash_menu:!0,windowsmedia_autostart:!0,windowsmedia_enablecontextmenu:!0,windowsmedia_invokeurls:!0,realmedia_autogotourl:!0,realmedia_imagestatus:!0},t||(m.type=e("media_type").options[e("media_type").selectedIndex].value,m.width=n("width"),m.height=n("height"),d=n("src"),"src"==a&&(l=d.replace(/^.*\.([^.]+)$/,"$1"),(c=g.getType(l))&&(m.type=c.name.toLowerCase()),o("media_type",m.type)),("video"==m.type||"audio"==m.type)&&(m.video.sources||(m.video.sources=[]),m.video.sources[0]={src:n("src")})),e("video_options").style.display="none",e("audio_options").style.display="none",e("flash_options").style.display="none",e("quicktime_options").style.display="none",e("shockwave_options").style.display="none",e("windowsmedia_options").style.display="none",e("realmedia_options").style.display="none",e("embeddedaudio_options").style.display="none",e(m.type+"_options")&&(e(m.type+"_options").style.display="block"),o("media_type",m.type),s("flash","play,loop,menu,swliveconnect,quality,scale,salign,wmode,base,flashvars"),s("quicktime","loop,autoplay,cache,controller,correction,enablejavascript,kioskmode,autohref,playeveryframe,targetcache,scale,starttime,endtime,target,qtsrcchokespeed,volume,qtsrc"),s("shockwave","sound,progress,autostart,swliveconnect,swvolume,swstretchstyle,swstretchhalign,swstretchvalign"),s("windowsmedia","autostart,enabled,enablecontextmenu,fullscreen,invokeurls,mute,stretchtofit,windowlessvideo,balance,baseurl,captioningid,currentmarker,currentposition,defaultframe,playcount,rate,uimode,volume"),s("realmedia","autostart,loop,autogotourl,center,imagestatus,maintainaspect,nojava,prefetch,shuffle,console,controls,numloop,scriptcallbacks"),s("video","poster,autoplay,loop,muted,preload,controls"),s("audio","autoplay,loop,preload,controls"),s("embeddedaudio","autoplay,loop,controls"),s("global","id,name,vspace,hspace,bgcolor,align,width,height"),t)"video"==m.type?(m.video.sources[0]&&o("src",m.video.sources[0].src),d=m.video.sources[1],d&&o("video_altsource1",d.src),d=m.video.sources[2],d&&o("video_altsource2",d.src)):"audio"==m.type?(m.video.sources[0]&&o("src",m.video.sources[0].src),d=m.video.sources[1],d&&o("audio_altsource1",d.src),d=m.video.sources[2],d&&o("audio_altsource2",d.src)):("flash"==m.type&&tinymce.each(p.getParam("flash_video_player_flashvars",{url:"$url",poster:"$poster"}),function(e,t){"$url"==e&&(m.params.src=r(m.params.flashvars)[t]||m.params.src||"")}),o("src",m.params.src));else{d=n("src");var h=i(d);d.match(/youtube\.com\/embed\/\w+/)?(m.width=m.width||425,m.height=m.height||350,m.params.frameborder="0",m.type="iframe",o("src",d),o("media_type",m.type)):(d.match(/youtu\.be\/[a-z1-9.-_]+/)&&(m.width=m.width||425,m.height=m.height||350,m.params.frameborder="0",m.type="iframe",d=h+"://www.youtube.com/embed/"+d.match(/youtu.be\/([a-z1-9.-_]+)/)[1],o("src",d),o("media_type",m.type)),d.match(/youtube\.com(.+)v=([^&]+)/)&&(m.width=m.width||425,m.height=m.height||350,m.params.frameborder="0",m.type="iframe",d=h+"://www.youtube.com/embed/"+d.match(/v=([^&]+)/)[1],o("src",d),o("media_type",m.type))),d.match(/video\.google\.com(.+)docid=([^&]+)/)&&(m.width=m.width||425,m.height=m.height||326,m.type="flash",d=h+"://video.google.com/googleplayer.swf?docId="+d.match(/docid=([^&]+)/)[1]+"&hl=en",o("src",d),o("media_type",m.type)),d.match(/vimeo\.com\/([0-9]+)/)&&(m.width=m.width||425,m.height=m.height||350,m.params.frameborder="0",m.type="iframe",d=h+"://player.vimeo.com/video/"+d.match(/vimeo.com\/([0-9]+)/)[1],o("src",d),o("media_type",m.type)),d.match(/stream\.cz\/((?!object).)*\/([0-9]+)/)&&(m.width=m.width||425,m.height=m.height||350,m.params.frameborder="0",m.type="iframe",d=h+"://www.stream.cz/object/"+d.match(/stream.cz\/[^\/]+\/([0-9]+)/)[1],o("src",d),o("media_type",m.type)),d.match(/maps\.google\.([a-z]{2,3})\/maps\/(.+)msid=(.+)/)&&(m.width=m.width||425,m.height=m.height||350,m.params.frameborder="0",m.type="iframe",d=h+"://maps.google.com/maps/ms?msid="+d.match(/msid=(.+)/)[1]+"&output=embed",o("src",d),o("media_type",m.type)),"video"==m.type?(m.video.sources||(m.video.sources=[]),m.video.sources[0]={src:d},d=n("video_altsource1"),d&&(m.video.sources[1]={src:d}),d=n("video_altsource2"),d&&(m.video.sources[2]={src:d})):"audio"==m.type?(m.video.sources||(m.video.sources=[]),m.video.sources[0]={src:d},d=n("audio_altsource1"),d&&(m.video.sources[1]={src:d}),d=n("audio_altsource2"),d&&(m.video.sources[2]={src:d})):m.params.src=d,o("width",m.width||("audio"==m.type?300:320)),o("height",m.height||("audio"==m.type?32:240))}},dataToForm:function(){this.moveStates(!0)},formToData:function(e){("width"==e||"height"==e)&&this.changeSize(e),"source"==e?(this.moveStates(!1,e),o("source",this.editor.plugins.media.dataToHtml(this.data)),this.panel="source"):("source"==this.panel&&(this.data=t(this.editor.plugins.media.htmlToData(n("source"))),this.dataToForm(),this.panel=""),this.moveStates(!1,e),this.preview())},beforeResize:function(){this.width=parseInt(n("width")||("audio"==this.data.type?"300":"320"),10),this.height=parseInt(n("height")||("audio"==this.data.type?"32":"240"),10)},changeSize:function(t){var i,a;e("constrain").checked&&(i=parseInt(n("width")||("audio"==this.data.type?"300":"320"),10),a=parseInt(n("height")||("audio"==this.data.type?"32":"240"),10),"width"==t?(this.height=Math.round(i/this.width*a),o("height",this.height)):(this.width=Math.round(a/this.height*i),o("width",this.width)))},getMediaListHTML:function(){if("undefined"!=typeof tinyMCEMediaList&&tinyMCEMediaList.length>0){var e="";e+='<select id="linklist" name="linklist" style="width: 250px" onchange="this.form.src.value=this.options[this.selectedIndex].value;Media.formToData(\'src\');">',e+='<option value="">---</option>';for(var t=0;tinyMCEMediaList.length>t;t++)e+='<option value="'+tinyMCEMediaList[t][1]+'">'+tinyMCEMediaList[t][0]+"</option>";return e+="</select>"}return""},getMediaTypeHTML:function(e){function t(t,n){return e.schema.getElementRule(n||t)?'<option value="'+t+'">'+tinyMCEPopup.editor.translate("media_dlg."+t)+"</option>":""}var n="";return n+='<select id="media_type" name="media_type" onchange="Media.formToData(\'type\');">',n+=t("video"),n+=t("audio"),n+=t("flash","object"),n+=t("quicktime","object"),n+=t("shockwave","object"),n+=t("windowsmedia","object"),n+=t("realmedia","object"),n+=t("iframe"),e.getParam("media_embedded_audio",!1)&&(n+=t("embeddedaudio","object")),n+="</select>"},setDefaultDialogSettings:function(e){var t=e.getParam("media_dialog_defaults",{});tinymce.each(t,function(e,t){o(t,e)})}},tinyMCEPopup.requireLangPack(),tinyMCEPopup.onInit.add(function(){Media.init()})})();