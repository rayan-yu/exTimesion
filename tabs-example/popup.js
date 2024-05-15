console.log("Hello from popup.js");

async function getTabs() {
  return await chrome.tabs.query({ url: ["https://*/*"] });
}

let currentPages = {};

// Utility function to get time difference
function getTimeDifference(startTime) {
  const start = new Date(startTime);
  const now = new Date();
  const milliseconds = now - start;
  const minutes = Math.floor(milliseconds / 1000 / 60);
  const seconds = Math.floor((milliseconds / 1000) % 60);
  return minutes + " minutes " + seconds + " seconds";
}

// Utility function to format milliseconds
function formatMilliseconds(milliseconds) {
  const minutes = Math.floor(milliseconds / 1000 / 60);
  const seconds = Math.floor((milliseconds / 1000) % 60);
  return minutes + " minutes " + seconds + " seconds";
}

// Initialize extension
function initializeExtension(tabs) {
  const collator = new Intl.Collator();
  tabs.sort((a, b) => collator.compare(a.title, b.title));

  const template = document.getElementById("li_template");
  const elements = new Set();
  const domains = new Set();

  for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);

    const title = tab.title.split("|")[0].trim();
    const pathname = new URL(tab.url);
    const domain = pathname.hostname;

    if (domains.has(domain)) {
      console.log("Duplicate domain found: ", domain);
      for (let el of elements) {
        if (el.querySelector(".domain").textContent === domain) {
          el.querySelector(".opentime").textContent += currentPages[tab.id]
            ? " | Additional tab: " + getTimeDifference(currentPages[tab.id].startTime)
            : " | Additional tab: untracked";

          el.querySelector(".focustime").textContent += currentPages[tab.id]
            ? " | Additional tab: " +
              formatMilliseconds(
                currentPages[tab.id].focus.reduce((acc, { startTime, endTime }) => {
                  const start = new Date(startTime);
                  const end = endTime ? new Date(endTime) : new Date();
                  return acc + (end - start);
                }, 0)
              )
            : " | Additional tab: untracked";
        }
      }
    } else {
      domains.add(domain);

      element.querySelector(".domain").textContent = domain;
      element.querySelector(".title").textContent = title;
      element.querySelector(".pathname").textContent = pathname;

      element.querySelector("a")?.addEventListener("click", async () => {
        await chrome.tabs.update(tab?.id, { active: true });
        await chrome.windows.update(tab?.windowId, { focused: true });
      });

      element.querySelector(".opentime").textContent += currentPages[tab.id]
        ? ": " + getTimeDifference(currentPages[tab.id].startTime)
        : ": untracked";

      element.querySelector(".focustime").textContent += currentPages[tab.id]
      ? " | Additional tab: " +
        formatMilliseconds(
          currentPages[tab.id].focus.reduce((acc, { startTime, endTime }) => {
            const start = new Date(startTime);
            const end = endTime ? new Date(endTime) : new Date();
            return acc + (end - start);
          }, 0)
        )
      : " | Additional tab: untracked";

      elements.add(element);
    }
  }

  document.querySelector("ul").append(...elements);

  const button = document.querySelector("button");
  button.addEventListener("click", async () => {
    const tabIds = tabs.map(({ id }) => id);
    if (tabIds.length) {
      const group = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(group, { title: "Active Tabs" });
    }
  });
}

// Load data from background script and initialize extension
chrome.runtime.sendMessage({ foo: "getPages" }, async (response) => {
  if (response) {
    currentPages = response;
    console.log("Loaded from background script", currentPages);
  }

  const tabs = await getTabs();
  initializeExtension(tabs);
});
