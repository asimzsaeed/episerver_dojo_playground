//>>built
define("epi-cms/command/UploadContent",["dojo/_base/declare","epi/shell/command/_Command","epi/shell/DestroyableByKey","epi-cms/contentediting/ContentActionSupport","epi-cms/core/ContentReference"],function(_1,_2,_3,_4,_5){return _1([_2,_3],{fileList:null,createAsLocalAsset:false,_execute:function(){var _6=_5.toContentReference(this.model.contentLink).createVersionUnspecificReference();this.viewModel.upload(this.fileList,_6.toString(),this.createAsLocalAsset);this.fileList=null;},_onModelChange:function(){var _7=this.model,_8=_7&&_4.hasProviderCapability(_7.providerCapabilityMask,_4.providerCapabilities.Create)&&_4.hasAccess(_7.accessMask,_4.accessLevel.Create);this.destroyByKey("isSearchingWatch");this.viewModel&&this.ownByKey("isSearchingWatch",this.viewModel.watch("isSearching",this._onModelChange.bind(this)));this.set("canExecute",!!(_8&&this.viewModel&&!this.viewModel.get("isSearching")));}});});