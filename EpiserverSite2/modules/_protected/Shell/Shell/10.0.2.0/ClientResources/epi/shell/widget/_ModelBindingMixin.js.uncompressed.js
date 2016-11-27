define("epi/shell/widget/_ModelBindingMixin", [
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "epi/shell/DestroyableByKey"],

function (array, declare, lang, DestroyableByKey) {

    return declare([DestroyableByKey], {
        // summary:
        //      Add the capability to bind a widget to a view model object.
        //      By providing a binding map, the widget can observe the view model and update its properties accordingly.
        //      The purpose is to separate presentation logic from the widgets and make them testable. The widget properties
        //      can then be reflected in the dom by using dijit attribute mapping.
        //      The mixin will take care of
        //
        // description:
        //      Declare the binding map in widget declaration to enable property propagtation from model to widget. One property
        //      in the model can be propagated to many widget properties.
        //
        //      |   define([
        //      |       "dojo/dom-style",
        //      |       "dijit/_Widget",
        //      |       "dijit/_TemplatedMixin",
        //      |       "epi/shell/widget/_ModelBindingMixin"
        //      |   ],
        //      |
        //      |   function (domStyle, _Widget, _TemplatedMixin, _ModelBindingMixin) {
        //      |       return dojo.declare([_Widget, _TemplatedMixin, _ModelBindingMixin], {
        //      |
        //      |           templateString: '<div><div data-dojo-attach-point="statusTextNode"></div><div data-dojo-attach-point="statusTextNode2"></div></div>',
        //      |
        //      |           // Declare view model binding
        //      |           modelBindingMap: {
        //      |               "statusText": ["statusText", "statusText2"],
        //      |               "visible": ["visible"],
        //      |           },
        //      |
        //      |           _setModelAttr: function(newModel) {
        //      |               this.inherited(arguments);
        //      |
        //      |               // Own any additional model bindinds (i.e. on or connects) here if needed,
        //      |               // inherited call will release model handles, so we don't need to do at destroyByKey
        //      |               // this.ownByKey(this.model, handle1, handle2)
        //      |           },
        //      |
        //      |           _setStatusTextAttr: { node: "statusTextNode", type: "innerHTML" },
        //      |
        //      |           _setStatusText2Attr: { node: "statusTextNode2", type: "innerHTML" },
        //      |
        //      |           _setVisibleAttr: function (val) {
        //      |               domStyle.set(this.domNode, "visibility", val ? "visible" : "hidden");
        //      |           },
        //      |
        //      |           // The other stuffs come here
        //      |       });
        //      |   });
        //
        // tags:
        //    internal

        // model: dojo/Stateful
        //      The view model which is a stateful object.
        model: null,

        // modelBindingMap: Object
        //      The binding map. Each key in the map must be an observable property in the model and each item in the map
        //      is a list of widget properties
        modelBindingMap: null,

        constructor: function (options) {
        },

        postMixInProperties: function () {
            this.inherited(arguments);

            if (!this.modelBindingMap) {
                this.modelBindingMap = {};
            }
        },

        _setModelAttr: function (value) {
            // remove existing handles
            this.destroyByKey(this.model);

            this._set("model", value);

            this._setupModelBindings();
        },

        _setupModelBindings: function () {

            if (!this.model) {
                return;
            }

            var callback = lang.hitch(this, "_modelWatch");

            for (var modelProperty in this.modelBindingMap) {
                var widgetProperties = this.modelBindingMap[modelProperty];

                this.ownByKey(this.model, this.model.watch(modelProperty, callback));

                // copy intial values to widget
                array.forEach(widgetProperties, function (widgetProperty) {
                    this.set(widgetProperty, this.model.get(modelProperty));
                }, this);

            }
        },

        _modelWatch: function (modelProperty, oldValue, value) {

            var widgetProperties = this.modelBindingMap[modelProperty];

            array.forEach(widgetProperties, function (widgetProperty) {
                this.set(widgetProperty, value);
            }, this);
        }
    });
});
