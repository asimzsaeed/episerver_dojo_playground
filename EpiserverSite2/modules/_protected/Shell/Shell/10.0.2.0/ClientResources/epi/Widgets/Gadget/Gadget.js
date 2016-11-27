(function ($, epi) {
    epi = epi || {};

    var sharedResourceKey = "EPiServer.Shell.Resources.Texts";

    epi.gadget = function () {
        var pub = {};

        pub.getByElement = function (htmlElement) {
            /// <summary>
            ///     Gets the epiGadget jQuery object.
            /// </summary>
            /// <param name="htmlElement" type="Element">
            ///     A DOM or jQuery element inside the gadget.
            /// </param>
            /// <returns type="jQuery element" />

            return $(htmlElement).closest("div.epi-gadget").epiGadget("getInstance");
        };

        pub.getById = function (gadgetId) {
            /// <summary>
            ///     Gets the epiGadget jQuery object.
            /// </summary>
            /// <param name="gadgetId" type="String">
            ///     The gadet guid string.
            /// </param>
            /// <returns type="jQuery element" />

            return $("#gadget_" + gadgetId).epiGadget("getInstance");
        };

        pub.loadView = function (htmlElement, routeParams) {
            pub.getByElement(htmlElement).loadView(routeParams);
        };

        pub.visibilityChanged = function (htmlElement, isVisible) {
            /// <summary>
            ///     Triggers visibility changed on the gadget.
            /// </summary>
            /// <param name="htmlElement" type="Element">
            ///     A DOM or jQuery element inside the gadget, or the gadget.
            /// </param>
            /// <param name="isVisible" type="boolean">Visibility indication</param>
            return $(htmlElement).epiGadget("triggerVisibilityChanged", isVisible);
        };

        pub.unload = function (htmlElement) {
            /// <summary>
            ///     Triggers unload event on the gadget.
            /// </summary>
            /// <param name="htmlElement" type="Element">
            ///     A DOM or jQuery element inside the gadget, or the gadget.
            /// </param>
            /// <param name="isVisible" type="boolean">Visibility indication</param>
            return $(htmlElement).epiGadget("triggerUnload");
        };

        pub.init = function (params) {
            /// <summary>
            ///     Initializes a gadget on the dashboard.
            /// </summary>
            /// <param name="params" type="Object">
            ///     The gadget init params to to initialize this gadget.
            ///     Example:
            ///     epi.gadget.init({
            ///         id: '123-234-345',
            ///         selector: "#gadget_123-234-345",
            ///         contentUrl: '/mygadget/index'
            ///         widgetParams: {
            ///             initMethod: 'mygadget.init',
            ///             routeUrl: '/mygadget/{action}',
            ///             routeParameters: { moduleArea: 'my', controller: 'mygadget', action: 'index' },
            ///             removeText: 'Delete',
            ///             initMethodErrorText: 'Oops, {0} caused {1}'
            ///         }
            ///     });
            /// </param>

            if (!params.selector) {
                throw "Missing parameter: params.selector";
            }

            if (params.contentUrl) {
                epi.shell.ajax({
                    url: params.contentUrl,
                    type: "GET",
                    dataType: "HTML",
                    data: { gadgetId: params.id },
                    success: function (data) {
                        $(params.selector).epiGadget($.extend({ htmlContent: data }, params.widgetParams));
                    },
                    error: function (xmlHttpRequest, status, errorThrown) {
                        var errorInfo = { xmlHttpRequest: xmlHttpRequest, status: status, errorThrown: errorThrown };
                        $(params.selector).epiGadget($.extend({ error: errorInfo }, params.widgetParams));
                    }
                });
            } else {
                $(params.selector).epiGadget(params.widgetParams);
            }
        };

        return pub;
    } ();

    /// epiGadget component
    $.widget("ui.epiGadget", {
        _init: function () {
            var o = this.options;
            var self = this;

            this._toolbarSetup();
            this._enableFocus();

            // Gadget id should always be a part of the route parameters
            o.routeParameters["gadgetId"] = this.getId();

            this.defaultRouteParams = o.routeParameters;

            var gadgetInstance = this.getInstance();
            gadgetInstance.routeParams = o.routeParameters;

            this.element.bind("epigadgetloaded", function (e) {
                $("form.epi-gadgetform", this).validate({
                    errorElement: "span"
                });

                $("form.epi-gadgetform", this).bind("submit", gadgetInstance, self._submitHandler);
            });

            if (o.movable) {
                this.element.trigger("epigadgetinitmove", gadgetInstance);
            }

            if (o.htmlContent) {
                this.element.find(".epi-gadgetContent").html(o.htmlContent);
            }

            if (o.initMethod && o.initMethod !== "") {
                try {
                    var initMethod = this._safeObject(o.initMethod);
                    this.element.bind("epigadgetinit", initMethod);
                }
                catch (ex) {
                    var errorMessage = o.initMethodErrorText.replace("{0}", o.initMethod).replace("{1}", ex.message);
                    this.setErrorMessage(errorMessage);
                }
            }

            this.element.trigger("epigadgetinit", gadgetInstance);

            if (o.error) {
                this.element.find(".epi-gadgetContent").html("");
                this.setErrorMessage("<strong>" + epi.shell.resource.get(sharedResourceKey, "InternalServerError") + " [" + o.error.xmlHttpRequest.status + "]</strong>.", { details: o.error.xmlHttpRequest.responseText, status: o.error.status, errorThrown: typeof (o.error.errorThrown) != "undefined" && o.error.errorThrown });

                gadgetInstance.raiseErrorEvent(o.error);
            } else {
                this.element.trigger("epigadgetloaded", gadgetInstance);
            }
        },

        _safeObject: function (functionDescription) {
            /// <summary>
            ///     Converts the function description into a Java Object
            /// </summary>
            /// <param name="functionDescription" type="String">function description to convert. E.g epi.myGadget.init</param>
            var parts = functionDescription.split('.');
            var objectString = parts[0];
            var safeObject = window[parts.shift()];
            $.each(parts, function (i) {
                try {
                    safeObject = safeObject[parts[i]];
                    objectString += "." + parts[i];
                }
                catch (e) {
                    e.message = e.message.replace("safeObject", objectString);
                    throw e;
                }
            });

            return safeObject;
        },

        _submitHandler: function (e) {
            var gadgetInstance = e.data;
            var formElement = this;

            if ($(formElement).valid()) {

                var submitEvent = jQuery.Event("epigadgetsubmit");
                submitEvent.target = formElement;

                $(formElement).trigger(submitEvent, gadgetInstance);

                if (!submitEvent.isDefaultPrevented()) {
                    var formData = $(formElement).serializeArray();
                    formData.push({ name: "gadgetId", value: gadgetInstance.id });
                    gadgetInstance.ajax({
                        url: formElement.action,
                        dataType: "html",
                        success: function (data) {
                            var routeParams = epi.routes.getRouteParams(gadgetInstance.getRouteUrl(), formElement.action);
                            routeParams["action"] = routeParams["action"] !== "" ? routeParams["action"] : gadgetInstance.getDefaultRouteParams().action;
                            routeParams["gadgetId"] = gadgetInstance.id;
                            gadgetInstance.routeParams = routeParams;


                            var gadgetContentDiv = $(".epi-gadgetContent", gadgetInstance.element);
                            gadgetContentDiv.children().remove();
                            gadgetContentDiv.append(data);
                            gadgetContentDiv.trigger("epigadgetloaded", gadgetInstance);
                        },
                        data: formData
                    });
                }
            }

            e.preventDefault();
        },

        setErrorMessage: function (message, options) {
            /// <summary>
            ///     Display an error message in the gadget content area.
            /// </summary>
            /// <param name="message" type="String">
            ///     The message to display
            /// </param>
            /// <param name="options" type="Object">
            ///     Options object for the error, available options:
            ///     * details: Detailed text displayed when showing detailed error message
            ///     * status: A status value
            ///     * errorThrown: Whether this error was the result of an unhandled exception
            ///     Default values for options object: { details: "", status: 0, errorThrown: false }
            /// </param>

            options = $.extend({ details: "", status: 0, errorThrown: false }, options);
            var feedbackElement = $(".epi-gadgetError", this.element);

            if (feedbackElement.length == 0) {
                // No div with with class = .epi-gadgetError exists in the gadget, so we create and add one.
                feedbackElement = $('<div class=\"epi-feedbackContent-error epi-feedbackContent epi-gadgetError\"></div>')
                $(".epi-gadgetContent", this.element).prepend(feedbackElement);
            }

            epi.shell.error.createErrorMessage(feedbackElement, message, options.details, options.status, true);

            feedbackElement.show();
        },

        clearErrorMessage: function () {
            var feedbackElement = $(".epi-gadgetError", this.element);
            feedbackElement.hide();
        },

        setFeedbackMessage: function (message, options) {
            /// <summary>
            ///     Display a feedback message in the gadget title bar.
            /// </summary>
            /// <param name="message" type="String">
            ///     The message to display
            /// </param>
            /// <param name="options" type="Object">
            ///     Options object with options for the feedback, available options:
            ///     * ajaxLoader: Boolean whether to display ajax loader image
            ///     * feedbackTitle: A text string that will be shown as tooltip to the loading image
            ///     * feedbackHideDelay: Number of milliseconds before message is removed, 0 means show indefinitely
            ///     * feedbackFadeOut: Boolean whether to fade rather than just hide the message after the delay
            ///     Default values for options object:{ ajaxLoader: false, feedbackTitle: "", feedbackHideDelay: 0, feedbackFadeOut: false }
            /// </param>

            // extend options with defaults
            options = $.extend({ ajaxLoader: false, feedbackMessage: message, feedbackTitle: "", feedbackHideDelay: 0, feedbackFadeOut: false }, options);

            // find and show the feedback element
            var feedbackQuery = $(this.element).closest(".epi-gadget").find(".epi-gadgetFeedback")
                .html(options.feedbackMessage).attr("title", options.feedbackTitle)
                .show();

            // ajax loader option
            if (options.ajaxLoader) {
                feedbackQuery.addClass("epi-gadgetLoader");
            }

            // auto-hide features
            if (options.feedbackHideDelay > 0) {
                var self = this;
                setTimeout(function () {
                    self.clearFeedbackMessage(options);
                }, options.feedbackHideDelay);
            } else if (options.feedbackFadeOut) {
                this.clearFeedbackMessage(options);
            }
        },

        clearFeedbackMessage: function (options) {
            /// <summary>
            ///     Hide the ajax loader for a gadget.
            /// </summary>
            /// <param name="gadgetElement" type="Element">
            ///     A DOM or jQuery element inside the gadget.
            /// </param>
            /// <param name="options" type="Object">
            ///     Options object with options for the feedback, available options:
            ///     * feedbackFadeOut: Boolean whether to fade rather than just hide the message after the delay
            ///     Default values for options object:{ feedbackFadeOut: false }
            /// </param>
            var feedbackQuery = $(this.element).closest(".epi-gadget").find(".epi-gadgetFeedback")
                .removeClass("epi-gadgetLoader");
            if (options && options.feedbackFadeOut && feedbackQuery.is(":visible")) {
                feedbackQuery.fadeOut();
            } else {
                feedbackQuery.hide();
            }
        },

        getId: function () {
            return this.element.attr("id").replace(/gadget_/, "");
        },

        getIsVisible: function () {
            return this.isVisible;
        },

        getInstance: function () {
            if (this.instance) {
                return this.instance;
            }

            this.instance = this._gadgetInstance();
            return this.instance;
        },

        loadView: function (routeParams) {
            this.isVisible = true;
            var gadgetInstance = this.getInstance();
            if (routeParams) {
                gadgetInstance.routeParams = routeParams;
            } else {
                gadgetInstance.routeParams = this.defaultRouteParams;
            }

            $(".epi-gadgetError", this.element).hide();

            /// this was previously epigadgetloadview handler
            var url = gadgetInstance.getActionPath(gadgetInstance.routeParams);

            gadgetInstance.ajax({
                url: url,
                type: "GET",
                dataType: "HTML",
                success: function (data) {
                    $(".epi-gadgetContent", gadgetInstance.element)
                        .html(data)
                        .trigger("epigadgetloaded", gadgetInstance);
                }
            });
        },

        triggerVisibilityChanged: function (isVisible) {
            this.isVisible = isVisible;
            this.element.trigger("epigadgetvisibilitychanged", this.getInstance());
        },

        triggerUnload: function () {
            this.element.trigger("epigadgetunload", this.getInstance());
        },

        getActionPath: function (routeParams) {
            return epi.routes.getActionPath(this._mergeRouteParameters(routeParams), this.options.routeUrl);
        },

        _mergeRouteParameters: function (routeParameters) {
            return $.extend({}, this.options.routeParameters, routeParameters);
        },

        _toolbarSetup: function () {
            var self = this;
            var o = this.options;

            this._contextMenuSetup();

            if (o.removable) {
                $(".epi-iconToolbar-delete", this.element).bind("click", function (e) {
                    self._deleteBtnClickHandler(e);
                });
            } else {
                $(".epi-iconToolbar-delete", this.element).hide();
            }
        },

        _contextMenuSetup: function () {
            var self = this;
            var o = this.options;
            var menuButton = $(".epi-iconToolbar-menu", this.element);
            if (!menuButton.length) {
                return;
            }
            this._contextMenu = $(".epi-contextMenu", this.element)
                .epiContextMenu({ attachedTo: menuButton, alignedRight: true, clickSelector: menuButton });
            if (this._contextMenu.length === 0) {
                return;
            }

            if (o.removable) {
                var deleteMenuItem = this._contextMenu.epiContextMenu("add", "delete", "#", o.removeText, null, false)
                                                    .epiContextMenu("getMenuItem", "delete");
            }

            this._contextMenuClick = function (e, clickedItem) {
                if (deleteMenuItem && clickedItem === deleteMenuItem.get(0)) {
                    self._deleteBtnClickHandler(e);
                } else if (clickedItem.href !== "" && clickedItem.href !== "#") {
                    var gadgetInstance = self.getInstance();
                    gadgetInstance.loadView({ "action": clickedItem.name });
                }
            };
            this._contextMenu.bind("epimenuclick", this._contextMenuClick);
        },

        _deleteBtnClickHandler: function (e) {
            this.element.trigger("epigadgetremove", this.getInstance());
            e.preventDefault();
        },

        _contextmenuEventHandler: function (e) {
            this._contextMenu.epiContextMenu("show");
            e.preventDefault();

        },

        _enableFocus: function () {
            var self = this;
            var keyDownEventHandler = function (e) {
                self._onKeyDown(e);
            };
            var contextmenuEventHandler = function (e) {
                self._contextmenuEventHandler(e);
            };

            var addEventHandlers = function (e) {
                if (e.target === self.element.get(0)) {
                    self.element.bind("keydown", keyDownEventHandler);
                    $('.epi-gadgetHeader', self.element).bind('contextmenu', contextmenuEventHandler);
                }
            };

            this._removeActiveGadgetEventHandlers = function (e) {
                this.element.unbind("keydown", keyDownEventHandler)
                    .unbind("contextmenu", contextmenuEventHandler);

            }

            this.element.attr("tabindex", 0)
            .bind("focus", addEventHandlers)
            .bind("blur", function (e) {
                self._removeActiveGadgetEventHandlers()
            });

        },


        // Helpers
        _getNextGadget: function () {
            /// <summary>
            ///     Returns the next visible gadget in document structure order.
            /// </summary>
            /// <returns type="jQuery" />
            return epi.shell.getSimilarElementInCertainPosition(this.element, 1, this.options.cssClass);
        },

        _getPreviousGadget: function () {
            /// <summary>
            ///     Returns the previous visible gadget in document structure order.
            /// </summary>
            /// <returns type="jQuery" />
            return epi.shell.getSimilarElementInCertainPosition(this.element, -1, this.options.cssClass);
        },

        _getGadgetContainer: function (gadget) {
            return gadget === null ? null : gadget.closest("." + this.options.containerCssClass);
        },

        _getNextGadgetContainer: function () {
            /// <summary>
            ///     Returns the next visible gadget container in document structure order.
            /// </summary>
            /// <param name="currentGadget" type="jQuery">
            ///     Gadget
            /// </param>
            /// <returns type="jQuery" />
            return epi.shell.getSimilarElementInCertainPosition(this._getGadgetContainer(this.element), 1, this.options.containerCssClass);
        },

        _getPreviousGadgetContainer: function () {
            /// <summary>
            ///     Returns the previous visible gadget container in document structure order.
            /// </summary>
            /// <param name="currentGadget" type="jQuery">
            ///     Gadget
            /// </param>
            /// <returns type="jQuery" />
            return epi.shell.getSimilarElementInCertainPosition(this._getGadgetContainer(this.element), -1, this.options.containerCssClass);
        },

        _getGadgetInSpecifiedPosition: function (gadgetContainer, index) {
            /// <summary>
            ///     Returns the n-th gadget in document order or the last if supplied index
            ///     exceeds the number of gadgets in supplied gadget container.
            /// </summary>
            /// <param name="gadgetContainer" type="jQuery">
            ///     Gadget container
            /// </param>
            /// <param name="index" type="Number">
            ///     Index
            /// </param>
            /// <returns type="jQuery" />
            var gadget = null;
            var cssClass = "." + this.options.cssClass;
            if (gadgetContainer !== null) {
                if (index < gadgetContainer.find(cssClass).length) {
                    gadget = gadgetContainer.find(cssClass + ":eq(" + index + ")");
                } else {
                    gadget = gadgetContainer.find(cssClass + ":last");
                }
            }

            if (gadget !== null && gadget.length === 0) {
                gadget = null;
            }
            return gadget;
        },

        _onKeyDown: function (e) {
            /// <summary>
            ///     Event listener for keydown event.
            /// </summary>
            /// <param name="e" type="Event">
            ///     Event object
            /// </param>
            var o = this.options;
            if (e.target !== this.element.get(0)) {
                this._removeActiveGadgetEventHandlers()

                return;
            }

            if (e.ctrlKey && o.movable) {
                if (epi.shell.isArrowKey(e.which)) {
                    this._moveGadget(e);
                }
            } else if (e.altKey || e.shiftKey) {
                // Do something
            } else {
                if (epi.shell.isArrowKey(e.which)) {
                    this._changeGadgetFocus(e);
                } else if (e.which === epi.shell.keyCode.contextMenu) {
                    // Open up gadget context menu
                    e.preventDefault();
                    return false;
                }
            }
        },

        _moveGadget: function (e) {
            /// <summary>
            ///     Moves current gadget in document structure depending on arrow keyCode.
            /// </summary>
            /// <param name="e" type="Event">
            ///     Event object
            /// </param>
            var isMoveSuccessful = false;
            switch (e.which) {
                case epi.shell.keyCode.arrowDown:
                    isMoveSuccessful = this._moveVertical(1);
                    break;

                case epi.shell.keyCode.arrowUp:
                    isMoveSuccessful = this._moveVertical(-1);
                    break;

                case epi.shell.keyCode.arrowLeft:
                    isMoveSuccessful = this._moveHorizontal(-1);
                    break;

                case epi.shell.keyCode.arrowRight:
                    isMoveSuccessful = this._moveHorizontal(1);
                    break;
            }

            var currentGadget = this.element;
            if (isMoveSuccessful) {
                currentGadget.trigger("epigadgetmove", this.getInstance());
            }
            currentGadget.focus();
            e.preventDefault();
            e.stopPropagation();
        },

        _moveVertical: function (direction) {
            var current = this.element;
            var gadget = epi.shell.getSimilarElementInCertainPosition(current, direction, this.options.cssClass);
            var siblingGadgetContainer = epi.shell.getSimilarElementInCertainPosition(this._getGadgetContainer(current), direction, this.options.containerCssClass);
            var siblingDOMGadgetContainer = siblingGadgetContainer ? siblingGadgetContainer.get(0) : null;
            var gadgetContainer = gadget ? this._getGadgetContainer(gadget).get(0) : null;

            if (gadget && (gadgetContainer === this._getGadgetContainer(current).get(0) || gadgetContainer === siblingDOMGadgetContainer)) {
                if ((direction === 1 && current.is(":not(:last-child)")) || (direction === -1 && current.is(":first-child"))) {
                    current.insertAfter(gadget);
                } else {
                    current.insertBefore(gadget);
                }
                return true;
            } else {
                if (siblingGadgetContainer) {
                    siblingGadgetContainer.append(current);
                    return true;
                }
            }
            return false;
        },

        _moveHorizontal: function (direction) {
            var current = this.element;
            var currentPosition = current.prevAll("." + this.options.cssClass).length;
            var gadgetContainer = epi.shell.getSimilarElementInCertainPosition(this._getGadgetContainer(current), direction, this.options.containerCssClass);
            var gadget = this._getGadgetInSpecifiedPosition(gadgetContainer, currentPosition);

            if (gadget) {
                if (gadget.prevAll().length < currentPosition) {
                    gadgetContainer.append(current);
                } else {
                    current.insertBefore(gadget);
                }
                return true;
            } else {
                if (gadgetContainer) {
                    gadgetContainer.append(current);
                    return true;
                }
            }
            return false;
        },

        _changeGadgetFocus: function (e) {
            /// <summary>
            ///     Sets focus to a gadget depending on keyCode.
            /// </summary>
            /// <param name="e" type="Event">
            ///     Event object
            /// </param>
            var cssClass = "." + this.options.cssClass;
            var currentGadget = this.element; // Current focused gadget.
            var gadgetContainer; // Gadget container for the gadget we are going for.
            var currentPosition; // Number of gadgets before focused gadget.
            var gadget = null; // Gadget we are going for.

            switch (e.which) {
                case epi.shell.keyCode.arrowDown:
                    gadget = this._getNextGadget();
                    break;

                case epi.shell.keyCode.arrowUp:
                    gadget = this._getPreviousGadget();
                    break;

                case epi.shell.keyCode.arrowLeft:
                    gadgetContainer = this._getPreviousGadgetContainer();
                    currentPosition = currentGadget.prevAll(cssClass).length;
                    gadget = this._getGadgetInSpecifiedPosition(gadgetContainer, currentPosition);
                    break;

                case epi.shell.keyCode.arrowRight:
                    gadgetContainer = this._getNextGadgetContainer();
                    currentPosition = currentGadget.prevAll(cssClass).length;
                    gadget = this._getGadgetInSpecifiedPosition(gadgetContainer, currentPosition);
                    break;
            }

            if (gadget === null) {
                return;
            }

            gadget.focus();
        },

        _gadgetInstance: function () {
            /// <summary>Convenience wrapper for a gadget instance</summary>
            /// <param name="gadgetInstance" type="ui.epiGaget">The wrapped gadget instance</param>
            /// <returns type="epi.gadgetInstance">The instance wrapper</returns>

            var gadget = this;

            var pub = {
                id: gadget.getId(),
                /// <summary>Returns the unique id of the gadget</summary>
                /// <returns type="String">The gadget id</returns>

                element: gadget.element,
                /// <summary>Returns the gadget container DOM element.</summary>
                /// <returns type="Element">The DOM element containing this gadget.</returns>

                routeParams: {} // this is updated by the widget's init method
                /// <summary>Returns the route params for the gadget.</summary>
                /// <returns type="Object">route param object {Action:{ActionName}}.</returns>
            };

            pub.getActionPath = function (routeParams) {
                /// <summary>Gets the URL for a gadget action based on routeParameters</summary>
                /// <param name="routeParams">
                ///   An object with optional route parameters overriding the default route parameters.
                ///   Example: {moduleArea: "CMS", controller: "MyGadget", action:"Show"}
                ///   The URL for the configured default action is returned if no routeParameters are appended.
                /// </param>
                /// <returns type="String">The URL for a gadget action</returns>
                return gadget.getActionPath(routeParams);
            };

            pub.getRouteUrl = function () {
                /// <summary>Gets the route url.</summary>
                ///<return tyle="String">The route</returns>
                return gadget.options.routeUrl;
            };

            pub.getDefaultRouteParams = function () {
                /// <summary>Gets the original route parameters received when initializing the gadget.</summary>
                ///<return tyle="String">The default route parameters</returns>
                return gadget.defaultRouteParams;
            };

            pub.loadView = function (routeParams) {
                /// <summary>Loads a new view into the gadget</summary>
                /// <param name="routeParams">
                ///   An object with optional route parameters overriding the default route parameters.
                ///   Example: {action: "Show"}
                ///   The URL for the configured default action is returned if no routeParameters are appended.
                /// </param>
                /// <returns type="String">The URL for a gadget action</returns>

                gadget.loadView(routeParams);
            };

            pub.isVisible = function () {
                /// <summary>Gets the gadget visibility.</summary>
                ///<return tyle="Boolean">The gadget visibility</returns>
                return gadget.getIsVisible();
            };

            pub.setErrorMessage = function (message, options) {
                /// <summary>Sets an error message in the gadget heading area.</summary>
                /// <param name="message">The message to display.</param>
                /// <param name="options">Feedback options.</param>
                gadget.setErrorMessage(message, options);
            };

            pub.clearErrorMessage = function () {
                /// <summary>Hides the error message panel</summary>
                gadget.clearErrorMessage();
            };

            pub.setFeedbackMessage = function (message, options) {
                /// <summary>Sets a feedback message in the gadget title area.</summary>
                /// <param name="message">The message to display.</param>
                /// <param name="options">Feedback options.</param>
                gadget.setFeedbackMessage(message, options);
            };

            pub.clearFeedbackMessage = function () {
                /// <summary>Hides the feedback message</summary>
                gadget.clearFeedbackMessage();
            };

            pub.raiseErrorEvent = function (errorParameters) {
                this.error = errorParameters;
                this.element.trigger("epigadgeterror", this);
                this.error = null;
            };

            pub.ajax = function (ajaxOptions) {
                /// <summary>Sends an AJAX request using jQuery AJAX functionalityserverSets an error message in the gadget heading area.</summary>
                /// <param name="ajaxOptions">A jQuery AJAX parameter object overriding default options.</param>
                // Merge any custom properties into the default ones

                var self = this;
                var options = {
                    dataType: "json",
                    feedbackMessage: "",
                    cache: false,
                    type: "POST",
                    ajaxLoader: true,
                    error: function (xmlHttpRequest, status, errorThrown) {
                        self.clearFeedbackMessage();
                        self.raiseErrorEvent({ xmlHttpRequest: xmlHttpRequest, status: status, errorThrown: errorThrown });
                        self.setErrorMessage("<strong>" + epi.shell.resource.get(sharedResourceKey, "InternalServerError") + " [" + xmlHttpRequest.status + "]</strong>.", { details: xmlHttpRequest.responseText, status: status, errorThrown: errorThrown });
                    },
                    success: function (data) {
                        self.clearFeedbackMessage();
                    }
                };

                if ($.isFunction(ajaxOptions.success)) {
                    var tempSuccess = ajaxOptions.success;
                    ajaxOptions.success = function (data, textStatus) {
                        self.clearFeedbackMessage();
                        tempSuccess.call(this, data, textStatus);
                    };
                }
                if ($.isFunction(ajaxOptions.error)) {
                    var tempError = ajaxOptions.error;
                    ajaxOptions.error = function (xmlHttpRequest, status, errorThrown) {
                        self.clearFeedbackMessage();
                        tempError.call(this, xmlHttpRequest, status, errorThrown);
                    };
                }

                options = $.extend(options, ajaxOptions);
                self.setFeedbackMessage("", options);

                $.ajax(options);
            };

            return pub;
        }
    });

    $.extend($.ui.epiGadget, {
        version: "0.1",
        eventPrefix: "epigadget",
        getter: ["getId", "getActionPath", "getInstance", "getIsVisible"],
        defaults: {
            autoupdate: 0,          // Period (in milliseconds) to reload gadget (0 to switch off)
            removable: true,        // Is it possible to delete the gadget?
            movable: true,          // Is it possible to move the gadget?
            routeParameters: {},    // Route parameters for the default view.
            routeUrl: null,         // Route url overriding the context url defined in epi.routes
            cssClass: "epi-gadget", // CSS class for this gadget.
            containerCssClass: "epi-gadgetContainer", // CSS class for the container element for this gadget (and siblings).
            removeText: "Remove",   // Text on menu item created if removable is set to true.
            initMethod: null,        // Optional init method called when the gadget is initialized
            initMethodErrorText: "Client script error: Failed to execute [<strong>{0}</strong>] method with error message: {1}."
        }
    });

})(epiJQuery, epi);
