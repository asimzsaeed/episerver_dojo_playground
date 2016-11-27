define("epi-cms/Profile", [
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/when",
    "epi/dependency",
    "epi/shell/Profile",

    "epi-cms/ApplicationSettings"
], function (lang, Deferred, when, dependency, Profile, ApplicationSettings) {

    var safeHostName = function (host) {
        return "editlanguage_" + host.replace(":", "");
    };

    lang.extend(Profile, {
            // tags:
            //      internal

        getContentLanguage: function (host) {
            // summary:
            //      Get the content language for the host
            // host: String?
            //      The host to get the content language for, defaults to window.location.host if not defined
            host = host || window.location.host;

            return when(this.get(safeHostName(host)), function (currentLanguage) {

                //If the user hasn't selected any preferred language yet use the current content language configured in the application settings
                return currentLanguage || ApplicationSettings.currentContentLanguage;
            });
        },
        setContentLanguage: function (languageId, host) {
            // summary:
            //      Set the language for a specific host (stored on the server)
            //
            // languageId: String
            //      The id of the language to set
            // host: String
            //      The host for which the language should be set
            return this.set(safeHostName(host), languageId, {location: "server"});
        }
    });

    return Profile;
});
