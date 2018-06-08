<?php

class SimplemapField extends InputField {
    static public $assets = array(
        'js' => array(
            'map.js'
        ),
        'css' => array(
            'map.css'
        )
    );

    public function content() {
        if (!empty($this->map)) {
            $this->data = $this->map;
        } else {
            $this->data = array();
        }

        if (!empty($this->value)) {
            // Overwrite blueprint values with the saved values.
            $parsedValue = (array)yaml::decode($this->value);
            $this->data = array_merge($this->data, $parsedValue);
        }

        $field = new Brick('div');
        $field->addClass('field-content');

        $field->data('field', 'kirbySimplemap'); // jQuery plugin, defined in assets/js/map.js
        $field->data('google-maps-key', c::get('google.maps.key'));
        $field->data('google-maps-language', panel()->translation()->code());

        $mapContainer = new Brick('div');
        $mapContainer->addClass('simplemap-canvas input');

        if (!empty($this->data['ratio'])) {
            $ratioParts = explode(':', $this->data['ratio']);

            if (count($ratioParts) == 2 && $ratioParts[0] > 0) {
                $paddingValue = ($ratioParts[1] / $ratioParts[0]) * 100;
                $mapContainer->attr('style', "padding-top: $paddingValue%;");
            } 
        }

        $field->append($mapContainer);
        $field->append($this->create_input('lat'));
        $field->append($this->create_input('lng'));
        $field->append($this->create_input('zoom'));

        return $field;
    }

    public function create_input($key) {
        $input = new Brick('input');
        $input->attr('type', 'hidden');
        $input->attr('name', $this->name() . "[$key]");
        $input->addClass("simplemap-$key");

        if (!empty($this->data[$key])) {
            $input->val($this->data[$key]);
        }

        return $input;
    }

    public function result() {
        $input = parent::result();
        return yaml::encode($input);
    }
}
