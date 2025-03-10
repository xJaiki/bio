"use client"

import { useState, useRef, useEffect } from "react"
import WidgetRenderer from "./WidgetRenderer"
import RichTextEditor from "../editor/RichTextEditor"
import { motion, AnimatePresence, useAnimation } from "framer-motion"

const WidgetEditor = ({ widgetType, initialConfig = {}, onSave, onBack }) => {
  // Base configuration
  const [config, setConfig] = useState(
    widgetType === "text"
      ? {
          content: "<p>Inserisci il tuo testo...</p>",
          fontSize: "16px",
          color: "#000000",
          backgroundColor: "#ffffff",
          padding: "16px",
          textAlign: "left",
          borderEnabled: false,
          borderColor: "#cccccc",
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "4px",
          shadowEnabled: false,
          shadowColor: "#000000",
          shadowBlur: "4px",
          width: "100%", 
          height: "auto", 
          ...initialConfig,
        }
      : { ...initialConfig }
  )

  // UI State
  const [activeSection, setActiveSection] = useState("content")
  const [previewMode, setPreviewMode] = useState("floating") // floating, fullscreen, hidden
  const previewRef = useRef(null)
  const editorRef = useRef(null)
  const controls = useAnimation()
  const [isExpanded, setIsExpanded] = useState({})
  
  // Group properties for accordion display
  const propertyGroups = {
    content: ["content"],
    text: ["fontSize", "color", "textAlign"],
    background: ["backgroundColor", "padding"],
    border: ["borderEnabled", "borderColor", "borderWidth", "borderStyle", "borderRadius"],
    shadow: ["shadowEnabled", "shadowColor", "shadowBlur"],
    dimensions: ["width", "height"]
  }

  // Helper functions
  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleContentChange = (newContent) => {
    updateConfig("content", newContent)
  }

  const toggleExpand = (section) => {
    setIsExpanded(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const togglePropertyGroup = (group) => {
    setActiveSection(activeSection === group ? null : group)
  }

  const cyclePreviewMode = () => {
    const modes = ["floating", "fullscreen", "hidden"]
    const currentIndex = modes.indexOf(previewMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setPreviewMode(modes[nextIndex])
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="flex justify-between items-center h-12">
          <button 
            onClick={onBack}
            className="flex-1 h-full flex items-center justify-center text-gray-600"
          >
            <span>↩️</span>
          </button>
          
          <button 
            onClick={cyclePreviewMode}
            className="flex-1 h-full flex items-center justify-center text-gray-600"
          >
            {previewMode === "floating" && <span>🔍</span>}
            {previewMode === "fullscreen" && <span>📱</span>}
            {previewMode === "hidden" && <span>👁️</span>}
          </button>
          
          <button 
            onClick={() => onSave(config)}
            className="flex-1 h-full flex items-center justify-center bg-blue-500 text-white"
          >
            <span>Salva</span>
          </button>
        </div>
      </div>

      {/* Main scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-12 pt-1 px-1" ref={editorRef}>
        {/* Property Controls with Swipeable Category Tabs */}
        <div className="mb-2 overflow-x-auto">
          <div className="flex whitespace-nowrap pb-1">
            {Object.keys(propertyGroups).map(group => (
              <button
                key={group}
                onClick={() => togglePropertyGroup(group)}
                className={`px-3 py-1 text-sm mr-1 rounded-full ${
                  activeSection === group
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Active Property Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-sm mb-2"
          >
            {activeSection === "content" && (
              <div className="p-2">
                <h3 className="text-sm font-medium mb-2">Contenuto</h3>
                <RichTextEditor value={config.content} onChange={handleContentChange} />
              </div>
            )}

            {activeSection === "text" && (
              <div className="p-2">
                <h3 className="text-sm font-medium mb-2">Stile Testo</h3>
                
                <div className="mb-2">
                  <label className="text-xs block mb-1">Dimensione Testo</label>
                  <div className="flex items-center">
                    <input 
                      type="range" 
                      className="flex-1 mr-2" 
                      min="10" 
                      max="36" 
                      value={parseInt(config.fontSize)} 
                      onChange={e => updateConfig("fontSize", `${e.target.value}px`)} 
                    />
                    <span className="text-xs w-8 text-center">{parseInt(config.fontSize)}px</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <label className="text-xs block mb-1">Colore Testo</label>
                  <input 
                    type="color" 
                    className="w-full h-8" 
                    value={config.color} 
                    onChange={e => updateConfig("color", e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="text-xs block mb-1">Allineamento</label>
                  <div className="flex border rounded overflow-hidden">
                    {["left", "center", "right", "justify"].map(align => (
                      <button
                        key={align}
                        onClick={() => updateConfig("textAlign", align)}
                        className={`flex-1 py-1 ${
                          config.textAlign === align 
                            ? "bg-blue-100 text-blue-600" 
                            : "bg-white text-gray-600"
                        }`}
                      >
                        {align === "left" && "⟮"}
                        {align === "center" && "≡"}
                        {align === "right" && "⟯"}
                        {align === "justify" && "≣"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "background" && (
              <div className="p-2">
                <h3 className="text-sm font-medium mb-2">Sfondo</h3>
                
                <div className="mb-2">
                  <label className="text-xs block mb-1">Colore Sfondo</label>
                  <input 
                    type="color" 
                    className="w-full h-8" 
                    value={config.backgroundColor} 
                    onChange={e => updateConfig("backgroundColor", e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="text-xs block mb-1">Padding</label>
                  <div className="flex items-center">
                    <input 
                      type="range" 
                      className="flex-1 mr-2" 
                      min="0" 
                      max="48" 
                      value={parseInt(config.padding)} 
                      onChange={e => updateConfig("padding", `${e.target.value}px`)} 
                    />
                    <span className="text-xs w-8 text-center">{parseInt(config.padding)}px</span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "border" && (
              <div className="p-2">
                <h3 className="text-sm font-medium mb-2">Bordo</h3>
                
                <div className="flex items-center mb-2">
                  <label className="text-xs flex-1">Abilita Bordo</label>
                  <div 
                    onClick={() => updateConfig("borderEnabled", !config.borderEnabled)}
                    className={`w-10 h-6 rounded-full p-1 flex ${
                      config.borderEnabled ? "bg-blue-500 justify-end" : "bg-gray-300 justify-start"
                    }`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full"></div>
                  </div>
                </div>
                
                {config.borderEnabled && (
                  <>
                    <div className="mb-2">
                      <label className="text-xs block mb-1">Colore Bordo</label>
                      <input 
                        type="color" 
                        className="w-full h-8" 
                        value={config.borderColor} 
                        onChange={e => updateConfig("borderColor", e.target.value)} 
                      />
                    </div>
                    
                    <div className="mb-2">
                      <label className="text-xs block mb-1">Spessore Bordo</label>
                      <div className="flex items-center">
                        <input 
                          type="range" 
                          className="flex-1 mr-2" 
                          min="1" 
                          max="10" 
                          value={parseInt(config.borderWidth)} 
                          onChange={e => updateConfig("borderWidth", `${e.target.value}px`)} 
                        />
                        <span className="text-xs w-8 text-center">{parseInt(config.borderWidth)}px</span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <label className="text-xs block mb-1">Stile Bordo</label>
                      <select
                        className="w-full p-1 border rounded"
                        value={config.borderStyle}
                        onChange={e => updateConfig("borderStyle", e.target.value)}
                      >
                        <option value="solid">Solido</option>
                        <option value="dashed">Tratteggiato</option>
                        <option value="dotted">Punteggiato</option>
                        <option value="double">Doppio</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-xs block mb-1">Arrotondamento</label>
                      <div className="flex items-center">
                        <input 
                          type="range" 
                          className="flex-1 mr-2" 
                          min="0" 
                          max="20" 
                          value={parseInt(config.borderRadius)} 
                          onChange={e => updateConfig("borderRadius", `${e.target.value}px`)} 
                        />
                        <span className="text-xs w-8 text-center">{parseInt(config.borderRadius)}px</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeSection === "shadow" && (
              <div className="p-2">
                <h3 className="text-sm font-medium mb-2">Ombra</h3>
                
                <div className="flex items-center mb-2">
                  <label className="text-xs flex-1">Abilita Ombra</label>
                  <div 
                    onClick={() => updateConfig("shadowEnabled", !config.shadowEnabled)}
                    className={`w-10 h-6 rounded-full p-1 flex ${
                      config.shadowEnabled ? "bg-blue-500 justify-end" : "bg-gray-300 justify-start"
                    }`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full"></div>
                  </div>
                </div>
                
                {config.shadowEnabled && (
                  <>
                    <div className="mb-2">
                      <label className="text-xs block mb-1">Colore Ombra</label>
                      <input 
                        type="color" 
                        className="w-full h-8" 
                        value={config.shadowColor} 
                        onChange={e => updateConfig("shadowColor", e.target.value)} 
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs block mb-1">Sfocatura</label>
                      <div className="flex items-center">
                        <input 
                          type="range" 
                          className="flex-1 mr-2" 
                          min="0" 
                          max="20" 
                          value={parseInt(config.shadowBlur)} 
                          onChange={e => updateConfig("shadowBlur", `${e.target.value}px`)} 
                        />
                        <span className="text-xs w-8 text-center">{parseInt(config.shadowBlur)}px</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeSection === "dimensions" && (
              <div className="p-2">
                <h3 className="text-sm font-medium mb-2">Dimensioni</h3>
                
                <div className="mb-2">
                  <label className="text-xs block mb-1">Larghezza</label>
                  <select
                    className="w-full p-1 border rounded"
                    value={config.width}
                    onChange={e => updateConfig("width", e.target.value)}
                  >
                    <option value="100%">Piena (100%)</option>
                    <option value="75%">Tre quarti (75%)</option>
                    <option value="50%">Metà (50%)</option>
                    <option value="25%">Un quarto (25%)</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs block mb-1">Altezza</label>
                  <select
                    className="w-full p-1 border rounded"
                    value={config.height}
                    onChange={e => updateConfig("height", e.target.value)}
                  >
                    <option value="auto">Auto (basata sul contenuto)</option>
                    <option value="100px">Piccola (100px)</option>
                    <option value="200px">Media (200px)</option>
                    <option value="300px">Grande (300px)</option>
                  </select>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Preview Modes */}
      {/* Floating Preview */}
      {previewMode === "floating" && (
        <motion.div
          ref={previewRef}
          className="fixed bottom-16 right-4 w-2/3 max-w-xs bg-white rounded-lg shadow-lg z-10 border border-gray-200 overflow-hidden"
          drag
          dragConstraints={editorRef}
          dragElastic={0.1}
          dragMomentum={false}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="bg-gray-100 p-1 flex justify-between items-center border-b">
            <span className="text-xs text-gray-500 font-medium">Anteprima</span>
            <div className="flex">
              <button 
                className="text-xs text-gray-500 w-6 h-6 flex items-center justify-center"
                onClick={() => setPreviewMode("fullscreen")}
              >
                🔍
              </button>
              <button 
                className="text-xs text-gray-500 w-6 h-6 flex items-center justify-center"
                onClick={() => setPreviewMode("hidden")}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-2 overflow-hidden">
            <WidgetRenderer widgetType={widgetType} config={config} preview />
          </div>
        </motion.div>
      )}

      {/* Fullscreen Preview */}
      <AnimatePresence>
        {previewMode === "fullscreen" && (
          <motion.div 
            className="fixed inset-0 bg-gray-100 z-30 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-2 border-b flex justify-between items-center">
              <span className="font-medium">Anteprima dispositivo</span>
              <button 
                onClick={() => setPreviewMode("floating")}
                className="p-1 text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              <div className="w-full max-w-sm mx-auto border border-gray-300 rounded-lg overflow-hidden bg-white shadow-md">
                <WidgetRenderer widgetType={widgetType} config={config} preview />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WidgetEditor