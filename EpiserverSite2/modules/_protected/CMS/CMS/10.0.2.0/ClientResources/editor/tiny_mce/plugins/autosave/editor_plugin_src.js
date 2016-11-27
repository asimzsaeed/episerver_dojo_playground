(function(e){var t,n,i="autosave",o="restoredraft",a=!0,r=e.util.Dispatcher;e.create("tinymce.plugins.AutoSave",{init:function(s){function l(e){var t={s:1e3,m:6e4};return e=/^(\d+)([ms]?)$/.exec(""+e),(e[2]?t[e[2]]:1)*parseInt(e)}var u=this,d=s.settings;u.editor=s,e.each({ask_before_unload:a,interval:"30s",retention:"20m",minlength:50},function(e,n){n=i+"_"+n,d[n]===t&&(d[n]=e)}),d.autosave_interval=l(d.autosave_interval),d.autosave_retention=l(d.autosave_retention),s.addButton(o,{title:i+".restore_content",onclick:function(){s.getContent({draft:!0}).replace(/\s|&nbsp;|<\/?p[^>]*>|<br[^>]*>/gi,"").length>0?s.windowManager.confirm(i+".warning_message",function(e){e&&u.restoreDraft()}):u.restoreDraft()}}),s.onNodeChange.add(function(){var e=s.controlManager;e.get(o)&&e.setDisabled(o,!u.hasDraft())}),s.onInit.add(function(){s.controlManager.get(o)&&(u.setupStorage(s),setInterval(function(){s.removed||(u.storeDraft(),s.nodeChanged())},d.autosave_interval))}),u.onStoreDraft=new r(u),u.onRestoreDraft=new r(u),u.onRemoveDraft=new r(u),n||(window.onbeforeunload=e.plugins.AutoSave._beforeUnloadHandler,n=a)},getInfo:function(){return{longname:"Auto save",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/autosave",version:e.majorVersion+"."+e.minorVersion}},getExpDate:function(){return new Date((new Date).getTime()+this.editor.settings.autosave_retention).toUTCString()},setupStorage:function(n){var o=this,r=i+"_test",s="OK";o.key=i+n.id,e.each([function(){return localStorage&&(localStorage.setItem(r,s),localStorage.getItem(r)===s)?(localStorage.removeItem(r),localStorage):t},function(){return sessionStorage&&(sessionStorage.setItem(r,s),sessionStorage.getItem(r)===s)?(sessionStorage.removeItem(r),sessionStorage):t},function(){return e.isIE?(n.getElement().style.behavior="url('#default#userData')",{autoExpires:a,setItem:function(e,t){var i=n.getElement();i.setAttribute(e,t),i.expires=o.getExpDate();try{i.save("TinyMCE")}catch(a){}},getItem:function(e){var t=n.getElement();try{return t.load("TinyMCE"),t.getAttribute(e)}catch(i){return null}},removeItem:function(e){n.getElement().removeAttribute(e)}}):t}],function(e){try{if(o.storage=e(),o.storage)return!1}catch(t){}})},storeDraft:function(){var e,t,n=this,i=n.storage,o=n.editor;if(i){if(!i.getItem(n.key)&&!o.isDirty())return;t=o.getContent({draft:!0}),t.length>o.settings.autosave_minlength&&(e=n.getExpDate(),n.storage.autoExpires||n.storage.setItem(n.key+"_expires",e),n.storage.setItem(n.key,t),n.onStoreDraft.dispatch(n,{expires:e,content:t}))}},restoreDraft:function(){var e,t=this,n=t.storage;n&&(e=n.getItem(t.key),e&&(t.editor.setContent(e),t.onRestoreDraft.dispatch(t,{content:e})))},hasDraft:function(){var e,t,n=this,i=n.storage;if(i&&(t=!!i.getItem(n.key))){if(n.storage.autoExpires)return a;if(e=new Date(i.getItem(n.key+"_expires")),(new Date).getTime()<e.getTime())return a;n.removeDraft()}return!1},removeDraft:function(){var e,t=this,n=t.storage,i=t.key;n&&(e=n.getItem(i),n.removeItem(i),n.removeItem(i+"_expires"),e&&t.onRemoveDraft.dispatch(t,{content:e}))},"static":{_beforeUnloadHandler:function(){var t;return e.each(tinyMCE.editors,function(e){e.plugins.autosave&&e.plugins.autosave.storeDraft(),e.getParam("fullscreen_is_enabled")||!t&&e.isDirty()&&e.getParam("autosave_ask_before_unload")&&(t=e.getLang("autosave.unload_msg"))}),t}}}),e.PluginManager.add("autosave",e.plugins.AutoSave)})(tinymce);