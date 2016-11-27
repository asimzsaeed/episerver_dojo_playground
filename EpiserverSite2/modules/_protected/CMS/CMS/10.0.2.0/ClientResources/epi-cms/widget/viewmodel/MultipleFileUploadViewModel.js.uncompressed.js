define("epi-cms/widget/viewmodel/MultipleFileUploadViewModel", [
// dojo
    "dojo/_base/array",
    "dojo/_base/declare",

    "dojo/when",

    "dojo/Stateful",
// epi
    "epi/shell/_StatefulGetterSetterMixin"
],

function (
// dojo
    array,
    declare,

    when,

    Stateful,
// epi
    _StatefulGetterSetterMixin
) {

    return declare([Stateful, _StatefulGetterSetterMixin], {
        // summary:
        //      View model for multiple file upload widget.
        // tags:
        //      internal

        upload: function (/*Array*/uploadingFiles) {
            // summary:
            //      Upload selected file(s) to server.
            //      It will show confirmation dialog that ask for replace/skip existing files.
            //      The filter condition is a file name and a content name.
            // uploadingFiles: [Array]
            //      Selected file(s) to upload
            // returns: [dojo/Deferred]
            //      An instance of Array for filtered file list to upload to server.
            //      This list can be the whole original selected file(s) or just the new file(s) that not existed on the server.
            // tags:
            //      public

            return when(this._filterUploadingFiles(uploadingFiles), function (/*Object*/filteredResult) {
                // filteredResult: [Object]
                //      existingContents: [Array]
                //          Existing content list
                //      newFiles: [Array]
                //          New uploading file list

                if (!filteredResult || !(filteredResult.existingContents instanceof Array) || filteredResult.existingContents.length === 0) {
                    return {
                        showConfirmation: false,
                        uploadingFiles: uploadingFiles
                    };
                }

                // Show confirmation dialog for replace/skip file(s) if it got any existing contents (have the same name) from server
                return {
                    showConfirmation: true,
                    uploadingFiles: uploadingFiles,
                    newFiles: filteredResult.newFiles,
                    existingContents: filteredResult.existingContents
                };
            });
        },

        _filterUploadingFiles: function (/*Array*/uploadingFiles) {
            // summary:
            //      Filters the given uploading files, check to see the list contains existing files on the server or not.
            //      It will return an existing content list and a list of new files.
            //      The filter condition is a file name and a content name.
            // uploadingFiles: [Array]
            //      Selected file(s) to upload
            // returns: [Object]
            //      filteredResult: [Object]
            //          existingContents: [Array]
            //              Existing content list
            //          newFiles: [Array]
            //              New uploading file list
            // tags:
            //      private

            var self = this;
            // If no store given, just return the whole original uploading file list
            if (!self.store) {
                return null;
            }

            return when(self.store.query(self.get("query")), function (/*Array*/contentList) {

                // Get existing content list
                var existingContents = array.filter(contentList, function (content) {
                    return array.some(uploadingFiles, function (file) {
                        return file.name.toLowerCase() === content.name.toLowerCase();
                    });
                });

                // Get new file list (that not existed on the server)
                var newFiles = array.filter(uploadingFiles, function (file) {
                    return array.every(contentList, function (content) {
                        return file.name.toLowerCase() !== content.name.toLowerCase();
                    });
                });

                return {
                    existingContents: existingContents,
                    newFiles: newFiles
                };
            });
        }

    });

});
