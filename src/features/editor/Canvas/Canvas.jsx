import React, { useMemo, useEffect } from 'react'
import styles from './Canvas.module.css'

import { useEditor } from '../EditorContext'

function Canvas() {
  const editor = useEditor()
  const canvasId = useMemo(() => 'paper', [])

  useEffect(() => {
    editor.init(canvasId)
  }, [])

  return (
    <canvas
      id={canvasId}
      className={styles.canvas}

    ></canvas>
  )
}

export default Canvas
