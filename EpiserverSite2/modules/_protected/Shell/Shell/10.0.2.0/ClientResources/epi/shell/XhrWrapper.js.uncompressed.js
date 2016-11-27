define("epi/shell/XhrWrapper", [
    "dojo/_base/array",
    "dojo/_base/connect",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/when",
    "epi",
    "epi/shell/request/xhr",
    "epi/shell/widget/dialog/Dialog",
    "epi/shell/widget/LoginForm"
], function (
    array,
    connect,
    declare,
    lang,
    Deferred,
    when,
    epi,
    xhr,
    Dialog,
    LoginForm
) {

    // Shared variables between all instances of this class
    var loginDeferred;

    var cls = declare(null, {
        // summary:
        //    Wrapper of xhr requests with support for XSRF validation and logout error handling
        //
        // tags:
        //    internal

        // xhrHandler: [public] Object
        //  The xhr implementation to use when requesting data. Defaults to dojo.xhr
        xhrHandler: null,

        _headerKeys: {
            // validation: [const private] String
            //    The name of the field in the request headers that contains the validation
            //    token. It needs to have the prefix "X-" according to the RFC specifications.
            //    See section 5 on http://www.ietf.org/rfc/rfc2047.txt
            validation: "X-EpiRestAntiForgeryToken",

            // loginScreen: [const private] String
            //    The name of the field in the request headers that indicates that the result
            //    is a login screen rather than the expected json data.
            loginScreen: "X-EPiLogOnScreen",
            postUrl: "X-EPiLogOnScreen-PostUrl",
            readOnlyMode: "X-EPiReadOnlyMode",
            readOnlyModeRedirectUrl: "X-EPiReadOnlyMode-RedirectUrl"
        },

        constructor: function (options) {
            // summary:
            //  Creates a new XhrWrapper instance
            //
            // options: Object
            //  Configuration options that will be mixed into the handler.

            declare.safeMixin(this, options);

            if (!this.xhrHandler) {
                // Default the xhr handler to the dojo one.
                this.xhrHandler = xhr;
            }

        },

        xhr: function (/*String*/method, /*dojo.__XhrArgs*/args, /*Boolean?*/hasBody) {
            //	summary:
            //		Sends an HTTP request with the given method.
            //	description:
            //		Sends an HTTP request with the given method.
            //		See also dojo.xhrGet(), xhrPost(), xhrPut() and dojo.xhrDelete() for shortcuts
            //		for those HTTP methods. There are also methods for "raw" PUT and POST methods
            //		via dojo.rawXhrPut() and dojo.rawXhrPost() respectively.
            //	method:
            //		HTTP method to be used, such as GET, POST, PUT, DELETE.  Should be uppercase.
            //  args:
            //      xhr arguments passed to dojo's native xhr API. This method optionally supports
            //      xsrfProtection which will resolve an xsrf token which is posted with the request.
            //	hasBody:
            //		If the request has an HTTP body, then pass true for hasBody.

            // Calling with apply since dojo.xhr checks arguments count
            var xhrArguments = arguments;

            args.headers = args.headers || {};

            if (args.xsrfProtection) {
                // Retrieve xsrf header and then do the work passing along validation token.
                var deferred = new Deferred();
                when(this._getXsrfHeader(args.url), lang.hitch(this, function (validationToken) {
                    // Got headers, now do the work
                    args.headers = lang.mixin({}, args.headers, validationToken);

                    when(this._xhr.apply(this, xhrArguments), deferred.resolve, deferred.reject);
                }), deferred.reject);
                return deferred;
            } else {
                // just do the work
                return this._xhr.apply(this, xhrArguments);
            }
        },
        xhrDelete: function (/*dojo.__XhrArgs*/args) {
            //	summary:
            //		Sends an HTTP DELETE request to the server.

            return this.xhr("DELETE", args);
        },
        xhrGet: function (/*dojo.__XhrArgs*/args) {
            //	summary:
            //		Sends an HTTP GET request to the server.

            return this.xhr("GET", args);
        },
        xhrPost: function (/*dojo.__XhrArgs*/args) {
            //	summary:
            //		Sends an HTTP POST request to the server. In addtion to the properties
            //		listed for the dojo.__XhrArgs type, the following property is allowed:
            //	postData:
            //		String. Send raw data in the body of the POST request.

            return this.xhr("POST", args, true);
        },
        xhrPut: function (/*dojo.__XhrArgs*/args) {
            //	summary:
            //		Sends an HTTP PUT request to the server. In addtion to the properties
            //		listed for the dojo.__XhrArgs type, the following property is allowed:
            //	putData:
            //		String. Send raw data in the body of the PUT request.

            return this.xhr("PUT", args, true);
        },

        _getXsrfHeader: function (target) {
            // summary:
            //    Resturns the XSRF header property if it's been set,
            //    otherwise a get request is made and a deferred is returned.
            //
            // returns:
            //    A object with the validation token or a deferred.
            //
            // tags:
            //   private

            if (cls.sharedXsrfHeader) {
                return cls.sharedXsrfHeader;
            }

            var params = {
                url: target,
                handleAs: "json",
                headers: {}
            };

            // Adding the XSRF header with and a special keyword tells the server not to execute the get but to return a token in the header instead.
            params.headers[this._headerKeys.validation] = "_CreateToken_";

            var deferred = new Deferred();

            this.xhrGet(params).then(lang.hitch(this, function () {
                deferred.resolve(cls.sharedXsrfHeader);
            }), deferred.reject);

            return deferred;
        },

        _xhr: function (/*String*/method, /*dojo.__XhrArgs*/args, /*Boolean?*/hasBody) {
            // summary:
            //    Wraps the xhr result to add handling for xsrf header update.
            //
            // returns:
            //    A deferred that is resolved to the xhr result data.
            //
            // tags:
            //   private

            var xhrArguments = arguments;

            // Modify arguments to match the dojo/request api
            var options = lang.delegate({
                method: method,
                data: args.content || args.postData
            }, args);

            var xhrResult = this.xhrHandler(options.url, options, true);

            var deferred = new Deferred();
            deferred.ioArgs = xhrResult.ioArgs;

            when(xhrResult, lang.hitch(this, function (data) {
                var xsrfData = xhrResult.ioArgs.xhr.getResponseHeader(this._headerKeys.validation);
                if (xsrfData) {
                    // Always set the xsrf header.
                    // If the user jumps between different sites (ports or virtual paths) on the same domain
                    // the cookie, and the corresponding header, will change.

                    if (!cls.sharedXsrfHeader) {
                        cls.sharedXsrfHeader = {};
                    }

                    cls.sharedXsrfHeader[this._headerKeys.validation] = xsrfData;
                }

                // The query method checks this
                deferred.ioArgs = xhrResult.ioArgs;
                deferred.resolve(data);

            }), lang.hitch(this, function (err) {
                // Error, is it caused by a logout?
                var loginScreen = xhrResult.ioArgs.xhr.getResponseHeader(this._headerKeys.loginScreen);
                if (loginScreen === "true" || xhrResult.ioArgs.xhr.status === 401) {
                    // The login screen was displayed, ask the user to and retry
                    var settings = {
                        postUrl: xhrResult.ioArgs.xhr.getResponseHeader(this._headerKeys.postUrl)
                    };

                    // reset xsrf header as the user's logged out, we need to get a new one
                    cls.sharedXsrfHeader = undefined;

                    var loginResult = this._showLogin(settings);
                    when(loginResult, lang.hitch(this, function () {
                        // Try the xhr request again after successful login
                        when(this.xhr.apply(this, xhrArguments), deferred.resolve, deferred.reject);
                    }), function () {
                        // User cancelled log in, pass the error back to the caller
                        deferred.reject(err);
                    });
                } else if (xhrResult.ioArgs.xhr.status === 503) {
                    // If the server returns a 503 (Service Unavailable)
                    // determine if the system is in read only mode, if so redirect to the provided read only url
                    // otherwise reject the promise
                    var readOnlyMode = xhrResult.ioArgs.xhr.getResponseHeader(this._headerKeys.readOnlyMode);
                    var readOnlyModeRedirectUrl = xhrResult.ioArgs.xhr.getResponseHeader(this._headerKeys.readOnlyModeRedirectUrl);
                    if (readOnlyMode && readOnlyModeRedirectUrl) {
                        this._redirect(readOnlyModeRedirectUrl);
                    } else {
                        deferred.reject(err);
                    }
                } else {
                    // Some unknown error, pass the error back to the caller
                    deferred.reject(err);
                }
            }));
            return deferred;
        },
        _redirect: function (url) {
            window.top.location = url;
        },

        _showLogin: function (settings) {
            //	summary:
            //		Displays a login dialog and interacts with the server to authenticate the user

            if (!loginDeferred) {
                loginDeferred = new Deferred();

                var form = new LoginForm();

                var dialog = new Dialog({
                    title: epi.resources.action.login,
                    confirmActionText: epi.resources.action.login,
                    content: form,
                    dialogClass: "",
                    _onAfterShow: function () {} // We wish to get focus on the input fields, not on the actions.
                });

                var connections = [];
                var cleanupAndNotify = function (wasSuccessful) {
                    // Hides the dialog, disconnects events, destroys the login widgets and notifies via the deferred object
                    array.forEach(connections, connect.disconnect);

                    form.destroyRecursive();
                    //destroyOnHide is set to true so this will destroy the dialog after hide.
                    dialog.hide();

                    if (wasSuccessful) {
                        loginDeferred.resolve();
                    } else {
                        loginDeferred.reject();
                    }
                    loginDeferred = null;
                };

                // validate user credentials by posting them to the server
                dialog.addValidator(lang.hitch(this, function () {
                    // User submitted login form
                    var validationDeferred = new Deferred();

                    var content = form.serializeForm();

                    var loginResult = this.xhr("POST", {
                        url: settings.postUrl,
                        content: content,
                        xsrfProtection: false,
                        handleAs: "json"
                    }, true);

                    when(loginResult, function (data) {
                        // User submitted the login form, was the login successful?
                        if (data.authenticationSuccessful) {
                            cleanupAndNotify(true);
                            validationDeferred.resolve();
                        } else {
                            form.authenticationFailed();
                            validationDeferred.reject();
                        }
                    }, function () {
                        // Unknown error logging in, break out and let the caller handle the original error
                        cleanupAndNotify(false);
                        validationDeferred.reject();
                    });
                    return validationDeferred;
                }));

                dialog.show();

                connections.push(connect.connect(dialog, "onCancel", function () {
                    // User cancelled
                    cleanupAndNotify(false);
                }));
            }
            return loginDeferred;
        }
    });

    // create a shared variable
    cls.sharedXsrfHeader = undefined;

    return cls;
});
