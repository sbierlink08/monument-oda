# Monument ODA — GitHub Pages staging

Files in this folder get uploaded to `github.com/<your-username>/monument-oda` and served via GitHub Pages. After Pages is enabled, the live URL is:

    https://<your-username>.github.io/monument-oda/

## What each file does

| File | Job |
|---|---|
| `index.html` | The ODA widget. Same code as `Claude storability model downloads/Current_2026-03-27_session9/Orchard Decision Aid/orchard_decision_aid.html`, plus a manifest link, a service-worker registration block, and a hidden update banner. Build stamp: `build 2026-04-25.gh-pages-pwa-v1`. |
| `manifest.json` | PWA metadata. App name, icon, theme colors, display mode (`standalone` = no browser chrome when installed). Tells Android Chrome the page is installable. |
| `service-worker.js` | Cache + auto-update logic. Caches `index.html` on first visit so the page loads instantly. On every later visit, checks the network in the background. If a new version is found, swaps it into the cache and posts a message to the page; the page shows a "New version available — tap to reload" banner. One tap reloads on the new code. |
| `icon.svg` | Home-screen / app-launcher icon. Apple silhouette with ODA wordmark. Fine to swap later for a Monument logo. |

## How updates work

1. You edit `index.html` (or any file) on github.com — pencil icon → paste → Commit changes.
2. Pages rebuilds and deploys in 30–60 seconds.
3. Next time you (or anyone with the PWA installed) opens the app, the old version loads instantly from cache. The service worker fetches the new version in the background, swaps it into cache, and a banner appears: "New version available — tap to reload".
4. Tap the banner. Page reloads. You're on the new code.

No manual cache clears, no reinstall, no Add-to-Home-Screen redo.

## Verifying locally

From the staging folder, you can test before pushing:

    python -m http.server 8000

Then open http://localhost:8000/ in Chrome. DevTools → Application tab → Service Workers should show the worker registered. Manifest tab should show "ODA" with no errors.

## Updating the widget after first deploy

Two ways:

**Web edit (recommended for small changes):**
1. github.com/<username>/monument-oda
2. Click `index.html`
3. Pencil icon (top right of file viewer)
4. Paste new content (or edit inline)
5. Scroll down, click "Commit changes"

**Drag-drop (recommended when you have multiple files to update):**
1. github.com/<username>/monument-oda
2. "Add file" → "Upload files"
3. Drag the new file in
4. "Commit changes"

Service worker handles the rest on the user side.
