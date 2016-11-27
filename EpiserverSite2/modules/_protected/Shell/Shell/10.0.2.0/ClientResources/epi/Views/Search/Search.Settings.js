(function ($, epi) {
    epi.searchSettings = function () {
        /// <summary>
        ///     Provides AJAX based search functionality.
        /// </summary>
        var pub = {};

        pub.initialize = function () {
            /// <summary>
            ///     Initializes the search settings functionality.
            /// </summary>
            /// <param name="saveSettingsUrl" type="String">
            ///     Url that is used to save the settings
            /// </param>

            if ($(".epi-searchSortable").length > 0) {
                $(".epi-searchSortable").sortable({
                    placeholder: 'epi-searchSortableHighlight'
                });
                $(".epi-searchSortable").disableSelection();

                $("#searchSettingsForm").submit(_saveSettings);
            }

            $("#searchFeedback").hide();
        };

        var _saveSettings = function (e) {
            //Name value collection to push JSON values on
            var settingsData = [];

            var saveSettingsUrl = this.action; //$(this).closest("form").attr("action");

            //For each sortable area
            $.each($(".epi-searchSortable"), function (i, n) {
                var searchAreaId = "searchAreas[" + i + "]";

                //Get the provider order
                var values = $(this).sortable("toArray");
                var j = 0;
                for (var provider in values) {
                    //Is it enabled?
                    var isEnabled = $("#" + values[provider] + " .isEnabled:checkbox").is(":checked");
                    var providerId = "providerSettings[" + j + "]";

                    //Push JSON objects
                    settingsData.push({ name: providerId + ".FullName", value: values[provider] });
                    settingsData.push({ name: providerId + ".IsEnabled", value: isEnabled });
                    j++;
                }
            });
            var postData = $.param(settingsData);
            var antiForgeryToken = $('input[name="__RequestVerificationToken"]', this).val();
            if (antiForgeryToken) {
                postData += "&" + $.param({__RequestVerificationToken : antiForgeryToken});
            }

            $.post(saveSettingsUrl, postData, function (e) {
                $("#searchFeedback").show();
                $.each($(".epi-searchSortable input:checkbox"), function (i, n) {
                    if ($(this).is(':checked')) {
                        $(this).attr('Checked', 'Checked');
                    } else {
                        $(this).removeAttr("checked")
                    }
                });
            }, "json");

            return false;
        };

        epi.shell.registerInitFunction(pub.initialize);

        return pub;
    } ();
} (epiJQuery, epi));
