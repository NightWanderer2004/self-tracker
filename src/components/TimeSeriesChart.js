import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

/**
 * Component for displaying time series data as a line chart
 */
const TimeSeriesChart = ({ timeSeriesData }) => {
   const [isDarkMode, setIsDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

   useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = e => {
         setIsDarkMode(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
   }, [])

   // Get text color based on theme - white for dark mode, blue for light mode
   const textColor = isDarkMode ? 'rgba(252, 252, 249, 0.8)' : 'rgba(79, 123, 152, 0.8)'
   const textColorSolid = isDarkMode ? 'rgba(252, 252, 249, 1)' : 'rgba(79, 123, 152, 1)'

   // Keep grid color subtle in both modes
   const gridColor = isDarkMode ? 'rgba(252, 252, 249, 0.15)' : 'rgba(79, 123, 152, 0.15)'

   // We don't modify the dataset colors - they remain in the accent blue color

   const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
         y: {
            beginAtZero: true,
            grid: {
               color: gridColor,
               lineWidth: 1.5,
            },
            ticks: {
               font: {
                  size: 14,
                  family: 'monospace',
               },
               color: textColor,
            },
         },
         x: {
            grid: {
               color: gridColor,
               lineWidth: 1.5,
            },
            ticks: {
               font: {
                  size: 14,
                  family: 'monospace',
               },
               color: textColor,
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
               color: textColorSolid,
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
