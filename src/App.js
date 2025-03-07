import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { marked } from 'marked'

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

   // Container style
   const containerStyle = {
      maxWidth: '925px',
      margin: '0 auto',
      padding: '44px 16px',
      fontFamily: 'monospace',
      fontSize: '16px',
   }

   // Handle data after file is loaded
   const handleDataLoaded = (content, parsedEntries) => {
      setFileContent(content)
      setEntries(parsedEntries)
      setIsFileUploaded(true)
   }

   // Process data for visualizations when entries change
   useEffect(() => {
      if (entries.length > 0) {
         // Extract unique categories
         const uniqueCategories = extractCategories(entries)
         setCategories(uniqueCategories)

         // Prepare time series data with custom color generator
         const colorGenerator = index => generatePastelColor(index, 0.7, 30)
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
               <span style={{ opacity: 0.5 }}>[</span>Трекинг себя<span style={{ opacity: 0.5 }}>]</span>
            </h1>
            <FileUploader onDataLoaded={handleDataLoaded} />
         </div>

         {isFileUploaded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {timeSeriesData && <TimeSeriesChart timeSeriesData={timeSeriesData} />}
               {correlationData && <CorrelationMatrix correlationData={correlationData} categories={categories} />}
               <DailyScores entries={entries} />
            </div>
         )}
      </div>
   )
}

export default App
