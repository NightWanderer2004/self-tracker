import React, { useEffect, useState } from 'react'
import { generateColor } from '../utils/colors'

/**
 * Component for displaying daily score cards
 */
const DailyScores = ({ entries }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [displayedEntries, setDisplayedEntries] = useState([])
  const [currentInitialWeek, setCurrentInitialWeek] = useState(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = e => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    // Set initial week to current week
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust when day is Sunday
    const monday = new Date(today.setDate(diff))
    monday.setHours(0, 0, 0, 0)
    setCurrentWeekStart(monday)
    setCurrentInitialWeek(new Date(monday))
  }, [])

  useEffect(() => {
    if (entries.length === 0) return

    // Filter entries for the current week
    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(weekEnd.getDate() + 5)
    weekEnd.setHours(23, 59, 59, 999)

    const filtered = entries.filter(entry => {
      const entryDate = parseDate(entry.date)
      return entryDate >= currentWeekStart && entryDate <= weekEnd
    })

    setDisplayedEntries(filtered)
  }, [entries, currentWeekStart])

  // Parse date from DD.MM.YY format
  const parseDate = dateStr => {
    const parts = dateStr.split('.')
    if (parts.length === 3) {
      const year = 2000 + parseInt(parts[2])
      const month = parseInt(parts[1]) - 1
      const day = parseInt(parts[0])
      return new Date(year, month, day)
    }
    return new Date() // Return today if format is incorrect
  }

  // Format date to DD.MM.YY
  const formatDate = date => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(2)
    return `${day}.${month}.${year}`
  }

  const navigateWeek = direction => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + direction * 6)

    // Prevent navigation beyond current week
    if (direction > 0 && currentInitialWeek && newDate > currentInitialWeek) {
      setCurrentWeekStart(new Date(currentInitialWeek))
    } else {
      setCurrentWeekStart(newDate)
    }
  }

  const getWeekRangeText = () => {
    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(weekEnd.getDate() + 5)
    return `${formatDate(currentWeekStart)} - ${formatDate(weekEnd)}`
  }

  // Check if current week is displayed
  const isCurrentWeek = () => {
    if (!currentInitialWeek) return true
    return currentWeekStart.getTime() === currentInitialWeek.getTime()
  }

  // Get text color based on theme
  const textColor = isDarkMode ? 'rgba(252, 252, 249, 1)' : 'rgba(79, 123, 152, 1)'
  const borderColor = isDarkMode ? 'rgba(252, 252, 249, 0.2)' : 'rgba(79, 123, 152, 0.2)'
  const disabledColor = isDarkMode ? 'rgba(252, 252, 249, 0.3)' : 'rgba(79, 123, 152, 0.3)'

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '22px', margin: 0 }}>Дневные рейты</h3>
        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <button
            onClick={() => navigateWeek(-1)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: textColor,
              fontWeight: 'bold',
              fontFamily: 'Departure Mono',
            }}
          >
            {'«'}
          </button>
          <span style={{ margin: '0 4px', color: textColor }}>{getWeekRangeText()}</span>
          <button
            onClick={() => navigateWeek(1)}
            disabled={isCurrentWeek()}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: isCurrentWeek() ? 'not-allowed' : 'pointer',
              color: isCurrentWeek() ? disabledColor : textColor,
              fontWeight: 'bold',
              fontFamily: 'Departure Mono',
              opacity: isCurrentWeek() ? 0.5 : 1,
            }}
          >
            {'»'}
          </button>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
        }}
      >
        {displayedEntries.length > 0 ? (
          displayedEntries.map((entry, index) => (
            <div
              key={index}
              style={{
                border: `1.5px solid ${borderColor}`,
                padding: '15px',
                backgroundColor: generateColor(
                  entry.averageScore,
                  0.3 * entry.averageScore * 0.35,
                  isDarkMode ? 0 : 35
                ),
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h4 style={{ margin: 0, color: textColor }}>{entry.date}</h4>
              <div
                style={{
                  backgroundColor: generateColor(
                    entry.averageScore,
                    0.3 * entry.averageScore * 0.3,
                    isDarkMode ? -50 : -35
                  ),
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
          ))
        ) : (
          <div
            style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: textColor, fontWeight: 'bold' }}
          >
            Нет данных за выбранный период
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyScores
