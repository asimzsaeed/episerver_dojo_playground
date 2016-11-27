(function ($, epi) {
    epi.shell.error = function () {
        var sharedResourceKey = "EPiServer.Shell.Resources.Texts";
        var pub = {};

        pub.openErrorDialog = function (element, errorText) {
            //Try to get the error dialog, if it dosen't exist, add it
            var errorDialog = $(".epi-errorOutputDialog", element);
            if (errorDialog.length === 0) {
                $(element).append("<div class='epi-errorOutputDialog'><iframe class='epi-errorOutputFrame'></iframe></div>");
                errorDialog = $(".epi-errorOutputDialog", element);
            }
            //Create the dialog
            $(errorDialog).epiDialog({
                title: "Error",
                width: 600,
                height: Math.min($(window).height(), 600),
                resizable: true,
                buttons: {
                    "Close": function () {
                        $(this).epiDialog("close");
                        //Remove the dialog
                        errorDialog.remove();
                    }
                }
            });
            //Open it
            $(errorDialog).epiDialog("open");

            //Write the content to the iframe
            var document = $(".epi-errorOutputFrame", errorDialog)[0].contentWindow.document;
            document.open();
            document.write(errorText);
            document.close();
        };

        pub.createErrorMessage = function (parentElement, errorTitle, errorText, status, includeMoreInformation) {
            if (errorTitle) {
                if (!errorText) {
                    includeMoreInformation = false;
                }

                if (includeMoreInformation) {
                    errorTitle = errorTitle + " <br/><a href='#' class='epi-openErrorDialogButton'>" + epi.shell.resource.get(sharedResourceKey, "ErrorMoreInformationText") + "</a>";
                }

                parentElement.html(errorTitle);

                $(".epi-openErrorDialogButton", parentElement).click(function (e) {
                    pub.openErrorDialog(parentElement, errorText);
                });
            }
        };

        pub.showDialogWithElementContent = function (errorContainer) {
            pub.openErrorDialog(document.body, $(errorContainer).html());
        };

        return pub;
    } ();

} (epiJQuery, epi));
