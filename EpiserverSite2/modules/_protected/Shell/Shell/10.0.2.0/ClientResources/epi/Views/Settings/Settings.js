$(document).ready(function () {
    epi.shell.layout.initScrollableArea({ area: "#epi-applicationBodySidebar,#epi-applicationBodyMain" });

    // init menu opening and closing
    var on = function (e) {
        $(this).closest("li").removeClass("epi-settings-closed");
    };
    var off = function (e) {
        $(this).closest("li").addClass("epi-settings-closed");
    };
    $(".epi-localNavigation > ul > li > a").toggle(off, on);
});
