//>>built
require({cache:{"url:epi-cms/widget/templates/MultipleFileUpload.html":"<div class=\"epi-multiFileUpload\">\r\n    <form method=\"post\" action=\"\" enctype=\"multipart/form-data\">\r\n        <div data-dojo-attach-point=\"breadcrumbBar\" data-dojo-type=\"epi-cms/widget/Breadcrumb\"></div>\r\n        <div data-dojo-attach-point=\"uploadToolbar\" class=\"epi-toolbar-unwrapped\">\r\n            <span title=\"${res.uploadform.addfiles}\" >\r\n                <input type=\"file\" multiple=\"multiple\" data-dojo-type=\"dojox.form.Uploader\" data-dojo-attach-point=\"uploaderInput\" \r\n                    data-dojo-props=\"iconClass:'epi-iconPlus', showLabel: false, multiple: true\" />\r\n            </span>\r\n            <div data-dojo-attach-point=\"toolbarDisableLayer\"></div>\r\n        </div>\r\n        <div data-dojo-attach-point=\"fileList\" data-dojo-type=\"epi-cms/widget/FileList\"></div>\r\n    </form>\r\n</div>"}});define("epi-cms/widget/MultipleFileUpload",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/dom-geometry","dojo/aspect","dojo/when","dojo/Evented","dijit/_Widget","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","dojox/form/Uploader","epi/routes","epi/shell/widget/dialog/Alert","epi-cms/widget/MultipleFileUploadConfirmation","epi-cms/widget/UploadUtil","epi-cms/widget/viewmodel/FileListViewModel","dojo/text!./templates/MultipleFileUpload.html","epi/i18n!epi/cms/nls/episerver.cms.widget.uploadmultiplefiles","epi-cms/widget/Breadcrumb","epi-cms/widget/FileList","epi/shell/form/uploader/HTML5"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12){return _2([_8,_9,_a,_7],{res:_12,_isCompleted:true,_uploadStatus:[],templateString:_11,postCreate:function(){this.inherited(arguments);this._setupUploader();this._setupFileList();this._confirmationDialog=this._confirmationDialog||new _e();},upload:function(_13){var _14=this,_15=_14.uploaderInput,_16=_14._getUploadSettings();_6(_14.model.upload(_13),function(_17){_6(_14._confirm(_17),function(_18){_14._resetUploader();if(!(_18 instanceof Array)||_18.length===0){return;}_14._fileListModel.set("uploadFiles",_18);_15._files=_18;_15.upload(_16);});});},close:function(){var _19=this,_1a=_19.uploaderInput._files,_1b=function(_1c){_19.emit("close",_1c);_19.set("disableToolbar",false);};if(_19._isCompleted||!_1a||_1a.length<=0){_1b(false);}else{var _1d=new _d({description:_12.confirmdialog.description,onAction:function(){_1b(true);}});_1d.show();}},_setUploadStatusAttr:function(_1e,_1f,_20){this._uploadStatus=_f.addStatus(this._uploadStatus,_1e,_1f,_20);},_getUploadStatusAttr:function(){return this._uploadStatus;},_setBreadcrumbAttr:function(_21){this.breadcrumbBar._cleanUp();this.breadcrumbBar._availableWidth=_4.getContentBox(this.breadcrumbBar.domNode).w;var i=0,_22=_21?_21.length:0;if(_22>0){for(i;i<_22-1;i++){this.breadcrumbBar._createItem(_21[i],true);}this.breadcrumbBar._createItem(_21[_22-1],false);}},_setDisableToolbarAttr:function(_23){this.uploaderInput.set("disabled",_23);!_23&&this.uploaderInput.set("tabindex",0);},_setupUploader:function(){var _24=this;this.uploaderInput.uploadUrl=_c.getActionPath({moduleArea:"CMS",controller:"FileUpload",action:"Upload"});this.own(_5.before(this.uploaderInput,"onChange",function(_25){_24._isCompleted=false;_24.set("disableToolbar",true);return [_24._getUploadSettings()];}),this.uploaderInput.on("error",function(err){_24.set("uploadStatus",_f.StatusScope.All,"",_12.uploadform.errormessage);_24._onUploadComplete();}));},_getUploadSettings:function(){return {uploadDirectory:this.get("uploadDirectory"),createAsLocalAsset:this.get("createAsLocalAsset")};},_setupFileList:function(){var _26=this,_27=this.uploaderInput;_26._fileListModel=new _10();_26.fileList.set("model",_26._fileListModel);this.own(_27.on("begin",function(_28){if(_28&&_28.length>0){_26._fileListModel.set("showProgressBar",true);}}),_27.on("progress",function(_29){_26._fileListModel.set("progress",_29);}),_27.on("complete",_3.hitch(_26,_26._onUploadComplete)),_5.after(_27,"reset",_3.hitch(_26,_26._fileListModel.clear)),_5.around(_27,"onChange",function(_2a){return function(_2b){var _2c=_27._files;return _6(_26.model.upload(_2c),function(_2d){return _6(_26._confirm(_2d),function(_2e){_26._clearUploadStatus();_2e=_f.getFileArray(_2e);if(!(_2e instanceof Array)||_2e.length===0){_26._resetUploader();return _2a.apply(_27,[_2b]);}_26._fileListModel.set("uploadFiles",_2e);_27._files=_2e;_27.upload(_26._getUploadSettings());return _2a.apply(_27,[_2b]);});});};}));},_confirm:function(_2f){return _2f.showConfirmation===true?this._confirmationDialog.showConfirmation(_2f.existingContents,_2f.uploadingFiles,_2f.newFiles):_2f.uploadingFiles;},_clearUploadStatus:function(){this._uploadStatus=[];},_clearUploadFiles:function(){this.uploaderInput._files=[];},_resetUploader:function(){this._fileListModel.set("showProgressBar",false);this.uploaderInput.reset();this.set("disableToolbar",false);},_onUploadComplete:function(evt){var _30="";this._isCompleted=true;if(evt){if(evt instanceof Array){_1.forEach(evt,function(_31){_30=_31.errorMessage;this.set("uploadStatus",_31.index?_f.StatusScope.Single:_f.StatusScope.All,_31.fileName||_31.name,_30);},this);}else{if(evt.isValid===false&&evt.saved===false){this.set("uploadStatus",_f.StatusScope.All,"",evt.errorMessage);}}}this._fileListModel.set("uploadStatus",this.get("uploadStatus"));this.set("disableToolbar",false);this._clearUploadFiles();this.emit("uploadComplete",!this._fileListModel.uploadStatus?this._fileListModel.uploadFiles:null);}});});