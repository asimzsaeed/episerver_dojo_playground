define("epi-cms/contentediting/ContentModelServerSync", [
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/Deferred",
    "dojo/when",
    "dojo/_base/json",
    "dojo/_base/lang",
    "dojo/Stateful",

    "epi/datetime",
    "epi/string"
],

function (
    array,
    declare,
    Deferred,
    when,
    json,
    lang,
    Stateful,

    epiDateTime,
    epiString) {

    return declare([Stateful], {
        // tags:
        //    internal

        // _queue: [private] Array
        //      The queue of updates to send
        _queue: null,

        // _isSynchronizing: [private] Boolean
        //      Set to true while we're synchronizing
        _isSynchronizing: false,

        // hasPendingChanges: Boolean
        hasPendingChanges: false,

        // contentLink: String
        //      Reference to the content this sync service instance is saving changes to
        contentLink: null,

        // contentDataStore: RestStore
        //      Reference to the content data store
        contentDataStore: null,

        // processInterval: Number
        //      How often (in milliseconds) should we check the queue to see if there's any items to be synced
        processInterval: 200,

        // _processIntervalId: [private] Number
        //      Id of the interval to check queue, will only be set when save() has been called
        _processIntervalId: 0,

        _saveDeferred: null,

        constructor: function (params) {
            // summary:
            //      init array
            // tags:
            //      private

            declare.safeMixin(this, params);

            // init queue
            this._queue = [];
        },

        scheduleForSync: function (/*String*/propertyName, /*String|Object*/value) {
            // summary:
            //      Put property update in queue
            // propertyName:
            //      Name of the property
            // value:
            //      The value of the property
            // tags:
            //      public

            if (value === undefined) {
                return;
            }

            this.set("hasPendingChanges", true);
            value = epiDateTime.transformDate(value);

            var index = this._propertyIndexInQueue(propertyName);

            if (index < 0) {
                // add item to queue
                this._queue.push({
                    name: propertyName,
                    value: value
                });
            } else {
                // update item value
                this._queue[index].value = value;
            }
        },

        saveAndPublishProperty: function (propertyName, value) {
            // summary:
            //      Sync a property value to the published version of the current content. The change is also synced to the current version.
            // propertyName: String
            //      The property name.
            // value:
            //      The updated value.

            this.scheduleForSync(propertyName, value);
            return this._startSynchronizeInterval({ delay: 0,  publish: true });
        },

        _propertyIndexInQueue: function (/*String*/propertyName) {

            var index = -1;

            // find item in queue
            array.some(this._queue, function (item, i) {
                if (item.name === propertyName) {
                    index = i;
                    return true;
                }
            });

            return index;
        },

        save: function () {
            // summary:
            //      Save updates to server
            // tags:
            //      public

            return this._startSynchronizeInterval();
        },

        _startSynchronizeInterval: function (settings) {

            var delay;

            if (!this._saveDeferred) {
                this._saveDeferred = new Deferred();
                delay = settings && settings.delay || this.processInterval;
                setTimeout(this._synchronizeItem.bind(this, settings), delay);
            }

            return this._saveDeferred.promise;
        },

        _synchronizeItem: function (settings) {
            // summary:
            //      Save updates to server
            // tags:
            //      private

            var items = this._queue,
                syncContentLink = this.contentLink,
                saveDeferred = this._saveDeferred;

            // Reset the queue and promise
            this._queue = [];
            this._saveDeferred = null;

            // Set hasPendingChanges to false since we have emptied the queue.
            this.set("hasPendingChanges", false);

            // Success callback
            var onSuccess = function (result) {

                var defResult = {},
                    savedLink;

                if (result) {
                    //Convert the propery names to camel case
                    array.forEach(result.properties, lang.hitch(this, function (property) {
                        property.name = epiString.pascalToCamel(property.name);
                    }));

                    savedLink = result.savedContentLink;

                    //Create def result object
                    defResult = lang.mixin({
                        successful: false,
                        contentLink: result.savedContentLink,
                        hasContentLinkChanged: result.savedContentLink && savedLink !== this.contentLink
                    }, result);

                    if (savedLink && savedLink !== this.contentLink) {
                        // If the server saved to another version than we anticipated
                        defResult.oldContentLink = this.contentLink;
                        this.contentLink = savedLink;
                    }

                    saveDeferred.resolve(defResult);
                } else {
                    saveDeferred.reject({
                        contentLink: syncContentLink,
                        properties: items,
                        error: "Unexpected result returned from the server."
                    });
                }
            }.bind(this);

            // Failure callback
            var onError = function (error) {

                var defResult = {
                    contentLink: syncContentLink,
                    properties: items,
                    error: error
                };

                saveDeferred.reject(defResult);
            }.bind(this);

            if (items.length === 0) {
                saveDeferred.resolve();
                return;
            }

            when(this._saveProperties(items, settings))
                .then(onSuccess)
                .otherwise(onError);
        },

        pendingSync: function (propertyName) {
            // summary:
            //      Check if there is any pending synchronization for the property with propertyName
            //
            // propertyName: String
            //      The name of the property to check for
            //
            // returns:
            //      True if there are pending synchronizations, otherwise False
            // tags:
            //      public
            return this._propertyIndexInQueue(propertyName) !== -1;
        },

        _saveProperties: function (items, settings) {
            // summary:
            //    Validate property value with server.
            //
            // propertyName: String
            //    The updated property name.
            //
            // propertyValue: String
            //    The property value.
            //
            // timestamp: String
            //    The client timestamp.
            //
            // returns:
            //	  A deferred
            //
            // tags:
            //    public

            var contentLink = this.contentLink,
                properties = {},
                publish = !!settings && settings.publish;

            array.forEach(items, lang.hitch(this, function (item) {
                properties[item.name] = json.toJson(item.value);
            }));

            var patchData = {
                id: contentLink,
                properties: properties,
                publishChanges: publish
            };

            return this.contentDataStore.patch(patchData, { id: patchData.id });
        }
    });
});
