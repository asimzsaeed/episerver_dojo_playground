(function ($, epi) {
    epi.rssReader = function () {

        // object returned by function. Exposes public methods and variables.
        var pub = {};

        pub.init = function (e, gadgetInstance) {
            // Listen to the loaded event raised each time a gadget view has been loaded
            $(this).bind("epigadgetloaded", viewLoaded);

            //            // Since showing confirms really is bugging this is commented but if you uncomment it
            //            // you'll see an example of intercepting the submit of a gadget. This is a good place
            //            // to do client-side validation
            //            $(this).bind("epigadgetsubmit", function(e, gadgetInstance) {
            //                if (!confirm("Submit gadget: " + gadgetInstance.id)) {
            //                    e.preventDefault();
            //                }
            //            });
        };

        var fetchTitle = function (e) {
            var gadgetInstance = e.data;

            var successFunction = function (data) {
                if (data.success === true) {
                    gadgetInstance.clearErrorMessage();
                    $("input[name='Title']", gadgetInstance.element).attr("value", data.title);
                } else {
                    gadgetInstance.setErrorMessage(data.message);
                }
            };

            gadgetInstance.ajax(
                {
                    url: gadgetInstance.getActionPath({ action: "FeedInfo" }),
                    type: "POST",
                    dataType: "json",
                    data: { FeedUrl: $("input[name='FeedUrl']", gadgetInstance.element).attr("value") },
                    success: successFunction
                }
            );
        };

        var viewLoaded = function (e, gadgetInstance) {
            // as an alternative to jQuery "live" events it's possible to hook events manually whenever a view is loaded
            $("#fetchTitleButton", this).bind("click", gadgetInstance, fetchTitle);

            var form = $("form", this);
            if (form && form.length > 0) {
                var input = $("input[name='FeedItemsToShow']", form);
                input.rules("add",
                {
                    required: true,
                    range: [1, 60]
                });
            }
        };

        return pub;

    } ();
} (epiJQuery, epi));
