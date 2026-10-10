# Eliza's Calendar

A month calendar for the iPad. She can type words on any day, add emoji stickers, pick a color for the day,
and decorate each month with a theme (Seasons changes by itself) and a letter style.

No build step. It's plain HTML, CSS and JS:

- `index.html`: the page
- `data.js`: themes, letter styles, colors and stickers (edit this to add more)
- `app.js`: how it works
- `sw.js`: offline support
- `icons/`: home-screen icons

Everything she makes is saved on the iPad (in the browser's local storage). The ⚙️ button has
"Save a backup" / "Load a backup" for grown-ups.

## Try it locally

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Then open `http://<this Mac's IP>:8080` in Safari on the iPad (same Wi-Fi).

## Put it on the iPad for real

Host the folder anywhere with HTTPS (GitHub Pages, Netlify, Cloudflare Pages). Open the URL in Safari on the iPad,
tap Share → **Add to Home Screen**. It opens full-screen like an app and works offline.
