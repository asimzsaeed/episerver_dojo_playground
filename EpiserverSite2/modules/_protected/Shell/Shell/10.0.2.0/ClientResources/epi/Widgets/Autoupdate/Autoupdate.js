//Autoupdate functionality (working with span created by Html.Autoupdate()
(function ($, epi) {
    epi.autoupdate = function () {
        //Here we store action on which autoupdate is performed
        var timeoutHandlers = {};

        //Main function appears raised after gadget loaded
        //We do not use context because live events are not able to create it
        var loaded = function (e) {
            var element = e.target;

            var gadget = epi.gadget.getByElement(element);

            // If there is any existing timeouts for this gadget, clear them
            var timeoutId = timeoutHandlers[gadget.id];
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutHandlers[gadget.id] = null;
            }

            //Find span with delay
            var delay = parseInt($("span.autoupdate", element).attr("title"));

            //If span has not been found or contains bad value then
            //Clear action for this gadget in parameteres and get out of here
            if (!delay || isNaN(delay) || delay <= 0) {
                return;
            }

            var updateRoute = gadget.routeParams;

            // Get name of the action to call if specified
            var actionName = $("span.autoupdate", element).attr("name");
            if (actionName) {
                updateRoute.action = actionName;
            }

            //Delayed function
            var temp = function () {
                gadget.loadView(updateRoute);
            };

            //Create timeout
            timeoutHandlers[gadget.id] = setTimeout(temp, delay);
        };

        //Bind live event on gadget loaded
        var gadgets = $(document.documentElement);
        gadgets.bind("epigadgetloaded", loaded);
    } ();

} (epiJQuery, epi));
