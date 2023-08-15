import React from 'react'
import styles from './Editor.module.css'

import { EditorProvider } from './EditorContext'

import Canvas from './Canvas/Canvas'
import Toolbar from './Toolbar/Toolbar'
import ContextMenu from './ContextMenu/ContextMenu'

function Editor({ width, height }) {
  return (
    <EditorProvider>
      <div style={{ width: width, height: height }}>
        <Toolbar></Toolbar>
        <Canvas></Canvas>

        <ContextMenu></ContextMenu>
      </div>
    </EditorProvider>
  )
}

export default Editor
