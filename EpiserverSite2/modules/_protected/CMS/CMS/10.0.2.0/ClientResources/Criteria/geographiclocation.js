dojo.require("epi-cms.ErrorDialog");
dojo.require('dojo.data.ItemFileReadStore');
dojo.require('dojo.store.DataStore');

(function () {
    return {
        createUI: function (namingContainer, container, settings, containerCallback) {
            var self = this;
            self.languageKeys =
                ['/shell/cms/visitorgroups/criteria/geographiclocation/continent',
                    '/shell/cms/visitorgroups/criteria/geographiclocation/country',
                    '/shell/cms/visitorgroups/criteria/geographiclocation/region',
                    '/shell/cms/visitorgroups/criteria/geographiclocation/mustselectcontinent'];

            // Fetch the translations from server, then we can generate the UI.
            this.getTranslation(function () {

                function loadContinents(settings, callback) {
                    dojo.xhrGet({
                        url: '../GeographicLocation/GetLocations',
                        handleAs: 'json',
                        error: epi.cms.ErrorDialog.showXmlHttpError,
                        load: function (jsonData) {
                            var store = new dojo.data.ItemFileReadStore({ data: jsonData });
                            continentSelection.store = dojo.store.DataStore({ store: store });
                            if (settings) {
                                if (settings.Continent) {
                                    continentSelection.set('value', settings.Continent);
                                }
                                loadCountries(settings, callback);
                            } else {
                                if (callback) {
                                    callback();
                                }
                            }
                        }
                    });
                }

                function loadCountries(settings, callback) {
                    if (!settings) {
                        if (callback) {
                            callback();
                        }
                        return;
                    }

                    dojo.xhrGet({
                        url: '../GeographicLocation/GetLocations?continentCode=' + settings.Continent,
                        handleAs: 'json',
                        error: epi.cms.ErrorDialog.showXmlHttpError,
                        load: function (jsonData) {
                            var store = new dojo.data.ItemFileReadStore({ data: jsonData });
                            countrySelection.store = dojo.store.DataStore({ store: store });
                            countrySelection.set('disabled', false);
                            if (settings.Country) {
                                countrySelection.set('value', settings.Country);
                            } else {
                                countrySelection.set('value', '*');
                            }
                            loadRegions(settings, callback);
                        }
                    });
                }

                function loadRegions(settings, callback) {
                    if (!settings || !settings.Country) {
                        if (callback) {
                            callback();
                        }
                        return;
                    }

                    dojo.xhrGet({
                        url: '../GeographicLocation/GetLocations?countryCode=' + settings.Country,
                        handleAs: 'json',
                        error: epi.cms.ErrorDialog.showXmlHttpError,
                        load: function (jsonData) {
                            var store = new dojo.data.ItemFileReadStore({ data: jsonData });
                            regionSelection.store = dojo.store.DataStore({ store: store });
                            regionSelection.set('disabled', false);
                            if (settings.Region) {
                                regionSelection.set('value', settings.Region);
                            } else {
                                regionSelection.set('value', '*');
                            }
                            if (callback) {
                                callback();
                            }
                        }
                    });
                }


                var loadingComplete = false;
                var element, span;
                span = dojo.create("div", { 'class': 'epi-criteria-grouping' });
                element = dojo.create("label", { 'class': 'epi-criteria-label', 'for': namingContainer + 'continentSelect', innerHTML: self.translatedText['/shell/cms/visitorgroups/criteria/geographiclocation/continent'] + ': ' });
                dojo.place(element, span);
                element = dojo.create("div");
                element.id = namingContainer + 'continentSelect';
                dojo.place(element, span);
                dojo.place(span, container);

                span = dojo.create("div", { 'class': 'epi-criteria-grouping' });
                element = dojo.create("label", { 'class': 'epi-criteria-label', 'for': namingContainer + 'countrySelect', innerHTML: self.translatedText['/shell/cms/visitorgroups/criteria/geographiclocation/country'] + ': ' });
                dojo.place(element, span);
                element = dojo.create("div");
                element.id = namingContainer + 'countrySelect';
                dojo.place(element, span);
                dojo.place(span, container);

                span = dojo.create("div", { 'class': 'epi-criteria-grouping' });
                element = dojo.create("label", { 'class': 'epi-criteria-label', 'for': namingContainer + 'regionSelect', innerHTML: self.translatedText['/shell/cms/visitorgroups/criteria/geographiclocation/region'] + ': ' });
                dojo.place(element, span);
                element = dojo.create("div");
                element.id = namingContainer + 'regionSelect';
                dojo.place(element, span);
                dojo.place(span, container);


                dojo.require('dijit.form.FilteringSelect');
                var continentSelection = new dijit.form.FilteringSelect(
                    {
                        id: namingContainer + 'continentSelect',
                        name: namingContainer + "continent",
                        searchAttr: 'Key',
                        required: true,
                        missingMessage: self.translatedText['/shell/cms/visitorgroups/criteria/geographiclocation/mustselectcontinent'],
                        onChange: function (item) {
                            if (!loadingComplete || !continentSelection.isValid())
                                return;
                            loadCountries({ Continent: item });
                        },
                        selectOnClick: true
                    }, namingContainer + 'continentSelect');


                var countrySelection = new dijit.form.FilteringSelect(
                    {
                        id: namingContainer + 'countrySelect',
                        name: namingContainer + "country",
                        searchAttr: 'Key',
                        disabled: true,
                        onChange: function (item) {
                            if (!loadingComplete)
                                return;
                            loadRegions({ Country: item });
                        },
                        selectOnClick: true
                    }, namingContainer + 'countrySelect');

                var regionSelection = new dijit.form.FilteringSelect(
                    {
                        id: namingContainer + 'regionSelect',
                        name: namingContainer + "region",
                        searchAttr: 'Key',
                        disabled: true,
                        onChange: function (item) {
                        },
                        selectOnClick: true
                    }, namingContainer + 'regionSelect');

                // Load initial values and use selections from settings, and set loadingComplete to true after everything's complete.
                loadContinents(settings, function () {
                    loadingComplete = true;
                    containerCallback(namingContainer, container);
                });
            });

        },

        getSettings: function (namingContainer) {
            return {
                Continent: dijit.byId(namingContainer + 'continentSelect').get('value'),
                Country: dijit.byId(namingContainer + 'countrySelect').get('value'),
                Region: dijit.byId(namingContainer + 'regionSelect').get('value')
            };
        }
    };
})();
