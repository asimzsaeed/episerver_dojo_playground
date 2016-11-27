
var EPi;
if (!EPi) {
    EPi = {};
}

EPi.EPiDiff = function () {
    var scrollbarWidth = null;

    var pub = {
        enableBlockDiv: function () {
            var diffiframe = $("div.epi-diffHolder-iframe>iframe");
            if (diffiframe.length) {
                $("div.epi-diffHolder-blockDiv").css("display", "block");
                $(diffiframe[0].contentWindow).bind("resize", resizeBlockDiv);
                resizeBlockDiv();
            }
        }
    };

    var resizeBlockDiv = function (e) {
        var diffiframe = $("div.epi-diffHolder-iframe>iframe");
        var scrollWidth = getScrollBarWidth();
        $("div.epi-diffHolder-blockDiv").css("width", diffiframe.width() - scrollWidth);
        $("div.epi-diffHolder-blockDiv").css("height", diffiframe.height() - scrollWidth);
    };

    var getScrollBarWidth = function () {
        // Returns the scrollbar size
        if (!scrollbarWidth) {
            var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
            // Append our div, do our calculation and then remove it
            $('body').append(div);
            var w1 = $('div', div).innerWidth();
            div.css('overflow-y', 'scroll');
            var w2 = $('div', div).innerWidth();
            div.remove();
            scrollbarWidth = w1 - w2;
        }
        return scrollbarWidth;
    };

    return pub;
} ();
