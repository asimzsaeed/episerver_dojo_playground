require({cache:{
'url:epi-cms/notification/templates/card.html':"<div class=\"epi-event\">\n    ${contentIcon}${menu}<span class=\"dijitInline epi-floatRight epi-lozenge ${languageBranchClass}\">${languageBranch}</span><h3 class=\"epi-event__title dojoxEllipsis\">${title}</h3>\n    <div class=\"epi-event__message\">${message}</div>\n    <div class=\"epi-event__timestamp\">${postedAt}</div>\n</div>\n"}});
﻿
define("epi-cms/notification/notificationFormatter", [
// dojo
    "dojo/dom-class",
    "dojo/string",

//dojox
    "dojox/html/entities",

// epi
    "epi/shell/TypeDescriptorManager",
    "epi-cms/dgrid/formatters",
    "epi/shell/dgrid/util/misc",

// template
    "dojo/text!./templates/card.html",

// resources
    "epi/i18n!epi/nls/episerver.shared"

], function (
// dojo
    domClass,
    string,

// dojox
    entities,

// epi
    TypeDescriptorManager,
    formatters,
    misc,

// Template
    template,

// resources
    sharedResources
) {

    var module;

    function cardFormatter() {
        // summary:
        //      Renders html for a card view of a User Notification list item.
        // tags:
        //      public

        function languageSelector(item) {
            //if the item is not ILocalizable it will not have a specific content language
            if (!item.contentLanguage) {
                return "";
            }
            // If the current content language differs from the contentLanguage for the list item
            // return the content language for the list item
            return item.contentLanguage !== module.contentLanguage ? item.contentLanguage : "";
        }

        function titleSelector(object) {

            if (object.subject) {
                return entities.encode(object.subject);
            }

            return "";
        }

        function iconSelector(iconKey) {
            // when message is posted on an IContent then the iconKey must be typeIdentifier
            if (iconKey && iconKey !== "projectIcon") {
                var iconNodeClass = TypeDescriptorManager.getValue(iconKey, "iconClass");

                if (iconNodeClass) {
                    return misc.icon(iconNodeClass + " epi-objectIcon");
                } else {
                    return "";
                }
            } else if (iconKey === "projectIcon") { // message is posted on Project feed
                return misc.icon("epi-iconObjectProject epi-objectIcon");
            }

            // no icon if there is no iconKey
            return "";
        }

        return function formatter(value, object, node, options) {

            var language = languageSelector(object);
            var map = {
                title: titleSelector(object),
                languageBranch: entities.encode(language),
                languageBranchClass: language ? "epi-card__language-branch" : "epi-card__language-branch--hidden",
                contentIcon: iconSelector(object.iconKey),
                message: object.content,
                postedAt: formatters.localizedDate(object.posted),
                menu: formatters.menu({ title: sharedResources.action.options })
            };
            var unread = (object.hasRead ? "" : " epi-card--unread");
            domClass.add(node, "epi-card epi-card--compact" + unread);

            return string.substitute(template, map);
        };
    }

    module = {
        // summary:
        //      A collection of formatters and utilities aiding
        //      rendering item lists.
        // tags:
        //      internal

        card: [
            cardFormatter()
        ]
    };

    return module;
});
