import React, { useEffect, useState } from 'react'
import styles from './ContextMenu.module.css'

import paper from 'paper'

import { useEditor } from '../EditorContext'

import { Button } from 'antd'

function ContextMenu() {
  const editor = useEditor()
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  })
  const [target, setTarget] = useState(null)

  useEffect(() => {
    paper.project.activeLayer.on('click', onMouseRightClick)
    document.addEventListener('click', onDocumentClick)

    return () => {
      paper.project.activeLayer.off('click', onMouseRightClick)
      document.removeEventListener('click', onDocumentClick)
    }
  }, [])

  const onMouseRightClick = e => {
    let hit = paper.project.hitTest(e.point)
    if (e.event.which === 3 && editor.currentTool !== 'createPath') {
      if (hit.item) {
        setTarget(hit.item)
        setPosition({
          x: e.point.x,
          y: e.point.y
        })
      }
    } else {
      setTarget(null)
    }
  }
  const onDocumentClick = e => {
    setTarget(null)
  }

  const onEditButtonClicked = () => {
    target.fullySelected = true
    editor.activateTool('createPath', target)
    setTarget(null)
  }
  const onDeleteButtonClicked = () => {
    target.remove()
  }

  if (target) {
    return (
      <div
        className={styles.root}
        style={{ position: 'absolute', top: position.y, left: position.x }}
      >
        <div className={styles.wrapper}>
          <Button type='link' size='small' onClick={onEditButtonClicked}>
            Edit
          </Button>
          <Button type='link' size='small' onClick={onDeleteButtonClicked}>
            Delete
          </Button>
          {/* <Button type='link' size='small' onClick={onFlipVerticalButtonClicked}>
            Flip Vertical
          </Button>
          <Button type='link' size='small' onClick={onCopyButtonClicked}>
            Copy
          </Button> */}
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default ContextMenu
