import React from 'react';

const TabItem = ({ tab, currentPages }) => {
  const getTimeDifference = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const milliseconds = now - start;
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.floor((milliseconds / 1000) % 60);
    return `${minutes} minutes ${seconds} seconds`;
  };

  const formatMilliseconds = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.floor((milliseconds / 1000) % 60);
    return `${minutes} minutes ${seconds} seconds`;
  };

  return (
    <li style={{ padding: '10px', borderBottom: '1px solid #ccc', backgroundColor: '#f7f7f7' }}>
      <a href={tab.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>
        <h3 className="domain">{new URL(tab.url).hostname}</h3>
        <h4 className="title">{tab.title}</h4>
        <p className="pathname">{tab.url}</p>
        <p className="opentime">
          {currentPages[tab.id]?.startTime ? `Tab Open Time: ${getTimeDifference(currentPages[tab.id].startTime)}` : 'Tab Open Time: untracked'}
        </p>
        <p className="focustime">
          {currentPages[tab.id]?.focus ? `Tab Focus Time: ${formatMilliseconds(currentPages[tab.id].focus.reduce((acc, { startTime, endTime }) => {
            const start = new Date(startTime);
            const end = endTime ? new Date(endTime) : new Date();
            return acc + (end - start);
          }, 0))}` : 'Tab Focus Time: untracked'}
        </p>
      </a>
    </li>
  );
};

export default TabItem;
