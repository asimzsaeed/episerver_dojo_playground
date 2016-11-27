///<reference path="../jquery-1.3.2-vsdoc.js" />
(function ($, epi) {
    epi.visitorGroupsStatistics = function () {

        var temp = {};
        var _resizeTrigger;

        var onloaded = function (e, gadgetInstance) {
            var self = this;

            createChartImage(self);

            var onSelectAllVisitorGroups = function () {
                var shouldSelect = $(this).hasClass("selectAllVisitorGroups");

                $("input[type=checkbox]", $(this).parent()).each(function () {
                    this.checked = shouldSelect;
                });
            }

            $(".selectAllVisitorGroups", this).click(onSelectAllVisitorGroups);
            $(".unselectAllVisitorGroups", this).click(onSelectAllVisitorGroups);

            $("select[name=SelectedView]", gadgetInstance.element).change(function () {
                $(this).parent(".epi-gadgetform").submit();
            });
        };

        temp.init = function (e, gadgetInstance) {
            var self = this;
            $(this).bind("epigadgetloaded", onloaded);

            $(window).resize(function () {
                if (_resizeTrigger) {
                    clearTimeout(_resizeTrigger);
                }

                _resizeTrigger = setTimeout(function () {
                    createChartImage(self)
                }, 500);
            });
        };

        var createChartImage = function (self) {
            var width = $(".epi-gadgetContent", self).width();

            if (width > 300)
                $(".visitorGroupListItem", self).width(300);

            $(".epi-visitorGroupStatistics-chart", self).each(function () {
                var src = this.href + "&width=" + (width - 55);
                $(this).html('<img src="' + src + '" alt="" class="cms-visitorGroupsStatisticsGadget-ChartImage" />');
            }).click(function (e) {
                e.preventDefault();
            });

        }

        return temp;
    } ();
} (epiJQuery, epi));


