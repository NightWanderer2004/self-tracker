import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// Import components
import FileUploader from './components/FileUploader'
import TimeSeriesChart from './components/TimeSeriesChart'
import CorrelationMatrix from './components/CorrelationMatrix'
import DailyScores from './components/DailyScores'

// Import utilities
import { extractCategories, prepareTimeSeriesData, calculateCorrelations } from './utils/dataProcessing'
import { generatePastelColor } from './utils/colors'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function App() {
   // State variables
   const [entries, setEntries] = useState([])
   const [fileContent, setFileContent] = useState('')
   const [isFileUploaded, setIsFileUploaded] = useState(false)
   const [correlationData, setCorrelationData] = useState(null)
   const [categories, setCategories] = useState([])
   const [timeSeriesData, setTimeSeriesData] = useState(null)
   const [isDarkMode, setIsDarkMode] = useState(false)

   // Container style
   const containerStyle = {
      maxWidth: '925px',
      margin: '0 auto',
      padding: '44px 16px',
      fontSize: '16px',
   }

   // Handle data after file is loaded
   const handleDataLoaded = (content, parsedEntries) => {
      setFileContent(content)
      setEntries(parsedEntries)
      setIsFileUploaded(true)
   }

   // Check system preference for dark mode on initial load
   useEffect(() => {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDarkMode)

      if (prefersDarkMode) {
         document.body.classList.add('dark-theme')
      } else {
         document.body.classList.remove('dark-theme')
      }

      // Listen for changes in system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = e => {
         setIsDarkMode(e.matches)
         if (e.matches) {
            document.body.classList.add('dark-theme')
         } else {
            document.body.classList.remove('dark-theme')
         }
      }

      mediaQuery.addEventListener('change', handleChange)

      // Cleanup listener on component unmount
      return () => {
         mediaQuery.removeEventListener('change', handleChange)
      }
   }, [])

   // Process data for visualizations when entries change
   useEffect(() => {
      if (entries.length > 0) {
         // Extract unique categories
         const uniqueCategories = extractCategories(entries)
         setCategories(uniqueCategories)

         // Prepare time series data with custom color generator
         // Keep using the original blue accent colors regardless of theme
         const colorGenerator = index => generatePastelColor(index, 0.7, 30, false)
         const timeData = prepareTimeSeriesData(entries, uniqueCategories, colorGenerator)
         setTimeSeriesData(timeData)

         // Calculate correlations
         const correlations = calculateCorrelations(entries, uniqueCategories)
         setCorrelationData(correlations)
      }
   }, [entries])

   return (
      <div style={containerStyle}>
         <div style={{ marginBottom: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '28px', margin: '0' }}>
               <span style={{ opacity: isDarkMode ? 1 : 0.5, color: isDarkMode ? 'rgba(79, 123, 152, 1)' : '' }}>[</span>Трекинг себя
               <span style={{ opacity: isDarkMode ? 1 : 0.5, color: isDarkMode ? 'rgba(79, 123, 152, 1)' : '' }}>]</span>
            </h1>
            <FileUploader onDataLoaded={handleDataLoaded} />
         </div>

         {isFileUploaded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {timeSeriesData && <TimeSeriesChart timeSeriesData={timeSeriesData} />}
               {correlationData && <CorrelationMatrix correlationData={correlationData} categories={categories} />}
               {entries.length > 0 && <DailyScores entries={entries} />}
            </div>
         )}
      </div>
   )
}

export default App
