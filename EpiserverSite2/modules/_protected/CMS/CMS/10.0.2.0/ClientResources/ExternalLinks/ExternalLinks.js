(function ($, epi) {
    epi.externalLinks = function () {
        var temp = {};

        temp.init = function (e, context) {
            $(this).bind("epigadgetloaded", viewLoaded);
        };

        var viewLoaded = function (e, context) {
            var span = $("span.cms-exteranlLinks-pager-current", this);
            var value = parseInt(span.text());
            var func = function (pageNumber) {
                context.loadView({ action: "Index", pageNumber: pageNumber }); return false;
            };
            $("a.cms-exteranlLinks-pager-prev", this).click(function () {
                return func(value - 1);
            });
            $("a.cms-exteranlLinks-pager-next", this).click(function () {
                return func(value + 1);
            });
            $("a.cms-exteranlLinks-pager-page", this).click(function () {
                return func($(this).text());
            });
        };

        return temp;
    } ();
} (epiJQuery, epi));
