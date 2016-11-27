//>>built
define("epi/shell/store/JsonRest",["dojo/_base/declare","dojo/_base/json","dojo/_base/lang","dojo/io-query","dojo/store/JsonRest","dojo/store/util/QueryResults","epi/shell/XhrWrapper"],function(_1,_2,_3,_4,_5,_6,_7){return _1([_5],{xhrHandler:null,idAttribute:"id",preventCache:false,defaultRequestParams:null,constructor:function(_8){this.defaultRequestParams=_8&&_8.defaultRequestParams;if(!this.xhrHandler){this.xhrHandler=new _7({preventLocalizationHeader:_8&&_8.preventLocalizationHeader});}},get:function(id,_9){var _a=_9||{};_a.Accept="application/javascript, application/json";var _b=typeof id!="undefined";var _c={url:_b?this.target+id:this.target,handleAs:"json",headers:_a,preventCache:this.preventCache};return this.xhrHandler.xhrGet(this._mixinDefaultParams(_c));},put:function(_d,_e){_e=_e||{};var _f={"Content-Type":"application/json","If-Match":_e.overwrite===true?"*":null,"If-None-Match":_e.overwrite===false?"*":null,Accept:"application/javascript, application/json"};var id=("id" in _e)?_e.id:this.getIdentity(_d);var _10=typeof id!="undefined";if(_10&&!_e.incremental){_f["X-Http-Method-Override"]="PUT";}var _11={url:_10?this.target+id:this.target,postData:_2.toJson(_d),handleAs:"json",headers:_f,xsrfProtection:true};return this.xhrHandler.xhr("POST",this._mixinDefaultParams(_11));},patch:function(_12,_13){var _14=_13||{};_14.Accept="application/javascript, application/json";_14["X-Http-Method-Override"]="PATCH";_14["Content-Type"]="application/json";var id=("id" in _13)?_13.id:this.getIdentity(_12);var _15=typeof id!="undefined";var _16={url:_15?this.target+id:this.target,postData:_2.toJson(_12),handleAs:"json",headers:_14,xsrfProtection:true};return this.xhrHandler.xhr("POST",this._mixinDefaultParams(_16));},remove:function(id,_17){var _18={};_18.Accept="application/javascript, application/json";_18["Content-Type"]="application/json";_18["X-Http-Method-Override"]="DELETE";_17=_17||{};return this.xhrHandler.xhr("POST",this._mixinDefaultParams({url:this.target+id,headers:_18,postData:_2.toJson(_17),handleAs:"json",xsrfProtection:true}));},query:function(_19,_1a){var _1b={Accept:"application/javascript, application/json"};var _1c;_1a=_1a||{};if(_1a.start>=0||_1a.count>=0){_1b.Range="items="+(_1a.start||"0")+"-"+(("count" in _1a&&_1a.count!==Infinity)?(_1a.count+(_1a.start||0)-1):"");}if(_3.isObject(_19)){_19=_3.mixin({},_19);if(_19[this.idAttribute]){_1c=_19[this.idAttribute];_19[this.idAttribute]=null;}_19=_4.objectToQuery(_19);_19=_19?"?"+_19:"";}if(_1a&&_1a.sort){_19+=(_19?"&":"?")+"sort(";for(var i=0;i<_1a.sort.length;i++){var _1d=_1a.sort[i];_19+=(i>0?",":"")+(_1d.descending?"-":"+")+encodeURIComponent(_1d.attribute);}_19+=")";}var _1e=this.xhrHandler.xhrGet(this._mixinDefaultParams({url:this.target+(_1c||"")+(_19||""),handleAs:"json",headers:_1b,preventCache:this.preventCache}));_1e.total=_1e.then(function(){var _1f=_1e.ioArgs.xhr.getResponseHeader("Content-Range");return _1f&&(_1f=_1f.match(/\/(.*)/))&&+_1f[1];});return _6(_1e);},move:function(id,_20,_21){return this._send("MOVE",id,_20,_21);},copy:function(id,_22,_23){return this._send("COPY",id,_22,_23);},executeMethod:function(_24,id,_25,_26){var _27=id!==null&&typeof id!=="undefined",url=this.target+(_27?id:""),_28=_26||{};_28.Accept="application/javascript, application/json";_28["Content-Type"]="application/json";_28["X-Http-Method-Override"]=_24;_25=_25||{};return this.xhrHandler.xhr("POST",this._mixinDefaultParams({url:url,headers:_28,postData:_2.toJson(_25),handleAs:"json",xsrfProtection:true}));},_send:function(_29,id,_2a,_2b){var _2c=_2b||{};_2c.Accept="application/javascript, application/json";_2c["X-Http-Method-Override"]=_29;var _2d=_3.isObject(_2a)?_2a:{targetId:_2a};return this.xhrHandler.xhr("POST",this._mixinDefaultParams({url:this.target+id,headers:_2c,content:_2d,handleAs:"json",xsrfProtection:true}));},_mixinDefaultParams:function(_2e){return _3.mixin({},this.defaultRequestParams,_2e);}});});