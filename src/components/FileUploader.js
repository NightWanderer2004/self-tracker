import React, { useState, useRef } from 'react'
import { parseMdContent } from '../utils/dataProcessing'

/**
 * Component for uploading and processing markdown files
 */
const FileUploader = ({ onDataLoaded }) => {
   const [fileName, setFileName] = useState('Выберите файл .md')
   const fileInputRef = useRef(null)

   /**
    * Handles file upload and processes the content
    * @param {Event} event - The file input change event
    */
   const handleFileUpload = event => {
      const file = event.target.files[0]
      if (!file) return

      setFileName(file.name)

      const reader = new FileReader()
      reader.onload = e => {
         const content = e.target.result
         const parsedEntries = parseMdContent(content)
         onDataLoaded(content, parsedEntries)
      }

      reader.readAsText(file)
   }

   const handleButtonClick = () => {
      fileInputRef.current.click()
   }

   return (
      <div>
         <div
            style={{
               display: 'flex',
               alignItems: 'center',
               gap: '10px',
            }}
         >
            <button
               onClick={handleButtonClick}
               style={{
                  backgroundColor: '#4f7b98',
                  color: 'white',
                  border: 'none',
                  padding: '7px 14px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
               }}
               onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3a5e70')}
               onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4f7b98')}
            >
               Загрузить файл
            </button>
            {/* <span
               style={{
                  fontSize: '16px',
                  color: '#4f7b98',
                  fontFamily: 'monospace',
                  border: '1.5px solid rgba(79, 123, 152, 0.1)',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(79, 123, 152, 0.05)',
                  flexGrow: 1,
               }}
            >
               {fileName}
            </span> */}
         </div>
         <input
            type='file'
            accept='.md'
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{
               display: 'none', // Hide the native input
            }}
         />
      </div>
   )
}

export default FileUploader
