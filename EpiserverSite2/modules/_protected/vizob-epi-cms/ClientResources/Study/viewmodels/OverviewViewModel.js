define("vizob-epi-cms/drive/viewmodels/OverviewViewModel", [
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dojo/when",
    "epi/dependency",
    "./_DriveViewModel"
], function (
    declare,
    lang,
    topic,
    when,
    dependency,
    _DriveViewModel
) {
    return declare([_DriveViewModel], {
        // summary:
        //
        // tags:
        //      internal

        // contextHistory: [readonly] epi-cms/BackContextHistory
        //      The context history stack
        contextHistory: null,

        // isDriveOverviewActive: [public] Boolean
        //      Indicates if the overview is open
        isDriveOverviewActive: false,

        // _sortOrderProfileKey: [protected] String
        //      The profile key used to store the sort order
        _sortOrderProfileKey: "epi.drive-overview-sort-order",

        // _isActivitiesVisibleProfileKey: [protected] String
        //      The profile key used to store whether the activities panel is visible or not
        _isActivitiesVisibleProfileKey: "epi.drive-overview-is-activities-visible",

        postscript: function () {
            this.inherited(arguments);
            this.contextHistory = this.contextHistory || dependency.resolve("epi.cms.BackContextHistory");
            this.own(this.driveService.on("currentDriveChanged", lang.hitch(this, this.driveOverviewChanged)));

        },

        contextChanged: function (/*Object*/context, /*Object*/callerData) {
            // summary:
            //      When context changes
            // tags:
            //      protected
            this.inherited(arguments);

            if (context && context.type === "epi.cms.drive") {
                var driveId = parseInt(context.id, 10);
                //when(this.driveStore.refresh(driveId)).then(this.set.bind(this, "selectedDrive"));
            } else {
                //this.set("selectedDrive", null);
            }
        },

        driveOverviewChanged: function (drive) {
            // summary:
            //      When the drive overview changes
            // drive: Object
            //      Drive
            // tags:
            //      public

            var active = this.get("isDriveOverviewActive"),
                newDriveUri;

            // id is empty when selecting None.
            if (active) {
                if (drive && drive.id) {
                    newDriveUri = "epi.cms.drive:///" + drive.id;
                    topic.publish("/epi/shell/context/request", { uri: newDriveUri }, { sender: this });
                } else {
                    this.requestPreviousContext();
                }
            }
        },

        requestPreviousContext: function () {
            // summary:
            //      Navigates back to previous context
            // tags:
            //      public

            this.contextHistory.closeAndNavigateBack(this);
        },

        _createDriveCommands: function () {
            var commands = this.inherited(arguments);

            commands.refreshDrive = new RefreshDriveItems({ model: this, category: "drive-comments", order: 120 });

            return commands;
        },

        _createDriveItemCommands: function () {

            var commands = this.inherited(arguments);

            commands.sortDriveItems.set({
                category: "driveButton",
                iconClass: "epi-iconSort"
            });

            commands.toggleDriveActivities = new ToggleDriveActivities({ model: this, order: 100 });

            return commands;
        },

        updateActivityFeed: function (selectedItems) {

            // Update the activity feed view model with the user selection.
            this.activityFeedModel.set({
                selectedDriveId: this.selectedDrive && this.selectedDrive.id,
                selectedDriveItems: selectedItems
            });
        },

        _selectedDriveSetter: function (selectedDrive) {
            this.inherited(arguments);
            this._updateDriveFeedViewModel(selectedDrive);
        },

        _updateSelectedDriveDependencies: function (selectedDrive) {
            this.inherited(arguments);
            this._updateDriveFeedViewModel(selectedDrive);
        },

        _updateDriveFeedViewModel: function (selectedDrive) {
            // Update the Drive comments feed view model with the new drive name and id.
            this.driveCommentFeedModel.set({
                placeholderName: selectedDrive && selectedDrive.name,
                selectedDriveId: selectedDrive && selectedDrive.id
            });
        }
    });
});
