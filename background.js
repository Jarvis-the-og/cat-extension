// Manifest V3 service worker.
// When the user clicks the extension's toolbar icon, inject content.js
// into the active tab. This uses "activeTab" + "scripting" permissions
// instead of a persistently-running content script, so the extension
// only ever touches the page the user explicitly clicks on.

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } catch (err) {
    console.error("Cat-ify Images: failed to inject content script", err);
  }
});
