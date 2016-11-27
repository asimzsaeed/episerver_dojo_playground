(function () {
    return {
        uiCreated: function (namingContainer) {

            var location = dojo.byId(namingContainer + 'Location');
            if (location.value == 'undefined' || location.value == 'null') {
                location.value = '';
            }

            var latitude = dojo.byId(namingContainer + 'Latitude');
            if (latitude.value == 'undefined' || latitude.value == 'null') {
                latitude.value = '';
            }

            var longitude = dojo.byId(namingContainer + 'Longitude');
            if (longitude.value == 'undefined' || longitude.value == 'null') {
                longitude.value = '';
            }

            this.setGeographicCoordinates(namingContainer, { 'location': location.value, 'latitude': latitude.value, 'longitude': longitude.value, 'showLatLng': false });

            var radiusWidget = dijit.byId(namingContainer + 'Radius');

            radiusWidget.set('constraints', { 'min': 0 });
            if (!radiusWidget.value && radiusWidget.value !== 0) {
                radiusWidget.set('value', 10);
            }

            var type = this.typeName;
            dojo.require('dijit.form.Button');
            new dijit.form.Button({
                    label: dojo.byId(namingContainer + 'SelectLocation').value,
                    onClick: function () {
                        var lat = dojo.byId(namingContainer + 'Latitude').value;
                        var lng = dojo.byId(namingContainer + 'Longitude').value;
                        open('../Geographic/CoordinatePicker?namingContainer=' + escape(namingContainer) + '&lat=' + escape(lat) + '&lng=' + escape(lng) + '&typeName=' + escape(type), 'locationPicker', 'location=0,status=0,scrollbars=0,width=600,height=500');
                    }
                },
                dojo.byId(namingContainer + 'SelectLocation'));
        },

        createUI: function (namingContainer, container, settings) {
            this.prototype.createUI.apply(this, arguments);
        },

        getSettings: function (namingContainer) {
            return this.prototype.getSettings.apply(this, arguments);
        },

        setGeographicCoordinates: function (namingContainer, values) {

            function roundedNumber(number, decimals) {
                return (Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
            }

            var location = dojo.byId(namingContainer + 'Location');
            location.value = values.location;

            var latitude = dojo.byId(namingContainer + 'Latitude');
            latitude.value = values.latitude;

            var longitude = dojo.byId(namingContainer + 'Longitude');
            longitude.value = values.longitude;


            var locationPlaceholder = dojo.byId(namingContainer + 'LocationPlaceholder');

            locationPlaceholder.style.display = (values.location != '') ? 'inline' : 'none';

            var latitudeLongitudePlaceholder = dojo.byId(namingContainer + 'LatitudeLongitudePlaceholder');

            latitudeLongitudePlaceholder.style.display = values.showLatLng ? 'inline' : 'none';


            var displayLocation = dojo.byId(namingContainer + 'DisplayLocation');
            if (typeof (displayLocation.innerText) == 'string') {
                displayLocation.innerText = values.location;
            } else {
                displayLocation.textContent = values.location;
            }

            var latitudeValue = roundedNumber(values.latitude, 3);
            var displayLatitude = dojo.byId(namingContainer + 'DisplayLatitude');
            if (typeof (displayLatitude.innerText) == 'string') {
                displayLatitude.innerText = latitudeValue;
            } else {
                displayLatitude.textContent = latitudeValue;
            }

            var longitudeValue = roundedNumber(values.longitude, 3);
            var displayLongitude = dojo.byId(namingContainer + 'DisplayLongitude');
            if (typeof (displayLongitude.innerText) == 'string') {
                displayLongitude.innerText = longitudeValue;
            } else {
                displayLongitude.textContent = longitudeValue;
            }
        }
    };
})();
