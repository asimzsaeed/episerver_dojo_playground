(function ($, epi) {
    epi.reportCenter = function () {

        var pub = {};

        pub.open = function (url) {
            var opener = window.top;
            var size = _getPopupSize();

            opener.name = "EPiServerMainUI";
            opener.open(url, "ReportCenter", "width=" + size.width + ", height=" + size.height + ", top=" + size.top + ", left=" + size.left + ", status=no, resizable, scrollbars").focus();

            return false;
        }

        var _getPopupSize = function () {
            return { width: 900, height: 600, top: 50, left: 50 };
        }

        return pub;
    } ();
} (epiJQuery, epi));
