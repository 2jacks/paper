import React from 'react'
import './App.css'

import Editor from './features/editor/Editor'

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Editor width={'100vw'} height={'100%'} />
    </div>
  )
}

export default App
