define("epi-cms/core/PermanentLinkHelper", [
// dojo
    "dojo/_base/declare",
    "dojo/Deferred",
    "dojo/_base/lang",

    "dojo/when",

// epi
    "epi/dependency"
],

function (
// dojo
    declare,
    Deferred,
    lang,

    when,

// epi
    dependency
) {

    return {
        // summary:
        //      Get the content from a permanent link
        // tags:
        //      public

        getContent: function (/*String*/link, /*Object*/options) {
            // summary:
            //      Get linked content data with the permanent link
            // tags:
            //      public

            if (!link) {
                return null;
            }

            var registry = dependency.resolve("epi.storeregistry"),
                store = registry.get("epi.cms.content.light"),
                query = lang.mixin({
                    query: "getcontentbypermanentlink",
                    permanentLink: link
                }, options || {});

            return when(store.query(query)).then(lang.hitch(this, function (contents) {
                return contents && contents instanceof Array ? contents[0] : contents;
            }));
        }
    };
});
