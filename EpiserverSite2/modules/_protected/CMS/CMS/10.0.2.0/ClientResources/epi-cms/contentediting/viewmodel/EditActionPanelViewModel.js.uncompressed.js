define("epi-cms/contentediting/viewmodel/EditActionPanelViewModel", [
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Stateful",
    "dojo/string",

    "dojox/html/entities",

    "epi-cms/contentediting/ContentActionSupport",
    "epi-cms/contentediting/viewmodel/_ContentViewModelObserver",
    "epi-cms/contentediting/viewmodel/PublishMenuViewModel",

    "epi/datetime",
    "epi/dependency",

    "epi/i18n!epi/cms/nls/episerver.cms.contentediting.editactionpanel"
],

function (
    array,
    declare,
    lang,
    Stateful,
    dojoString,

    entities,

    ContentActionSupport,
    _ContentViewModelObserver,
    PublishMenuViewModel,

    datetime,
    dependency,

    res
) {

    return declare([_ContentViewModelObserver], {
        // tags:
        //      internal

        // public view model properties
        state: null,
        buttonText: null,
        statusText: null,
        statusIcon: null,
        additionalClass: null,
        nonEditableIndicator: null,
        visible: null,
        publishMenuViewModel: null,

        inUseNotificationManager: null,

        // Skip child model creation. Used in test environment.
        skipChildModels: false,

        // Private stuffs
        _virtualStatusEnum: {
            NotCreated: 0,
            NotPublishedYet: 1,
            NoChangeToPublish: 2,
            ChangesToPublish: 3,
            ReadyToPublish: 4,
            ScheduledPublish: 5,
            Published: 6,
            PreviouslyPublished: 7,
            Expired: 8,
            InUse: 9,
            Deleted: 10
        },
        _virtualStatusCssState: [],
        _virtualStatusLocalization: [],
        _statusIcon: [],

        _watchers: null,
        _statusMap: {},


        postscript: function () {
            //set up resources
            this.res = this.res || res;

            this.inherited(arguments);

            this.inUseNotificationManager = this.inUseNotificationManager || dependency.resolve("epi.cms.contentediting.inUseNotificationManager");

            // build up virtual status state, localization, and icon
            if (this._virtualStatusCssState.length === 0) {
                for (var status in this._virtualStatusEnum) {
                    this._virtualStatusCssState.push(status);
                    this._virtualStatusLocalization.push(this.res["status"][status.toLowerCase()]);
                }

                this._statusMap[ContentActionSupport.versionStatus.CheckedOut] = this._virtualStatusEnum.NotPublishedYet;
                this._statusMap[ContentActionSupport.versionStatus.CheckedIn] = this._virtualStatusEnum.ReadyToPublish;
                this._statusMap[ContentActionSupport.versionStatus.Rejected] = this._virtualStatusEnum.ChangesToPublish;
                this._statusMap[ContentActionSupport.versionStatus.DelayedPublish] = this._virtualStatusEnum.ScheduledPublish;
                this._statusMap[ContentActionSupport.versionStatus.Published] = this._virtualStatusEnum.Published;
                this._statusMap[ContentActionSupport.versionStatus.PreviouslyPublished] = this._virtualStatusEnum.PreviouslyPublished;
                this._statusMap[ContentActionSupport.versionStatus.Expired] = this._virtualStatusEnum.Expired;

                this._statusIcon[ContentActionSupport.versionStatus.DelayedPublish] = "epi-iconClock";
                this._statusIcon[ContentActionSupport.versionStatus.Rejected] = "epi-iconStop";
            }

            //create child models
            if (!this.skipChildModels) {
                this.publishMenuViewModel = new PublishMenuViewModel({
                    inUseNotificationManager: this.inUseNotificationManager
                });
            }
        },

        destroy: function () {
            if (this.publishMenuViewModel) {
                this.publishMenuViewModel.destroy();
            }
            this.inherited(arguments);
        },

        _setDataModelAttr: function (value) {
            this.inherited(arguments);
            if (this.publishMenuViewModel) {
                this.publishMenuViewModel.set("dataModel", value);
            }
        },

        onDataModelChange: function (name, oldValue, value) {
            var contentData = this.dataModel.contentData,
                virtualStatus = this._getVirtualStatus(contentData);

            this.set("state", this._virtualStatusCssState[virtualStatus]);

            this.set("additionalClass", virtualStatus === this._virtualStatusEnum.ChangesToPublish ? "animated8 shake" : "");

            this._setStatusText(virtualStatus, contentData);

            this.set("buttonText", this._getButtonText(virtualStatus, contentData));

            this.set("statusIcon", this._statusIcon[contentData.versionStatus] || "");

            var contentEditable = this.dataModel.canChangeContent(ContentActionSupport.action.Edit);

            this.set("nonEditableIndicator", !contentEditable);

            this.set("visible", !contentData.isWastebasket);
        },

        _setStatusText: function (virtualStatus, contentData) {
            if (contentData.status === ContentActionSupport.versionStatus.DelayedPublish) {
                this.set("statusText", dojoString.substitute(this._virtualStatusLocalization[virtualStatus],
                    [datetime.toUserFriendlyHtml(contentData.properties.iversionable_startpublish)]));
            } else if (virtualStatus === this._virtualStatusEnum.InUse) {
                var userList = this.inUseNotificationManager.getOtherUsersInUseNotifications(contentData.inUseNotifications);
                userList = userList.map(function (item) {
                    return entities.encode(item);
                }).join(",");
                this.set("statusText", dojoString.substitute(this._virtualStatusLocalization[virtualStatus], [userList]));
            } else {
                this.set("statusText", this._virtualStatusLocalization[virtualStatus]);
            }
        },

        _getButtonText: function (virtualStatus, contentData) {
            if ((virtualStatus === this._virtualStatusEnum.NotPublishedYet ||
                virtualStatus === this._virtualStatusEnum.ChangesToPublish ||
                virtualStatus === this._virtualStatusEnum.ReadyToPublish) &&
                this.dataModel.canChangeContent(ContentActionSupport.action.Publish)) {

                return this.res.buttonlabel.publish;
            } else {
                return this.res.buttonlabel.option;
            }
        },

        _getVirtualStatus: function (contentData) {
            if (contentData.isDeleted) {
                return this._virtualStatusEnum.Deleted;
            }

            var ignoreFlag, originallyEditable, hasInUseNotificationWarning;

            // Temporarily ignore inuse notification warning to check original editable status
            ignoreFlag = this.inUseNotificationManager.ignoreOthersNotifications;
            this.inUseNotificationManager.ignoreOthersNotifications = true;
            originallyEditable = this.dataModel.canChangeContent();
            this.inUseNotificationManager.ignoreOthersNotifications = ignoreFlag;

            hasInUseNotificationWarning = this.inUseNotificationManager.hasInUseNotificationWarning(contentData.inUseNotifications);

            if (hasInUseNotificationWarning && originallyEditable) {
                return this._virtualStatusEnum.InUse;
            }

            if (contentData.isCommonDraft) {
                if (contentData.status === ContentActionSupport.versionStatus.Published) {
                    return this._virtualStatusEnum.NoChangeToPublish;
                }
                if (contentData.status === ContentActionSupport.versionStatus.CheckedOut) {
                    return contentData.isMasterVersion ? this._virtualStatusEnum.NotPublishedYet : this._virtualStatusEnum.ChangesToPublish;
                }
            }

            return this._statusMap[contentData.status];
        }
    });
});
