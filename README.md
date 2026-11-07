# Basel Buddhist Vihara

Website of the Basel Buddhist Vihara, a Sri Lankan Theravada temple in Basel,
Switzerland, run by SKBZ (Sri Kalyana Buddhistisches Zentrum).

**Domain:** https://baselbuddhistvihara.ch
**Languages:** German (default), English, Sinhala

## About the site

A calm, light, single-page website with a few extra pages:

| Page | What it shows |
| --- | --- |
| `index.html` | Home: photo slideshow, about, monks, programmes and events, YouTube playlists, gallery, contact form with map |
| `monks/*.html` | One page per monk |
| `donate.html` | Swiss QR bill and bank details |
| `community.html` | All community event albums, grouped by year |
| `event.html?id=…` | One event album with a photo lightbox |
| `404.html` | "Page not found" |

## Tech

- Plain HTML, CSS and JavaScript. No framework and no build step.
- [Lucide](https://lucide.dev) icons (pinned version) and Google Fonts
  (Cormorant Garamond, Inter).
- Contact form via [Formspree](https://formspree.io).
- Hosted on [Vercel](https://vercel.com), deployed automatically from `main`.

## Run it locally

Any static web server works, for example:

```bash
python -m http.server 5510
```

Then open http://localhost:5510. The site loads its texts and data with
`fetch()`, so opening `index.html` straight from the file system does not work.

## Project structure

```
assets/css/        style.css (all styles), fonts.css
assets/js/         i18n.js       language switcher
                   settings.js   on/off switches (e.g. the Poya programme)
                   main.js       navigation, slideshow, carousel, monks, form
                   gallery.js    photo lightbox
                   events.js     community albums
                   moonstone.js  footer ornament
assets/images/     web-ready photos (WebP, 800 px and 1600 px)
data/              translations.json, monks.json, events.json
```

## Common changes

- **Change a text:** edit `data/translations.json`. Every text exists in
  `de`, `en` and `si`.
- **Switch the Poya programme on or off:** `assets/js/settings.js`.
- **Add a monk:** add an entry to `data/monks.json`.
- **Add an event album:** put the photos in `assets/images/events/<id>/`
  (`<name>-800.webp` and `<name>-1600.webp`) and add one entry to
  `data/events.json`. No HTML needs to change.

`CLAUDE.md` has the full design rules and conventions.

## Credits

Design and development: Deshan John.
