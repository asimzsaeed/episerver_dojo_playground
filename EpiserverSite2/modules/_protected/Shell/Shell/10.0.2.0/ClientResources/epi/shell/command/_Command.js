//>>built
define("epi/shell/command/_Command",["dojo/_base/declare","dojo/_base/kernel","dojo/Stateful"],function(_1,_2,_3){return _1([_3],{label:null,tooltip:null,iconClass:null,category:null,order:null,model:null,canExecute:false,isAvailable:true,_callOnModelChange:false,postscript:function(){this.inherited(arguments);this.model&&this._onModelChange();this._callOnModelChange=true;},destroy:function(){},execute:function(){if(this.isAvailable&&this.canExecute){return this._execute();}},watchModelChange:function(){_2.deprecated("epi/shell/command/_Command","watchModelChange will be removed since it was not meant for public use","11.0");this.set("_callOnModelChange",true);},unwatchModelChange:function(){_2.deprecated("epi/shell/command/_Command","unwatchModelChange will be removed since it was not meant for public use","11.0");this.set("_callOnModelChange",false);},_execute:function(){},_onModelChange:function(){},_modelSetter:function(_4){this.model=_4;this._callOnModelChange&&this._onModelChange();}});});