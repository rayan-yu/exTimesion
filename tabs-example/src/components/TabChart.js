import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const TabChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.label),
    datasets: [
      {
        label: 'Tab Open Time (minutes)',
        data: data.map((entry) => entry.openTime / 60000), // Convert milliseconds to minutes
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tab Focus Time (minutes)',
        data: data.map((entry) => entry.focusTime / 60000), // Convert milliseconds to minutes
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Time (minutes)',
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default TabChart;
