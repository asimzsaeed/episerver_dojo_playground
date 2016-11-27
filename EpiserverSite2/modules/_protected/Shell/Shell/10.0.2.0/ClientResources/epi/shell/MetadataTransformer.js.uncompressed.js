define("epi/shell/MetadataTransformer", [
    "dojo/_base/declare",
    "dojo/_base/lang",

    "epi/string",
    "epi/shell/TypeDescriptorManager"
],

function (
    declare,
    lang,

    epiString,
    TypeDescriptorManager
) {

    return declare(null, {
        // tags:
        //      internal

        defaultGroupType: "epi/shell/layout/GroupContainer",
        defaultSingleGroupType: "epi/shell/layout/SimpleContainer",
        defaultParentType: "epi/shell/layout/ParentContainer",
        defaultGroupName: "defaultGroup",
        defaultGroupTitle: "",

        propertyFilter: null,
        _item: null,

        constructor: function (args) {
            declare.safeMixin(this, args);
        },

        toComponentDefinitions: function (item /*object*/, nameBase /*string*/, useDefaultValue /*Boolean*/, readOnly) {
            // summary:
            //      Transforms metadata into a format that epi/shell/widget/WidgetFactory can process.
            //
            // item: Object
            //      The original item in the metadata sent by the server
            //
            // nameBase: String
            //      The name of the level, empty to start with,
            //      get the parents property names concatenated during the recursivity if there are children
            //
            // useDefaultValue: Boolean
            //      Flag indicating if the property will get its value or the default value.
            //
            // readOnly: Boolean
            //      Flag indicating if the property is read only

            this._item = item;

            var properties = this._filterProperties(item);

            return this._getComponentDefinitions(properties, item.groups, nameBase, useDefaultValue, readOnly);
        },

        _filterProperties: function (property) {
            var filter = this.propertyFilter,
                properties = property.properties;

            return filter
                ? properties.filter(lang.hitch(this, function (prop) {
                    return filter(property, prop);
                }))
                               : properties;
        },

        _getComponentDefinitions: function (propertyDefinitions, groupDefinitions, nameBase, useDefaultValue, readOnly) {

            var properties = lang.clone(propertyDefinitions) || [],
                groupContainers,
                groupMap = {},
                defaultGroupName = epiString.pascalToCamel(this.defaultGroupName),
                defaultGroup,
                sortFn = function (item1, item2) {
                    return (item1.displayOrder || 0) - (item2.displayOrder || 0);
                };

            // Create group containers and sort them based on displayOrder
            groupContainers = (groupDefinitions || []).map(function createGroups(group) {
                var container = this._createGroupContainer(group, readOnly);
                groupMap[container.settings.name] = container;
                return container;
            }, this);

            groupContainers.sort(sortFn);

            // Add default group
            groupContainers.unshift(groupMap[defaultGroupName] = defaultGroup = this._createGroupContainer(
                { name: defaultGroupName, title: this.defaultGroupTitle, displayUI: true },
                readOnly)
            );

            // Sort properties based on displayOrder
            properties.sort(sortFn);

            // Loop through property definitions, create property components and add to groups
            properties.forEach(function createProperties(property) {

                if (!property.showForEdit) {
                    return;
                }

                var groupName = epiString.pascalToCamel(property.groupName || ""),
                    // find what group the property belongs to or use default
                    group = groupMap[groupName] || defaultGroup;

                // create property widgets if the uiType is specified, otherwise create a parent container for the property
                var widgets = property.uiType
                    ? this._createPropertyWidget(property, nameBase, useDefaultValue, readOnly)
                    : this._createParentContainer(property, nameBase, useDefaultValue, readOnly);

                // Add to the groups component collection
                widgets instanceof Array ?
                    Array.prototype.push.apply(group.components, widgets) :
                    group.components.push(widgets);

            }, this);

            // Filter group containers that should be visible and contains at least 1 component.
            groupContainers = groupContainers.filter(function (group) {
                return group.settings.displayui && group.components.length;
            });

            if (groupContainers.length === 1 && groupContainers[0].widgetType === this.defaultGroupType) {
                groupContainers[0].widgetType = this.defaultSingleGroupType;
            }

            return groupContainers;
        },

        _createGroupContainer: function (group, readOnly) {
            var baseSettings = {
                _type: "group",
                name: epiString.pascalToCamel(group.name),
                title: group.title,
                readOnly: readOnly,
                displayui: group.displayUI
            };

            return {
                displayOrder: group.displayOrder,
                settings: lang.mixin(baseSettings, group.options),
                widgetType: group.uiType || this.defaultGroupType,
                components: []
            };
        },

        _createParentContainer: function (property, nameBase, useDefaultValue, readOnly) {
            var baseSettings = {
                _type: "parent",
                name: nameBase + epiString.pascalToCamel(property.name),
                title: property.displayName
            };

            //Metadata only returns the property name and not the translation so we translate
            //it and sets title to the translated name instead of the propertyname
            this._setTranslatedLabelAndTooltip(property.name, baseSettings);

            var properties = this._filterProperties(property);

            return {
                settings: lang.mixin(baseSettings, property.settings),
                widgetType: property.layoutType || this.defaultParentType,
                components: this._getComponentDefinitions(properties, property.groups, baseSettings.name + ".", useDefaultValue, readOnly)
            };
        },

        _createPropertyWidget: function (property, nameBase, useDefaultValue, readOnly) {
            var baseSettings = lang.mixin(useDefaultValue ? { value: property.initialValue } : {}, {
                _type: property.hideSurroundingHtml ? "hiddenfield" : "field",
                name: nameBase + epiString.pascalToCamel(property.name),
                label: property.displayName,
                selections: property.selections,
                displayui: property.displayui,
                readOnly: readOnly
            }, property.settings);

            this._setTranslatedLabelAndTooltip(property.name, baseSettings);

            return {
                settings: baseSettings,
                widgetType: property.uiType,
                widgetPackage: property.uiPackage
            };
        },

        _setTranslatedLabelAndTooltip: function (propertyName, settings) {

            var modelTypeIdentifier = this._item.additionalValues && this._item.additionalValues.modelTypeIdentifier,
                property;

            propertyName = "properties." + propertyName.toLowerCase();

            if (!modelTypeIdentifier ||
                !(property = TypeDescriptorManager.getResourceValue(modelTypeIdentifier, propertyName))) {
                return;
            }

            if (property.caption) {
                settings.title = settings.label = property.caption;
            }

            if (property.help) {
                settings.tooltip = property.help;
            }
        }
    });
});
