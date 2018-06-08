# Simplemap Field
Very quick, simple, easy, flexible and 100% working integration for Google Maps in Kirby.

![Simplemap field in primary language](https://i.imgur.com/UQrPrKi.jpg)
![Simplemap field in secondary language](https://i.imgur.com/thNwWoj.jpg)

## Features
- Localization: The map language is set to the language of the panel, providing a consistent experience.
- Readonly/disabled support: The map will be disabled when the field has `translate: false` and a non-primary language is selected, for example.
- UI/UX settings: You can change the map UI (`zoomControl`, `fullscreenControl`...) and UX (`gestureHandling`) directly from your blueprint.
- Marker settings: Like the map settings, you can also change the various marker functionality via blueprints.
- Smart script loading: In case some other plugin loaded Google Maps in the panel already, nothing will be loaded.
- Variable width: Works perfectly with the default Kirby `width` blueprint property, as seen on the screenshot above.
- Height setting: You can set the height of the map as a ratio relative to its width, like 16:9, 4:3, 1:1, any pair of numbers will do.