import React, { useEffect } from 'react'
import styles from './Toolbar.module.css'

import paper from 'paper'

import { useEditor } from '../EditorContext'

import { ArrowUpOutlined, EditOutlined } from '@ant-design/icons'
import { Button } from 'antd'

function Toolbar() {
  const { tools, ...editor } = useEditor()

  useEffect(() => {
    tools.createPath.setCallbacks({
      onComplete: onPathCreateCompleted,
      onCancel: onPathCreateCanceled
    })
    tools.move.setCallbacks({
      onSelect: onMoveItemSelect
    })
  }, [])

  function onPathCreateCanceled() {
    editor.activateTool('move')
  }
  function onPathCreateCompleted(path) {
    path.fullySelected = false
    path.addTo(paper.project.activeLayer)
    editor.activateTool('move')
  }
  function onMoveItemSelect(item) {
    editor.setSelection(item)
  }

  const onPathToolClicked = e => {
    e.target.blur()
    editor.activateTool('createPath')
  }
  const onMoveToolClicked = e => {
    editor.activateTool('move')
  }

  return (
    <div className={[styles.tools]}>
      <Button
        danger={editor.currentTool === tools.move.tool.name}
        icon={<ArrowUpOutlined />}
        onClick={onMoveToolClicked}
      />
      <Button
        danger={editor.currentTool === tools.createPath.tool.name}
        icon={<EditOutlined />}
        disabled={editor.currentTool === tools.createPath.tool.name}
        onClick={onPathToolClicked}
      />

      {/* <button onClick={xml}>XML</button> */}
    </div>
  )
}

export default Toolbar
