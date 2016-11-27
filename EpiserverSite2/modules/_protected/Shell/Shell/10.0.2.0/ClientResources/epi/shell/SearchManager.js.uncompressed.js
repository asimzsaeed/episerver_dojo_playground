define("epi/shell/SearchManager", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/Deferred",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/DeferredList",
// epi
    "epi/dependency"
],
function (
// dojo
    declare,
    Deferred,
    array,
    lang,
    DeferredList,
// epi
    dependency
) {
    return declare(null, {
        // summary:
        //      Search component that provides search provider stores and search results store
        //      to make searching by conditions and take searching results.
        // tags:
        //      public

        // _providersStore: [epi.shell.searchproviders] object
        _providersStore: null,
        // _resultsStore: [epi.shell.searchresults] object
        _resultsStore: null,

        constructor: function () {
            // summary:
            //      Setup search provider stores and search results store.
            // tags:
            //      public

            this._setupStores();
        },

        getProviderQuery: function (/*string*/area) {
            // summary:
            //      Return provider query parameter(s) that used as input parameter(s) for search results store.
            // area: string
            //      The area of the search provider(s).
            //      E.g: "cms/blocks" area, will return all search provider(s) that have area is "cms/blocks".
            //          Will return all search providers if passed blank area.
            // return:
            //      Deferred object that holds provider query parameters JSON object.
            // tags:
            //      public

            var deferred = new Deferred();

            Deferred.when(this.getProviders(area), lang.hitch(this, function (providers) {
                if (providers && providers.length > 0) {
                    deferred.resolve(this._getQuery(providers[0], {}));
                } else {
                    deferred.resolve();
                }
            }));

            return deferred;
        },

        getProviders: function (/*string*/area) {
            // summary:
            //      Return all search provider in the given area.
            //      If passed blank value will return all providers.
            // area: string
            //      The area that search provider(s) belong to.
            // return:
            //      Deferred object that holds an array of search provider objects.
            // tags:
            //      public

            var deferred = new Deferred();

            Deferred.when(this._providersStore.query({ searchArea: area }), function (providers) {
                if (providers && providers.length > 0) {
                    deferred.resolve(providers);
                } else {
                    deferred.resolve();
                }
            });

            return deferred;
        },

        getStore: function () {
            // summary:
            //      Return search results store object.
            // tags:
            //      public

            return this._resultsStore;
        },

        search: function (/*string*/area, /*object*/queryParams) {
            // summary:
            //      Get all results from search results by passing search provider area and query parameter(s).
            // area: string
            //      The area that search provider(s) belong to.
            // queryParams: JSON object
            //      Query that used to search.
            // return:
            //      Deferred object that contains an array of search result data items.
            // tags:
            //      public

            var deferred = new Deferred();

            // Get all search provider stores from search providers store
            Deferred.when(this.getProviders(area), lang.hitch(this, function (providers) {
                if (providers && providers.length > 0) {
                    var deferredArray = [];

                    // Query each search provider store to get its results
                    array.forEach(providers, function (provider, index) {
                        deferredArray.push(this._getData(provider, queryParams));
                    }, this);

                    var deferredList = new DeferredList(deferredArray),
                        data = [];

                    // Put all data together
                    deferredList.then(function (items) {
                        array.forEach(items, function (item) {
                            if (lang.isArray(item[1])) {
                                data = data.concat(item[1]);
                            }
                        });
                        deferred.resolve(data);
                    });
                }
            }));

            return deferred;
        },

        _setupStores: function () {
            // summary:
            //      Get search providers store and search results store from registry.
            // tags:
            //      private

            var registry = dependency.resolve("epi.storeregistry");
            this._providersStore = registry.get("epi.shell.searchproviders");
            this._resultsStore = registry.get("epi.shell.searchresults");
        },

        _getQuery: function (/*object*/provider, /*object*/queryParams) {
            // summary:
            //      Build search query.
            // provider: object
            //      Search provider store object.
            // queryParams: JSON object
            //      Query that used to search.
            // return:
            //      Query JSON object.
            // tags:
            //      private

            var query = { providerId: provider.id };

            lang.mixin(query, queryParams || {});

            return query;
        },

        _getData: function (/*object*/provider, /*object*/queryParams) {
            // summary:
            //      Get search results from search results store by the given search provider and query.
            // provider: object
            //      Search provider store object.
            // queryParams: JSON object
            //      Query that used to search.
            // return:
            //      Deferred object that contains an array of search result items.
            // tags:
            //      private

            var deferred = new Deferred();

            // Query by search results store
            Deferred.when(this._resultsStore.query(this._getQuery(provider, queryParams)), function (items) {
                if (items && items.length > 0) {
                    deferred.resolve(items);
                } else {
                    deferred.resolve();
                }
            });

            return deferred;
        }
    });
});
