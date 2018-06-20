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

            if (params.lang) {
                url += '&language=' + params.lang;
            }

            return mapsPromise = $.getScript(url);
        } else {
            throw new Error('Simplemap: No Google Maps API key found');
        }
    }

    function SimpleMap($field, data) {
        this.$field = $field;
        this.$inputLat = this.$field.find('.simplemap-lat');
        this.$inputLng = this.$field.find('.simplemap-lng');
        this.$inputZoom = this.$field.find('.simplemap-zoom');
        this.$mapCanvas = this.$field.find('.simplemap-canvas');

        this.isDisabled = this.$mapCanvas.hasClass('is-disabled');
        this.data = data;

        if (this.data.style) {
            var self = this;

            $.get(this.data.style).always(function (data, status) {
                if (status == 'success') {
                    self.data.map.styles = data;
                } else {
                    console.warn('Simplemap: Failed to load map styles from:', self.data.style);
                }

                self.init();
            });
        } else {
            this.init();
        }
    } SimpleMap.prototype = {
        init: function () {
            this.map = new google.maps.Map(this.$mapCanvas[0], this.data.map);
            this.pin = new google.maps.Marker(
                $.extend(this.data.marker || {}, {
                    map: this.map,
                    position: this.data.map.center,
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
            this.$field.closest('form').trigger('keep');
        }
    };

    $.fn.kirbySimplemap = function () {
        return this.each(function (i, element) {
            var $field = $(element);

            try {
                var fieldData = JSON.parse($field.attr('data-simplemap'));
            } catch (e) {
                throw new Error('Simplemap: Failed to parse data');
            }

            whenGoogleMapsLoaded({
                key: fieldData.key,
                lang: fieldData.lang
            }).then(function () {
                new SimpleMap($field, fieldData);
            });
        });
    };
})(jQuery);
