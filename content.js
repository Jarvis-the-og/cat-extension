// content.js
// Replaces every <img> on the page with a random cat image, and also
// watches for images added later (e.g. lazy-loaded / infinite-scroll
// pages) so those get cat-ified too.

(function () {
  const CAT_API_BASE = "https://cataas.com/cat";
  const PROCESSED_ATTR = "data-catified";

  function randomCatUrl(width, height) {
    // cataas.com returns a new random cat image on every request.
    // A cache-busting query param + optional width/height keeps the
    // request unique and lets us roughly preserve the original
    // image's footprint on the page.
    const params = new URLSearchParams();
    if (width) params.set("width", Math.max(1, Math.round(width)));
    if (height) params.set("height", Math.max(1, Math.round(height)));
    params.set("_", `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    return `${CAT_API_BASE}?${params.toString()}`;
  }

  function catifyImage(img) {
    if (img.hasAttribute(PROCESSED_ATTR)) return;
    img.setAttribute(PROCESSED_ATTR, "true");

    const width = img.getBoundingClientRect().width || img.naturalWidth || img.width;
    const height = img.getBoundingClientRect().height || img.naturalHeight || img.height;

    // Clear responsive-image attributes so the browser doesn't fall
    // back to the original source.
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.src = randomCatUrl(width, height);
  }

  function catifyAllImages() {
    document.querySelectorAll("img").forEach(catifyImage);
  }

  // Initial pass over everything currently on the page.
  catifyAllImages();

  // Keep watching for images added dynamically after the initial run
  // (e.g. infinite scroll, lazy loading, SPA navigation).
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.tagName === "IMG") {
          catifyImage(node);
        } else {
          node.querySelectorAll?.("img").forEach(catifyImage);
        }
      });
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Stop watching automatically after a while so the extension
  // doesn't run forever on pages the user has moved on from.
  setTimeout(() => observer.disconnect(), 5 * 60 * 1000);
})();
