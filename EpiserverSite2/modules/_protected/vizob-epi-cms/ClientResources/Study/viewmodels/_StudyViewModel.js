define("vizob-epi-cms/study/viewmodels/_StudyViewModel", [
// dojo
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/Deferred",
    "dojo/Evented",
    "dojo/Stateful",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/promise/all",
    "dojo/when",
    "dojo/string",

// dijit
    "dijit/Destroyable",

//epi
    "epi/epi",
    "epi/datetime",
    "epi/dependency",
    "epi/username",
    "epi/shell/_ContextMixin",
    "epi/shell/xhr/errorHandler"

], function (
// dojo
    declare,
    lang,
    aspect,
    Deferred,
    Evented,
    Stateful,
    topic,
    domClass,
    all,
    when,
    string,

// dijit
    Destroyable,

// epi
    epi,
    epiDate,
    dependency,
    username,
    _ContextMixin,
    errorHandler
) {
    return declare([Stateful, Destroyable, Evented, _ContextMixin], {
        // summary:
        //      The view model for the epi-cms/drive/DriveComponent
        // tags:
        //      internal

        // commands: [readonly] epi/shell/command/_Command[]
        //      Commands to be consumed by the view.
        commands: null,

        // namedCommands: [readonly] Object
        //      Way to access commands using named keys.
        namedCommands: null,

        // created: [readonly] string
        //      A view prepared version of the date the selected drive was created.
        created: "",

        // createdBy: [readonly] string
        //      A view prepared version of the user that created the selected drive.
        createdBy: "",

        // profile: [readonly] Profile
        //      The current user profile
        profile: null,

        // contentLanguage: [readonly] string
        //      The current UI language
        contentLanguage: "",

        dndEnabled: false,

        // isActivitiesVisible: [readonly] Boolean
        //      A flag which indicates whether the activities panel
        //      should be visible.
        isActivitiesVisible: false,

        // driveStore: [readonly] Store
        //      A REST store for interacting with drives.
        driveStore: null,

        // driveSortOrder: [public] Object
        //      The order drives are sorted by.
        driveSortOrder: null,

        // driveItemStore: [readonly] Store
        //      A REST store for interacting with drive items.
        driveItemStore: null,

        // driveItemQuery: Query
        //      Query object holding parameters to get a drives items.
        driveItemQuery: null,

        // activitiesStore: [readonly] Store
        //      A REST store for interacting with activities.
        activitiesStore: null,

        // driveItemSortOrder: [public] Object
        //      The order to sort drive items by.
        driveItemSortOrder: null,

        // driveStatus: [public] string
        //      State that indicates if a drive and it's contents are available.
        driveStatus: "",

        // driveName: [public] string
        //      The name of the selected drive.
        driveName: "",

        // notificationMessage: [public] string
        //      The message to show in the notification bar.
        notificationMessage: "",

        // selectedDrive: [public] Object
        //      The drive that is currently selected.
        selectedDrive: null,

        // selectedDriveItems: [public] Array
        //      An array of the drive items that are selected through user interaction
        selectedDriveItems: null,

        // driveItemCountMessage: [public] String
        //      Message that is displayed when selecting items in the list
        driveItemCountMessage: "",

        // placeholderState: [public] string
        //      State that indicates if a drive and it's contents are available.
        placeholderState: "noDrive",

        // _sortOrderProfileKey: [protected] String
        //      The profile key used to store the sort order
        _sortOrderProfileKey: "epi.drive-sort-order",

        // _isActivitiesVisibleProfileKey: [protected] String
        //      The profile key used to store whether the activities panel is visible or not
        _isActivitiesVisibleProfileKey: "epi.drive-is-activities-visible",

        _messages: null,

        constructor: function () {
            // Initialize default values for object typed properties.
            this.driveItemSortOrder = [];
            this.driveSortOrder = [{ attribute: "created", descending: true }];
            this.selectedDriveItems = [];
        },

        postscript: function () {
            this.inherited(arguments);

            // Resolve the stores from the registry if they haven't been injected. This allows
            // us to mock the stores when testing.
            //this.driveService = this.driveService || dependency.resolve("epi.cms.DriveService");
            //this.driveStore = this.driveStore || dependency.resolve("epi.storeregistry").get("epi.cms.drive");
            //this.driveItemStore = this.driveItemStore || dependency.resolve("epi.storeregistry").get("epi.cms.drive.item");
            //this.activitiesStore = this.activitiesStore || dependency.resolve("epi.storeregistry").get("epi.cms.activities");

            this.profile = this.profile || dependency.resolve("epi.shell.Profile");

            this._messages = this.isDriveModeEnabled() ? res.status.message : lang.mixin({}, res.status.message, res.status["messagelegacy"]);

            this._createCommands();

            this.own(
                this.driveService.on("drive-item-updated", lang.hitch(this, this._updateSelectedItems)),
                this.driveService.on("drive-updated", lang.hitch(this, this._driveUpdated))
            );

        },

        initialize: function () {
            // summary:
            //
            // returns: Promise
            //
            // tags:
            //      public

            return all(
                // Set the sort order based on what is stored in the profile, fall back to default value if nothing stored.
                //when(this.profile.get(this._sortOrderProfileKey), lang.hitch(this, function (sort) {
                //    var option = this._findSortOption("key", sort) || this.namedCommands.sortDriveItems.options[0]; // default to name ascending
                //    this._changeAttrValue("driveItemSortOrder", option.value); // use the internal setter to not trigger a profile save
                //})),
                //// Load the selected/current drive
                //when(this._loadSelectedDrive(), lang.hitch(this, function (drive) {
                //    this._updateSelectedDriveDependencies(drive);
                //    this._changeAttrValue("selectedDrive", drive);  // use the internal setter to not trigger a profile save
                //})),
                //// Get the current content language from the profile
                //when(this.profile.getContentLanguage(), lang.hitch(this, function (contentLanguage) {
                //    this.set("contentLanguage", contentLanguage);
                //})),
                //when(this.profile.get(this._isActivitiesVisibleProfileKey), lang.hitch(this, function (isVisible) {
                //    //Don´t set value if it is not a boolean
                //    if (typeof isVisible === "boolean") {
                //        this.set("isActivitiesVisible", isVisible);
                //    }
                //}))
            );
        },

        isDriveModeEnabled: function () {
            // summary:
            //      Indicates whether drive mode is enabled or not
            // tags:
            //      public
            //get from server
            return true; //this.driveService.isDriveModeEnabled;
        },

        getCommands: function () {
            // summary:
            //      Returns all available commands
            // tags:
            //      public

            return this.commands;
        },

        addDrive: function (drive) {
            // summary:
            //      Adds a drive and sets it as the selectedDrive
            // tags:
            //      public

            //this.driveStore.add(drive)
            //    .then(lang.hitch(this, function (value) {
            //        this.set("selectedDrive", value);
            //    }))
            //    .otherwise(errorHandler.forXhr);
        },

        updateDrive: function (drive) {
            // summary:
            //      Adds a drive and sets it as the selectedDrive
            // tags:
            //      public

            //this.driveStore.put(drive)
            //    .then(lang.hitch(this, "set", "selectedDrive"))
            //    .otherwise(errorHandler.forXhr);
        },

        publishDrive: function (driveId, delayPublishUntil) {
            // summary:
            //      Publishes a drive with given id right away or delay publishing until given delayPublish date.
            // driveId: Number
            //      Id of the drive to publish
            // delayPublishUntil: Date?
            //      If supplied, then the drive will be delay published.
            // returns: Promise
            // tags:
            //      public

            //var self = this;

            //return this.driveService.publishDrive(pdriveId, delayPublishUntil)
            //    .then(function (updatedDrive) {
            //        return self._updateSelectedDriveAndRefreshContextRequest(updatedDrive)
            //            .then(function () {
            //                return updatedDrive;
            //            });
            //    });
        },

        reactivateDrive: function (driveId) {
            // summary:
            //      Reactivates a drive that has been scheduled to publish.
            // driveId: Number
            //      The ID of the drive to reactivate
            // returns: Promise
            // tags:
            //      public

            //var self = this;

            //if (isNaN(driveId)) {
            //    throw new Error("The given drive ID is not a number.");
            //}

            //return this.driveService.reactivateDrive(driveId)
            //    .then(function (updatedDrive) {
            //        return self._updateSelectedDriveAndRefreshContextRequest(updatedDrive)
            //            .then(function () {
            //                return updatedDrive;
            //            });
            //    });
        },

        refreshActivities: function () {
            // summary:
            //      Refreshes the activity feed.
            // tags:
            //      public

            //this.emit("refresh-activities");
        },

        refreshDrive: function (refreshItems) {
            // summary:
            //      Refreshes the selected drive, particularly information if the drive can be published or not.
            // refreshItems: Boolean
            //      A flag indicating whether to emit a refresh event to also refresh drive items. Default true.
            // tags:
            //      public

            //var self = this;

            //if (refreshItems === undefined) {
            //    refreshItems = true;
            //}

            //if (this.selectedDrive) {
            //    return this.driveStore.refresh(this.selectedDrive.id).then(
            //        function (value) {
            //            self.set("selectedDrive", value);
            //            if (refreshItems) {
            //                self.emit("refresh");
            //            }
            //            return value;
            //        },
            //        function (ex) {
            //            self.set("selectedDrive", null);
            //        }
            //    );
            //}

            //if (refreshItems) {
            //    this.emit("refresh");
            //}
        },

        removeDrive: function () {
            // summary:
            //      Removes the selected drive and sets the selected drive property to null.
            // tags:
            //      public
            //var self = this,
            //    store = this.driveStore;

            //if (!this.selectedDrive) {
            //    return new Deferred().resolve();
            //}

            //return store.remove(this.selectedDrive.id).then(function () {
            //    self.set("selectedDrive", null);
            //});
        },

        canAddContent: function (contentReferences) {
            // summary:
            //      Verifies that the given content references can be added to the currently selected drive
            // contentReferences: Array
            //      The content references to add to the currently selected drive
            // returns: Promise
            //      A promise
            // tags:
            //      public

            var selectedDriveId = this.get("selectedDrive").id;

            return this.driveService.canAddContent(selectedDriveId, contentReferences);
        },

        canPublishDrive: function (drive) {
            // summary:
            //      Checks if a drive can be published. Uses either a drive
            //      as an argument or the currently selected proejct.
            // tags:
            //      public

            var itemStatusCount;

            function noPublishAccess() {
                return Object.keys(itemStatusCount).some(function (key) {
                    if (key.indexOf("nopublishaccess") > -1) {
                        if (itemStatusCount[key] > 0) {
                            return true;
                        }
                    }
                });
            }

            function checkState(state) {
                return itemStatusCount[state] > 0;
            }

            drive = drive || this.selectedDrive;
            itemStatusCount = drive && drive.itemStatusCount;

            if (this.isDriveModeEnabled()) {
                return !!drive && drive.itemStatusCount.checkedin > 0;
            } else {
                return !!drive && (drive.status === "active" || drive.status === "publishfailed") &&
                       !noPublishAccess() && !checkState("notcreated") && !checkState("rejected") && !checkState("checkedout") &&
                       (checkState("checkedin") || checkState("published") || checkState("previouslypublished") || checkState("delayedpublish"));
            }
        },

        addDriveItems: function (contentReferences, driveId) {
            // summary:
            //      Adds the given content references as items of the drive.
            // tags:
            //      public

            var selectedDrive = this.get("selectedDrive");

            driveId = driveId || (selectedDrive && selectedDrive.id);

            if (!driveId) {
                throw new Error("If no driveId is provided a selectedDrive must be set in the context");
            }

            return this.driveService.addDriveItems(driveId, contentReferences);
        },

        removeSelectedDriveItems: function () {
            // summary:
            //      Removes the selected drive items from the drive.
            // tags:
            //      public
            var promise = this.driveService.removeDriveItems(this.selectedDriveItems);
            promise
                .then(lang.hitch(this, function () {
                    this.emit("clear-selection");
                }));

            return promise;
        },

        markDriveItemsAsReadyToPublish: function () {
            // summary:
            //      Mark the selected drive items as ready to publish.
            // returns: Promise
            //      A promise that resolves when the refresh drive has completed.
            // tags:
            //      public

            // Do an early exit when there are no drive items selected.
            if (!this.selectedDriveItems.length) {
                return new Deferred().resolve();
            }

            var self = this;
            var itemIds = this.selectedDriveItems.map(function (item) {
                return item.id;
            });

            return this.driveService.markAsReadyToPublish(itemIds)
                .then(function () {
                    when(self.getCurrentContext()).then(function (ctx) {
                        var matchingItem;
                        self.selectedDriveItems.some(function (item) {
                            if (item.contentLink === ctx.id) {
                                matchingItem = item;
                                return true;
                            }
                        });
                        if (matchingItem) {
                            self.requestContextChange(matchingItem.contentLink);
                        }
                    });
                });
        },

        requestContextChange: function (contextOrContentReference) {
            // summary:
            //      Requests that the UI changes the context to the specified contentReference.
            // tags:
            //      public

            var context = contextOrContentReference.uri ? contextOrContentReference :
                { uri: "epi.cms.contentdata:///" + contextOrContentReference };

            topic.publish("/epi/shell/context/request", context, { sender: this });
        },

        updateActivityFeed: function (selectedItems) {
            // summary:
            //      Used to update activity feed in drive overview
            // tags:
            //      protected
        },

        _driveUpdated: function (drive) {
            // summary:
            //      Handle drive-updated event
            //      Check if provided drive is the same as the currently selected one
            //      then set notificationMessage if drivestatus is publishfailed if true
            // tags:
            //      private
            if (this.selectedDrive && this.selectedDrive.id === drive.id) {
                this.set("selectedDrive", drive);
            }
        },

        _updateSelectedItems: function (item) {
            // summary:
            //      Update selectedDriveItems with new one if provided item has changed
            // tags:
            //      private

            var selectedLength = this.selectedDriveItems.length;

            for (var i = 0; i < selectedLength; i++) {
                if (this.selectedDriveItems[i].id === item.id) {
                    this.selectedDriveItems[i] = item;
                    this.set("selectedDriveItems", this.selectedDriveItems);

                    // since store has already run refresh on these items, we need to highligt them again in the list
                    this.emit("selected-drive-items-updated", this.selectedDriveItems);
                    break;
                }
            }
        },

        _createCommands: function () {

            var namedCommands = lang.mixin(this._createDriveCommands(), this._createDriveItemCommands()),
                commands;

            commands = Object.keys(namedCommands).map(function (key) {
                return namedCommands[key];
            }).sort(function (a, b) {
                return a.sortOrder - b.sortOrder;
            });

            this.own.apply(this, commands);

            this.set({
                commands: commands,
                namedCommands: namedCommands
            });
        },

        _createDriveCommands: function () {

            return {
                addDrive: new AddDrive({ model: this, order: 10 }),
                renameDrive: new RenameDrive({ model: this, order: 20 }),
                removeDrive: new RemoveDrive({ model: this, order: 30, store: this.driveStore }),
                publishDrive: new PublishDrive({ model: this, order: 40 }),
                scheduleDrive: new ScheduleDrive({ model: this, order: 50 }),
                removeDriveScheduling: withConfirmation(new RemoveDriveScheduling({ model: this, order: 60 }), null, {
                    title: res.command.removeschedulingdriveitem.title,
                    description: res.command.removeschedulingdriveitem.confirmation,
                    confirmActionText: resShared.remove,
                    cancelActionText: resShared.cancel
                })
            };
        },

        _createDriveItemCommands: function () {

            return {
                readyToPublishDriveItem: new ReadyToPublishDriveItem({ model: this, order: 100 }),
                editDriveItem: new EditDriveItem({ model: this, order: 110 }),
                removeDriveItem: withConfirmation(new RemoveDriveItem({ model: this, order: 120 }), null, {
                    title: res.command.removedriveitem.label,
                    description: res.command.removedriveitem.confirmation,
                    confirmActionText: resShared.remove,
                    cancelActionText: resShared.cancel
                }),
                sortDriveItems: new SortDriveItems({ model: this, order: 130 }),
                refreshDriveItems: new RefreshDriveItems({ model: this, order: 140 })
            };
        },

        _loadSelectedDrive: function () {
            // summary:
            //      Loads the selected drive
            // returns: Promise
            // tags:
            //      protected

            return this.driveService.getCurrentDrive();
        },

        _persistSelectedDrive: function (selectedDrive) {
            // summary:
            //      Store the selected drive in the user profile
            //  tags: protected

            this.profile.set(this._selectedDriveProfileKey, selectedDrive && selectedDrive.id, { location: "server" });
        },

        _persistSortOrder: function (sortOrder) {
            // summary:
            //      Store the drive item sort order in the user profile
            //  tags: protected

            var option = this._findSortOption("value", sortOrder),
                key = option && option.key || null;

            this.profile.set(this._sortOrderProfileKey, key, { location: "server" });
        },

        _persistIsActivitiesPanelVisible: function (isVisible) {
            // summary:
            //      Store whether the activities panel is visible or not
            //  tags: protected

            this.profile.set(this._isActivitiesVisibleProfileKey, isVisible, { location: "server" });
        },

        _findSortOption: function (key, term) {

            var options = this.namedCommands.sortDriveItems.options,
                option = null;

            term && options.some(function (item) {
                if (term === item[key]) {
                    option = item;
                    return true;
                }
            });

            return option;
        },

        _updateSelectedDriveDependencies: function (selectedDrive) {

            var created = "",
                createdBy = "",
                delayPublish = "",
                dndEnabled = false,
                notificationMessage = "",
                driveItemQuery = null,
                driveStatus = "",
                driveName = "",
                isDriveModeEnabled = this.isDriveModeEnabled();

            if (selectedDrive) {
                created = epiDate.toUserFriendlyString(new Date(selectedDrive.created));
                createdBy = username.toUserFriendlyString(selectedDrive.createdBy, null, true);
                dndEnabled = (isDriveModeEnabled && selectedDrive.status !== "publishing") || selectedDrive.status === "active" || selectedDrive.status === "publishfailed";
                driveItemQuery = { driveId: selectedDrive.id };
                driveName = selectedDrive.name;

                if (!this.canPublishDrive(selectedDrive) || isDriveModeEnabled) {
                    driveStatus = this._messages[selectedDrive.status] || "";

                    if (selectedDrive.status === "delayedpublished" && !isDriveModeEnabled) {
                        delayPublish = epiDate.toUserFriendlyString(selectedDrive.delayPublishUntil);
                        driveStatus = lang.replace(driveStatus, { date: delayPublish });
                        notificationMessage = lang.replace(res.status.state.delayedpublished, { delayPublishUntil: delayPublish });
                    }
                }

                if (selectedDrive.status === "publishfailed") {
                    notificationMessage = this._getDriveFailedMessage(selectedDrive);
                }
            }

            this.set({
                created: created,
                createdBy: createdBy,
                dndEnabled: dndEnabled,
                notificationMessage: notificationMessage,
                driveItemQuery: driveItemQuery, // Refresh the list query when the selected drive changes.
                driveStatus: driveStatus,
                driveName: driveName
            });
        },

        _getDriveFailedMessage: function (selectedDrive) {
            //  summary:
            //      Helper function to get the drive failed notification message
            //  returns: String
            //  tags: private
            var failedItemsCount = 0,
                notificationMessage = "",
                publishfailed = res.notifications.publishfailed;

            failedItemsCount = this._getUnpublishedItems(selectedDrive.itemStatusCount);

            if (failedItemsCount > 0) {
                notificationMessage = lang.replace(failedItemsCount > 1
                    ? publishfailed.notificationtextmultipleitems
                    : publishfailed.notificationtextsingleitem, { failedItemsCount: failedItemsCount });
            }
            return notificationMessage;
        },

        _getUnpublishedItems: function (statuses) {
            //  summary:
            //      Helper function to count the amount of unpublished items in the drive
            //  returns: Integer
            //  tags: private
            var count = 0;

            Object.keys(statuses).forEach(function (key) {
                if (key.indexOf("checkedin") === 0) {
                    count += statuses[key];
                }
            });
            return count;
        },

        _isActivitiesVisibleSetter: function (isVisible) {

            if (isVisible === this.isActivitiesVisible) {
                return;
            }
            this.isActivitiesVisible = isVisible;
            this._persistIsActivitiesPanelVisible(isVisible);
        },

        _selectedDriveSetter: function (selectedDrive) {

            //Store return the same instance sometimes.
            selectedDrive = lang.clone(selectedDrive);

            // Early exit if the drive has not changed
            if (epi.areEqual(this.selectedDrive, selectedDrive)) {
                return;
            }

            // Only clear the selection if a new drive is selected and
            // not when the current drive has been updated.
            if (this.selectedDrive && (!selectedDrive || this.selectedDrive.id !== selectedDrive.id)) {
                this.emit("clear-selection");
            }

            this.selectedDrive = selectedDrive;
            this._updateSelectedDriveDependencies(selectedDrive);
        },

        _driveItemSortOrderSetter: function (sortOrder) {
            // summary:
            //      Store the selected drive in the user profile

            if (sortOrder && sortOrder === this.driveItemSortOrder) {
                return;
            }

            this.driveItemSortOrder = sortOrder;

            this._persistSortOrder(sortOrder);

        },

        _updateSelectedDriveAndRefreshContextRequest: function (updatedDrive) {
            // summary:
            //      Updates the selectedDrive with given drive and runs the context request change with currently available context
            // returns: Promise
            //      The context which is reloaded/refreshed.
            // tags:
            //      internal

            var self = this;

            // update the selected drive and also change context request to current context.
            self.set("selectedDrive", updatedDrive);

            return when(this.getCurrentContext()).then(function (context) {
                self.requestContextChange(context);
                return context;
            });
        },

        _selectedDriveItemsSetter: function (selectedItems) {
            this.selectedDriveItems = selectedItems;
            this._updateDriveCountMessage(selectedItems);
        },

        _updateDriveCountMessage: function (selectedItems) {

            var items = selectedItems && selectedItems.length > 0 ? selectedItems.length : null,
                message = "";

            function createMessage(count, resourceKey) {
                message = string.substitute(res.notifications.selecteditems[resourceKey], {
                    count: count
                });
            }

            if (items) {
                if (items === 1) {
                    createMessage(items, "singular");
                } else if (items > 1) {
                    createMessage(items, "plural");
                }
            }

            this.set("driveItemCountMessage", message);
        }

    });
});
