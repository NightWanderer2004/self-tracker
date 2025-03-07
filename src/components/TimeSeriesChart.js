import React from 'react'
import { Line } from 'react-chartjs-2'

/**
 * Component for displaying time series data as a line chart
 */
const TimeSeriesChart = ({ timeSeriesData }) => {
   const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
         y: {
            beginAtZero: true,
            grid: {
               color: 'rgba(79, 123, 152, 0.15)',
               lineWidth: 1.5,
            },
            ticks: {
               font: {
                  size: 14,
                  family: 'monospace',
               },
               color: 'rgba(79, 123, 152, 0.8)',
            },
         },
         x: {
            grid: {
               color: 'rgba(79, 123, 152, 0.15)',
               lineWidth: 1.5,
            },
            ticks: {
               font: {
                  size: 14,
                  family: 'monospace',
               },
               color: 'rgba(79, 123, 152, 0.8)',
            },
         },
      },
      plugins: {
         legend: {
            position: 'bottom',
            labels: {
               font: {
                  size: 14,
                  family: 'monospace',
               },
               color: 'rgba(79, 123, 152, 1)',
               padding: 15,
            },
         },
         tooltip: {
            bodyFont: {
               size: 14,
               family: 'monospace',
            },
            titleFont: {
               size: 16,
               family: 'monospace',
            },
            backgroundColor: 'rgba(79, 123, 152, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(79, 123, 152, 0.2)',
            borderWidth: 1,
            padding: 10,
         },
      },
   }

   return (
      <div style={{ marginBottom: '2rem' }}>
         <h3 style={{ fontSize: '22px' }}>Динамика показателей во времени</h3>
         <div style={{ height: '400px' }}>
            <Line data={timeSeriesData} options={chartOptions} />
         </div>
      </div>
   )
}

export default TimeSeriesChart
