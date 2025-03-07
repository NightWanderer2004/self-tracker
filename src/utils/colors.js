/**
 * Generates a color based on a score value using shades of rgba(79, 123, 152, 1)
 * @param {number} score - The score value (typically 0-10)
 * @param {number} opacity - Color opacity (0-1)
 * @param {number} lightness - Lightness adjustment (-100 to 100)
 * @returns {string} - RGBA color string
 */
export const generateColor = (score, opacity = 0.8, lightness = 0) => {
   // Normalize score to 0-1 range (assuming score is 0-10)
   const normalizedScore = Math.min(Math.max(score / 10, 0), 1)

   // Adjust lightness based on score (higher score = lighter color)
   const lightnessAdjustment = lightness + normalizedScore * 40

   // Base color components
   let r = 79
   let g = 123
   let b = 152

   // Adjust RGB values based on lightness
   if (lightnessAdjustment > 0) {
      // Lighten: move towards white (255, 255, 255)
      const factor = lightnessAdjustment / 100
      r = Math.min(r + (255 - r) * factor, 255)
      g = Math.min(g + (255 - g) * factor, 255)
      b = Math.min(b + (255 - b) * factor, 255)
   } else if (lightnessAdjustment < 0) {
      // Darken: move towards black (0, 0, 0)
      const factor = Math.abs(lightnessAdjustment) / 100
      r = Math.max(r * (1 - factor), 0)
      g = Math.max(g * (1 - factor), 0)
      b = Math.max(b * (1 - factor), 0)
   }

   return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${opacity})`
}

/**
 * Generates diverse colors based on index, all in the rgba(79, 123, 152, 1) family
 * @param {number} index - The index to generate color for
 * @param {number} opacity - Color opacity (0-1)
 * @param {number} saturationVariation - How much to vary the saturation (0-100)
 * @returns {string} - RGBA color string
 */
export const generatePastelColor = (index, opacity = 0.8, saturationVariation = 20) => {
   // Base color components
   const r = 79
   const g = 123
   const b = 152

   // Create variations based on index
   const variation = ((index * 30) % 100) - 30

   // Adjust RGB values based on variation
   let adjustedR = Math.min(Math.max(r + variation, 0), 255)
   let adjustedG = Math.min(Math.max(g + variation * 0.7, 0), 255)
   let adjustedB = Math.min(Math.max(b + variation * 0.5, 0), 255)

   return `rgba(${Math.round(adjustedR)}, ${Math.round(adjustedG)}, ${Math.round(adjustedB)}, ${opacity})`
}

/**
 * Generates a correlation cell background color using shades of rgba(79, 123, 152, 1)
 * @param {number|string} value - Correlation value or '-' for no data
 * @returns {string} - RGBA color string
 */
export const getCorrelationColor = value => {
   if (value === '-') {
      // No data - very light shade
      return 'rgba(79, 123, 152, 0.1)'
   } else if (value === 1) {
      // Self-correlation (diagonal) - medium shade
      return 'rgba(79, 123, 152, 0.3)'
   } else if (value > 0) {
      // Positive correlation - darker with higher correlation
      return generateColor(value, value * 0.8, 35)
   } else {
      // Negative correlation - lighter shade with lower opacity
      return generateColor(value, value * 0.8, -35)
   }
}
