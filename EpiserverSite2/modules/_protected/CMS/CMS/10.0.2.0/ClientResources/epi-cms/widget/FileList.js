//>>built
require({cache:{"url:epi-cms/widget/templates/FileList.html":"<div class=\"epi-multiFileUpload-list\">\r\n    <div data-dojo-type=\"dijit/ProgressBar\" data-dojo-attach-point=\"progressBar\" data-dojo-props=\"maximum:100\"></div>\r\n</div>"}});define("epi-cms/widget/FileList",["dojo/_base/declare","dojo/_base/lang","dojo/dom-attr","dojo/dom-construct","dojo/dom-class","dojo/dom-style","dojox/form/uploader/Base","dgrid/OnDemandGrid","dgrid/Selection","dgrid/Keyboard","dijit/ProgressBar","epi/shell/widget/_ModelBindingMixin","epi/shell/dgrid/Formatter","epi-cms/widget/UploadUtil","epi/i18n!epi/cms/nls/episerver.cms.widget.uploadmultiplefiles.uploadform","dojo/text!./templates/FileList.html"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10){return _1([_7,_c],{templateString:_10,modelBindingMap:{showProgressBar:["showProgressBar"],progress:["progress"],uploadFiles:["uploadFiles"]},postCreate:function(){this.inherited(arguments);this._buildGrid();},_setUploadFilesAttr:function(_11){this._bindData(_11);},_setShowProgressBarAttr:function(_12){_e.toggleVisibility(this.progressBar.domNode,_12);},_setProgressAttr:function(_13){if(!_13){return;}this.progressBar.update({progress:_13.percent.replace("%","")});},_bindData:function(_14){_14=_14||[];this._grid.refresh();this._grid.renderArray(_14);},_buildGrid:function(){var _15=_1([_8,_a,_d]);this._grid=new _15({columns:{fileName:{label:_f.uploadfilename,field:"fileName",htmlEncode:true},size:{label:_f.uploadfilesize,field:"size",get:_2.hitch(this,function(_16){var _17=this.convertBytes(_16.size).value;if(isNaN(_17)){return _17;}var _18=_17===0?_f.bytetext:_f.bytestext;return _2.replace("{0} {1}",[_17,_18]);})},status:{label:_f.uploadfilestatus,field:"status",renderCell:_2.hitch(this,function(_19,_1a,_1b,_1c){_3.set(_1b,"title",_19.statusMessage?_19.statusMessage:"");_5.toggle(_1b,"epi-failedStatus",_19.status===_f.failed);_1b.innerHTML=_19.status;})}}});this.own(this._grid);_4.place(this._grid.domNode,this.domNode);}});});