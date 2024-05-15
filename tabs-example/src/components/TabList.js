import React from "react";
import TabItem from "./TabItem";

const TabList = ({ tabs, currentPages }) => {
  const collator = new Intl.Collator();
  tabs.sort((a, b) => collator.compare(a.title, b.title));
  console.log("tabs: " + JSON.stringify(tabs));
  console.log("current pages: " + JSON.stringify(currentPages));

  // Group tabs by hostname
  const tabGroups = tabs.reduce((groups, tab) => {
    const hostname = new URL(tab.url).hostname;
    if (!groups[hostname]) {
      groups[hostname] = [];
    }
    groups[hostname].push(tab);
    return groups;
  }, {});

  return (
    <ul>
      {Object.entries(tabGroups).map(([hostname, tabs]) => (
        <TabItem key={hostname} tabs={tabs} currentPages={currentPages} />
      ))}
    </ul>
  );
};

export default TabList;
