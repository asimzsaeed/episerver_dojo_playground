define("epi-cms/widget/viewmodel/FileListViewModel", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",

    "dojo/Stateful",
// epi
    "epi/shell/_StatefulGetterSetterMixin",

    "epi-cms/widget/UploadUtil",
// resources
    "epi/i18n!epi/cms/nls/episerver.cms.widget.uploadmultiplefiles"
],

function (
// dojo
    declare,
    array,
    lang,

    Stateful,
// epi
    _StatefulGetterSetterMixin,

    UploadUtil,
// resources
    resources
) {
    return declare([Stateful, _StatefulGetterSetterMixin], {
        // summary:
        //      The view model for multiple file upload widget
        //
        // tags:
        //      internal

        // progress: [Object]
        //      Progress of uploading files
        progress: null,

        // uploadFiles: [Array]
        //      List of uploading files
        uploadFiles: null,

        // uploadStatus: [Array]
        //      List of uploading status
        uploadStatus: null,

        // showProgressBar: [Boolean]
        //      Indicates that progress bar should show or hide
        showProgressBar: false,

        _setUploadFilesAttr: function (/* Array */files) {
            // summary:
            //      Uploading files need to send to server
            // tags:
            //      private

            if (!UploadUtil.validUploadFiles(files)) {
                return;
            }

            var fileList = [];
            array.forEach(files, function (file) {
                fileList.push({ fileName: file.name, size: file.size, status: resources.uploadform.uploading });
            }, this);

            this._set("uploadFiles", fileList);
        },

        _setUploadStatusAttr: function (/* Array */statusList) {
            // summary:
            //      Status indicates that file uploaded or not
            // tags:
            //      private

            var files = this.get("uploadFiles");

            // Do nothing on next upload time if not any files dropped or selected
            if (array.some(files, function (item) {
                return item.status !== resources.uploadform.uploading;
            })) {
                return;
            }

            array.forEach(files, function (item) {
                if (!statusList || statusList.length <= 0) {
                    item.status = resources.uploadform.uploaded;
                    return false;
                }

                // Set file upload is failed when there are exception occured
                if (statusList[0] && statusList[0].scope === UploadUtil.StatusScope.All && statusList[0].itemName === "") {
                    item.status = resources.uploadform.failed;
                    item.statusMessage = statusList[0].message;
                    return false;
                }

                // Find file upload in exception list
                var failedFiles = array.filter(statusList, function (status) {
                    return item.fileName === status.itemName;
                });

                // Update status of file upload
                if (failedFiles && failedFiles.length > 0) {
                    item.status = resources.uploadform.failed;
                    item.statusMessage = failedFiles[0].message;
                } else {
                    item.status = resources.uploadform.uploaded;
                }
            }, this);

            this._set("uploadFiles", files);
        },

        clear: function () {
            // summary:
            //      Clear all temporaries upload file information before
            // tags:
            //      private

            this._set("uploadFiles", null);
        }
    });
});
