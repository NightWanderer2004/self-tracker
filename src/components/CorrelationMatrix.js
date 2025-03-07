import React from 'react'
import { getCorrelationColor } from '../utils/colors'

/**
 * Component for displaying a correlation matrix between categories
 */
const CorrelationMatrix = ({ correlationData, categories }) => {
   return (
      <div style={{ marginBottom: '2rem' }}>
         <h3 style={{ fontSize: '22px' }}>Корреляционная матрица</h3>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', margin: '0', width: '100%', fontSize: '16px' }}>
               <thead>
                  <tr>
                     <th style={{ padding: '10px', border: '1.5px solid rgba(79, 123, 152, 0.2)' }}></th>
                     {categories.map(cat => (
                        <th key={cat} style={{ padding: '10px', border: '1.5px solid rgba(79, 123, 152, 0.2)' }}>
                           {cat}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {categories.map(cat1 => (
                     <tr key={cat1}>
                        <td style={{ padding: '10px', border: '1.5px solid rgba(79, 123, 152, 0.2)', fontWeight: 'bold' }}>{cat1}</td>
                        {categories.map(cat2 => {
                           const value = correlationData[cat1][cat2]
                           const backgroundColor = getCorrelationColor(value)

                           return (
                              <td
                                 key={cat2}
                                 style={{
                                    padding: value === 1.0 ? '5px' : '10px',
                                    border: '1.5px solid rgba(79, 123, 152, 0.2)',
                                    backgroundColor: backgroundColor,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: value === 1.0 ? '28px' : 'inherit',
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
