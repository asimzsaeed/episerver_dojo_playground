(function ($, epi) {

    epi.shell.registerInitFunction(function () {
        $.validator.addMethod("nohtml", function (value, element) {
            return this.optional(element) || !/([<>])|(&#)/.test(value);
        });
    });
})(epiJQuery, epi);
