define(["dojo/_base/declare", "dojo/store/JsonRest"], function (declare, JsonRest) {
	var contentStore = new JsonRest({ target: "/api/VizobDrive/", idProperty: "contentLink" })

	return declare("Vizob.ContentStore", [], {
		getContentById: function (id) {
			console.info("vizob.ContentStore>>getContentById>>");
			return contentStore.get(id);
		}
	});
});