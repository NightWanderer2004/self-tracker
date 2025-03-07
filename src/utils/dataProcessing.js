/**
 * Parses markdown content into structured data entries
 * @param {string} content - Markdown content to parse
 * @returns {Array} - Array of parsed entries with metrics and average scores
 */
export const parseMdContent = content => {
   const lines = content.split('\n')
   const parsedEntries = []
   let currentDate = ''
   let currentEntry = {}

   lines.forEach(line => {
      // Match date format DD.MM.YY
      const dateMatch = line.match(/^##?\s*(\d{2}\.\d{2}\.\d{2})/)
      if (dateMatch) {
         if (currentDate) {
            // Calculate average score before adding the entry
            if (Object.keys(currentEntry.metrics).length > 0) {
               const scores = Object.values(currentEntry.metrics).map(m => m.score)
               currentEntry.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
            }
            parsedEntries.push(currentEntry)
         }
         currentDate = dateMatch[1]
         currentEntry = { date: currentDate, metrics: {}, averageScore: 0 }
      }
      // Match metrics in format "- **category** → description (score)"
      else if (line.match(/^-\s*\*\*([^*]+)\*\*\s*→/)) {
         const [_, category] = line.match(/^-\s*\*\*([^*]+)\*\*\s*→/)

         // Extract score from parentheses at the end of the line
         const scoreMatch = line.match(/\((\d+)\)\s*$/)
         const score = scoreMatch ? parseInt(scoreMatch[1]) : 5 // Default to 5 if no score found

         // Extract description (everything between → and (score))
         let description = line.split('→')[1].trim()
         if (scoreMatch) {
            description = description.substring(0, description.lastIndexOf('(')).trim()
         }

         currentEntry.metrics[category.trim()] = {
            description: description,
            score: score,
         }
      }
   })

   // Process the last entry
   if (Object.keys(currentEntry).length > 0) {
      // Calculate average score for the last entry
      if (Object.keys(currentEntry.metrics).length > 0) {
         const scores = Object.values(currentEntry.metrics).map(m => m.score)
         currentEntry.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
      }
      parsedEntries.push(currentEntry)
   }

   return parsedEntries
}

/**
 * Extracts unique categories from entries
 * @param {Array} entries - Array of data entries
 * @returns {Array} - Array of unique category names
 */
export const extractCategories = entries => {
   return Array.from(new Set(entries.flatMap(entry => Object.keys(entry.metrics))))
}

/**
 * Prepares time series data for Chart.js
 * @param {Array} entries - Array of data entries
 * @param {Array} categories - Array of category names
 * @param {Function} colorGenerator - Function to generate colors
 * @returns {Object} - Chart.js compatible data object
 */
export const prepareTimeSeriesData = (entries, categories, colorGenerator) => {
   return {
      labels: entries.map(entry => entry.date),
      datasets: categories.map((category, index) => ({
         label: category,
         data: entries.map(entry => entry.metrics[category]?.score || null),
         fill: false,
         borderWidth: 1.5,
         borderStyle: 'solid',
         borderColor: colorGenerator(index + 6, 80, 65),
         backgroundColor: colorGenerator(index + 6, 80, 75),
         tension: 0.3,
         pointRadius: 5,
         pointHoverRadius: 8,
      })),
   }
}

/**
 * Calculates correlation matrix between categories
 * @param {Array} entries - Array of data entries
 * @param {Array} categories - Array of category names
 * @returns {Object} - Correlation matrix
 */
export const calculateCorrelations = (entries, categories) => {
   const correlations = {}

   categories.forEach(cat1 => {
      correlations[cat1] = {}
      categories.forEach(cat2 => {
         if (cat1 === cat2) {
            correlations[cat1][cat2] = 1
            return
         }

         // Collect all pairs where both metrics are present
         const pairs = entries
            .filter(entry => entry.metrics[cat1] && entry.metrics[cat2])
            .map(entry => [entry.metrics[cat1].score, entry.metrics[cat2].score])

         // Minimum 3 pairs required for correlation calculation
         if (pairs.length < 3) {
            correlations[cat1][cat2] = '-'
            return
         }

         // Calculate Pearson correlation
         const x = pairs.map(p => p[0])
         const y = pairs.map(p => p[1])
         const meanX = x.reduce((a, b) => a + b, 0) / x.length
         const meanY = y.reduce((a, b) => a + b, 0) / y.length

         let covariance = 0
         let varX = 0
         let varY = 0

         for (let i = 0; i < pairs.length; i++) {
            const xDiff = x[i] - meanX
            const yDiff = y[i] - meanY
            covariance += xDiff * yDiff
            varX += xDiff * xDiff
            varY += yDiff * yDiff
         }

         const correlation = covariance / (Math.sqrt(varX) * Math.sqrt(varY))
         correlations[cat1][cat2] = isNaN(correlation) ? '-' : correlation
      })
   })

   return correlations
}
