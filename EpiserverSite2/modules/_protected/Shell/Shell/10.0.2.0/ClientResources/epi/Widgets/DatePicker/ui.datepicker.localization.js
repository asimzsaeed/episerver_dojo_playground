(function ($, epi) {
    var resourceKey = 'EPiServer.Shell.UI.Resources.DatePicker';

    if (typeof require !== "undefined") {
        require(["epi/i18n!epi/shell/ui/nls/" + resourceKey, "dojo/domReady!"], function (res) {
            // When in dojo land we're not loading resources unconditionally, so they won't exist in the
            // global resource object and must be loaded and added.
            epi.shell.resource.add(resourceKey, res);
            registerResources();
        });
    } else {
        epi.shell.registerInitFunction(registerResources);
    }

    function registerResources() {
        $.datepicker.regional[''] =
        {
            closeText: epi.shell.resource.get(resourceKey, 'closetext'),
            prevText: epi.shell.resource.get(resourceKey, 'prevtext'),
            nextText: epi.shell.resource.get(resourceKey, 'nexttext'),
            currentText: epi.shell.resource.get(resourceKey, 'currenttext'),
            monthNames: epi.shell.resource.get(resourceKey, 'monthnames').split(','),
            monthNamesShort: epi.shell.resource.get(resourceKey, 'monthnamesshort').split(','),
            dayNames: epi.shell.resource.get(resourceKey, 'daynames').split(','),
            dayNamesShort: epi.shell.resource.get(resourceKey, 'daynamesshort').split(','),
            dayNamesMin: epi.shell.resource.get(resourceKey, 'daynamesmin').split(','),
            dateFormat: epi.shell.resource.get(resourceKey, 'dateformat'),
            firstDay: parseInt(epi.shell.resource.get(resourceKey, 'firstday')),
            isRTL: epi.shell.resource.get(resourceKey, 'isrtl') == 'true'
        };

        $.datepicker.setDefaults($.datepicker.regional['']);
    }
})(epiJQuery, epi);
