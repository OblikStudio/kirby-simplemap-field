<?php

class SimplemapField extends InputField {
    public $type = 'simplemap';

    static public $assets = array(
        'css' => array('map.css'),
        'js' => array('map.js')
    );

    public function content() {
        if (!empty($this->map)) {
            $mapSettings = $this->map;
        } else {
            $mapSettings = array(
                'zoom' => 2,
                'center' => array(
                    'lat' => 0,
                    'lng' => 0
                )
            );
        }

        if (!empty($this->value)) {
            $parsed = (array)yaml::decode($this->value); // get saved values
            $mapSettings['zoom'] = $parsed['zoom'];
            $mapSettings['center'] = array(
                'lat' => $parsed['lat'],
                'lng' => $parsed['lng']
            );
        }

        $field = new Brick('div');
        $field->addClass('field-content');

        if (!c::get('google.maps.key')) {
            $field->append('Missing Google Maps API key config setting.');
            return $field;
        }

        $field->data('field', 'kirbySimplemap'); // jQuery plugin, defined in assets/js/map.js
        $field->data('google-maps-key', c::get('google.maps.key'));
        $field->data('google-maps-language', panel()->translation()->code());

        $map = new Brick('div');
        $map->addClass('simplemap-canvas input');
        $map->data('map-settings', json_encode($mapSettings, JSON_NUMERIC_CHECK));

        if ($this->readonly() || $this->disabled()) {
            $map->addClass('is-disabled');
        }

        if (!empty($this->ratio)) {
            $ratioParts = explode(':', $this->ratio);

            if (count($ratioParts) == 2 && $ratioParts[0] > 0) {
                $paddingValue = ($ratioParts[1] / $ratioParts[0]) * 100;
                $map->attr('style', "padding-top: $paddingValue%;");
            } 
        }

        if (!empty($this->marker)) {
            $map->data('marker-settings', json_encode($this->marker, JSON_NUMERIC_CHECK));
        }

        $field->append($map);
        $field->append($this->create_input('lat', $mapSettings['center']['lat']));
        $field->append($this->create_input('lng', $mapSettings['center']['lng']));
        $field->append($this->create_input('zoom', $mapSettings['zoom']));

        return $field;
    }

    public function create_input($key, $value) {
        $input = new Brick('input');
        $input->attr('type', 'hidden');
        $input->attr('name', $this->name() . "[$key]");
        $input->addClass("simplemap-$key");
        $input->val($value);

        return $input;
    }

    public function result() {
        $input = parent::result();
        return yaml::encode($input);
    }
}
