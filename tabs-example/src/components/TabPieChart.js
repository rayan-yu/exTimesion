import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const TabPieChart = ({ data }) => {
  if (!data) {
    return <div>No data available</div>;
  }

  console.log('TabPieChart Data:', data);

  const chartData = {
    labels: ['Focus Time (minutes)', 'Open Time (minutes)'],
    datasets: [
      {
        data: [data.focusTime / 60000, data.openTime / 60000], // Convert milliseconds to minutes
        backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(153, 102, 255, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: `Most Active Tab: ${data.label}`,
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default TabPieChart;
