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

## Installing as an app (one-time per device)

Without installing, the URL opens in a browser tab — not what Steven wants on phone or iPad. Install once per device for a real home-screen app that runs in standalone mode (no browser chrome).

**Android — Chrome:**
1. Open `https://sbierlink08.github.io/monument-oda/` in Chrome on Android.
2. 3-dot menu (top right) → "Install app" (or "Add to Home screen" on older Chrome).
3. Confirm name "ODA" → Install.
4. App icon lands on the Android home screen.
5. Tap to open — runs full-screen, no browser bars.

**iPad — Safari ONLY (Chrome on iPad CANNOT install PWAs):**
Apple restricts PWA install to Safari on iPadOS / iOS. Chrome and other browsers on iPad cannot install the app — they'll only open the URL in a tab.

1. Open `https://sbierlink08.github.io/monument-oda/` in **Safari on iPad** (not Chrome on iPad).
2. Tap the Share button (square with arrow up, center bottom of Safari).
3. Scroll down in the share sheet → tap "Add to Home Screen".
4. Confirm name "ODA" → Add.
5. App icon lands on the iPad home screen.
6. Tap to open — runs in standalone mode, no Safari chrome, full-screen.

After install, future taps on the icon open the standalone PWA. The browser tab is the un-installed flow.

**iPhone — Safari ONLY:** same path as iPad. Chrome on iPhone cannot install PWAs either.

**Desktop (Windows / Mac) — Chrome or Edge:**
1. Open the URL in Chrome / Edge.
2. Address bar → install icon (small monitor with down arrow on the right side of the URL bar) or 3-dot menu → "Install Monument ODA".
3. App opens in its own window; pinned to taskbar / dock.

## How sync works between devices

Every install is the same GitHub-hosted `index.html`. So all devices run the same code; updates pushed to `main` reach every install on the next visit through the service worker.

Per-device data (orchard entries, bloom logs, fruit tests) is local to each device unless the Cloud Sync (Google Drive) feature is configured. With Cloud Sync configured to the same Apps Script URL on every device:

- Save on phone → POSTs full state to Drive → next time desktop or iPad opens the app, it GETs from Drive and adopts the newer state.
- Same in reverse.
- Concurrent edits on two devices simultaneously is last-write-wins on the full state — no merge logic. For typical Steven workflow (phone in field, desktop later in office), this is fine. Avoid having two devices open + actively logging at the same instant if you can.

The Cloud Sync URL field is in Settings → Cloud Sync (Google Drive). Paste the same Apps Script web-app URL on every device.

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
