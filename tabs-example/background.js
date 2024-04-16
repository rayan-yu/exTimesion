let currentPages = [];

chrome.tabs.onCreated.addListener((tab) => {
  console.log("Here in the created listener");
  const tabIndex = currentPages.findIndex((page) => page.tabId === tab.id);
  if (tabIndex === -1) {
    currentPages = [
      ...currentPages,
      {
        tabId: tab.id,
        startTime: new Date().toISOString(),
        focus: [],
      },
    ];
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("Here in the activated listener");
  const previousActiveTabIndex = currentPages.findIndex((page) => page.active);
  if (previousActiveTabIndex !== -1) {
    currentPages[previousActiveTabIndex].active = false;
    const focusLength = currentPages[previousActiveTabIndex].focus.length;
    currentPages[previousActiveTabIndex].focus[focusLength - 1].endTime =
      new Date().toISOString();
  }
  const newActiveTabIndex = currentPages.findIndex(
    (page) => page.tabId === activeInfo.tabId
  );
  if (newActiveTabIndex > 0) {
    currentPages[newActiveTabIndex].active = true;
    currentPages[newActiveTabIndex].focus.push({
      startTime: new Date().toISOString(),
      endTime: "",
    });
  } else {
    currentPages = [
      ...currentPages,
      {
        tabId: activeInfo.tabId,
        active: true,
        startTime: new Date().toISOString(),
        focus: [{ startTime: new Date().toISOString(), endTime: "" }],
      },
    ];
  }
});
