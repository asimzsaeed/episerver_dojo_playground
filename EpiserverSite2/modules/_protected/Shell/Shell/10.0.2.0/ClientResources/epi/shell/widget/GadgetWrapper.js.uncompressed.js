define("epi/shell/widget/GadgetWrapper", [
    "epi",
    "dojo",
    "dijit",
    "dijit/_Widget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojox/layout/ContentPane",
    "epi/routes",
    "epi/shell/Error",
    "epi/clientResourcesLoader",
    "dojo/NodeList-traverse",
    "epi/i18n!epi/shell/ui/nls/EPiServer.Shell.UI.Resources.GadgetChrome",
    "epi/i18n!epi/shell/nls/EPiServer.Shell.Resources.Texts"],

function (epi, dojo, dijit, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, routes, Error, clientResourcesLoader, NodeList, shellUIResources, shellResources) {

    /* global epiJQuery: true */

    var $ = epiJQuery, jQuery = epiJQuery;

    epi.gadget = (function () {
        var pub = {};
        pub.gadgetIdHash = {};

        pub.getByElement = function (/*DomNode*/htmlElement) {
            // summary:
            //    Gets the epiGadget jQuery object.
            //
            // htmlElement:
            //    A DOM or jQuery element inside the gadget.
            //
            // returns:
            //    A gadget instance
            //
            // tags:
            //    public
            htmlElement = (htmlElement.jquery ? htmlElement.context : htmlElement);

            var dojoElementlist = dojo.query(htmlElement).closest("div.epi-gadgetInner");
            if (dojoElementlist.length === 1) {
                var widget = dijit.byNode(dojoElementlist[0]); //epi/shell/widget/GadgetWrapper
                return widget.getInstance(); // gadget instance
            } else {
                return null; // gadget instance
            }
        };

        pub.getById = function (/*String*/gadgetId) {
            // summary:
            //    Gets the epiGadget jQuery object.
            //
            // gadgetId:
            //    The gadet guid string.
            //
            // returns:
            //    An instance of epi/shell/widget/GadgetWrapper
            //
            // tags:
            //    public
            var widgetid = pub.gadgetIdHash[gadgetId];
            if (!widgetid) {
                console.error("Gadget with ID " + gadgetId + " is not found in the epi.gadget.gadgetIdHash");
                return null;
            }
            var widget = dijit.byId(widgetid); // epi/shell/widget/GadgetWrapper
            return widget.getInstance();
        };

        pub.loadView = function (/*DomNode*/htmlElement, /*Object*/routeParams) {
            // summary:
            //    Load the view
            //
            // htmlElement:
            //    A DOM or jQuery element inside the gadget, or the gadget.
            //
            // routeParams:
            //    An object with optional route parameters overriding the default route parameters.
            //    Example: {moduleArea: "CMS", controller: "MyGadget", action:"Show"}
            //    The URL for the configured default action is returned if no routeParameters are appended.
            //
            // tags:
            //    public
            pub.getByElement(htmlElement).loadView(routeParams);
        };

        pub.visibilityChanged = function (/*Object*/htmlElement, /*Boolean*/isVisible) {
            // summary:
            //    Triggers visibility changed on the gadget.
            //
            // htmlElement:
            //    A DOM or jQuery element inside the gadget, or the gadget.
            //
            // isVisible:
            //    Visibility indication
            //
            // tags:
            //   public
            pub.getByElement(htmlElement).triggerVisibilityChanged();
        };

        pub.unload = function (/*DomNode*/htmlElement) {
            // summary:
            //    Triggers unload event on the gadget.
            //
            // htmlElement:
            //    A DOM or jQuery element inside the gadget, or the gadget.
            //
            // tags:
            //    public


            pub.getByElement(htmlElement).triggerUnload();
        };

        return pub;
    })();


    return dojo.declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //    Wraps a gadget and handle its client resources and routing information.
        //
        // tags:
        //    public

        // res: Object
        //    Localization resources for the gadget wrapper.
        res: dojo.mixin({}, shellResources, shellUIResources),

        // componentId: [public] Guid
        //    Unique component identifier.
        componentId: null,

        // element: [public] String
        //    The gadget's DOM element.
        element: null,

        // defaultRouteParams: [public] Object
        //    The default gadget route information.
        defaultRouteParams: null,

        // routeData: [public] Object
        //   Gadget's route data.
        routeData: null,

        // templateString: [String] String
        //    The layout of the gadget wrapper.
        templateString: "<div class=\"epi-gadgetInner\" data-dojo-attach-point=\"gadgetContainer\"> \
                             <div class=\"epi-gadgetFeedback\" data-dojo-attach-point=\"gadgetFeedback\">&nbsp;</div> \
                             <div class=\"epi-gadgetContent\" ioArgs=\"{ preventCache: true }\" data-dojo-type=\"dojox/layout/ContentPane\" data-dojo-attach-point=\"gadgetContent\"></div> \
                         </div>",

        // stylePaths: [public] String[]
        //    Array containing the css files URLs.
        stylePaths: null,

        // scriptPaths: [public] String[]
        //    Array containing the Javascript files URLs.
        scriptPaths: null,

        constructor: function () {
            // summary:
            //    Widget's contructor. It initializes the client resources arrays.
            //
            // tags:
            //    public
            this.stylePaths = [];
            this.scriptPaths = [];
        },

        startup: function () {
            // summary:
            //    Start up the widget
            //
            // tags:
            //    public
            if (this._started) {
                return;
            }

            this.inherited(arguments);

            if (!this.routeData) {
                this.set("content", "Missing route data");
                return;
            }

            this.defaultRouteParams = {};

            // Discard any properties starting with underscore (data store internals)
            for (var param in this.routeData) {
                if (param[0] !== "_") {
                    this.defaultRouteParams[param] = this.routeData[param];
                }
            }

            // TODO: load resources, add extra parameter in constructor for gadget name which will be used to resolve which resources to load
            var deferred = epi.clientResourcesLoader.loadResources(this.stylePaths, this.scriptPaths);

            dojo.when(deferred, dojo.hitch(this, function () {

                // The component id is used as the gadget id when persisting data on the server
                epi.gadget.gadgetIdHash[this.componentId] = this.id;

                var gadgetInstance = this.getInstance();
                // Mixin the gadget id since it's not sent in with the route values
                gadgetInstance.routeParams = dojo.mixin(this.defaultRouteParams, { gadgetId: this.componentId });

                // Must be set for backwards compatibility, some gadgets assume they can find the
                // content container with this id
                this.gadgetContent.set("id", "gadget_" + gadgetInstance.id);

                $(gadgetInstance.element).bind("_epigadgetloadedinternal", dojo.hitch(this, this._onEpiGadgetLoaded));

                try {
                    if (typeof this.initMethod == "string") {
                        var initMethod = dojo.getObject(this.initMethod);
                        $(gadgetInstance.element).bind("epigadgetinit", initMethod);
                    }
                } catch (ex) {
                    this.setErrorMessage(ex.message);
                }

                $(gadgetInstance.element).trigger("epigadgetinit", gadgetInstance);

                this.connect(this.gadgetContent, "onDownloadEnd", function () {
                    $(gadgetInstance.element).trigger("_epigadgetloadedinternal");
                });

                this.loadView(this.defaultRouteParams);
            }));
        },

        destroy: function () {
            delete epi.gadget.gadgetIdHash[this.componentId];
            this.inherited(arguments);
        },

        getInstance: function () {
            // summary:
            //    Get a backward compatible wrapped gadget instance
            //
            // tags:
            //    public
            //
            // returns:
            //    An instance of gadget.
            if (this.instance) {
                return this.instance;
            }

            this.instance = this._gadgetInstance();
            return this.instance; // gadget instance
        },

        getId: function () {
            // summary:
            //    Get the gadget ID.
            //
            // tags:
            //    public
            return this.componentId;
        },

        getActionPath: function (/*Object*/routeParams) {
            // summary:
            //    Get the gadget's action path.
            //
            // routeParams:
            //    An object with optional route parameters overriding the default route parameters.
            //    Example: {moduleArea: "CMS", controller: "MyGadget", action:"Show"}
            //    The URL for the configured default action is returned if no routeParameters are appended.
            //
            // tags:
            //    public
            return routes.getActionPath(this._mergeRouteParameters(routeParams), null);
        },

        _onEpiGadgetLoaded: function () {
            // summary:
            //    Raises the epigadgetloaded event after internal setup is done.
            //
            // tags:
            //    private callback

            var gadgetInstance = this.getInstance();

            // Must be run before custom gadget load handlers, and it seems the execution order may differ from the bind order in IE9
            $("form.epi-gadgetform", gadgetInstance.element).validate({ errorElement: "span" });
            $("form.epi-gadgetform", gadgetInstance.element).bind("submit", gadgetInstance, this._submitHandler);

            // Raise the public loaded event for other custom handlers
            try {
                $(gadgetInstance.element).trigger("epigadgetloaded", gadgetInstance);
            } catch (err) {
                this.setErrorMessage(this.res.gadgetinitfailed, { details: err.message, errorThrown: true });
            }
        },

        _mergeRouteParameters: function (routeParameters) {
            // summary:
            //    Merge the route parameters.
            //
            // routeParams:
            //    An object with optional route parameters overriding the default route parameters.
            //    Example: {moduleArea: "CMS", controller: "MyGadget", action:"Show"}
            //    The URL for the configured default action is returned if no routeParameters are appended.
            //
            // tags:
            //    private
            return dojo.mixin({}, this.defaultRouteParams, routeParameters);
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
                        data: formData,
                        success: function (data) {
                            gadgetInstance.routeParams = {};
                            gadgetInstance.gadgetContent.set("content", data.toString());
                            $(gadgetInstance.element).trigger("_epigadgetloadedinternal");
                        }
                    });
                }
            }

            e.preventDefault();
        },

        loadView: function (/*Object*/routeParams) {
            // summary:
            //    Load the gadget view.
            //
            // routeParams:
            //    An object with optional route parameters overriding the default route parameters.
            //    Example: {moduleArea: "CMS", controller: "MyGadget", action:"Show"}
            //    The URL for the configured default action is returned if no routeParameters are appended.
            //
            // tags:
            //   public
            this.isVisible = true;
            var gadgetInstance = this.getInstance();
            if (routeParams) {
                gadgetInstance.routeParams = routeParams;
            } else {
                gadgetInstance.routeParams = this.defaultRouteParams;
            }

            // this was previously epigadgetloadview handler
            var url = gadgetInstance.getActionPath(gadgetInstance.routeParams);

            this.gadgetContent.set("href", url);
        },

        getIsVisible: function () {
            // summary:
            //    Gets the gadget visibility state.
            //
            // tags:
            //    public
            //
            // returns:
            //    Returns true if the gadget is visible, otherwise false.
            return this.isVisible; //Boolean
        },

        setErrorMessage: function (/*String*/message, /*Object*/options) {
            // summary:
            //    Display an error message in the gadget content area.
            //
            // message:
            //    The message to display
            //
            // options:
            //    Options object for the error, available options:
            //    * details: Detailed text displayed when showing detailed error message
            //    * status: A status value
            //    * errorThrown: Whether this error was the result of an unhandled exception
            //    Default values for options object: { details: "", status: 0, errorThrown: false }
            //
            // tags:
            //    public
            options = dojo.mixin({ details: "", status: 0, errorThrown: false }, options);
            var feedbackElement = dojo.query(".epi-gadgetError", this.gadgetContainer);

            if (feedbackElement.length === 0) {
                // No div with with class = .epi-gadgetError exists in the gadget, so we create and add one.
                feedbackElement = dojo.create("div", { "class": "epi-feedbackContent-error epi-feedbackContent epi-gadgetError" }, this.gadgetContainer, "before");
            }

            Error.createErrorMessage(feedbackElement, message, options.details, options.status, true);

            dojo.style(feedbackElement, "display", "block");
        },

        clearErrorMessage: function () {
            // summary:
            //    Hide the error message.
            //
            // tags:
            //    public
            var feedbackElement = dojo.query(".epi-gadgetError", this.gadgetContainer);
            dojo.style(feedbackElement, "display", "none");
        },

        setFeedbackMessage: function (/*String*/message, /*Object*/options) {
            // summary:
            //    Display a feedback message in the gadget title bar.
            //
            // message:
            //     The message to display
            //
            // options:
            //    Options object with options for the feedback, available options:
            //    * ajaxLoader: Boolean whether to display ajax loader image
            //    * feedbackTitle: A text string that will be shown as tooltip to the loading image
            //    * feedbackHideDelay: Number of milliseconds before message is removed, 0 means show indefinitely
            //    * feedbackFadeOut: Boolean whether to fade rather than just hide the message after the delay
            //    Default values for options object:{ ajaxLoader: false, feedbackTitle: "", feedbackHideDelay: 0, feedbackFadeOut: false }
            //
            // tags:
            //    public

            // extend options with defaults
            options = dojo.mixin({ ajaxLoader: false, feedbackMessage: message, feedbackTitle: "", feedbackHideDelay: 0, feedbackFadeOut: false }, options);

            this.gadgetFeedback.innerHTML = options.feedbackMessage;
            dojo.style(this.gadgetFeedback, "display", "block");

            // ajax loader option
            if (options.ajaxLoader) {
                dojo.addClass(this.gadgetFeedback, "epi-gadgetLoader");
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

        clearFeedbackMessage: function (/*Object*/options) {
            // summary:
            //    Hide the ajax loader for a gadget.
            //
            // options:
            //    Options object with options for the feedback, available options:
            //    * feedbackFadeOut: Boolean whether to fade rather than just hide the message after the delay
            //    Default values for options object:{ feedbackFadeOut: false }
            //
            // tags:
            //    public
            dojo.removeClass(this.gadgetFeedback, "epi-gadgetLoader");

            if (options && options.feedbackFadeOut && dojo.style(this.gadgetFeedback, "display") === "block") {
                var fadeArgs = {
                    node: this.gadgetFeedback,
                    duration: 4000,
                    // when the fadeout is done, set gadgetFeedback to display:none and opacity to 1
                    onEnd: dojo.hitch(this, function () {
                        dojo.style(this.gadgetFeedback, "display", "none");
                        dojo.style(this.gadgetFeedback, "opacity", "1");
                    })
                };
                dojo.fadeOut(fadeArgs).play();
            } else {
                dojo.style(this.gadgetFeedback, "display", "none");
            }
        },

        triggerUnload: function () {
            // summary:
            //    Trigger the epigadgetunload event in the wrapper.
            //
            // tags:
            //    public
            $(this.getInstance().element).trigger("epigadgetunload", this.getInstance());
        },

        triggerVisibilityChanged: function (/*Boolean*/isVisible) {
            // summary:
            //    Trigger the epigadgetvisibilitychanged event in the wrapper.
            //
            // isVisible:
            //    Specifies the gadget's visibility state.
            //
            // tags:
            //    public
            this.isVisible = isVisible;
            $(this.getInstance().element).trigger("epigadgetvisibilitychanged", this.getInstance());
        },

        _gadgetInstance: function () {
            // summary:
            //    Convenience wrapper for a gadget instance.
            //
            // returns:
            //    The gadget instance.
            //
            // tags:
            //    private

            var gadget = this;

            var pub = {
                id: gadget.componentId,
                // The unique id of the gadget

                element: gadget.gadgetContainer,
                // The gadget container DOM element.

                gadgetContent: gadget.gadgetContent,

                routeParams: {} // this is updated by the widget's init method
                // The route params for the gadget.

            };

            pub.getActionPath = function (/*Object*/routeParams) {
                // summary:
                //    Gets the URL for a gadget action based on routeParameters
                //
                // routeParams:
                //    An object with optional route parameters overriding the default route parameters.
                //    Example: {moduleArea: "CMS", controller: "MyGadget", action:"Show"}
                //    The URL for the configured default action is returned if no routeParameters are appended.
                //
                // tags:
                //    public
                //
                // returns:
                //    The URL for a gadget action
                return gadget.getActionPath(routeParams); //String
            };

            pub.loadView = function (/*Object*/routeParams) {
                // summary:
                //    Loads a new view into the gadget
                //
                // routeParams:
                //    An object with optional route parameters overriding the default route parameters.
                //    Example: {action: "Show"}
                //    The URL for the configured default action is returned if no routeParameters are appended.
                //
                // tags:
                //    public
                gadget.loadView(routeParams);
            };

            pub.isVisible = function () {
                // summary:
                //    Gets the gadget visibility.
                //
                // tags:
                //    public
                //
                // returns:
                //    The gadget visibility
                return gadget.getIsVisible(); //Boolean
            };

            pub.setErrorMessage = function (/*String*/message, /*Object*/options) {
                // summary:
                //    Sets an error message in the gadget heading area.
                //
                // message:
                //    The message to display.
                //
                // options:
                //    Feedback options.
                //
                // tags:
                //    public
                gadget.setErrorMessage(message, options);
            };

            pub.clearErrorMessage = function () {
                // summary:
                //    Hides the error message panel
                //
                // tags:
                //    public
                gadget.clearErrorMessage();
            };

            pub.setFeedbackMessage = function (/*String*/message, /*Object*/options) {
                // summary:
                //    Sets a feedback message in the gadget title area.
                //
                // message:
                //    The message to display.
                //
                // options:
                //    Feedback options.
                //
                // tags:
                //    public
                gadget.setFeedbackMessage(message, options);
            };

            pub.clearFeedbackMessage = function () {
                // summary:
                //    Hides the feedback message
                //
                // tags:
                //    public
                gadget.clearFeedbackMessage();
            };

            pub.raiseErrorEvent = function (/*Object*/errorParameters) {
                // summary:
                //    Raise a error
                //
                // errorParameters:
                //    Options object for the error, available options:
                //     * details: Detailed text displayed when showing detailed error message
                //     * status: A status value
                //     * errorThrown: Whether this error was the result of an unhandled exception
                //     Default values for options object: { details: "", status: 0, errorThrown: false }
                //
                // tags:
                //    public
                this.error = errorParameters;
                $(this.element).trigger("epigadgeterror", this);
                this.error = null;
            };

            pub.ajax = function (/*Object*/ajaxOptions) {
                // summary:
                //    Sends an AJAX request using jQuery AJAX functionalityserverSets an error message in the gadget heading area.
                //
                // ajaxOptions:
                //    A jQuery AJAX parameter object overriding default options.
                //
                // tags:
                //    public

                // Merge any custom properties into the default ones

                // Don't even try converting this to dojo methods until there are unit tests validating the post data conversion

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
                        self.setErrorMessage("<strong>" + gadget.res.internalservererror + " [" + xmlHttpRequest.status + "]</strong>.", { details: xmlHttpRequest.responseText, status: status, errorThrown: errorThrown });
                    },
                    success: function (data) {
                        self.clearFeedbackMessage();
                    }
                };

                // Add antiforgery protection data to the request data
                var antiforgeryToken = $("input[name=__RequestVerificationToken]", this.element);
                if (antiforgeryToken.length > 0) {
                    var validationData = { __RequestVerificationToken: antiforgeryToken.val() };
                    if (ajaxOptions.data) {
                        if (!ajaxOptions.data.__RequestVerificationToken) {
                            ajaxOptions.data = $.extend(ajaxOptions.data, validationData);
                        }
                    } else {
                        ajaxOptions.data = validationData;
                    }
                }

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

            return pub; //gadget instance
        }
    });
});
