define("vizob-epi-cms/study/StudyViewSetting", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",

    "dijit/Destroyable",
    // Parent class
    "epi-cms/contentediting/_ViewSetting"
], function (
    declare,
    lang,
    Deferred,
    Destroyable,
    // Parent class
    _ViewSetting
) {

	return declare([Destroyable, _ViewSetting], {
		key: "drive",
		usedForRendering: true,
		isTagItem: false,

		constructor: function (contextService) {
			// Register a request interceptor so we can add the correct params on the request when the view setting is enabled
			this.own(contextService.registerRequestInterceptor(lang.hitch(this, this._onContextChange)));
		},

		beforePreviewLoad: function (previewParams, enabled) {
			// Determines whether to add the projects parameter to the preview before loading the preview.     
			this.inherited(arguments);

			if (enabled && this.value) {
				previewParams.epidrive = this.value;
			} else {
				delete previewParams.epidrive;
			}
		},

		_onContextChange: function (contextParams, callerData) {
			var dfd = new Deferred();

			if (this.get("enabled") && this.value) {
				//Add drive  to the context params for the content api to deliver the correct values
				contextParams.epidrive = this.value;
				contextParams.epieditmode = true;
			}

			dfd.resolve();
			return dfd.promise;
		}
	});
});
