# StormRadar

StormRadar is a lightweight, USB-portable severe-weather radar interface. Read the radar. Respect the storm.

## Use from a USB drive

1. Copy the entire `OS` folder to a flash drive.
2. Open `index.html` in a modern browser.
3. Choose a country or region and select a display mode.
4. Choose **Set up my radar**. Preferences are saved in that browser on that laptop.

The app itself is only a few kilobytes. The interactive base map loads Leaflet and OpenStreetMap tiles from the internet, so live map imagery needs a connection. If the drive is used offline, the setup screen and saved interface still open, but external map tiles and production radar feeds will not be available.

## Current prototype scope

- Country selector covering ISO 3166 regions
- Light and dark display modes
- Portable local preference storage
- Interactive map with zoom, recenter, storm cells, lightning points, alert list, and layer toggles
- Responsive layout for laptop and smaller screens

The storm cells in this prototype are visual demo data. A production release should connect the layer controls to a licensed weather provider or government feed for live radar, alerts, hail, tornado, wind, and lightning data.
