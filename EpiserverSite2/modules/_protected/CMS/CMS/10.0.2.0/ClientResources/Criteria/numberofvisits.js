 (function () {

    return {
         createUI: function (namingContainerPrefix, container, settings) {
             this.languageKeys = '/shell/cms/visitorgroups/criteria/numberofvisits/thresholdtolargewarning,/shell/cms/visitorgroups/criteria/numberofvisits/required';
             this.prototype.createUI.apply(this, arguments);
         },

         uiCreated: function (namingContainer) {
             var timeFrameSelectionId = namingContainer + 'TimeFrameSelection';
             var fixTimeId = namingContainer + 'fixtime';
             var floatTimeId = namingContainer + 'floattime';

             var timeSelection = dijit.byId(timeFrameSelectionId);
             var widgetFloatTime = dijit.byId(namingContainer + 'FloatTimeValue');
             var widgetFixTime = dijit.byId(namingContainer + 'FixTime');

             var onSelectionChanged = function (newValue, namingContainer) {

                 switch (newValue) {
                 case '1':
                     // Within, only numer of days/weeks/month/years should be visible of the extra fields
                     dojo.byId(fixTimeId).style.display = 'none';
                     widgetFixTime.set('value', null);

                     dojo.byId(floatTimeId).style.display = '';

                     break;
                 case '2':
                     // Since, only the dateTime should be visible of the extra fields
                     dojo.byId(fixTimeId).style.display = '';

                     dojo.byId(floatTimeId).style.display = 'none';
                     widgetFloatTime.set('value', 0);
                     break;
                 default:
                     // In total, no extra fields should be displayed
                     dojo.byId(fixTimeId).style.display = 'none';
                     widgetFixTime.set('value', null);

                     dojo.byId(floatTimeId).style.display = 'none';
                     widgetFloatTime.set('value', 0);
                     break;
                 }
             };
             dojo.connect(timeSelection, 'onChange', this, onSelectionChanged);
             //Call to trigger visibility from start when loading existing settings.
             onSelectionChanged(timeSelection.value, namingContainer);
         },

         validate: function (namingContainer) {
             var validationErrors = this.prototype.validate.apply(this, arguments);

             var timeFrame = dijit.byId(namingContainer + 'TimeFrameSelection');
             if (timeFrame.value !== '0') {
                 var thresHold = dijit.byId(namingContainer + 'Threshold');
                 if (thresHold.value > 10) {
                     validationErrors.Add(this.translatedText['/shell/cms/visitorgroups/criteria/numberofvisits/thresholdtolargewarning'], thresHold);
                 }
             }

             // Within - floattime
             if (timeFrame.value == '1') {
                 var floatTimePeriod = dijit.byId(namingContainer + 'FloatTimePeriod');
                 if (floatTimePeriod.value == '') {
                     validationErrors.Add(this.translatedText['/shell/cms/visitorgroups/criteria/numberofvisits/required'], floatTimePeriod);
                 }

                 var floatTimeValue = dojo.byId(namingContainer + 'FloatTimeValue');
                 if (!floatTimeValue.value) {
                     validationErrors.Add(this.translatedText['/shell/cms/visitorgroups/criteria/numberofvisits/required'], dijit.byId(namingContainer + 'FloatTimeValue'));
                 }
             }

             // Since - fixtime
             if (timeFrame.value == '2') {
                 var fixTime = dijit.byId(namingContainer + 'FixTime');
                 if (fixTime.value == null && fixTime.textbox.value == '') {
                     validationErrors.Add(this.translatedText['/shell/cms/visitorgroups/criteria/numberofvisits/required'], fixTime);
                 }
             }

             return validationErrors;
         }
     };
})();
