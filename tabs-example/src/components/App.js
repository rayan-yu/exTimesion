import React, { useEffect, useState } from 'react';
import TabList from './TabList';
import TabChart from './TabChart';
import TabPieChart from './TabPieChart';

const App = () => {
  const [tabs, setTabs] = useState([]);
  const [currentPages, setCurrentPages] = useState({});

  useEffect(() => {
    chrome.runtime.sendMessage({ foo: 'getPages' }, (response) => {
      setCurrentPages(response || {});
      chrome.tabs.query({ url: ["https://*/*"] }, (tabs) => {
        setTabs(tabs);
      });
    });
  }, []);

  const chartData = tabs.map((tab) => ({
    label: new URL(tab.url).hostname,
    openTime: currentPages[tab.id]?.startTime ? new Date() - new Date(currentPages[tab.id].startTime) : 0,
    focusTime: currentPages[tab.id]?.focus ? currentPages[tab.id].focus.reduce((acc, { startTime, endTime }) => {
      const start = new Date(startTime);
      const end = endTime ? new Date(endTime) : new Date();
      return acc + (end - start);
    }, 0) : 0,
  }));

  console.log('Chart Data:', chartData);

  const mostActiveTab = chartData.length > 0 
    ? chartData.reduce((max, tab) => (tab.focusTime > max.focusTime ? tab : max), chartData[0])
    : null;

  console.log('Most Active Tab:', mostActiveTab);

  return (
    <div style={{ padding: '10px' }}>
      <h1>exTimesion</h1>
      <button style={{ marginBottom: '20px' }}>Group currently active tabs</button>
      <TabList tabs={tabs} currentPages={currentPages} />
      <div style={{ marginTop: '20px' }}>
        <TabChart data={chartData} />
      </div>
      <div style={{ marginTop: '20px' }}>
        {mostActiveTab ? <TabPieChart data={mostActiveTab} /> : <div>No active tabs</div>}
      </div>
    </div>
  );
};

export default App;
