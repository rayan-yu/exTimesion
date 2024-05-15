import React from 'react';
import TabItem from './TabItem';

const TabList = ({ tabs, currentPages }) => {
  const collator = new Intl.Collator();
  tabs.sort((a, b) => collator.compare(a.title, b.title));

  return (
    <ul>
      {tabs.map((tab) => (
        <TabItem key={tab.id} tab={tab} currentPages={currentPages} />
      ))}
    </ul>
  );
};

export default TabList;
