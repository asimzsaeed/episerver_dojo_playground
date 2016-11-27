(function ($, epi) {
    epi.brokenLinks = function () {
        var pub = {};
        var _pageBrowserUrl;
        var _jobStatusUrl;

        pub.initialize = function (pageBrowserUrl, jobStatusUrl) {
            _pageBrowserUrl = pageBrowserUrl;
            _jobStatusUrl = jobStatusUrl;

            $(".epi-recheckLink").live("click", _recheckLinks);
            $("#selectPageButton").click(_showPageBrowserDialog);

            _updateJobStatus();
        };

        var _recheckLinks = function (e) {
            var self = $(this);
            self.hide();
            self.siblings(".epi-ajaxLoader").show();

            e.preventDefault();

            $.get(this, null, function (data) {
                self.show();
                self.siblings(".epi-ajaxLoader").hide();
                self.closest("tbody").html(data);
            });
        };

        var _showPageBrowserDialog = function () {
            EPi.CreatePageBrowserDialog(_pageBrowserUrl,
                    $("#rootPageId").val(),
                    true,
                    false,
                    "rootPageName",
                    "rootPageId",
                    "");
        };

        var _updateJobStatus = function () {
            $.getJSON(_jobStatusUrl,
                function (data) {
                    //Remove all loading
                    var pageLink = $(".epi-recheckLink");
                    pageLink.show();
                    pageLink.siblings(".epi-ajaxLoader").hide();

                    //Add those that are loading
                    $.each(data, function (i, item) {
                        var pageLink = $("#PageLink_" + item);
                        pageLink.hide();
                        pageLink.siblings(".epi-ajaxLoader").show();
                    });

                    //If we have any running jobs poll for status changes
                    if (data.length > 0) {
                        setTimeout(_updateJobStatus, 5000);
                    }
                });
        };

        return pub;
    } ();
} (epiJQuery, epi));
