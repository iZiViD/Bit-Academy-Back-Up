import { useState } from 'react'
import './output.css'

function App() {

  const askForScreenSharing = async () => {
      const stream = await navigator.mediaDevices.getDisplayMedia();
        return stream;
  }

  return (
    <>
            <button onClick={askForScreenSharing}>Ask for screen sharing</button>
    </>
  )
}

export default App