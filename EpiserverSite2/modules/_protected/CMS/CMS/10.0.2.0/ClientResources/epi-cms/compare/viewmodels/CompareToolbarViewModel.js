//>>built
define("epi-cms/compare/viewmodels/CompareToolbarViewModel",["dojo/_base/declare","dojo/_base/lang","dojo/Stateful","dojo/when","epi/dependency","epi/datetime","epi/username","epi/shell/TypeDescriptorManager","epi-cms/contentediting/ContentActionSupport","epi/i18n!epi/shell/ui/nls/episerver.cms.compare"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){return _1([_3],{contentVersionStore:null,leftVersion:null,rightVersion:null,leftButtonLabel:null,rightButtonLabel:null,leftByText:null,rightByText:null,leftDateText:null,rightDateText:null,messageText:null,showsVersionSelectors:null,hasAccess:true,typeIdentifier:null,languages:null,currentLanguage:null,postscript:function(){this.inherited(arguments);var _b=this._profile||_5.resolve("epi.shell.Profile");_4(_b.getContentLanguage(),_2.hitch(this,function(_c){this.set("currentLanguage",_c);}));},_leftVersionSetter:function(_d){this.leftVersion=_d;if(_d){this.set("leftButtonLabel",this._createButtonLabel(_d));this.set("leftByText",_7.toUserFriendlyString(_d.savedBy,null,false));this.set("leftDateText",_6.toUserFriendlyString(_d.savedDate));}},_rightVersionSetter:function(_e){this.rightVersion=_e;if(_e){this.set("rightButtonLabel",this._createButtonLabel(_e));this.set("rightByText",_7.toUserFriendlyString(_e.savedBy,null,false));this.set("rightDateText",_6.toUserFriendlyString(_e.savedDate));}this.set("showsVersionSelectors",_e!==null);},_typeIdentifierSetter:function(_f){this.typeIdentifier=_f;this._updateMessageText();},_hasAccessSetter:function(_10){this.hasAccess=_10;this._updateMessageText();},_updateMessageText:function(){this.set("messageText",this.hasAccess?_8.getResourceValue(this.typeIdentifier,"compare.onlyoneversion"):_a.insufficientpermission);},_createButtonLabel:function(_11){var _12=_11.language?" ("+_11.language+")":"";var _13=_9.getVersionStatus(_11.status);return _13+_12;}});});