(function ($) {
    var mapsPromise;

    function whenGoogleMapsLoaded(params) {
        if (mapsPromise) {
            return mapsPromise;
        }

        if (
            typeof google != 'undefined' &&
            typeof google.maps != 'undefined'
        ) { 
            return mapsPromise = $.when(); // already resolved promise
        }

        var url = 'https://maps.googleapis.com/maps/api/js';
        if (params.key) {
            url += '?key=' + params.key;

            if (params.language) {
                url += '&language=' + params.language;
            }

            return mapsPromise = $.getScript(url);
        } else {
            throw new Error('Simplemap: No map API key found!');
        }
    }

    function MapField($field) {
        this.$field = $field;
        this.$inputLat = this.$field.find('.simplemap-lat');
        this.$inputLng = this.$field.find('.simplemap-lng');
        this.$inputZoom = this.$field.find('.simplemap-zoom');
        this.$mapCanvas = this.$field.find('.simplemap-canvas');

        this.settings = {
            zoom: parseInt(this.$inputZoom.val()) || 1,
            center: {
                lat: parseFloat(this.$inputLat.val()) || 0,
                lng: parseFloat(this.$inputLng.val()) || 0
            },

            disableDefaultUI: true,
            zoomControl: true,
            fullscreenControl: true,
            gestureHandling: 'cooperative'
        };

        this.init();
    } MapField.prototype = {
        init: function () {
            this.map = new google.maps.Map(this.$mapCanvas[0], this.settings);
            this.pin = new google.maps.Marker({
                position: new google.maps.LatLng(this.settings.center.lat, this.settings.center.lng),
                map: this.map,
                draggable: true
            });
            this.listen();
        },

        listen: function () {
            var self = this;

            this.pin.addListener('dragend', function (event) {
                self.updatePosition(event.latLng);
            });

            this.map.addListener('click', function (event) {
                self.updatePosition(event.latLng);
            });

            this.map.addListener('zoom_changed', function () {
                self.$inputZoom.val(self.map.getZoom());
            });
        },

        updatePosition: function (position) {
            this.$inputLat.val(position.lat());
            this.$inputLng.val(position.lng());
            this.pin.setPosition(position);
        }
    };

    $.fn.kirbySimplemap = function () {
        var $field = $(this);

        whenGoogleMapsLoaded({
            key: $field.attr('data-google-maps-key'),
            language: $field.attr('data-google-maps-language')
        }).then(function () {
            new MapField($field);
        });
    };
})(jQuery);
