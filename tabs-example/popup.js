// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

console.log("Hello from popup.js");
const tabs = await chrome.tabs.query({
  url: ["https://*/*"],
});

let currentPages = {};
chrome.runtime.sendMessage({ foo: "getPages" }, async (response) => {
  // use the response here
  console.log(response);
  currentPages = response;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator
  const collator = new Intl.Collator();
  tabs.sort((a, b) => collator.compare(a.title, b.title));

  const template = document.getElementById("li_template");
  const elements = new Set();
  for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);

    const title = tab.title.split("|")[0].trim();
    const pathname = new URL(tab.url);

    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = pathname;
    element.querySelector("a")?.addEventListener("click", async () => {
      // need to focus window as well as the active tab
      await chrome.tabs.update(tab?.id, { active: true });
      await chrome.windows.update(tab?.windowId, { focused: true });
    });
    element.querySelector(".opentime").textContent += currentPages[tab.id]
      ? ": " + getTimeDifference(currentPages[tab.id].startTime)
      : ": untracked";

    function getTimeDifference(startTime) {
      const start = new Date(startTime);
      const now = new Date();
      const milliseconds = now - start;
      const minutes = Math.floor(milliseconds / 1000 / 60);
      const seconds = Math.floor((milliseconds / 1000) % 60);
      return minutes + " minutes " + seconds + " seconds";
    }

    element.querySelector(".focustime").textContent += currentPages[tab.id]
      ? ": " +
        currentPages[tab.id].focus.reduce((acc, { startTime, endTime }) => {
          const start = new Date(startTime);
          const end = endTime ? new Date(endTime) : new Date();
          const milliseconds = acc + (end - start);
          return (
            Math.floor(milliseconds / 1000 / 60).toString() +
            " minutes " +
            Math.floor((milliseconds / 1000) % 60) +
            " seconds"
          );
        }, 0)
      : ": untracked";

    elements.add(element);
  }
  document.querySelector("ul").append(...elements);

  const button = document.querySelector("button");
  button.addEventListener("click", async () => {
    const tabIds = tabs.map(({ id }) => id);
    if (tabIds.length) {
      const group = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(group, { title: "DOCS" });
    }
  });
});

// Tab time tracking
// const FocusPeriod = {
//   startTime: String,
//   endTime: String,
// };

// const TAB_USAGE = {
//   tabId: Number,
//   index: Number,
//   active: Boolean, //we're using active instead of highlighted
//   url: String, //notice url is now optional
//   startTime: String,
//   endTime: String,
//   focus: Array, //storing multiple focus events of a tab
// };
