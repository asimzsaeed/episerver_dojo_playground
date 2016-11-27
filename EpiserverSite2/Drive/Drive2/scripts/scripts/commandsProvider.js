define([
    "dojo",
    "dojo/_base/declare",
    "dijit/form/ToggleButton",
    "epi-cms/component/command/_GlobalToolbarCommandProvider",
    "drive/scripts/driveCommand"
], function (dojo, declare, ToggleButton, _GlobalToolbarCommandProvider, DriveCommand) {
    return declare([_GlobalToolbarCommandProvider], {

        constructor: function () {
            this.inherited(arguments);

            var driveCommand = new DriveCommand({
                //label: "First command"
            });
            this.addToLeading(driveCommand,
            {
                showLabel: false,
                widget: ToggleButton,
                'class': 'favourite-button'
                //'epi-disabledDropdownArrow epi-groupedButtonContainer'//'epi-leadingToggleButton epi-disabledDropdownArrow dijitDropDownButton' // dijitChecked
            });
        }
    });
});