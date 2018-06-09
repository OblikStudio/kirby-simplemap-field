# Simplemap Field
Very quick, simple, easy, flexible and 100% working integration for Google Maps in the Kirby CMS Panel.

## Features
- Localization: The map language is set to the language of the panel, providing a consistent experience.
- Readonly/disabled support: The map will be disabled when the field has `translate: false` and a non-primary language is selected, for example.
- UI/UX settings: You can change the map UI (`zoomControl`, `fullscreenControl`...) and UX (`gestureHandling`) directly from your blueprint.
- Marker settings: Like the map settings, you can also change the various marker functionality via blueprints.
- Variable width: Works perfectly with the default Kirby `width` blueprint property, as seen on the screenshots.
- Height setting: You can set the height of the map as a ratio relative to its width, like `16:9`, `4:3`, `1:1`, any pair of numbers will do.
- Smart script loading: In case some other plugin loaded Google Maps in the panel already, nothing will be loaded.

## Screenshots

On the left, there’s a map with 2/3 width, 16:9 size ratio and the default Google Maps settings. On the right, there’s a map with 1/3 width, 1:1 ratio, customized map settings (no UI), custom marker (pin) styles and the field has `translate: false`. Both maps are in English because the panel is in that language.

![Simplemap field in primary language](https://i.imgur.com/UQrPrKi.jpg)

On this screenshot, the panel language was switched to Bulgarian and the site (translation) language was also set to Bulgarian. As you can see, both maps are displayed in that language and the map on the right is disabled because it has `translate: false`. Disabled maps can be interacted with, but the user won’t be able to change marker position.

![Simplemap field in secondary language](https://i.imgur.com/thNwWoj.jpg)

## Installation

Open a terminal and navigate to your root Kirby folder:

```sh
cd /var/www/html/my-kirby-project
```

Then use git submodules:

```sh
git submodule add https://github.com/hdodov/kirby-simplemap-field.git site/fields/simplemap
```

or simply clone the repo:

```sh
git clone https://github.com/hdodov/kirby-simplemap-field.git site/fields/simplemap
```

Make sure that the repository is under `site/fields/simplemap` and that `simplemap.php` is inside that folder.

## Usage

After you’ve installed the field, open your `config/config.php` and add your Google Maps API key:

```php
c::set('google.maps.key', '__________GOOGLE_MAPS_API_KEY__________');
```

Then open a blueprint and use the field:

```yaml
fields:
  location:
    label: Location
    type: simplemap
```

Now you should have a working location picker field!

## Options

### Default Kirby stuff

You’ve got no problem using `width`, `disabled`, `help`...

```yaml
location:
  label: Location
  type: simplemap
  width: 2/3
  disabled: true
  help: Drag the marker or click on the map to change the location.
```

### Map height

You can set the map height relative to its width as a ratio. Any pair of numbers will work:

```yaml
location:
  label: Location
  type: simplemap
  ratio: 16:9 # or 4:3, 1:1, 4:20, 999:666
```

### Map settings

The map settings you specify in your blueprint are directly passed as JSON to the JavaScript that initializes the map. Technically you can change everything specified in the [Google Maps documentation](https://developers.google.com/maps/documentation/javascript/controls):

```yaml
location:
  label: Location
  type: simplemap
  map:
    zoom: 7 # default zoom
    center:
      lat: 42.693752936972366 # default latitude
      lng: 23.328649668569142 # default longitude
    disableDefaultUI: true
    zoomControl: true
    fullscreenControl: true
    gestureHandling: cooperative # zoom the map with ctrl + mousewheel
```

### Marker settings

Marker settings work the same way map settings work, meaning you can change everything specified in the [Google Maps Marker documentation](https://developers.google.com/maps/documentation/javascript/markers):

```yaml
location:
  label: Location
  type: simplemap
  marker:
    icon: https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png
    title: Drag me!
```

---

**Warning:** Map and marker settings are passed to the Google Maps API as primitive values! Settings that expect a non-primitve value **will not work**. For example, if you try to specify a marker animation:

```yaml
location:
  label: Location
  type: simplemap
  marker:
    animation: google.maps.Animation.DROP
```

This will not work! The API will receive `"google.maps.Animation.DROP"` as a string. It won’t access the `google` object.

**Conclusion:** Use the map and marker settings to change values that expect a string, number or boolean, like the ones up in the examples.
