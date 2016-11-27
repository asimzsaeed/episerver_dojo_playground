define("epi-cms/core/ContentReference", ["dojo/_base/declare", "epi/epi"], function (declare, epi) {

    var ContentReference = declare(null, {
        // summary:
        //    An object uniquely identifying a CMS content item.
        //
        // example:
        //  Create a content reference from an object with properties
        //  |   var contentReference = new epi.cms.core.ContentReference({ id:3, workId:4, providerName: ""});
        //
        // example:
        //  Create a content reference from its serialized string representation
        //  |   var contentReference = new epi.cms.core.ContentReference("3__providerName");
        //
        // tags:
        //      public

        // id: [public] Integer
        //    The id number of an item
        id: 0,

        // workId: [public] Integer
        //    The version id of an item.
        workId: 0,

        // providerName: [public] String
        //    A string that identifies a if an external provider serves the item.
        providerName: null,

        // isSelfReference: [public] Boolean
        //    Denotes if the reference is a self reference
        isSelfReference: false,

        constructor: function (value) {
            // summary:
            //    Creates a new content reference instance from the provided value
            //
            // value: Object|String|epi.cms.core.ContentReference
            //     Can be either an object in the format
            //
            //
            if (value) {
                this._parse(value);
            }
        },

        _parse: function (value) {
            // summary:
            //    Parses an object or a string describing a content reference int this object
            //
            // value: Object|String
            //    The value to parse as a content reference
            //
            // tags:
            //    public

            if (typeof value === "object") {
                // Assume it's an object serialized by the server or an instance of this class
                this.id = parseInt(value.ID || value.id || value.iD || value.Id || 0, 10);
                this.workId = parseInt(value.WorkID || value.workId || 0, 10);
                this.providerName = value.ProviderName || value.providerName || null;
            } else if (typeof value === "string") {
                if (value === "-") {
                    this.isSelfReference = true;
                    this.id = 0;
                    this.workId = -1;
                } else {
                    this.isSelfReference = false;
                    var v = String();
                    v.split("_");
                    var segments = value.split("_");
                    this.id = parseInt(segments[0], 10);
                    this.workId = parseInt(segments[1], 10) || 0;
                    this.providerName = segments[2] || "";
                }
            } else if (typeof value === "number") {
                this.id = value;
                this.workId = 0;
                this.providerName = "";
            }

            // validate data
            if (isNaN(this.id)) {
                throw new Error("The id parameter of a content reference must be an integer");
            }

            if (isNaN(this.workId) && !this.isSelfReference) {
                throw new Error("The workId of a content reference must be an integer");
            }
        },

        toString: function () {
            // summary:
            //    Returns a serialized version of this content reference in the format id[_workId][_providerName]
            //
            // tags:
            //    public

            if (this.isSelfReference) {
                return "-";
            }

            var contentReference = String(this.id);
            if (this.workId !== 0) {
                contentReference += "_" + this.workId;
            }
            if (this.providerName) {
                contentReference += (this.workId === 0 ? "__" : "_") + this.providerName;
            }
            return contentReference;
        },

        createVersionUnspecificReference: function () {
            // summary:
            //    Creates a content link that ignores the work id
            //
            // tags:
            //    public

            return new ContentReference({ id: this.id, providerName: this.providerName });
        }
    });

    ContentReference.isContentReference = function (value) {
        // summary:
        //      Tests whether the given value can be parsed as a content reference.
        // tags:
        //      public
        try {
            return !!(new ContentReference(value));
        } catch (error) {
            return false;
        }
    };

    ContentReference.toContentReference = function (obj) {
        if (obj instanceof ContentReference) {
            return obj;
        } else if (typeof obj === "string" || typeof obj === "number") {
            return new ContentReference(obj);
        }

        return ContentReference.emptyContentReference;
    };

    ContentReference.compareIgnoreVersion = function (object1, object2) {

        var c1 = ContentReference.toContentReference(object1);
        var c2 = ContentReference.toContentReference(object2);

        var pub1 = c1.createVersionUnspecificReference();
        var pub2 = c2.createVersionUnspecificReference();

        return epi.areEqual(pub1, pub2);
    };

    ContentReference.emptyContentReference = new ContentReference({ id: -1, workId: -1 });

    return ContentReference;
});
