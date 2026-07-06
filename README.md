# Cat-ify Images

A Chrome extension (Manifest V3) that replaces every image on the current webpage with a random cat image.

## What it does

Click the extension's toolbar icon on any webpage, and every `<img>` on that page is swapped out for a fresh random cat photo fetched from the [cataas.com](https://cataas.com) API. Images added to the page later (lazy-loaded content, infinite scroll, etc.) get cat-ified automatically too.

## How it works

| File | Purpose |
|---|---|
| `manifest.json` | Manifest V3 config. Declares `activeTab` + `scripting` permissions and `host_permissions` for `cataas.com`. |
| `background.js` | Service worker. Listens for toolbar icon clicks and injects `content.js` into the active tab only. |
| `content.js` | Finds all `<img>` elements, clears `srcset`/`sizes`, and sets `src` to a new random cat image URL (roughly matching the original image's dimensions). Uses a `MutationObserver` to catch images added to the DOM after the initial pass, and auto-disconnects after 5 minutes. |
| `icons/` | Toolbar icon assets (16px, 48px, 128px). |

The extension only runs when you click its icon — it doesn't run automatically on every page load, and it doesn't require permission to read all your browsing (`activeTab` limits it to the tab you're currently on).

## Installation (Developer Mode)

1. Download and unzip `cat-extension.zip`.
2. Open Chrome and go to `chrome://extensions`.
3. Toggle **Developer mode** on (top-right corner).
4. Click **Load unpacked** and select the unzipped `cat-extension` folder.
5. The extension is now installed. Click the puzzle-piece icon in Chrome's toolbar, find **Cat-ify Images**, and click the pin icon to keep it visible in your toolbar.

## Usage

1. Navigate to any webpage.
2. Click the Cat-ify Images icon in the toolbar.
3. All images on the page are replaced with random cats.

## Technologies Used

- JavaScript
- Chrome Extensions Manifest V3
- Chrome Scripting API (`chrome.scripting.executeScript`)
- MutationObserver (Web API)
- [cataas.com](https://cataas.com) — Cat as a Service API

## Known limitations

- Only affects `<img>` elements — CSS `background-image` styles are not replaced.
- Some sites with unusual image-loading patterns (e.g. blob URLs, shadow DOM, canvas-rendered images) may not be fully covered.
- The `MutationObserver` stops watching after 5 minutes to avoid running indefinitely on pages you've navigated away from in spirit but left open.