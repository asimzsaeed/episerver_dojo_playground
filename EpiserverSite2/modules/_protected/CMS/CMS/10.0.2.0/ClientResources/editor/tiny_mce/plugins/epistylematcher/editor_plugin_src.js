(function(e){e.create("tinymce.plugins.epistylematcher",{init:function(e){e.onInit.add(function(e){var t=e.formatter,n=t.matchAll,i=t.remove;t.matchAll=function(){var e=n.apply(this,arguments);return e=e.sort(function(e,n){var i=t.get(e)[0],o=t.get(n)[0];if(i.block==o.block&&i.inline==o.inline){if(!i.classes)return 1;if(!o.classes)return-1;var a=i.classes.length>o.classes.length?i.classes:o.classes,r=i.classes.length>o.classes.length?o.classes:i.classes,s=!0;for(var l in r){var d=!1;for(var c in a)if(a[c]==r[l]){d=!0;break}if(!d){s=!1;break}}return s?i.classes.length>o.classes.length?-1:1:0}return 0})},t.remove=function(t,n,o){if(t)i.apply(this,arguments);else{var a,r=e.selection;if((a=r.getStart())==r.getEnd()){var s=e.dom.isBlock(a)?{block:a.tagName.toLowerCase()}:{inline:a.tagName.toLowerCase()};this.register("__current__",s),i.apply(this,["__current__",n,o])}}}})},getInfo:function(){return{longname:"styling improvement plugin",author:"EPiServer AB",authorurl:"http://www.episerver.com",infourl:"http://www.episerver.com",version:1}}}),e.PluginManager.add("epistylematcher",e.plugins.epistylematcher)})(tinymce,epiJQuery);