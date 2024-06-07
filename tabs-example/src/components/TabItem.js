import React from "react";

const TabItem = ({ tabs, currentPages }) => {
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

  const groupedTabs = tabs.reduce((acc, tab) => {
    const domain = new URL(tab.url).hostname;
    if (!acc[domain]) {
      acc[domain] = [];
    }
    acc[domain].push(tab);
    return acc;
  }, {});
  
  const handleRemove = (id) => {
    chrome.tabs.remove(id);
    return;
  };

  return (
    <>
      {Object.entries(groupedTabs).map(([domain, tabs]) => (
        <div key={domain}>
          <h3 className="domain">{domain}</h3>
          <ul>
            {tabs.map((tab) => (
              <li
                key={tab.id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                  backgroundColor: "#f7f7f7",
                }}
              >
                <a
                  href={tab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <h4 className="title">{tab.title}</h4>
                  <p className="pathname">{tab.url}</p>
                  <p className="opentime">
                    {currentPages[tab.id]?.startTime
                      ? `Tab Open Time: ${getTimeDifference(
                          currentPages[tab.id].startTime
                        )}`
                      : "Tab Open Time: untracked"}
                  </p>
                  <p className="focustime">
                    {currentPages[tab.id]?.focus
                      ? `Tab Focus Time: ${formatMilliseconds(
                          currentPages[tab.id].focus.reduce(
                            (acc, { startTime, endTime }) => {
                              const start = new Date(startTime);
                              const end = endTime
                                ? new Date(endTime)
                                : new Date();
                              return acc + (end - start);
                            },
                            0
                          )
                        )}`
                      : "Tab Focus Time: untracked"}
                  </p>
                </a>
                <button 
                  onClick={() => handleRemove(tab.id)} 
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#3d3d3d',
                    marginLeft: '10px'
                  }}
                  title="Close tab"
                >
                  &#128465;
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default TabItem;
