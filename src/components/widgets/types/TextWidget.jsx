"use client"

import { useMemo } from "react"

const TextWidget = ({ config, preview, onEdit, onDelete }) => {
  const {
    content = "<p>Testo predefinito</p>",
    fontSize = "16px",
    color = "#000",
    backgroundColor = "#ffffff",
    padding = "16px",
    textAlign = "left",
    borderEnabled = false,
    borderColor = "#cccccc",
    borderWidth = "1px",
    borderStyle = "solid",
    borderRadius = "4px",
    shadowEnabled = false,
    shadowColor = "#000000",
    shadowBlur = "4px",
  } = config

  // Calcola lo stile in base alle configurazioni
  const style = useMemo(
    () => ({
      fontSize,
      color,
      backgroundColor,
      padding,
      textAlign,
      border: borderEnabled ? `${borderWidth} ${borderStyle} ${borderColor}` : "none",
      borderRadius: borderEnabled ? borderRadius : "0",
      boxShadow: shadowEnabled ? `0 0 ${shadowBlur} ${shadowColor}` : "none",
    }),
    [
      fontSize,
      color,
      backgroundColor,
      padding,
      textAlign,
      borderEnabled,
      borderWidth,
      borderStyle,
      borderColor,
      borderRadius,
      shadowEnabled,
      shadowBlur,
      shadowColor,
    ],
  )

  return (
    <div className={`text-widget relative ${preview ? "preview" : ""}`}>
      {!preview && (
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            aria-label="Modifica widget"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
            aria-label="Elimina widget"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      )}
      <div
        className={`widget-content group ${preview ? "bg-gray-50" : ""}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default TextWidget

