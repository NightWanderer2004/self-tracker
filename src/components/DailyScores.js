import React from 'react'
import { generateColor } from '../utils/colors'

/**
 * Component for displaying daily score cards
 */
const DailyScores = ({ entries }) => {
   return (
      <div style={{ marginBottom: '2rem' }}>
         <h3 style={{ fontSize: '22px' }}>Дневные рейты</h3>
         <div
            style={{
               display: 'grid',
               gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
               gap: '10px',
            }}
         >
            {entries.map((entry, index) => (
               <div
                  key={index}
                  style={{
                     border: '1.5px solid rgba(79, 123, 152, 0.2)',
                     padding: '15px',
                     backgroundColor: generateColor(entry.averageScore, 0.3 * entry.averageScore * 0.35, 35),
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                  }}
               >
                  <h4 style={{ margin: 0, color: 'rgba(79, 123, 152, 1)' }}>{entry.date}</h4>
                  <div
                     style={{
                        backgroundColor: generateColor(entry.averageScore, 0.3 * entry.averageScore * 0.3, -35),
                        padding: '6px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: 'white',
                        borderRadius: '3px',
                     }}
                  >
                     [{entry.averageScore.toFixed(1)}]
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

export default DailyScores
