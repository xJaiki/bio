"use client"

import { useRef, useState, useEffect } from "react"

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null)
  const [html, setHtml] = useState(value || "")

  useEffect(() => {
    if (editorRef.current && value !== html) {
      setHtml(value || "")
      editorRef.current.innerHTML = value || ""
    }
  }, [value])

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
  }

  const handleInput = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML
      setHtml(newHtml)
      onChange(newHtml)
    }
  }

  return (
    <div className="rich-text-editor w-full">
      <div className="toolbar flex flex-wrap gap-1 mb-2 p-1 border border-gray-300 rounded bg-gray-50">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-1 hover:bg-gray-200 rounded"
          title="Grassetto"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-1 hover:bg-gray-200 rounded"
          title="Corsivo"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-1 hover:bg-gray-200 rounded"
          title="Sottolineato"
        >
          <u>U</u>
        </button>
        <span className="w-px h-6 bg-gray-300 mx-1"></span>
      </div>
      <div
        ref={editorRef}
        className="editor min-h-[150px] p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        contentEditable="true"
        onInput={handleInput} // Usa onInput invece di onKeyUp
      />
    </div>
  )
}

export default RichTextEditor
