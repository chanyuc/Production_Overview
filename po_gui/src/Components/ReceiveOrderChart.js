import React from 'react';
import ReceiveOrderCount from './ReceiveOrderCount';
import ProductionHourly from './ProductionHourly';

import { Line } from 'react-chartjs-2'; 
import { Chart, registerables } from 'chart.js';
import '../CSS/ProductionDataChart.css';
import { options } from './chartOptions';
Chart.register(...registerables);

const ReceiveOrderChart = () => {
  const chartData1 = ReceiveOrderCount();
  const chartData2 = ProductionHourly();
  if (!chartData1 || !chartData2) { return <div>Loading...</div>; }

  const RecentLabels = chartData1.labels.slice(-12);
  const RecentData1 = chartData1.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.slice(-12)
  }));
  const RecentData2 = chartData2.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.slice(-12)
  }));

  const multiLineData = {
    labels: RecentLabels,
    datasets: [
        ...RecentData1,
        ...RecentData2
    ]
  };

  return (
    <div className="production-chart-container">
      <div className="production-chart">
        <h2 className='text-color'>Receive Order Chart</h2>
        <Line className='production-graph' data={multiLineData} options={options} />
      </div>
    </div>
  );
};

export default ReceiveOrderChart;
