# Simplemap Field
Very quick, simple, easy, flexible and 100% working integration for Google Maps in the Kirby CMS Panel.

## Features
- Localization: The map language is set to the language of the panel, providing a consistent experience.
- Readonly/disabled support: The map will be disabled when the field has `translate: false` and a non-primary language is selected, for example.
- UI/UX settings: You can change the map UI (`zoomControl`, `fullscreenControl`...) and UX (`gestureHandling`) directly from your blueprint.
- Marker settings: Like the map settings, you can also change the various marker functionality via blueprints.
- Map styling: You can style the map however you wish with styles from [Snazzy Maps](https://snazzymaps.com/).
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

### Map styles

To add a custom style to your map, you need to have a JSON file with the style data inside. Let’s say we want to add [this style](https://snazzymaps.com/style/72543/assassins-creed-iv) to a map:

1. Copy the JavaScript style array from Snazzy Maps

2. Save the array in `assets/maps/style.json`

3. Open `config/config.php` and register a new style by pointing to the file:

   ```php
   c::set('google.maps.styles.assassins', kirby()->urls()->assets() . '/maps/style.json');
   ```

4. In your blueprint, add the `style` property:

   ```yaml
   location:
     label: Location
     type: simplemap
     style: assassins
   ```

5. The map is styled!

   ![Simplemap with Snazzy Maps styles](https://i.imgur.com/4WnO3j3.png)

---

You can register any style by setting a configuration variable like that:

```
c::set('google.maps.styles.STYLE_NAME', 'STYLE_JSON_FILE_URL');
```

And then use it by specifying the name in the blueprint:

```yaml
style: STYLE_NAME
```

## Comparing with other plugins

### [kirby-map-field](https://github.com/AugustMiller/kirby-map-field) by [August Miller](https://github.com/AugustMiller)

Simplemap is actually an overhaul of kirby-map-field. Despite it being a great plugin, it had some functionalities that didn’t align with my needs:

- It uses the route `example.com/maps/key` to serve the Google Maps API key. This is a bit tricky to handle if you use URL rewriting, which I do. For that reason, Simplemap passes the API key as an attribute to the actual field in the panel. From there, JavaScript knows where to look and gets the key. No routes involved.

- Has poor user experience (in my opinion). Whenever you zoom in/out, it pans to the current marker position. If I want to move the pin from New York to Moscow, I need to drag it all the way from one place to the other while the map is constantly being panned to the marker. Simplemap doesn’t pan the map at all. You can simply zoom out, navigate to the place you want and just click to place the marker. You can drag it, but you’re not _forced_ to do so.

- Has locked map settings. For example, zooming in/out with your mousewheel is disabled. With Simplemap, you have all the control _and_ you can control the marker settings.

- Doesn’t use the panel’s language to display the map.

- Doesn’t work with readonly/disabled fields. On a multi-language site, you can change the location in any translation, which is unneeded.

- It uses the deprecated Google JSAPI loader https://www.google.com/jsapi to load Google Maps.

- Its address field can’t be hidden and if you don’t enable the Geolocation API, that field is obsolete.

- Its latitude and longitude fields are clutter. If you’re the content manager, you probably don’t care about coordinates.