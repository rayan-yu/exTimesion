let currentPages = {};

// Load data from local storage when the background script initializes
chrome.storage.local.get(["pages"], (result) => {
  if (result.pages) {
    currentPages = result.pages;
    console.log("Loaded from storage", currentPages);
  }
});

chrome.tabs.onCreated.addListener((tab) => {
  console.log("Here in the created listener");
  if (!currentPages.hasOwnProperty(tab.id)) {
    currentPages[tab.id] = {
      startTime: new Date().toISOString(),
      focus: [],
    };
    saveCurrentPages();
    console.log("Tab created", currentPages);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("Here in the activated listener");
  const previousActiveTabId = Object.keys(currentPages).find(
    (tabId) => currentPages[tabId].active
  );
  if (previousActiveTabId) {
    currentPages[previousActiveTabId].active = false;
    const focusLength = currentPages[previousActiveTabId].focus.length;
    currentPages[previousActiveTabId].focus[focusLength - 1].endTime =
      new Date().toISOString();
  }
  if (currentPages.hasOwnProperty(activeInfo.tabId)) {
    currentPages[activeInfo.tabId].active = true;
    currentPages[activeInfo.tabId].focus.push({
      startTime: new Date().toISOString(),
      endTime: "",
    });
  } else {
    currentPages[activeInfo.tabId] = {
      active: true,
      startTime: new Date().toISOString(),
      focus: [{ startTime: new Date().toISOString(), endTime: "" }],
    };
  }
  saveCurrentPages();
  console.log(currentPages);
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.foo === "getPages") {
    sendResponse(currentPages);
    return true; // Indicates that the response will be sent asynchronously
  }
});

function saveCurrentPages() {
  chrome.storage.local.set({ pages: currentPages }, () => {
    console.log("Current pages saved to storage", currentPages);
  });
}
