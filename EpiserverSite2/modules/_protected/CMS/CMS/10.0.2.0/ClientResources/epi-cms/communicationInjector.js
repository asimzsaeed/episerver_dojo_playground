(function (scope, global) {
    // summary:
    //      Handles integration between site content in preview and the edit UI.
    // tags:
    //      private

    /* global self: true */

    "use strict";

    var keyPrefix = "epi::",
        messageHandlers = {},
        eventHandles = [];

    function on(target, eventType, listener, capture) {
        // summary:
        //      Simple event handler registration. Returns a handle with a remove method.
        // target: Object
        //      the object to listen for events on. Must implement addEventListener.
        // eventType: String
        //      The message payload to send to the the topic listeners
        // listener: function
        //      The function to execute when the event is triggered

        var resolvedCapture = !!capture;

        target.addEventListener(eventType, listener, resolvedCapture);

        return {
            remove: function () {
                target.removeEventListener(eventType, listener, resolvedCapture);
                target = eventType = listener = capture = null;
            }
        };
    }

    function publish(topic, message) {
        // summary:
        //      Publishes a message using the postMessage hub.
        // topic: String
        //      The name of the topic to publish to
        // message: Object
        //      The message payload to send to the the topic listeners

        global.postMessage({ id: topic, message: message }, "*");
    }

    function subscribe(topic, handler) {
        // summary:
        //      Subscribes to a message on the postMessage hub.
        // topic: String
        //      The topic to subscribe to
        // handler: Function
        //      A function to call when a message is published to the given topic

        var key = keyPrefix + topic;

        messageHandlers[key] ? messageHandlers[key].push(handler) : messageHandlers[key] = [handler];

        return {
            remove: function () {
                var i, topicHandlers = messageHandlers[key];

                if (topicHandlers) {
                    while ((i = topicHandlers.indexOf(handler)) !== -1) {
                        topicHandlers.splice(i, 1);
                    }
                }
                topic = handler = key = null;
            }
        };
    }

    function ready(fn) {
        // summary:
        //      Executes the provided function when the dom is ready.
        // fn: function
        //      The callback to execute when the dom is ready.

        var loadHandle;

        if (!fn) {
            return;
        }


        function load() {
            loadHandle.remove();
            fn();
            loadHandle = fn = null;
        }


        if (scope.document.readyState === "complete") {
            fn();
        } else {
            loadHandle = on(scope.document, "DOMContentLoaded", load);
        }
    }

    function destroy() {
        eventHandles.forEach(function (handle) {
            handle.remove();
        });

        delete scope.epi.publish;
        delete scope.epi.subscribe;

        scope = global = messageHandlers = eventHandles = null;
    }

    function initSizeListener() {

        var size,
            name = scope.name,
            publishTopic = "/site/resize" + (name ? "/" + name : "");

        function getElement() {

            var doc = scope.document,
                elm = doc.getElementById("epi-bodysize");

            if (elm) {
                if (doc.body.lastChild === elm) {
                    return elm;
                }
                elm.parentNode.removeChild(elm);
                elm = null;
            }

            doc.body.insertAdjacentHTML("beforeend", "<div id='epi-bodysize' style='position: absolute; padding: 0; margin: 0;height: 0; width: 100%;'></div>");
            return doc.getElementById("epi-bodysize");
        }

        function sizeChecker() {
            var elm = getElement(),
                w = elm.offsetWidth,
                h = elm.offsetTop;

            if (!size || size.w !== w || size.h !== h) {
                size = {h: h, w: w };
                publish(publishTopic, size);
            }
        }

        eventHandles.push(subscribe("/site/checksize", sizeChecker));
    }

    function initMessageHandler() {

        function handleMessage(msg) {
            var handlers,
                msgData = msg.data;

            if (msgData && msgData.id) {
                handlers = messageHandlers[keyPrefix + msgData.id];

                handlers && handlers.forEach(function (handler) {
                    try {
                        handler(msgData.data);
                    } catch (ex) { // eslint-disable-line no-empty
                    }
                });

                msgData = null;
            }
        }

        eventHandles.push(on(scope, "message", handleMessage));
    }

    function exposeMethods() {

        var exports = scope.epi = (scope.epi || {});

        exports.publish = publish;
        exports.subscribe = subscribe;
    }

    ready(function () {

        var message = { url: scope.location.href };

        initMessageHandler();
        initSizeListener();
        exposeMethods();

        eventHandles.push(on(scope, "unload", function () {
            publish("/site/unload", message);
            destroy();
            message = null;
        }));

        publish("/site/load", message);

    });

})(self, top);
