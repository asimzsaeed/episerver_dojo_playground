//>>built
define("epi-cms/contentediting/ViewSettingsManager",["dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/topic","dojo/Stateful","epi/epi","epi/dependency","epi/UriParser"],function(_1,_2,_3,_4,_5,_6,_7,_8){return _1([_5],{_hashWrapper:null,viewSettings:null,_viewSettingsMap:null,viewSettingsHashValue:null,_activeKey:"active",enabled:false,previewParams:null,postscript:function(){this.inherited(arguments);this._hashWrapper=this._hashWrapper||_7.resolve("epi.shell.HashWrapper");this.previewParams={};this.viewSettingsHashValue=[];this._viewSettingsMap={};_2.forEach(this.viewSettings,_3.hitch(this,function(_9){if(!this._viewSettingsMap[_9.key]){this._viewSettingsMap[_9.key]=_9;}else{throw "Duplicated view settings key.";}}));_4.subscribe("/epi/cms/action/viewsettingvaluechanged",_3.hitch(this,this._viewSettingChanged));_4.subscribe("/epi/cms/action/eyetoggle",_3.hitch(this,this._viewSettingEnabledChanged));var _a=this._hashWrapper.getHash();if(_a&&_a.viewsetting){this.viewSettingsHashValue=this._toObjects(_a.viewsetting);}this.enabled=this._loadProperty(this._activeKey)==="true";_2.forEach(this.viewSettingsHashValue,_3.hitch(this,function(_b){var _c=this._viewSettingsMap[_b.type];if(_c){_c.set("enabled",this.get("enabled"));_c.value=_b.id;_c.beforePreviewLoad(this.previewParams,this.get("enabled"));}}));},onPreviewReady:function(_d){this._preview=_d;_2.forEach(this.viewSettings,_3.hitch(this,function(_e){_e.afterPreviewLoad(_d,this.get("enabled"));}));},getSettingProperty:function(_f){var _10=_2.filter(this.viewSettingsHashValue,function(_11){return _11.type===_f;});return _10.length>0?_10[0].id:null;},hasVisitorGroup:function(){return this.getSettingProperty("visitorgroup")!==null&&this.getSettingProperty("visitorgroup").id!==null;},_enabledGetter:function(){return this.enabled;},_enabledSetter:function(_12){this.enabled=_12;var _13={};_2.forEach(this.viewSettings,_3.hitch(this,function(_14){_14.set("enabled",_12);_14.beforePreviewLoad(_13,_12);}));if(!_6.areEqual(this.previewParams,_13)){this.previewParams=_13;}else{_2.forEach(this.viewSettings,_3.hitch(this,function(_15){_15.afterPreviewLoad(this._preview,_12);}));}},_applyViewSettingValue:function(key,_16){var _17,_18=this._viewSettingsMap[key];if(_18){_17=_3.clone(this.previewParams);_18.value=_16;_18.beforePreviewLoad(_17,true);if(!_6.areEqual(this.previewParams,_17)){this.previewParams=_17;}else{_18.afterPreviewLoad(this._preview,true);}}},_viewSettingChanged:function(key,_19){var _1a=this;this._commitToHash(function(){var _1b=key;if(!(key instanceof Array)){_1b=[{key:key,value:_19}];}_1b.forEach(function(_1c){_1a._saveProperty(_1c.key,_1c.value);_1a._applyViewSettingValue(_1c.key,_1c.value);});});},_viewSettingEnabledChanged:function(_1d){var _1e=this;this._commitToHash(function(){var _1f=_1e._hasSetting();if(_1d){_1e._saveProperty(_1e._activeKey,"true");}else{_1e._saveProperty(_1e._activeKey,_1f?false:null);}_1e.set("enabled",_1d);});},_addProperty:function(_20,_21){this.viewSettingsHashValue.push({type:_20,id:_21});},_updateProperty:function(_22,_23){var _24=-1;_2.forEach(this.viewSettingsHashValue,function(_25,_26){if(_25.type===_22){_24=_26;return;}});if(_24>-1){this.viewSettingsHashValue[_24].id=_23;}else{this._addProperty(_22,_23);}},_toObjects:function(url){var _27=[];_2.forEach(url.split("|"),function(_28,_29){var uri=new _8(_28);_27.push({type:uri.getType(),id:uri.getId()});});return _27;},_deleteProperty:function(_2a){var _2b=-1;_2.forEach(this.viewSettingsHashValue,function(_2c,_2d){if(_2c.type===_2a){_2b=_2d;return;}});if(_2b>-1){this.viewSettingsHashValue.splice(_2b,1);}},_commitToHash:function(_2e){var obj=this._hashWrapper.getHash();var _2f=[];if(obj&&obj.viewsetting){this.set("viewSettingsHashValue",this._toObjects(obj.viewsetting));}else{this.set("viewSettingsHashValue",[]);}_2e();_2.forEach(this.viewSettingsHashValue,function(_30,_31){_2f.push(_30.type+":///"+_30.id);});if(_2f.length>0){obj.viewsetting=_2f.join("|");}else{delete obj.viewsetting;}this._hashWrapper.setHash(obj);},_saveProperty:function(_32,_33){if(this.get("viewSettingsHashValue")){if(_33!=null){this._updateProperty(_32,_33);}else{this._deleteProperty(_32);}}else{if(_33!=null){this._updateProperty(_32,_33);}}},_loadProperty:function(_34){var obj=this._hashWrapper.getHash();var _35=null;if(obj&&obj.viewsetting){var _36=this._toObjects(obj.viewsetting);var _37=_2.filter(_36,function(_38){return _38.type===_34;})[0];if(_37){_35=_37.id;}}return _35;},_hasSetting:function(){var obj=this._hashWrapper.getHash();if(obj&&obj.viewsetting){if(obj.viewsetting.split("|").length>1){return true;}}return false;},getRenderingViewSettings:function(){return _2.filter(this.viewSettings,_3.hitch(this,function(_39){return _39.usedForRendering;}));}});});