define("epi/patch/dijit/Dialog", [
    "dojo/_base/lang",
    "dijit/Dialog"], function (lang, Dialog) {
    lang.mixin(Dialog.prototype, {
        _onBlur: function () {
            //Rollbacked: http://bugs.dojotoolkit.org/ticket/16551 until dojo 1.8.4 has been released
        }
    });

    Dialog.prototype._onBlur.nom = "_onBlur";
});
