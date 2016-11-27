require(["epi", "epi/i18n!epi/shell/nls/episerver.shell.resources.texts"], function (epi, res) {
    (function ($) {
        epi.notes = function () {
            /// <summary>
            ///     Client script for the Notes gadget.
            /// </summary>
            var pub = {};

            pub.init = function (e, gadgetInstance) {
                /// <summary>
                ///    Sets up the different event handlers on gadget initialization.
                /// </summary>
                /// <param name="e" type="Event" />
                /// <param name="gadgetInstance" type="Gadget object" />
                $(this).bind("epigadgetloaded", onGadgetLoaded);

            };

            var onGadgetLoaded = function (e, gadgetInstance) {
                var notes = $(".notesArea", this);
                if (notes.length) {
                    // Default view
                    notes.bind("focus", function (e) {
                        initEdit.call(this, e, gadgetInstance);
                    });
                } else {
                    // Config view
                    initConfigurationView();
                }
            };

            var initEdit = function (e, gadgetInstance) {
                // <summary>
                ///    Initialize edit mode
                /// </summary>
                /// <param name="e" type="Event" />
                /// <param name="gadgetInstance" type="Gadget object" />
                var that = $(this);

                var editNode = that.clone();
                editNode.attr("contentEditable", true);
                editNode.bind("blur", { viewNode: that, gadgetInstance: gadgetInstance }, save);

                if (editNode.html().length == 0) {
                    editNode.html("<br/>");
                }


                editNode.insertBefore(that.hide());
                window.setTimeout(function () {
                    editNode.focus();
                }, 1);

                e.stopPropagation();
            };

            var save = function (e) {
                /// <summary>
                ///    Saves the users notes content.
                /// </summary>
                /// <param name="e" type="Event" />
                var verificationTokenName = "__RequestVerificationToken";

                var editNode = $(this);
                var postData = { content: editNode.html() };
                var viewNode = e.data.viewNode;
                var gadgetInstance = e.data.gadgetInstance;


                if (postData.content != viewNode.html()) {
                    var successFunction = function (data) {
                        viewNode.show().html(postData.content);
                        editNode.remove();
                    };

                    var saveMessage = res.saving;

                    // Append the anti-forgery token to the post data.
                    postData[verificationTokenName] = $("input[name=" + verificationTokenName + "]", gadgetInstance.element).val();

                    gadgetInstance.ajax({
                        url: gadgetInstance.getActionPath({ action: "Save" }),
                        type: "POST",
                        dataType: "json",
                        feedbackMessage: saveMessage,
                        data: postData,
                        success: successFunction
                    }, { keepFeedback: false });
                }
            };

            var initConfigurationView = function () {
                /// <summary>
                ///    Method that is used to make background color for select options work better in browsers.
                ///    Also sets the background color for the options based on their value on initial load.
                /// </summary>

                function setSelectBackgroundColor(e) {
                    $(this).each(function () {
                        this.style.backgroundColor = this.options[this.selectedIndex].style.backgroundColor;
                    });
                }

                var select = $(".notesSelect").bind("change", setSelectBackgroundColor);

                select.children("option").each(function () {
                    $(this).css("backgroundColor", this.value);
                });

                setSelectBackgroundColor.call(select);
            };

            return pub;
        } ();
    } (epiJQuery));
});
