$(document).ready(function () {
    $(".epi-dropdownLink").click(function () {
        $(this).parent().find("ul").fadeIn("fast").show();
        $(this).parent().hover(function () {
        }, function () {
            $(this).parent().find("ul").fadeOut("normal");
        });
        return false;
    });
});
