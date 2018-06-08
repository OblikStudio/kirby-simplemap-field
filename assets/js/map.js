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
            throw new Error('Simplemap: No Google Maps API key found!');
        }
    }

    function SimpleMap($field) {
        this.$field = $field;
        this.$inputLat = this.$field.find('.simplemap-lat');
        this.$inputLng = this.$field.find('.simplemap-lng');
        this.$inputZoom = this.$field.find('.simplemap-zoom');
        this.$mapCanvas = this.$field.find('.simplemap-canvas');

        this.isDisabled = this.$mapCanvas.hasClass('is-disabled');

        this.settings = JSON.parse(
            this.$mapCanvas.attr('data-map-settings')
        );

        this.markerSettings = this.$mapCanvas.attr('data-marker-settings');
        if (this.markerSettings) {
            try {
                this.markerSettings = JSON.parse(this.markerSettings);
            } catch (e) {
                this.markerSettings = null;
                console.warn('Couldn’t parse marker settings:', e);
            }
        }

        this.init();
    } SimpleMap.prototype = {
        init: function () {
            this.map = new google.maps.Map(this.$mapCanvas[0], this.settings);
            this.pin = new google.maps.Marker(
                $.extend(this.markerSettings, {
                    map: this.map,
                    position: this.settings.center,
                    draggable: !this.isDisabled
                })
            );

            if (!this.isDisabled) {
                this.listen();
            }
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
        return this.each(function (i, element) {
            var $field = $(element);

            whenGoogleMapsLoaded({
                key: $field.attr('data-google-maps-key'),
                language: $field.attr('data-google-maps-language')
            }).then(function () {
                new SimpleMap($field);
            });
        });
    };
})(jQuery);
