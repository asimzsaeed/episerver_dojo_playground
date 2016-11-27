(function () {
    return {
        createUI: function (namingContainerPrefix, container, settings) {
            this.languageKeys = [
                '/shell/cms/visitorgroups/criteria/timeofday/starttimeafterendtime',
                '/shell/cms/visitorgroups/criteria/timeofday/nodayofweekselected',
                '/shell/cms/visitorgroups/criteria/timeofday/bothornonetime'
            ];

            this.prototype.createUI.apply(this, arguments);
        },

        uiCreated: function (namingContainerPrefix) {
            dojo.require('dijit.form.Button');
            dojo.require('dijit.TooltipDialog');

            var toolTipDlg = new dijit.TooltipDialog({

            }, namingContainerPrefix + 'dayCheckboxes');

            var button = new dijit.form.DropDownButton({
                dropDown: toolTipDlg
            }, namingContainerPrefix + 'dayDropdown');
        },

        validate: function (namingContainerPrefix) {
            var validationErrors = this.prototype.validate.apply(this, arguments);

            var from = dijit.byId(namingContainerPrefix + 'StartTime');
            var to = dijit.byId(namingContainerPrefix + 'EndTime');
            var dow = dijit.byId(namingContainerPrefix + 'dayDropdown');

            var fromTime = from.get('value');
            var toTime = to.get('value');

            if (fromTime === null && toTime !== null) {
                validationErrors.Add(this.translatedText['/shell/cms/visitorgroups/criteria/timeofday/bothornonetime'], from);
            }
            if (fromTime !== null && toTime === null) {
                validationErrors.Add(this.translatedText['/shell/cms/visitorgroups/criteria/timeofday/bothornonetime'], to);
            }

            if (fromTime >= toTime && fromTime !== null && toTime !== null) {
                validationErrors.Add(this.translatedText['/shell/cms/visitorgroups/criteria/timeofday/starttimeafterendtime'], from);
            }

            if ((!dijit.byId(namingContainerPrefix + 'Monday').checked) &&
                (!dijit.byId(namingContainerPrefix + 'Tuesday').checked) &&
                (!dijit.byId(namingContainerPrefix + 'Wednesday').checked) &&
                (!dijit.byId(namingContainerPrefix + 'Thursday').checked) &&
                (!dijit.byId(namingContainerPrefix + 'Friday').checked) &&
                (!dijit.byId(namingContainerPrefix + 'Saturday').checked) &&
                (!dijit.byId(namingContainerPrefix + 'Sunday').checked)) {

                validationErrors.Add(this.translatedText['/shell/cms/visitorgroups/criteria/timeofday/nodayofweekselected'], dow);
            }

            return validationErrors;
        }
    };
})();
