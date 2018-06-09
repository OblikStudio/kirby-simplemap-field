<?php

class SimplemapField extends InputField {
    public $type = 'simplemap';

    static public $assets = array(
        'css' => array('map.css'),
        'js' => array('map.js')
    );

    public function get_field_data() {
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

        $data = array(
            'key'   => c::get('google.maps.key'),
            'lang'  => panel()->translation()->code(),
            'map'   => $mapSettings
        );

        if (!empty($this->marker)) {
            $data['marker'] = $this->marker;
        }

        return $data;
    }

    public function content() {
        $fieldData = $this->get_field_data();

        $field = new Brick('div');
        $field->addClass('field-content');

        if (empty($fieldData['key'])) {
            $field->append('Missing Google Maps API key config setting.');
            return $field;
        }

        $field->data('simplemap', json_encode($fieldData, JSON_NUMERIC_CHECK));
        $field->data('field', 'kirbySimplemap'); // jQuery plugin, defined in assets/js/map.js

        $map = new Brick('div');
        $map->addClass('simplemap-canvas input');

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

        $field->append($map);
        $field->append($this->create_input('lat', $fieldData['map']['center']['lat']));
        $field->append($this->create_input('lng', $fieldData['map']['center']['lng']));
        $field->append($this->create_input('zoom', $fieldData['map']['zoom']));

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
