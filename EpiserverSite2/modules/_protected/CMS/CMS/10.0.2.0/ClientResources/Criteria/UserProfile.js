(function () {
    return {
        // We call the Edit action on the UserProfile controller to get the edit view for this criterion
        _nameToTypeMap: null,
        createUI: function (namingContainer, container, settings, callback) {
            dojo.require("dijit.form.FilteringSelect");
            dojo.require("dijit.form.TextBox");
            dojo.require("dijit.form.RadioButton");
            dojo.require("dijit.form.NumberSpinner");
            dojo.require("dojo.parser");

            var profileKey = '';
            var profileValue = '';
            var matchType = '';

            if (settings) {
                profileKey = settings.ProfileKey;
                profileValue = settings.ProfileValue;
                matchType = settings.MatchType;
            }

            var self = this;
            self.languageKeys = '/button/no,/button/yes,/shell/cms/visitorgroups/criteria/userprofile/required';
            self.getTranslation(function () {
                dojo.xhrPost({
                    url: '../../CMS/UserProfile/Edit',
                    content: {
                        namingContainer: namingContainer,
                        profileKey: profileKey,
                        matchType: matchType
                    },
                    handleAs: 'text',
                    load: function (data, ioArgs) {
                        // Insert the base html, and then call the initialize method.
                        var element = dojo.create('div', { id: namingContainer + 'Root' });
                        element.innerHTML = data;
                        dojo.place(element, container);

                        self._initialize(namingContainer, settings, function () {
                            callback(namingContainer, container);
                        });
                    }
                });
            });
        },

        // Returns the properties "profileKey", "profileValue" and "matchType".
        getSettings: function (namingContainer) {
            var profileKey = dijit.byId(namingContainer + 'ProfileKey').value;
            var matchType = dijit.byId(namingContainer + 'MatchType').value;
            var profileValueWidget = dijit.byId(namingContainer + 'ProfileValue');
            var profileValue;

            if (profileValueWidget) {
                profileValue = profileValueWidget.value;
            } else {
                // If profileValueWidget is null it means we are working with radio buttons and need special handling
                var trueRadioButton = dijit.byId(namingContainer + 'ProfileValueTrue');
                var falseRadioButton = dijit.byId(namingContainer + 'ProfileValueFalse');

                if (trueRadioButton.checked) {
                    profileValue = 'True';
                } else if (falseRadioButton.checked) {
                    profileValue = 'False';
                }

            }

            return {
                ProfileKey: profileKey,
                ProfileValue: profileValue,
                MatchType: matchType
            };
        },

        // Validates that the user has entered a value for the profile key and the profile value.
        validate: function (namingContainer) {
            var validationErrors = this.prototype.validate.apply(this, arguments);

            var valid = true;
            var profileValueWidget = dijit.byId(namingContainer + 'ProfileValue');
            var profileKeyWidget = dijit.byId(namingContainer + 'ProfileKey');
            var requiredText = this.translatedText['/shell/cms/visitorgroups/criteria/userprofile/required'];

            if (!profileValueWidget) {
                // If profile value is null it means that we are dealing with radio buttons.
                // So we know that some value was selected
                return validationErrors;
            }

            if (!profileValueWidget.value || profileValueWidget.value == '') {
                validationErrors.Add(requiredText, profileValueWidget);
            }

            return validationErrors;
        },

        // Initializes the name to type map as well as the generation of correct input controls.
        _initialize: function (namingContainer, settings, callback) {
            var self = this;

            if (!settings) {
                settings = {};
            }

            // Init name to type map.
            dojo.xhrPost({
                url: '../../CMS/UserProfile/NameToTypeMap',
                content: {},
                handleAs: 'json',
                load: function (data, ioArgs) {
                    self._nameToTypeMap = data;

                    // The name to type map has been initialized, continue with rest of initialization.
                    var criterionRoot = document.getElementById(namingContainer + 'Root');
                    dojo.parser.parse(criterionRoot);

                    var keySelectDijit = dijit.byId(namingContainer + 'ProfileKey');
                    keySelectDijit.missingMessage = self.translatedText['/shell/cms/visitorgroups/criteria/userprofile/required'];
                    self._updateInputControls(keySelectDijit.value, namingContainer, settings, self._nameToTypeMap);

                    var eventHandler = function () {
                        // The profile value should be removed when we change the profile key
                        settings.ProfileValue = '';
                        self._updateInputControls(keySelectDijit.value, namingContainer, settings, self._nameToTypeMap);
                    };

                    dojo.connect(keySelectDijit, 'onChange', self, eventHandler);

                    //let the caller know that everything is done
                    callback();
                }
            });
        },


        // Will destroy any existing input control, and add a new one.
        _updateInputControls: function (keyName, namingContainer, settings, nameToTypeMap) {
            var profileValueId = namingContainer + 'ProfileValue';
            var profileValueWidget = dijit.byId(profileValueId);

            if (profileValueWidget) {
                var profileValueWrapper = profileValueWidget.domNode.parentNode;
                profileValueWidget.destroy();
                if (profileValueWrapper) {
                    dojo.empty(profileValueWrapper);
                }
            } else {
                // If there is no profileValueWidget there may be radio button widgets, so we need to try and destoy them.
                this._destroyRadioButtonSelection(profileValueId);
            }

            switch (nameToTypeMap[keyName]) {
                case 'System.Int32':
                    this._createIntSelectionInput(namingContainer, settings);
                    break;
                case 'System.Boolean':
                    this._createBoolSelectionInput(namingContainer, settings);
                    break;
                default:
                    this._createStringSelectionInput(namingContainer, settings);
                    break;
            }
        },

        // Creates the input controls for entering a string value.
        _createStringSelectionInput: function (namingContainer, settings) {
            // Show match type drop down
            dojo.style(dojo.byId(namingContainer + 'MatchTypeContainer'), 'display', '');

            var matchValueInput = this.getMatchValueInput(namingContainer);

            var profileValueWidget = new dijit.form.TextBox({
                id: namingContainer + 'ProfileValue',
                value: settings ? settings.ProfileValue : ''
            }, matchValueInput);
        },

        // Creates the input controls for entering an integer value.
        _createIntSelectionInput: function (namingContainer, settings) {
            // Hide match type dropdown
            dojo.style(dojo.byId(namingContainer + 'MatchTypeContainer'), 'display', 'none');
            dijit.byId(namingContainer + 'MatchType').set('value', 0);

            var matchValueInput = this.getMatchValueInput(namingContainer);

            var profileValueWidget = new dijit.form.NumberSpinner({
                constraints: { places: 0 },
                id: namingContainer + 'ProfileValue',
                value: settings ? settings.ProfileValue : '',
                'class': 'epi-userprofile-intinput',
                selectOnClick: true
            }, matchValueInput);
        },

        // Creates the input controls for entering a boolean value.
        _createBoolSelectionInput: function (namingContainer, settings) {
            var savedValue = false;
            if (settings && settings.ProfileValue == 'True') {
                savedValue = true;
            }
            var profileValueName = namingContainer + 'ProfileValue';
            var trueRadioButton = new dijit.form.RadioButton({
                name: profileValueName,
                id: profileValueName + 'True',
                value: true,
                checked: savedValue,
                style: 'margin-left: 0.5em'
            });
            var falseRadioButton = new dijit.form.RadioButton({
                name: profileValueName,
                id: profileValueName + 'False',
                value: false,
                checked: !savedValue,
                style: 'margin-left: 0.5em'
            });

            // Hide match type dropdown
            dojo.style(dojo.byId(namingContainer + 'MatchTypeContainer'), 'display', 'none');
            dijit.byId(namingContainer + 'MatchType').set('value', 0);

            // Add the radio buttons and labels to the dom
            var wrapperElement = dojo.byId(namingContainer + 'MatchValueContainer');

            trueRadioButton.placeAt(wrapperElement, 'last');
            var yesText = this.translatedText['/button/yes'];
            dojo.place(dojo.create('label', { 'for': profileValueName + 'True', innerHTML: yesText, id: profileValueName + 'TrueLabel' }), wrapperElement);

            falseRadioButton.placeAt(wrapperElement, 'last');
            var noText = this.translatedText['/button/no'];
            dojo.place(dojo.create('label', { 'for': profileValueName + 'False', innerHTML: noText, id: profileValueName + 'FalseLabel' }), wrapperElement);
        },

        getMatchValueInput: function (namingContainer) {
            var wrapperElement = dojo.byId(namingContainer + 'MatchValueContainer');

            //empty the wrapper
            if (wrapperElement.childNodes.length > 0) {
                dojo.empty(wrapperElement);
            }

            //create a dummy input, on which a widget will be constructed
            var dummyInput = dojo.create('input', {id: namingContainer + 'MatchValue', type: 'text'}, wrapperElement);

            return dummyInput;
        },

        // Destroys the radio button widgets for selecting bool, and the corresponding labels.
        _destroyRadioButtonSelection: function (profileValueId) {
            var radioButtonWidgetTrue = dijit.byId(profileValueId + 'True');
            var radioButtonWidgetFalse = dijit.byId(profileValueId + 'False');

            if (radioButtonWidgetTrue) {
                radioButtonWidgetTrue.destroy();
                var label = dojo.byId(profileValueId + 'TrueLabel');
                dojo.destroy(label);
            }

            if (radioButtonWidgetFalse) {
                radioButtonWidgetFalse.destroy();
                var label = dojo.byId(profileValueId + 'FalseLabel');
                dojo.destroy(label);
            }
        }
    };
})();
