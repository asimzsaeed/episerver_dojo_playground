(function ($, jQuery, epi) {
    var jQueryValidateResourceKey = 'EPiServer.Shell.UI.Resources.JQueryValidate';


    if (typeof require !== "undefined") {
        require(["epi/i18n!epi/shell/ui/nls/" + jQueryValidateResourceKey, "dojo/domReady!"], function (res) {
            // When in dojo land we're not loading resources unconditionally, so they won't exist in the
            // global resource object and must be loaded and added.

            epi.shell.resource.add(jQueryValidateResourceKey, res);
            registerResources();
        });
    } else {
        epi.shell.registerInitFunction(registerResources);
    }

    function registerResources(resources) {

        $.extend(jQuery.validator.messages, {
            required: epi.shell.resource.get(jQueryValidateResourceKey, "required"),
            remote: epi.shell.resource.get(jQueryValidateResourceKey, "remote"),
            email: epi.shell.resource.get(jQueryValidateResourceKey, "email"),
            url: epi.shell.resource.get(jQueryValidateResourceKey, "url"),
            date: epi.shell.resource.get(jQueryValidateResourceKey, "date"),
            dateISO: epi.shell.resource.get(jQueryValidateResourceKey, "dateiso"),
            number: epi.shell.resource.get(jQueryValidateResourceKey, "number"),
            digits: epi.shell.resource.get(jQueryValidateResourceKey, "digits"),
            creditcard: epi.shell.resource.get(jQueryValidateResourceKey, "creditcard"),
            equalTo: epi.shell.resource.get(jQueryValidateResourceKey, "equalto"),
            accept: epi.shell.resource.get(jQueryValidateResourceKey, "accept"),
            maxlength: $.validator.format(epi.shell.resource.get(jQueryValidateResourceKey, "maxlength")),
            minlength: $.validator.format(epi.shell.resource.get(jQueryValidateResourceKey, "minlength")),
            rangelength: $.validator.format(epi.shell.resource.get(jQueryValidateResourceKey, "rangelength")),
            range: $.validator.format(epi.shell.resource.get(jQueryValidateResourceKey, "range")),
            max: $.validator.format(epi.shell.resource.get(jQueryValidateResourceKey, "max")),
            min: $.validator.format(epi.shell.resource.get(jQueryValidateResourceKey, "min")),
            nohtml: $.validator.format(epi.shell.resource.get(jQueryValidateResourceKey, "nohtml"))
        });
    }

})(epiJQuery, epiJQuery, epi);
