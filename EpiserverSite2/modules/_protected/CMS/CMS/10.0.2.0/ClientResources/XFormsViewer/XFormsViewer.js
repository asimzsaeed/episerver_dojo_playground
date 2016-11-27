(function ($, epi) {
    epi.xFormsViewer = function () {
        var temp = {};

        var onclick = function () {
            var value = '';
            if ($(this).attr("checked")) {
                value = $(this).parent().find("label").text();
            }
            $(this).parent().find("input:hidden").val(value);
        };

        var fill = function (gadgetInstance, html) {
            var div = $("div.cms-XFormsViewer-fieldListPanel", gadgetInstance.element);
            div.html(html);
            var fields = $("input:checkbox[name=Fields]", div);
            fields.click(onclick);
            fields.each(onclick);
        };

        var loadXFormFields = function (gadgetInstance, formID, demoMode) {
            var routeValues = { action: "FieldList" };
            var actionUrl = gadgetInstance.getActionPath(routeValues);
            if (!demoMode) {
                demoMode = false;
            }
            gadgetInstance.ajax({
                url: actionUrl,
                data: {formID: formID, demoMode: demoMode},
                dataType: "html",
                success: function (data) {
                    fill(gadgetInstance, data)
                }
            });
        };

        var demoModeChanged = function (gadgetInstance) {
            var form = $("form", gadgetInstance.element);
            var hidden = $("<input type='hidden'>");
            hidden.attr("name", "DemoModeChanged");
            hidden.val("DemoModeChanged");
            form.append(hidden);
            $("select[name=XFormID]", gadgetInstance.element).empty();

            // Since we are submitting the form and switching mode we need to empty to field selection panel as to not get caught in validation
            fill(gadgetInstance, '');

            form.submit();
        };

        var onloaded = function (e, gadgetInstance) {
            $(".epi-toolTip", this).epiToolTip();

            $("select[name=XFormID]", gadgetInstance.element).change(function () {
                var demoMode = $("input:checkbox[name=DemoMode]", gadgetInstance.element).attr("checked");
                if ($(this).val()) {
                    loadXFormFields(gadgetInstance, $(this).val(), demoMode);
                }
            }).change();

            var numberOfItemsInput = $("input[name=NumberOfPosts]", this);
            if (numberOfItemsInput && numberOfItemsInput.length > 0) {
                numberOfItemsInput.rules("add", {
                    required: true,
                    range: [1, 50]
                });
            }

            $("input:checkbox[name=DemoMode]", gadgetInstance.element).click(function () {
                demoModeChanged(gadgetInstance);
            })


            // implementing custom highlighting for form fields checkboxes if none is selected
            var form = $("form", this);
            if (form && form.length > 0) {
                var validator = form.validate();
                validator.settings.highlight = function (element, errorClass, validClass) {
                    if ($(element).attr('name') == 'Fields') {
                        $('input', $(element).parent().parent()).addClass(errorClass).removeClass(validClass);
                    } else {
                        $(element).addClass(errorClass).removeClass(validClass);
                    }
                };
                validator.settings.unhighlight = function (element, errorClass, validClass) {
                    if ($(element).attr('name') == 'Fields') {
                        $('input', $(element).parent().parent()).removeClass(errorClass).addClass(validClass);
                    } else {
                        $(element).removeClass(errorClass).addClass(validClass);
                    }
                }
            }
        };

        temp.init = function (e, gadgetInstance) {
            $(this).bind("epigadgetloaded", onloaded);
        };

        return temp;
    } ();
} (epiJQuery, epi));
