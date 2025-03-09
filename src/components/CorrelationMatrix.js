import React, { useEffect, useState } from 'react'
import { getCorrelationColor } from '../utils/colors'

/**
 * Component for displaying a correlation matrix between categories
 */
const CorrelationMatrix = ({ correlationData, categories }) => {
   const [isDarkMode, setIsDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

   useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = e => {
         setIsDarkMode(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
   }, [])

   // Get text and border colors based on theme
   const textColor = isDarkMode ? 'rgba(252, 252, 249, 1)' : 'rgba(79, 123, 152, 1)'
   const borderColor = isDarkMode ? 'rgba(252, 252, 249, 0.2)' : 'rgba(79, 123, 152, 0.2)'

   return (
      <div style={{ marginBottom: '2rem' }}>
         <h3 style={{ fontSize: '22px' }}>Корреляционная матрица</h3>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', margin: '0', width: '100%', fontSize: '16px' }}>
               <thead>
                  <tr>
                     <th style={{ padding: '10px', border: `1.5px solid ${borderColor}`, color: textColor }}></th>
                     {categories.map(cat => (
                        <th key={cat} style={{ padding: '10px', border: `1.5px solid ${borderColor}`, color: textColor }}>
                           {cat}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {categories.map(cat1 => (
                     <tr key={cat1}>
                        <td style={{ padding: '10px', border: `1.5px solid ${borderColor}`, fontWeight: 'bold', color: textColor }}>{cat1}</td>
                        {categories.map(cat2 => {
                           const value = correlationData[cat1][cat2]
                           // Keep using blue accent colors for cells (isDarkMode = false)
                           const backgroundColor = getCorrelationColor(value, false)
                           const cellTextColor = isDarkMode && value !== 1.0 && value !== '-' ? 'rgba(252, 252, 249, 1)' : 'inherit'

                           return (
                              <td
                                 key={cat2}
                                 style={{
                                    padding: value === 1.0 ? '5px' : '10px',
                                    border: `1.5px solid ${borderColor}`,
                                    backgroundColor: backgroundColor,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: value === 1.0 ? '28px' : 'inherit',
                                    color: cellTextColor,
                                 }}
                              >
                                 {value === '-' ? '-' : value === 1.0 ? '✦' : value.toFixed(2)}
                              </td>
                           )
                        })}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}

export default CorrelationMatrix
