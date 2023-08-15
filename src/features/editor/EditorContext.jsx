import React, { useState, useEffect, useRef, useContext } from 'react'

import paper from 'paper'

import { grid } from './tools/Grid'
import { createPath } from './tools/CreatePath'
import { move } from './tools/Move'

export const editorContext = React.createContext(null)

const tools = { createPath, move }

export function EditorProvider({ children }) {
  const canvasRef = useRef(null)
  const [currentTool, setCurrentTool] = useState('')
  const [selection, setSelection] = useState(null)

  // useEffect(() => {
  //   if (selectedItem) {
  //     selectedItem.selected = true
  //   }
  // }, [selectedItem])

  const init = canvasId => {
    paper.install(window)
    paper.setup(canvasId)

    canvasRef.current = document.querySelector(`#${canvasId}`)
    document.addEventListener('contextmenu', e => {
      e.preventDefault()
    })

    grid.setDimensions({ cellSize: 40, boundingRect: paper.view.bounds })
    grid.buildGrid()

    activateTool('move')
  }

  function activateTool(name, args) {
    tools[name].activate(args)
    setCurrentTool(tools[name].tool.name)
  }

  return (
    <editorContext.Provider
      value={{
        init: init,
        canvas: canvasRef.current,
        tools: tools,

        activateTool: activateTool,

        currentTool: currentTool,
        setCurrentTool: setCurrentTool,

        selection: selection,
        setSelection: setSelection
      }}
    >
      {children}
    </editorContext.Provider>
  )
}

export function useEditor() {
  const editor = useContext(editorContext)
  return editor
}
