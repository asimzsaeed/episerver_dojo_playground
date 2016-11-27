define("epi-cms/contentediting/LanguageNotification", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/_base/url",
    "dojo/Stateful",

    "dojo/dom-construct",

// epi
    "epi/dependency",
// epi CMS
    "epi-cms/ApplicationSettings",
    "epi-cms/contentediting/command/Editing",

    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.languagenotification"
],

function (
// dojo
    declare,
    lang,
    array,
    Url,
    Stateful,

    domConstruct,

// epi
    dependency,

// epi CMS
    ApplicationSettings,
    EditingCommands,

    resources
) {

    return declare([Stateful], {
        // summary:
        //      Language notification
        // description:
        //      Show notification for language on a related page
        // tags:
        //      internal

        _valueSetter: function (data) {
            // summary:
            //      Updates the notification when the property changes.
            // tags:
            //      private

            var context = data.context;

            if (!context.languageContext) {
                this.set("notification", null);
                return;
            }

            var store = dependency.resolve("epi.storeregistry").get("epi.cms.language");

            store.query().then(lang.hitch(this, function (languages) {
                var languageResource = {};
                array.forEach(languages, function (language) {
                    languageResource[language.languageId] = language.name;
                }, this);

                var content = context.languageContext.warning;
                var currentContentLanguage = ApplicationSettings.currentContentLanguage;
                var languageContext = context.languageContext;

                var switchToLanguage;
                if (currentContentLanguage !== languageContext.preferredLanguage && languageContext.isTranslationNeeded) {
                    content = lang.replace(resources.nottranslatedswitchto, [languageResource[languageContext.language], languageResource[languageContext.preferredLanguage]]);
                    switchToLanguage = languageContext.preferredLanguage;
                } else if (currentContentLanguage !== languageContext.language && !languageContext.isTranslationNeeded) {
                    content = lang.replace(resources.workinginwrongsite, [languageResource[currentContentLanguage], languageResource[languageContext.language]]);
                    switchToLanguage = languageContext.language;
                }

                if (!content) {
                    //clear old language notification
                    this.set("notification", null);

                    return;
                }

                var html = domConstruct.create("div", {innerHTML: content});

                if (switchToLanguage) {
                    var url = new Url(window.top.location.href);
                    var text = lang.replace(resources.switchto, [languageResource[switchToLanguage]]);

                    domConstruct.create("a", {
                        href: [url.scheme, "://", url.authority, url.path, "?language=", switchToLanguage, "#context=", context.versionAgnosticUri].join(""),
                        innerHTML: text,
                        title: text}, html);
                }

                this.set("notification", {
                    content: html,
                    //If the the content requires a translation and the current content language is the same as the requested language we can show the command
                    commands: languageContext.isTranslationNeeded && currentContentLanguage === languageContext.preferredLanguage ? [EditingCommands.translate] : []
                });

            }));
        }
    });

});
