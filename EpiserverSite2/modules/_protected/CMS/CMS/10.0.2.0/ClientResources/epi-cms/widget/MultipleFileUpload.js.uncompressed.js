require({cache:{
'url:epi-cms/widget/templates/MultipleFileUpload.html':"﻿<div class=\"epi-multiFileUpload\">\r\n    <form method=\"post\" action=\"\" enctype=\"multipart/form-data\">\r\n        <div data-dojo-attach-point=\"breadcrumbBar\" data-dojo-type=\"epi-cms/widget/Breadcrumb\"></div>\r\n        <div data-dojo-attach-point=\"uploadToolbar\" class=\"epi-toolbar-unwrapped\">\r\n            <span title=\"${res.uploadform.addfiles}\" >\r\n                <input type=\"file\" multiple=\"multiple\" data-dojo-type=\"dojox.form.Uploader\" data-dojo-attach-point=\"uploaderInput\" \r\n                    data-dojo-props=\"iconClass:'epi-iconPlus', showLabel: false, multiple: true\" />\r\n            </span>\r\n            <div data-dojo-attach-point=\"toolbarDisableLayer\"></div>\r\n        </div>\r\n        <div data-dojo-attach-point=\"fileList\" data-dojo-type=\"epi-cms/widget/FileList\"></div>\r\n    </form>\r\n</div>"}});
﻿define("epi-cms/widget/MultipleFileUpload", [
// dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",

    "dojo/dom-geometry",

    "dojo/aspect",
    "dojo/when",

    "dojo/Evented",
// dijit
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",

// dojox
    "dojox/form/Uploader",

// epi
    "epi/routes",
    "epi/shell/widget/dialog/Alert",

    "epi-cms/widget/MultipleFileUploadConfirmation",
    "epi-cms/widget/UploadUtil",

    "epi-cms/widget/viewmodel/FileListViewModel",
// templates
    "dojo/text!./templates/MultipleFileUpload.html",
// resources
    "epi/i18n!epi/cms/nls/episerver.cms.widget.uploadmultiplefiles",

    // Used in the template
    "epi-cms/widget/Breadcrumb",
    "epi-cms/widget/FileList",

    // Registers itself when loaded
    "epi/shell/form/uploader/HTML5"
],

function (
// dojo
    array,
    declare,
    lang,

    domGeometry,
    aspect,
    when,

    Evented,
// dijit
    _Widget,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    // dojox
    Uploader,
// epi
    routes,

    Alert,

    MultipleFileUploadConfirmation,
    UploadUtil,

    FileListViewModel,
// templates
    template,
// resources
    resources
) {

    return declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
        // summary:
        //      Multiple file upload dialog widget. Use HTML5 native Dnd file(s) in Chrome, Firefox and IE.
        // tags:
        //      internal

        // widget resources
        res: resources,

        // _isCompleted: [private] Boolean
        //      Status of upload files progress
        _isCompleted: true,

        // Upload failed exception list
        _uploadStatus: [],

        // templateString: String
        //  Template for the widget
        templateString: template,

        // =======================================================================
        // Public overrided functions

        postCreate: function () {

            this.inherited(arguments);

            this._setupUploader();
            this._setupFileList();

            this._confirmationDialog = this._confirmationDialog || new MultipleFileUploadConfirmation();
        },

        // =======================================================================
        // Public functions

        upload: function (/*Array*/uploadingFiles) {
            // summary:
            //      Upload files to a directory.
            // uploadingFiles: [Array]
            //      Collection of file to upload
            // tags:
            //      public

            var self = this,
                uploader = self.uploaderInput,
                uploadSettings = self._getUploadSettings();

            when(self.model.upload(uploadingFiles), function (/*Object*/result) {

                when(self._confirm(result), function (confirmedFiles) {
                    self._resetUploader();

                    if (!(confirmedFiles instanceof Array) || confirmedFiles.length === 0) {
                        return;
                    }

                    self._fileListModel.set("uploadFiles", confirmedFiles);
                    uploader._files = confirmedFiles;

                    // Call uploader plugin upload(/*Object?*/formData) function
                    uploader.upload(uploadSettings);
                });
            });
        },

        close: function () {
            // summary:
            //      Close upload mutiple files dialog.
            // tags:
            //      public

            var self = this,
                files = self.uploaderInput._files,
                releaseDialog = function (uploading) {
                    // Inactive layer overlay toolbar
                    self.emit("close", uploading);
                    self.set("disableToolbar", false);
                };

            if (self._isCompleted || !files || files.length <= 0) {
                releaseDialog(false);
            } else {
                // Confirm dialog to verify if stopping the upload files.
                var dialog = new Alert({
                    description: resources.confirmdialog.description,
                    onAction: function () {
                        releaseDialog(true);
                    }
                });

                dialog.show();
            }
        },

        // =======================================================================
        // Protected functions

        _setUploadStatusAttr: function (/*Integer*/scope, /*String*/fileName, /*String*/errorMessage) {
            // summary:
            //      Append upload status to list.
            // tags:
            //      protected

            this._uploadStatus = UploadUtil.addStatus(this._uploadStatus, scope, fileName, errorMessage);
        },

        _getUploadStatusAttr: function () {
            // summary:
            //      Return upload status data.
            // tags:
            //      protected

            return this._uploadStatus;
        },

        _setBreadcrumbAttr: function (/*Array*/parts) {
            // summary:
            //      Build breadcrumb
            // tags:
            //      protected

            // Display server path of files directory.
            this.breadcrumbBar._cleanUp();
            this.breadcrumbBar._availableWidth = domGeometry.getContentBox(this.breadcrumbBar.domNode).w;

            var i = 0,
                length = parts ? parts.length : 0;

            if (length > 0) {
                for (i; i < length - 1; i++) {
                    this.breadcrumbBar._createItem(parts[i], true);
                }

                this.breadcrumbBar._createItem(parts[length - 1], false);
            }
        },

        _setDisableToolbarAttr: function (/*Boolean*/disabled) {
            // summary:
            //      Active/Inactive upload button.
            // tags:
            //      protected

            this.uploaderInput.set("disabled", disabled);

            // Have to reset tabIndex since the uploader implementation doesn't do this when it's enabled again
            !disabled && this.uploaderInput.set("tabindex", 0);
        },

        // =======================================================================
        // Private functions

        _setupUploader: function () {
            // summary:
            //      Settings for uploader
            // tags:
            //      private

            var self = this;

            // set the action path for upload form
            this.uploaderInput.uploadUrl = routes.getActionPath({
                moduleArea: "CMS",
                controller: "FileUpload",
                action: "Upload"
            });

            // To pass uploadDirectory to this.onChange delegate, in order to indicate the folder to upload files into.
            this.own(
                aspect.before(this.uploaderInput, "onChange", function (/*Array*/fileArray) {
                    self._isCompleted = false;
                    self.set("disableToolbar", true);

                    return [self._getUploadSettings()];
                }),
                this.uploaderInput.on("error", function (err) {
                    self.set("uploadStatus", UploadUtil.StatusScope.All, "", resources.uploadform.errormessage);
                    self._onUploadComplete();
                })
            );
        },

        _getUploadSettings: function () {
            // summary:
            //      Get uploading settings
            // returns: [Object]
            //      Object's properties
            //          uploadDirectory: [String]
            //          createAsLocalAsset: [Boolean]
            // tags:
            //      private

            return {
                uploadDirectory: this.get("uploadDirectory"),
                createAsLocalAsset: this.get("createAsLocalAsset")
            };
        },

        _setupFileList: function () {
            // summary:
            //      Listen on uploader events to controls file list
            // tags:
            //      private

            var self = this,
                uploader = this.uploaderInput;

            self._fileListModel = new FileListViewModel();
            self.fileList.set("model", self._fileListModel);

            // Reset file list
            this.own(
                // Show progress bar
                uploader.on("begin", function (files) {
                    if (files && files.length > 0) {
                        self._fileListModel.set("showProgressBar", true);
                    }
                }),
                // Show uploading progress
                uploader.on("progress", function (customEvent) {
                    self._fileListModel.set("progress", customEvent);
                }),
                uploader.on("complete", lang.hitch(self, self._onUploadComplete)),

                aspect.after(uploader, "reset", lang.hitch(self, self._fileListModel.clear)),

                // Set upload files to file list model
                aspect.around(uploader, "onChange", function (original) {

                    return function (/*Array*/fileArray) {

                        var uploadingFiles = uploader._files;

                        return when(self.model.upload(uploadingFiles), function (/*Object*/result) {

                            return when(self._confirm(result), function (confirmedFiles) {
                                self._clearUploadStatus();

                                confirmedFiles = UploadUtil.getFileArray(confirmedFiles);

                                if (!(confirmedFiles instanceof Array) || confirmedFiles.length === 0) {
                                    self._resetUploader();
                                    return original.apply(uploader, [fileArray]);
                                }

                                self._fileListModel.set("uploadFiles", confirmedFiles);
                                uploader._files = confirmedFiles;
                                uploader.upload(self._getUploadSettings());

                                return original.apply(uploader, [fileArray]);
                            });
                        });
                    };
                })
            );
        },

        _confirm: function (/*Object*/result) {
            // summary:
            //      Get confirmed file collection to upload to server
            // result: [Object]
            //      Filtered result information
            // returns: [dojo/Deferred]
            //      File collection to upload to server
            // tags:
            //      private

            return result.showConfirmation === true
                ? this._confirmationDialog.showConfirmation(result.existingContents, result.uploadingFiles, result.newFiles)
                : result.uploadingFiles;
        },

        _clearUploadStatus: function () {
            // summary:
            //      Clear upload status data.
            // tags:
            //      private

            this._uploadStatus = [];
        },

        _clearUploadFiles: function () {
            // summary:
            //      Clear uploaded files data.
            // tags:
            //      private

            this.uploaderInput._files = [];
        },

        _resetUploader: function () {
            // summary:
            //      Hide uploading progress bar.
            //      Call dojox uploader reset function.
            // tags:
            //      private

            this._fileListModel.set("showProgressBar", false);
            // make sure the file list is empty, to set new files
            this.uploaderInput.reset();
            this.set("disableToolbar", false);
        },

        _onUploadComplete: function (evt) {
            // summary:
            //      Fires when all files have uploaded.
            //      Event is an array of all files.
            // tags:
            //      private

            var message = "";

            this._isCompleted = true;

            // update upload status for file list:
            if (evt) {
                if (evt instanceof Array) {
                    array.forEach(evt, function (item) {
                        message = item.errorMessage;
                        this.set("uploadStatus", item.index ? UploadUtil.StatusScope.Single : UploadUtil.StatusScope.All, item.fileName || item.name, message);
                    }, this);
                } else if (evt.isValid === false && evt.saved === false) {
                    this.set("uploadStatus", UploadUtil.StatusScope.All, "", evt.errorMessage);
                }
            }

            this._fileListModel.set("uploadStatus", this.get("uploadStatus"));

            this.set("disableToolbar", false);
            this._clearUploadFiles();
            this.emit("uploadComplete", !this._fileListModel.uploadStatus ? this._fileListModel.uploadFiles : null);
        }
    });
});
