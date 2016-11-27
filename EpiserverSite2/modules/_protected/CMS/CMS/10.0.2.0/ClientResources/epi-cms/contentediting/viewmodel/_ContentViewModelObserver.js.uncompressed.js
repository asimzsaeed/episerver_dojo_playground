define("epi-cms/contentediting/viewmodel/_ContentViewModelObserver", [
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/Stateful",
    "epi/shell/_StatefulGetterSetterMixin"
],

function (
    declare,
    array,
    lang,
    Stateful,
    _StatefulGetterSetterMixin) {

    return declare([Stateful, _StatefulGetterSetterMixin], {
        // tags:
        //      internal

        // dataModel: [public] epi.cms.contentediting.ContentViewModel
        dataModel: null,

        _watchers: null,

        destroy: function () {
            this._unbindDataModel();
            this.inherited(arguments);
        },

        _bindDataModel: function () {
            this._watchers.push(this.dataModel.watch("status", lang.hitch(this, this.onDataModelChange)));
            this._watchers.push(this.dataModel.watch("contentData", lang.hitch(this, this.onDataModelChange)));
        },

        _unbindDataModel: function () {
            array.forEach(this._watchers, function (w) {
                w.unwatch();
            });
            this._watchers = [];
        },

        _setDataModelAttr: function (value) {
            this._unbindDataModel();
            this._set("dataModel", value);
            this.onDataModelChange();
            this._bindDataModel();
        },

        onDataModelChange: function (name, oldValue, value) {
            // when data model changes, update view model properties accordingly.
        }

    });
});
