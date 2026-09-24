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

## Production

- Host: `root@nettyw.com`
- Repository: `/root/nettyw.com`, branch `main`
- nginx config: `/etc/nginx/sites-available/nettyw.com`
- Web root: `/var/www/nettyw.com`

Push the reviewed commit, then pull with `git pull --ff-only` in the server
repository and verify the commit. Back up the web root before publishing.
Export tracked files with `git archive HEAD` into a staging directory and copy
them with `rsync -rlt --delay-updates` into the web root, preserving its existing
permissions and ownership (a temporary staging directory is private by default).
Publish assets first and atomically replace `index.html` last. No nginx reload is needed
for static asset changes. Check HTTPS, both destination links, QR dialog,
mobile layout, and the custom 404 after deployment.

To roll back, restore the saved web root with `rsync -a --delay-updates`.
