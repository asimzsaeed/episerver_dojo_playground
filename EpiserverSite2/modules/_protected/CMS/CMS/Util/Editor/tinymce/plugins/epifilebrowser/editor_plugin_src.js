(function(tinymce, $) {

    tinymce.create('tinymce.plugins.epifilebrowser', {
        /**
        * Initializes of the file browser plug-in. Sets the file_browser_callback setting which enables the browse button in tinyMCE dialogs.
        *
        * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
        * @param {string} url Absolute URL to where the plugin is located.
        */
        init: function(editor, url) {
            editor.settings.file_browser_callback = null;
        },

        /**
        * Returns information about the plugin as a name/value array.
        *
        * @return {Object} Name/value array containing information about the plugin.
        */
        getInfo: function() {
            return {
                longname: 'File Browser Plug-In',
                author: 'EPiServer AB',
                authorurl: 'http://www.episerver.com',
                infourl: 'http://www.episerver.com',
                version: 1.0
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('epifilebrowser', tinymce.plugins.epifilebrowser);
}(tinymce, epiJQuery));