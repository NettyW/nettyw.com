# nettyw.com

A small personal homepage: a floating cat-planet, a Twitch bot link, and Telegram.
Plain HTML, CSS, and JavaScript. No build step or runtime dependencies.

## Local preview

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765. The homepage uses `resources/home.css` and
`resources/home.js`; the older `/pages/` routes keep `resources/styles.css`.
Manrope is hosted locally, with its SIL Open Font License in `resources/fonts/`.

Animations respect the device's reduced-motion preference and can be paused
using the header button. The preference is saved locally when storage is
available. The main links and inline QR code also work without JavaScript.

## Publishing

This is a static site. Publish `index.html`, `resources/`, and `pages/` to the
configured web root. Back up the current release first, preserve the existing
directory permissions and ownership, publish assets first, and replace
`index.html` last. No application build or restart is required.

After publishing, check HTTPS, both destination links, the QR dialog, mobile
layout, and the custom 404. Restore the backup to roll back.
